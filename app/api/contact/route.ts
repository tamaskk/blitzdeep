import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/lib/site";

// Resend needs the Node runtime (not Edge).
export const runtime = "nodejs";

const TO = "kalman.tamaskrisztian@gmail.com";
// blitzdeep.com is verified in Resend, so we send from the domain. This lets the
// auto-reply reach any recipient (not just the account owner) and ships proper
// SPF/DKIM for deliverability. Any address @blitzdeep.com works as a sender.
const FROM = "BlitzDeep Website <notifications@blitzdeep.com>";
const FROM_TEAM = "BlitzDeep <info@blitzdeep.com>";
const REPLY_TO = "info@blitzdeep.com";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Internal lead notification sent to the BlitzDeep inbox. */
function notification(input: {
  fullName: string;
  email: string;
  website: string;
  message: string;
}) {
  const { fullName, email, website, message } = input;
  const text = [
    `New contact form submission from the BlitzDeep website.`,
    ``,
    `Name:    ${fullName}`,
    `Email:   ${email}`,
    `Website: ${website || "—"}`,
    ``,
    `Message:`,
    message,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.6;color:#1a1714">
      <h2 style="margin:0 0 12px">New contact form submission</h2>
      <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(fullName)}</p>
      <p style="margin:0 0 4px"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin:0 0 12px"><strong>Website:</strong> ${escapeHtml(website) || "—"}</p>
      <p style="margin:0 0 4px"><strong>Message:</strong></p>
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>
  `;

  return { subject: `New inquiry from ${fullName}`, text, html };
}

/** Branded auto-reply sent to the person who filled in the form. */
function confirmation(input: { firstName: string; message: string }) {
  const { firstName, message } = input;
  const year = new Date().getFullYear();
  const name = escapeHtml(firstName);
  const safeMessage = escapeHtml(message);

  const subject = `Thanks, ${firstName} — we've received your message`;

  const text = [
    `Thanks, ${firstName} — we're on it.`,
    ``,
    `We've received your message and a senior member of our team will get back to you within one business day. No bots, no hand-offs.`,
    ``,
    `Your message:`,
    message,
    ``,
    `Talk soon,`,
    `The BlitzDeep Team`,
    ``,
    `Strategy. Design. Performance. Unified for measurable ROI.`,
    `info@blitzdeep.com • +1 332 278 8976`,
    `${siteConfig.url}`,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#FAF9F7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF9F7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;background:#ffffff;border:1px solid #E9E6E1;border-radius:20px;overflow:hidden;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <!-- Header -->
          <tr>
            <td style="background:#171513;padding:24px 32px;">
              <span style="font-size:22px;font-weight:800;letter-spacing:-0.02em;color:#ffffff;">BlitzDeep<span style="color:#F1592A;">&gt;</span></span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 8px;">
              <p style="margin:0 0 14px;font-size:13px;font-weight:600;color:#F1592A;letter-spacing:0.02em;">&bull;&nbsp;MESSAGE RECEIVED</p>
              <h1 style="margin:0 0 14px;font-size:26px;line-height:1.2;font-weight:600;color:#1A1714;">Thanks, ${name} &mdash; <span style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-weight:400;">we&rsquo;re on it.</span></h1>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#6B6661;">We&rsquo;ve received your message and a senior member of our team will get back to you within one business day. No bots, no hand-offs &mdash; just real people who care about your growth.</p>
            </td>
          </tr>
          <!-- Message echo -->
          <tr>
            <td style="padding:0 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF9F7;border:1px solid #E9E6E1;border-left:3px solid #F1592A;border-radius:12px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 6px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:#9A938C;">Your message</p>
                    <p style="margin:0;font-size:14px;line-height:1.6;color:#1A1714;white-space:pre-wrap;">${safeMessage}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding:24px 32px 36px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:999px;background:#F1592A;">
                    <a href="${siteConfig.url}/#reference" style="display:inline-block;padding:13px 26px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;">See Our Work</a>
                  </td>
                </tr>
              </table>
              <p style="margin:22px 0 0;font-size:15px;line-height:1.6;color:#6B6661;">Talk soon,<br /><strong style="color:#1A1714;">The BlitzDeep Team</strong></p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#FAF9F7;border-top:1px solid #E9E6E1;padding:22px 32px;">
              <p style="margin:0 0 6px;font-size:13px;color:#6B6661;">Strategy. Design. Performance. Unified for measurable ROI.</p>
              <p style="margin:0;font-size:12px;color:#9A938C;">
                <a href="mailto:info@blitzdeep.com" style="color:#9A938C;text-decoration:none;">info@blitzdeep.com</a> &nbsp;&bull;&nbsp;
                <a href="tel:+13322788976" style="color:#9A938C;text-decoration:none;">+1&nbsp;332&nbsp;278&nbsp;8976</a>
              </p>
              <p style="margin:10px 0 0;font-size:11px;color:#C2BCB4;">&copy; ${year} BlitzDeep &middot; You&rsquo;re receiving this because you contacted us through blitzdeep.com.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const website = String(body.website ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!firstName || !lastName || !email || !message) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 }
    );
  }
  if (!isEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const fullName = `${firstName} ${lastName}`;
  const resend = new Resend(apiKey);

  // 1) Lead notification to the BlitzDeep inbox — this one must succeed.
  try {
    const note = notification({ fullName, email, website, message });
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email,
      subject: note.subject,
      text: note.text,
      html: note.html,
    });
    if (error) {
      console.error("Resend (notification) error:", error);
      return NextResponse.json(
        { error: "Could not send your message. Please try again." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("Contact route (notification) error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  // 2) Branded auto-reply to the sender — best-effort: a failure here shouldn't
  //    fail the request, since the lead is already captured by the notification.
  try {
    const reply = confirmation({ firstName, message });
    const { error } = await resend.emails.send({
      from: FROM_TEAM,
      to: [email],
      replyTo: REPLY_TO,
      subject: reply.subject,
      text: reply.text,
      html: reply.html,
    });
    if (error) {
      console.warn("Resend (auto-reply) skipped:", error);
    }
  } catch (err) {
    console.warn("Contact route (auto-reply) skipped:", err);
  }

  return NextResponse.json({ ok: true });
}
