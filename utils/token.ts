/**
 * Generates a LiveKit Access Token using Web Crypto API.
 * NOTE: In a production app, tokens should be generated on a secure backend.
 * This client-side generation is for the requested "Serverless/User-Input" architecture.
 */
export async function generateLiveKitToken(
  apiKey: string,
  apiSecret: string,
  participantName: string,
  roomName: string
): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    iss: apiKey,
    sub: participantName,
    nbf: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
    video: {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    },
    name: participantName,
  };

  const encodeBase64Url = (str: string) => {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const encodedHeader = encodeBase64Url(JSON.stringify(header));
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(apiSecret);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const encodedSignature = encodeBase64Url(String.fromCharCode(...new Uint8Array(signature)));

  return `${data}.${encodedSignature}`;
}