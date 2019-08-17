// import base64url from 'base64url';
// import parse from 'emailjs-mime-parser';

// function EmailExtractor(raw) {
//   // private interface

//   const parseEmail = (payload) => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         try {
//           resolve(parse(base64url.decode(payload)));
//         } catch (error) {
//           reject(error);
//         }
//       }, 0);
//     });
//   };

//   const extractNode = (node, results) => {
//     switch (node.contentType.type) {
//       case 'message':
//         console.log(node);
//         break;

//       case 'multipart':
//         node.childNodes.forEach(childNode => extractNode(childNode, results));
//         break;

//       case 'image':
//         results.push({
//           content: node.content,
//           type: node.contentType.value,
//           filename: node.contentType.params.name,
//         });
//         break;

//       case 'text':
//       case 'application':
//         results.push({
//           content: new TextDecoder('utf-8').decode(node.content),
//           type: node.contentType.value,
//           filename: node.contentType.params.name,
//         });
//         break;

//       default:
//         throw new Error(`No handler for '${node.contentType.value}' content type`);
//     }
//   };

//   // public interface

//   this.raw = raw;
//   this.email = null;

//   this.headers = async () => {
//     if (!this.email) this.email = await parseEmail(this.raw);

//     return this.email.header.reduce((accumulator, header) => {
//       const [key, value] = header.split(': ');
//       accumulator[key] = value;
//       return accumulator;
//     }, {});
//   };

//   this.content = async () => {
//     if (!this.email) this.email = await parseEmail(this.raw);

//     const results = [];
//     extractNode(this.email, results);
//     return results;
//   };
// }

// export default EmailExtractor;
