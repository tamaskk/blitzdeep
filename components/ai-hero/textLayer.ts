/**
 * Mirrors the hero's DOM text and buttons onto a 2D canvas so WebGL can
 * distort them. Elements opt in with `data-gl`; `data-gl-group` sets their
 * place in the intro stagger and `data-gl-bg` / `data-gl-bg-hover` draw a
 * button face behind the text.
 *
 * Text is drawn word by word at the exact rect the browser laid it out in, so
 * wrapping, centring and mixed fonts all match the DOM without re-implementing
 * line breaking.
 */

type TextOp = {
  type: "text";
  text: string;
  x: number;
  top: number;
  height: number;
  font: string;
  color: string;
  letterSpacing: string;
  group: number;
};

type BoxOp = {
  type: "box";
  el: Element;
  x: number;
  y: number;
  w: number;
  h: number;
  radius: number;
  fill: string;
  fillHover: string;
  group: number;
};

export type Layout = {
  ops: Array<TextOp | BoxOp>;
  /** Area covered by the ops, in CSS px relative to the hero. */
  bounds: { x: number; y: number; w: number; h: number };
};

// Room around the content for the intro rise and italic overhang.
const PADDING = 28;
const RISE = 20;

export function measureLayout(root: HTMLElement): Layout {
  const origin = root.getBoundingClientRect();
  const ops: Layout["ops"] = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const grow = (r: DOMRect) => {
    minX = Math.min(minX, r.left - origin.left);
    minY = Math.min(minY, r.top - origin.top);
    maxX = Math.max(maxX, r.right - origin.left);
    maxY = Math.max(maxY, r.bottom - origin.top);
  };

  const range = document.createRange();
  root.querySelectorAll<HTMLElement>("[data-gl]").forEach((el) => {
    const group = Number(el.dataset.glGroup ?? 0);

    if (el.dataset.glBg) {
      const r = el.getBoundingClientRect();
      grow(r);
      ops.push({
        type: "box",
        el,
        x: r.left - origin.left,
        y: r.top - origin.top,
        w: r.width,
        h: r.height,
        radius: parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0,
        fill: el.dataset.glBg,
        fillHover: el.dataset.glBgHover ?? el.dataset.glBg,
        group,
      });
    }

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent) continue;
      const cs = getComputedStyle(parent);
      const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const letterSpacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
      const text = node.textContent ?? "";
      const words = /\S+/g;
      let match: RegExpExecArray | null;
      while ((match = words.exec(text))) {
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        const r = range.getClientRects()[0];
        if (!r) continue;
        grow(r);
        ops.push({
          type: "text",
          text: match[0],
          x: r.left - origin.left,
          top: r.top - origin.top,
          height: r.height,
          font,
          color: cs.color,
          letterSpacing,
          group,
        });
      }
    }
  });

  if (!ops.length) return { ops, bounds: { x: 0, y: 0, w: 1, h: 1 } };
  return {
    ops,
    bounds: {
      x: Math.floor(minX - PADDING),
      y: Math.floor(minY - PADDING),
      w: Math.ceil(maxX - minX + PADDING * 2),
      h: Math.ceil(maxY - minY + PADDING * 2),
    },
  };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/**
 * Paint the layout. `progress(group)` returns 0–1 for the intro (0 = hidden
 * and 20px low, 1 = in place); `hovered` holds the buttons to draw in their
 * hover colour.
 */
export function drawLayout(
  ctx: CanvasRenderingContext2D,
  layout: Layout,
  dpr: number,
  progress: (group: number) => number,
  hovered: Set<Element>
) {
  const { bounds } = layout;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.setTransform(dpr, 0, 0, dpr, -bounds.x * dpr, -bounds.y * dpr);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  for (const op of layout.ops) {
    const p = progress(op.group);
    if (p <= 0) continue;
    const dy = (1 - p) * RISE;
    ctx.globalAlpha = p;

    if (op.type === "box") {
      roundRect(ctx, op.x, op.y + dy, op.w, op.h, op.radius);
      ctx.fillStyle = hovered.has(op.el) ? op.fillHover : op.fill;
      ctx.fill();
      // Subtle inner highlight along the top edge.
      const sheen = ctx.createLinearGradient(0, op.y + dy, 0, op.y + dy + op.h * 0.6);
      sheen.addColorStop(0, "rgba(255,255,255,0.16)");
      sheen.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sheen;
      ctx.fill();
      continue;
    }

    ctx.font = op.font;
    // Not in every browser's canvas API yet; words are positioned individually,
    // so missing it only costs a hair of intra-word tracking.
    if ("letterSpacing" in ctx) {
      (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
        op.letterSpacing;
    }
    const m = ctx.measureText(op.text);
    const ascent = m.fontBoundingBoxAscent ?? op.height * 0.8;
    const descent = m.fontBoundingBoxDescent ?? op.height * 0.2;
    const baseline = op.top + (op.height - (ascent + descent)) / 2 + ascent;
    ctx.fillStyle = op.color;
    ctx.fillText(op.text, op.x, baseline + dy);
  }
  ctx.globalAlpha = 1;
}
