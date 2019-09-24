/* globals DOMParser */

import { reduce, groupBy } from 'lodash';

function EmailExtractor(email) {
  // private interface

  const extractHeaders = (node) => {
    return node.header.reduce((accumulator, header) => {
      const [key, ...value] = header.split(': ');
      accumulator[key.toLowerCase()] = value.join(': ');
      return accumulator;
    }, {});
  };

  const extractNode = (node, results) => {
    if (!node.contentType) {
      console.log(node);
      throw new Error('ContentType not defined');
    }

    switch (node.contentType.type) {
      case 'message':
        results.push({
          headers: extractHeaders(node),
          content: node.content,
          type: node.contentType.value,
          group: node.contentType.type,
          filename: 'message-attachment.eml',
        });
        break;

      case 'multipart':
        node.childNodes.forEach(childNode => extractNode(childNode, results));
        break;

      case 'video':
      case 'image':
        results.push({
          headers: extractHeaders(node),
          content: node.content,
          type: node.contentType.value,
          group: node.contentType.type,
          filename: node.contentType.params.name,
        });
        break;

      case 'text':
        results.push({
          content: new TextDecoder('utf-8').decode(node.content),
          type: node.contentType.value,
          group: node.contentType.type,
          filename: node.contentType.params.name,
        });
        break;

      case 'application':
        results.push({
          content: node.content,
          type: node.contentType.value,
          group: node.contentType.type,
          filename: node.contentType.params.name,
        });
        break;

      default:
        throw new Error(`No handler for '${node.contentType.value}' content type`);
    }
  };

  // public interface

  Object.defineProperties(this, {
    headers: {
      get: () => extractHeaders(email),
    },

    content: {
      get: () => {
        const results = [];
        extractNode(email, results);
        return groupBy(results, 'group');
      },
    },

    snippet: {
      get: () => {
        if (this.content.text.length === 0) return 'No content.';

        const [target] = this.content.text;

        switch (target.type) {
          case 'text/html': {
            const parser = new DOMParser();
            const doc = parser.parseFromString(target.content, 'text/html');
            return doc.body.textContent.replace(/\r?\n|\r/g, ' ').slice(0, 255);
          }

          case 'text/plain':
            return target.content.replace(/\r?\n|\r/g, ' ').slice(0, 255);

          default:
            throw new Error(`Content type ${target.type} is not supported.`);
        }
      },
    },

    inline: {
      get: () => reduce(
        this.content.image,
        (accumulator, image) => {
          if (image.headers['Content-ID']) accumulator[image.headers['Content-ID']] = image;
          return accumulator;
        },
        {},
      ),
    },

    attachments: {
      get: () => {
        const { application = [], image = [] } = this.content;
        return [...application, ...image];
      },
    },
  });
}

export default EmailExtractor;
