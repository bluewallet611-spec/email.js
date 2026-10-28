// Brevo API configuration
const BREVO_API_KEY = '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';
const SENDER_EMAIL = 'support@chroniclewallet.com';
const SENDER_NAME = 'Chronicle Wallet';

// Base helper function to send emails via Brevo REST API
async function sendBrevoEmail({ toEmail, toName, subject, htmlBody }) {
  const url = 'https://api.brevo.com/v3/smtp/email';
  
  const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px; }
        .container { max-width: 550px; background: #ffffff; border-radius: 12px; margin: 0 auto; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <div class="container">
        ${htmlBody}
        <div class="footer">
          <p>© ${new Date().getFullYear()} Chronicle Wallet. All rights reserved.</p>
          <p>Security notice: We will never ask for your private key or password via email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: toEmail, name: toName }],
        subject: subject,
        htmlContent: fullHtml
      })
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}

// 1. Welcome Alert
export async function sendWelcomeAlert(toEmail, toName) {
  const htmlBody = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #4f46e5; margin: 0;">Welcome to Chronicle Wallet! 🎉</h2>
    </div>
    <p>Hello ${toName},</p>
    <p>Your account is ready. You can now securely send, receive, sell coins, and manage your balance.</p>
  `;
  return sendBrevoEmail({ toEmail, toName, subject: `Welcome to Chronicle Wallet!`, htmlBody });
}

// 2. Money Received (Credit Alert)
export async function sendTransferReceivedAlert(toEmail, toName, amount, senderName, transactionId) {
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const htmlBody = `
    <div style="text-align: center; margin-bottom: 25px;">
      <div style="background-color: #d1fae5; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
        <span style="font-size: 30px; color: #059669;">↓</span>
      </div>
      <h3 style="color: #059669; margin: 5px 0; font-size: 22px;">Money Received!</h3>
      <p style="color: #6b7280; font-size: 14px; margin: 0;">Funds have been added to your wallet.</p>
    </div>

    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 25px;">
      <span style="font-size: 13px; color: #6b7280; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Amount Received</span>
      <h1 style="font-size: 32px; color: #111827; margin: 8px 0 0 0;">+$${amount}</h1>
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #374151;">
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 10px 0; color: #6b7280;">Sender</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 600;">${senderName}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 10px 0; color: #6b7280;">Date</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 600;">${date}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 10px 0; color: #6b7280;">Transaction ID</td>
        <td style="padding: 10px 0; text-align: right; font-family: monospace; font-size: 12px;">${transactionId}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #6b7280;">Status</td>
        <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #059669;">Completed</td>
      </tr>
    </table>
  `;
  return sendBrevoEmail({ toEmail, toName, subject: `Credit Alert: Received $${amount}`, htmlBody });
}

// 3. Money Sent (Debit Alert)
export async function sendTransferSentAlert(toEmail, toName, amount, recipientName, transactionId) {
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const htmlBody = `
    <div style="text-align: center; margin-bottom: 25px;">
      <div style="background-color: #fee2e2; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
        <span style="font-size: 30px; color: #dc2626;">↑</span>
      </div>
      <h3 style="color: #dc2626; margin: 5px 0; font-size: 22px;">Transfer Sent</h3>
      <p style="color: #6b7280; font-size: 14px; margin: 0;">You have successfully sent funds.</p>
    </div>

    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 25px;">
      <span style="font-size: 13px; color: #6b7280; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Amount Sent</span>
      <h1 style="font-size: 32px; color: #dc2626; margin: 8px 0 0 0;">-$${amount}</h1>
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #374151;">
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 10px 0; color: #6b7280;">Recipient</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 600;">${recipientName}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 10px 0; color: #6b7280;">Date</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 600;">${date}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #6b7280;">Transaction ID</td>
        <td style="padding: 10px 0; text-align: right; font-family: monospace; font-size: 12px;">${transactionId}</td>
      </tr>
    </table>
  `;
  return sendBrevoEmail({ toEmail, toName, subject: `Debit Alert: Sent $${amount}`, htmlBody });
}

// 4. Coin Sale Alert
export async function sendCoinSoldAlert(toEmail, toName, coinName, coinAmount, fiatReceived, transactionId) {
  const htmlBody = `
    <div style="text-align: center; margin-bottom: 25px;">
      <div style="background-color: #ede9fe; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
        <span style="font-size: 30px; color: #7c3aed;">🪙</span>
      </div>
      <h3 style="color: #7c3aed; margin: 5px 0; font-size: 22px;">Coin Sale Successful</h3>
      <p style="color: #6b7280; font-size: 14px; margin: 0;">Your crypto swap/sale was completed.</p>
    </div>

    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 25px;">
      <span style="font-size: 13px; color: #6b7280; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Credited Value</span>
      <h1 style="font-size: 32px; color: #059669; margin: 8px 0 0 0;">+$${fiatReceived}</h1>
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #374151;">
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 10px 0; color: #6b7280;">Asset Sold</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 600;">${coinAmount} ${coinName}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #6b7280;">Reference ID</td>
        <td style="padding: 10px 0; text-align: right; font-family: monospace; font-size: 12px;">${transactionId}</td>
      </tr>
    </table>
  `;
  return sendBrevoEmail({ toEmail, toName, subject: `Coin Sale Confirmed: Sold ${coinName}`, htmlBody });
}

// 5. Security / Password Change Alert
export async function sendSecurityAlert(toEmail, toName, actionType = "Password Updated") {
  const htmlBody = `
    <div style="text-align: center; margin-bottom: 25px;">
      <div style="background-color: #fef2f2; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
        <span style="font-size: 30px; color: #ef4444;">🛡️</span>
      </div>
      <h3 style="color: #ef4444; margin: 5px 0; font-size: 22px;">Security Update Notice</h3>
      <p style="color: #6b7280; font-size: 14px; margin: 0;">An account security change was made.</p>
    </div>
    <p>Hello ${toName},</p>
    <p>This is to confirm that your account experienced a security event: <strong>${actionType}</strong>.</p>
    <p style="color: #dc2626; font-size: 13px;">If you did not perform this action, please secure your account immediately.</p>
  `;
  return sendBrevoEmail({ toEmail, toName, subject: `Security Alert: ${actionType}`, htmlBody });
}

// 6. Withdrawal Step-by-Step Stage Alert
export async function sendWithdrawalAlert(toEmail, toName, amount, destination, currentStage = "Pending Verification", instructions = "Your withdrawal request has been submitted and is currently moving through verification steps.") {
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const refId = 'CW-' + Math.floor(Math.random() * 899999 + 100000);

  const htmlBody = `
    <div style="text-align: center; margin-bottom: 25px;">
      <div style="background-color: #fff7ed; width: 65px; height: 65px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px; border: 1px solid #ffedd5;">
        <span style="font-size: 30px; color: #ea580c;">⏳</span>
      </div>
      <h3 style="color: #111827; margin: 5px 0; font-size: 22px; font-weight: 700;">Withdrawal Stage Update</h3>
      <p style="color: #6b7280; font-size: 14px; margin: 0;">Status update on your payout request</p>
    </div>

    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 25px;">
      <span style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Withdrawal Amount</span>
      <h1 style="font-size: 34px; color: #dc2626; margin: 6px 0 0 0; font-weight: 800;">$${amount}</h1>
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #374151; margin-bottom: 25px;">
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 12px 0; color: #6b7280;">Destination</td>
        <td style="padding: 12px 0; text-align: right; font-weight: 600;">${destination}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 12px 0; color: #6b7280;">Reference ID</td>
        <td style="padding: 12px 0; text-align: right; font-family: monospace; font-weight: 600; font-size: 13px;">${refId}</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; color: #6b7280;">Current Stage</td>
        <td style="padding: 12px 0; text-align: right;">
          <span style="background-color: #ffedd5; color: #c2410c; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">
            ${currentStage}
          </span>
        </td>
      </tr>
    </table>

    <div style="background-color: #fffbe6; border: 1px solid #ffe58f; border-left: 5px solid #faad14; border-radius: 8px; padding: 18px; margin-bottom: 25px;">
      <h4 style="margin: 0 0 8px 0; color: #d48806; font-size: 15px; font-weight: 700;">
        📌 Stage Details: ${currentStage}
      </h4>
      <p style="margin: 0; font-size: 13px; color: #595959; line-height: 1.6;">
        ${instructions}
      </p>
    </div>

    <div style="text-align: center;">
      <a href="https://bluewallet611-spec.github.io/Chronicle/" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
        View Portal & Complete Step →
      </a>
    </div>
  `;
  return sendBrevoEmail({ toEmail, toName, subject: `Withdrawal Update: ${currentStage}`, htmlBody });
}
