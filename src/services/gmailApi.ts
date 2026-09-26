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
 * Builds an RFC 2822 formatted email message
 */
function buildRfc2822Message({
  to,
  subject,
  htmlBody,
  fromName = 'InLife Financial Adviser',
  fromEmail,
}: SendEmailPayload): string {
  const fromHeader = fromEmail
    ? `From: "${fromName.replace(/"/g, '')}" <${fromEmail}>\r\n`
    : '';

  // Encode subject to UTF-8 base64 header if it contains non-ascii
  const encodedSubject = `=?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;

  const headers = [
    fromHeader,
    `To: <${to}>\r\n`,
    `Subject: ${encodedSubject}\r\n`,
    'MIME-Version: 1.0\r\n',
    'Content-Type: text/html; charset="UTF-8"\r\n',
    'Content-Transfer-Encoding: base64\r\n',
    '\r\n',
  ].join('');

  // Encode HTML body in UTF-8 base64
  const utf8Body = unescape(encodeURIComponent(htmlBody));
  const base64Body = btoa(utf8Body);

  return headers + base64Body;
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
        throw new Error('Your Google connection has expired. Please reconnect your Google account in Settings.');
      }
      if (response.status === 403) {
        throw new Error('Gmail sending permission was not granted or was restricted. Please re-authenticate.');
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
 * Tests the Gmail API connection
 */
export async function testGmailConnection(accessToken: string): Promise<{ success: boolean; emailAddress?: string; error?: string }> {
  try {
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Your Google connection has expired. Please reconnect your Google account.');
      }
      throw new Error(`Gmail connection test failed (Status: ${response.status})`);
    }

    const data = await response.json();
    return {
      success: true,
      emailAddress: data.emailAddress,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to verify Gmail connection.',
    };
  }
}
