import quotedPrintable from 'quoted-printable';
import base64url from 'base64url';

const decode = (raw) => {
  const tokens = raw.split(new RegExp('=?utf-8?', 'i'));
  return tokens.map((token) => {
    if (token.toLowerCase().startsWith('?q?')) return quotedPrintable.decode(token.substring(3, token.length - 2));
    if (token.toLowerCase().startsWith('?b?')) return base64url.decode(token.substring(3, token.length - 2));
    if (token === '=?') return '';
    return raw;
  }).join(' ');
};

module.exports = decode;
