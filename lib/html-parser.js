/* globals DOMParser, XMLSerializer, btoa */

import { each } from 'lodash';

const parse = (raw, extractor) => {
  const parser = new DOMParser();
  const serializer = new XMLSerializer();

  const doc = parser.parseFromString(raw, 'text/html');
  const images = doc.getElementsByTagName('img');

  each(images, (image) => {
    if (image.src.startsWith('cid')) {
      const src = `<${image.src.split(':')[1]}>`;
      const data = extractor.inline[src];
      if (data) image.setAttribute('src', `data:${data.type};base64, ${btoa(String.fromCharCode(...data.content))}`);
    }
  });

  return serializer.serializeToString(doc);
};

export default parse;
