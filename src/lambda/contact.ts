import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Initialize SES client
const sesClient = new SESClient({ region: 'eu-north-1' });

interface ContactFormData {
  name: string;
  email: string;
  projectType: string[];
  message: string;
  turnstileToken: string;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Contact form submission received', { body: event.body });

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Parse request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const data: ContactFormData = JSON.parse(event.body);

    // Verify Turnstile token
    if (!data.turnstileToken) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Security verification required' }),
      };
    }

    const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecretKey) {
      console.error('TURNSTILE_SECRET_KEY environment variable not set');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    const turnstileVerification = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: turnstileSecretKey,
          response: data.turnstileToken,
        }),
      }
    );

    const turnstileResult = await turnstileVerification.json();

    if (!turnstileResult.success) {
      console.log('Turnstile verification failed', turnstileResult);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Security verification failed. Please try again.' }),
      };
    }

    // Validate required fields
    if (!data.name || data.name.length < 2) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name must be at least 2 characters' }),
      };
    }

    if (!data.email || !isValidEmail(data.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valid email is required' }),
      };
    }

    if (!data.message || data.message.length < 10) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message must be at least 10 characters' }),
      };
    }

    // Prepare email
    const projectTypes = Array.isArray(data.projectType) ? data.projectType.join(', ') : data.projectType || 'Not specified';

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #06b6d4 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 20px; }
    .label { font-weight: 600; color: #667eea; margin-bottom: 5px; }
    .value { background: white; padding: 15px; border-radius: 6px; border-left: 3px solid #667eea; }
    .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #e1e8ed; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🚀 New Contact Form Submission</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">PAISS - paiss.me</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">From:</div>
        <div class="value">${escapeHtml(data.name)}</div>
      </div>

      <div class="field">
        <div class="label">Email:</div>
        <div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
      </div>

      <div class="field">
        <div class="label">Project Type:</div>
        <div class="value">${escapeHtml(projectTypes)}</div>
      </div>

      <div class="field">
        <div class="label">Message:</div>
        <div class="value">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
      </div>

      <div class="footer">
        <p><strong>Reply directly to this email</strong> to respond to ${escapeHtml(data.name)}.</p>
        <p style="color: #999; font-size: 12px;">Automated notification from paiss.me contact form</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const textBody = `
New Contact Form Submission - PAISS

From: ${data.name}
Email: ${data.email}
Project Type: ${projectTypes}

Message:
${data.message}

---
Reply directly to this email to respond to ${data.name}.
Automated notification from paiss.me contact form
    `;

    // Send email via AWS SES
    const command = new SendEmailCommand({
      Source: 'info@paiss.me',
      Destination: {
        ToAddresses: ['info@paiss.me'],
      },
      ReplyToAddresses: [data.email],
      Message: {
        Subject: {
          Data: `🚀 New Contact: ${data.name} - ${projectTypes}`,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: 'UTF-8',
          },
          Text: {
            Data: textBody,
            Charset: 'UTF-8',
          },
        },
      },
    });

    await sesClient.send(command);

    console.log('Email sent successfully', { to: 'info@paiss.me', from: data.email });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Thank you for your message! I\'ll reply within hours.',
      }),
    };
  } catch (error) {
    console.error('Error processing contact form:', error);

    // Check if it's an SES error
    if (error instanceof Error) {
      // Common SES errors to handle gracefully
      if (error.message.includes('Email address is not verified')) {
        console.error('SES email not verified. Please verify info@paiss.me in AWS SES.');
      }
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to send message. Please email info@paiss.me directly.',
      }),
    };
  }
};

// Helper function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to escape HTML
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
