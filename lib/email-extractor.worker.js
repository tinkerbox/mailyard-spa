/* eslint-disable no-undef */
import base64url from 'base64url';
import parse from 'emailjs-mime-parser';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

onmessage = (e) => {
  const { id, raw } = e.data;
  try {
    const email = parse(base64url.decode(decoder.decode(raw)));

    const utf8 = new Uint8Array(email.length);
    encoder.encodeInto(email, utf8);

    const message = { id, email: utf8.buffer };
    postMessage(message, [message.email]);
  } catch (error) {
    throw new Error({ id, original });
  }
};
