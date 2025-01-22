import crypto from 'crypto';

const b64enc = (buffer: Buffer) => 
    buffer.toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

export const genCodeVerifier = () =>
    b64enc(crypto.randomBytes(32));

export const genCodeChallenge = (cv: string) =>
    b64enc(crypto.createHash('sha256').update(cv).digest());
