export interface SendEmailPayload {
  to: string;
  subject: string;
  htmlBody: string;
  fromName?: string;
  fromEmail?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Encodes a string to RFC 4648 Base64URL without padding
 */
function base64UrlEncode(str: string): string {
  // UTF-8 safe base64 encoding
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Builds an RFC 2822 formatted email message with RFC-compliant base64 wrapping
 */
function buildRfc2822Message({
  to,
  subject,
  htmlBody,
  fromName = 'InLife Financial Adviser',
  fromEmail,
}: SendEmailPayload): string {
  const fromClean = fromName ? `"${fromName.replace(/"/g, '')}" <${fromEmail || 'me'}>` : fromEmail || '';
  const fromHeader = fromClean ? `From: ${fromClean}\r\n` : '';

  // Encode subject to UTF-8 base64 header
  const subjectBytes = new TextEncoder().encode(subject);
  let subjectBinary = '';
  for (let i = 0; i < subjectBytes.length; i++) {
    subjectBinary += String.fromCharCode(subjectBytes[i]);
  }
  const encodedSubject = `=?UTF-8?B?${btoa(subjectBinary)}?=`;

  // Encode HTML body in UTF-8 base64
  const bodyBytes = new TextEncoder().encode(htmlBody);
  let bodyBinary = '';
  for (let i = 0; i < bodyBytes.length; i++) {
    bodyBinary += String.fromCharCode(bodyBytes[i]);
  }
  const rawBase64 = btoa(bodyBinary);
  // Split into chunks of 76 characters as required by RFC 2045 & RFC 5322
  const chunkedBody = rawBase64.match(/.{1,76}/g)?.join('\r\n') || rawBase64;

  const headers = [
    fromHeader,
    `To: <${to.trim()}>\r\n`,
    `Subject: ${encodedSubject}\r\n`,
    'MIME-Version: 1.0\r\n',
    'Content-Type: text/html; charset="UTF-8"\r\n',
    'Content-Transfer-Encoding: base64\r\n',
    '\r\n',
  ].join('');

  return headers + chunkedBody;
}

/**
 * Sends an email via the official Gmail API
 */
export async function sendGmailMessage(
  accessToken: string,
  payload: SendEmailPayload
): Promise<SendEmailResult> {
  try {
    const rawRfc2822 = buildRfc2822Message(payload);
    const encodedRaw = base64UrlEncode(rawRfc2822);

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedRaw,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Your Google session has expired. Please click "Authenticate Gmail Mailing" in Settings or the Header to refresh your login.');
      }
      if (response.status === 403) {
        throw new Error('Gmail sending permission (gmail.send) was not granted to this token. Please click "Authenticate Gmail Mailing (Send Emails)" in Settings.');
      }
      const errData = await response.json().catch(() => ({}));
      const detailedMessage =
        errData?.error?.message || `Gmail API returned error ${response.status} (${response.statusText})`;
      throw new Error(detailedMessage);
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.id,
    };
  } catch (error: any) {
    console.error('Failed to send email via Gmail:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred while sending email through Gmail.',
    };
  }
}

/**
 * Tests the Gmail API connection by querying Google OAuth tokeninfo
 */
export async function testGmailConnection(accessToken: string): Promise<{
  success: boolean;
  emailAddress?: string;
  hasSendScope?: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${encodeURIComponent(accessToken)}`
    );

    if (!response.ok) {
      if (response.status === 400 || response.status === 401) {
        throw new Error('Your Google session has expired. Please click "Authenticate Gmail Mailing" to reconnect.');
      }
      throw new Error(`Gmail token validation failed (Status: ${response.status})`);
    }

    const data = await response.json();
    const scopes: string = data.scope || '';
    const hasSendScope = scopes.includes('gmail.send');

    if (!hasSendScope) {
      return {
        success: false,
        emailAddress: data.email,
        hasSendScope: false,
        error: 'Google Account is connected, but the "gmail.send" permission is not active. Please click "Authenticate Gmail Mailing (Send Emails)".',
      };
    }

    return {
      success: true,
      emailAddress: data.email,
      hasSendScope: true,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to verify Gmail connection.',
    };
  }
}
