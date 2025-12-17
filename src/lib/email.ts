import { Resend } from 'resend';

// Lazy initialization to avoid errors during build
let resendClient: Resend | null = null;

function getResendClient() {
  if (!resendClient && process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'HouseQuay <noreply@housequay.com>';
const APP_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const resend = getResendClient();

  if (!resend) {
    console.log('[Email] Skipping email (no RESEND_API_KEY):', { to, subject });
    return { success: false, error: 'No API key configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('[Email] Failed to send:', error);
      return { success: false, error };
    }

    console.log('[Email] Sent successfully:', data?.id);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('[Email] Error:', error);
    return { success: false, error };
  }
}

// Email Templates

export function getBaseTemplate(content: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HouseQuay</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">HouseQuay</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Premium Jetty Marketplace</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px; color: #64748b; font-size: 14px;">
                <a href="${APP_URL}" style="color: #0369a1; text-decoration: none;">Visit HouseQuay</a>
                &nbsp;&bull;&nbsp;
                <a href="${APP_URL}/bookings" style="color: #0369a1; text-decoration: none;">My Bookings</a>
                &nbsp;&bull;&nbsp;
                <a href="${APP_URL}/messages" style="color: #0369a1; text-decoration: none;">Messages</a>
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                &copy; ${new Date().getFullYear()} HouseQuay. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Booking Notifications

export interface BookingEmailData {
  guestName: string;
  guestEmail: string;
  hostName: string;
  hostEmail: string;
  listingTitle: string;
  listingId: string;
  bookingId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  nights: number;
}

export function sendBookingRequestEmail(data: BookingEmailData) {
  // Email to host about new booking request
  const hostContent = `
    <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 24px; font-weight: 600;">New Booking Request</h2>
    <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6;">
      Great news! <strong>${data.guestName}</strong> has requested to book your jetty.
    </p>

    <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px; color: #0f172a; font-size: 18px; font-weight: 600;">${data.listingTitle}</h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Check-in</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 500;">${data.checkIn}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Check-out</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 500;">${data.checkOut}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Duration</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 500;">${data.nights} night${data.nights > 1 ? 's' : ''}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-top: 1px solid #e2e8f0; color: #0f172a; font-size: 16px; font-weight: 600;">Total</td>
          <td style="padding: 8px 0; border-top: 1px solid #e2e8f0; color: #0369a1; font-size: 16px; text-align: right; font-weight: 700;">$${data.totalPrice}</td>
        </tr>
      </table>
    </div>

    <p style="margin: 0 0 24px; color: #475569; font-size: 14px; line-height: 1.6;">
      Please respond to this request within 24 hours to ensure a great experience for your guest.
    </p>

    <a href="${APP_URL}/bookings/${data.bookingId}" style="display: inline-block; background: linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; font-weight: 600;">
      Review Request
    </a>
  `;

  // Email to guest confirming request
  const guestContent = `
    <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 24px; font-weight: 600;">Booking Request Sent</h2>
    <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6;">
      Hi ${data.guestName}, your booking request has been sent to <strong>${data.hostName}</strong>. They typically respond within 24 hours.
    </p>

    <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px; color: #0f172a; font-size: 18px; font-weight: 600;">${data.listingTitle}</h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Check-in</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 500;">${data.checkIn}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Check-out</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 500;">${data.checkOut}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Duration</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 500;">${data.nights} night${data.nights > 1 ? 's' : ''}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-top: 1px solid #e2e8f0; color: #0f172a; font-size: 16px; font-weight: 600;">Total</td>
          <td style="padding: 8px 0; border-top: 1px solid #e2e8f0; color: #0369a1; font-size: 16px; text-align: right; font-weight: 700;">$${data.totalPrice}</td>
        </tr>
      </table>
    </div>

    <a href="${APP_URL}/bookings/${data.bookingId}" style="display: inline-block; background: linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; font-weight: 600;">
      View Booking
    </a>
  `;

  return Promise.all([
    sendEmail({
      to: data.hostEmail,
      subject: `New booking request for ${data.listingTitle}`,
      html: getBaseTemplate(hostContent),
    }),
    sendEmail({
      to: data.guestEmail,
      subject: `Booking request sent - ${data.listingTitle}`,
      html: getBaseTemplate(guestContent),
    }),
  ]);
}

export function sendBookingConfirmedEmail(data: BookingEmailData) {
  // Email to guest - booking confirmed
  const guestContent = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="width: 64px; height: 64px; background-color: #dcfce7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>
    </div>

    <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 24px; font-weight: 600; text-align: center;">Booking Confirmed!</h2>
    <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6; text-align: center;">
      Great news, ${data.guestName}! Your booking has been confirmed by ${data.hostName}.
    </p>

    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px; color: #0f172a; font-size: 18px; font-weight: 600;">${data.listingTitle}</h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Check-in</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 500;">${data.checkIn}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Check-out</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 500;">${data.checkOut}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Duration</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 500;">${data.nights} night${data.nights > 1 ? 's' : ''}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-top: 1px solid #bbf7d0; color: #0f172a; font-size: 16px; font-weight: 600;">Total Paid</td>
          <td style="padding: 8px 0; border-top: 1px solid #bbf7d0; color: #16a34a; font-size: 16px; text-align: right; font-weight: 700;">$${data.totalPrice}</td>
        </tr>
      </table>
    </div>

    <p style="margin: 0 0 24px; color: #475569; font-size: 14px; line-height: 1.6;">
      You can message your host directly to coordinate arrival details and ask any questions.
    </p>

    <a href="${APP_URL}/bookings/${data.bookingId}" style="display: inline-block; background: linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; font-weight: 600;">
      View Booking Details
    </a>
  `;

  // Email to host - booking confirmed
  const hostContent = `
    <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 24px; font-weight: 600;">Booking Confirmed</h2>
    <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6;">
      The booking from <strong>${data.guestName}</strong> is now confirmed and paid.
    </p>

    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px; color: #0f172a; font-size: 18px; font-weight: 600;">${data.listingTitle}</h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Guest</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 500;">${data.guestName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Check-in</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 500;">${data.checkIn}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Check-out</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 500;">${data.checkOut}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-top: 1px solid #bbf7d0; color: #0f172a; font-size: 16px; font-weight: 600;">Your Payout</td>
          <td style="padding: 8px 0; border-top: 1px solid #bbf7d0; color: #16a34a; font-size: 16px; text-align: right; font-weight: 700;">$${Math.round(data.totalPrice * 0.88)}</td>
        </tr>
      </table>
    </div>

    <a href="${APP_URL}/bookings/${data.bookingId}" style="display: inline-block; background: linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; font-weight: 600;">
      View Booking
    </a>
  `;

  return Promise.all([
    sendEmail({
      to: data.guestEmail,
      subject: `Booking confirmed - ${data.listingTitle}`,
      html: getBaseTemplate(guestContent),
    }),
    sendEmail({
      to: data.hostEmail,
      subject: `Booking confirmed from ${data.guestName}`,
      html: getBaseTemplate(hostContent),
    }),
  ]);
}

export function sendBookingDeclinedEmail(data: BookingEmailData) {
  const content = `
    <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 24px; font-weight: 600;">Booking Not Available</h2>
    <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6;">
      Hi ${data.guestName}, unfortunately your booking request for <strong>${data.listingTitle}</strong> was not approved by the host.
    </p>

    <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <p style="margin: 0; color: #991b1b; font-size: 14px;">
        Don't worry - there are plenty of other great jetties available. Browse our listings to find the perfect spot for your boat.
      </p>
    </div>

    <a href="${APP_URL}/browse" style="display: inline-block; background: linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; font-weight: 600;">
      Browse Jetties
    </a>
  `;

  return sendEmail({
    to: data.guestEmail,
    subject: `Booking update - ${data.listingTitle}`,
    html: getBaseTemplate(content),
  });
}

export function sendBookingCancelledEmail(data: BookingEmailData & { cancelledBy: 'guest' | 'host' }) {
  const isGuestCancel = data.cancelledBy === 'guest';

  // Email to the other party
  const recipientEmail = isGuestCancel ? data.hostEmail : data.guestEmail;
  const recipientName = isGuestCancel ? data.hostName : data.guestName;
  const cancellerName = isGuestCancel ? data.guestName : data.hostName;

  const content = `
    <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 24px; font-weight: 600;">Booking Cancelled</h2>
    <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6;">
      Hi ${recipientName}, the booking for <strong>${data.listingTitle}</strong> has been cancelled by ${cancellerName}.
    </p>

    <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Listing</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 500;">${data.listingTitle}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Dates</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 500;">${data.checkIn} - ${data.checkOut}</td>
        </tr>
      </table>
    </div>

    <a href="${APP_URL}/bookings" style="display: inline-block; background: linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; font-weight: 600;">
      View My Bookings
    </a>
  `;

  return sendEmail({
    to: recipientEmail,
    subject: `Booking cancelled - ${data.listingTitle}`,
    html: getBaseTemplate(content),
  });
}

// Message Notifications

export interface MessageEmailData {
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  messagePreview: string;
  conversationId: string;
  listingTitle?: string;
}

export function sendNewMessageEmail(data: MessageEmailData) {
  const content = `
    <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 24px; font-weight: 600;">New Message</h2>
    <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6;">
      Hi ${data.recipientName}, you have a new message from <strong>${data.senderName}</strong>${data.listingTitle ? ` about <strong>${data.listingTitle}</strong>` : ''}.
    </p>

    <div style="background-color: #f8fafc; border-left: 4px solid #0369a1; padding: 16px 20px; margin-bottom: 24px; border-radius: 0 8px 8px 0;">
      <p style="margin: 0; color: #475569; font-size: 14px; font-style: italic;">
        "${data.messagePreview.length > 150 ? data.messagePreview.slice(0, 150) + '...' : data.messagePreview}"
      </p>
    </div>

    <a href="${APP_URL}/messages/${data.conversationId}" style="display: inline-block; background: linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; font-weight: 600;">
      Reply Now
    </a>
  `;

  return sendEmail({
    to: data.recipientEmail,
    subject: `New message from ${data.senderName}`,
    html: getBaseTemplate(content),
  });
}
