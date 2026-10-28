// Configuration - 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
const BREVO_API_KEY = 'xkeysib-75f50fb8fae703faf10...'; // Your Brevo key
const SENDER_INFO = {
  name: 'Chronicle Wallet',
  email: 'noreply@chroniclewallets.com' // Your authenticated domain
};

// Generic Helper Function to Send Email via Brevo REST API
async function sendBrevoEmail({ toEmail, toName, subject, htmlBody }) {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: SENDER_INFO,
        to: [{ email: toEmail, name: toName || 'Valued User' }],
        subject: subject,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 20px;">
            <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 25px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
              <h2 style="color: #1a202c; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Chronicle Wallet</h2>
              ${htmlBody}
              <hr style="border: none; border-top: 1px solid #edf2f7; margin-top: 30px;"/>
              <p style="font-size: 11px; color: #a0aec0; text-align: center;">
                If you did not initiate this request, please contact Chronicle Wallet support immediately.
              </p>
            </div>
          </div>
        `
      })
    });

    const data = await response.json();
    console.log(`[Brevo API] Email sent to ${toEmail}:`, data);
    return data;
  } catch (error) {
    console.error('[Brevo API Error]:', error);
  }
}
