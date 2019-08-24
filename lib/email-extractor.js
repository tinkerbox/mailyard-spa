import { groupBy } from 'lodash';

function EmailExtractor(email) {
  // private interface

  const extractNode = (node, results) => {
    switch (node.contentType.type) {
      case 'message':
        console.log(node);
        break;

      case 'multipart':
        node.childNodes.forEach(childNode => extractNode(childNode, results));
        break;

      case 'image':
        results.push({
          content: node.content,
          type: node.contentType.value,
          filename: node.contentType.params.name,
        });
        break;

      case 'text':
      case 'application':
        results.push({
          content: new TextDecoder('utf-8').decode(node.content),
          type: node.contentType.value,
          filename: node.contentType.params.name,
        });
        break;

      default:
        throw new Error(`No handler for '${node.contentType.value}' content type`);
    }
  };

  // public interface

  this.email = email;

  this.headers = () => {
    return this.email.header.reduce((accumulator, header) => {
      const [key, value] = header.split(': ');
      accumulator[key] = value;
      return accumulator;
    }, {});
  };

  this.content = () => {
    const results = [];
    extractNode(this.email, results);
    return groupBy(results, 'type');
  };
}

export default EmailExtractor;
