/* eslint-disable no-undef */
import base64url from 'base64url';
import parse from 'emailjs-mime-parser';

onmessage = (e) => {
  const { id, raw } = e.data;
  try {
    const email = parse(base64url.decode(raw));
    postMessage({ id, email });
  } catch {
    throw new Error(id);
  }
};
