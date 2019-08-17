/* eslint-disable no-undef */
import base64url from 'base64url';
import parse from 'emailjs-mime-parser';

onmessage = (e) => {
  const { id, raw } = e.data;
  try {
    const email = parse(base64url.decode(raw));
    const message = { id, email };
    postMessage(message);
  } catch (error) {
    throw new Error({ id, original });
  }
};
