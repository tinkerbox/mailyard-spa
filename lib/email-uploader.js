import crypt from 'crypto';
import gql from 'graphql-tag';

const SYNC_MUTATION = gql`
  mutation ($syncSessionId: ID!, $message: MessageInput!, $hash: String!) {
    sync(syncSessionId: $syncSessionId, message: $message) {
      putRequest(hash: $hash)
    }
  }
`;

const getMD5HashFromFile = file => crypt.createHash('md5')
  .update(file)
  .digest('base64');

function EmailUploader(mailboxId, client) {
  this.mailboxId = mailboxId;
  this.client = client;

  this.sync = async (result, extractor, syncSessionId) => {
    const { headers, snippet } = extractor;
    const receivedAt = new Date(parseInt(result.internalDate, 10));
    const size = result.raw.length;
    const {
      id, historyId, threadId, labelIds, sizeEstimate,
    } = result;

    const hash = getMD5HashFromFile(result.raw);

    const variables = {
      syncSessionId,
      message: {
        receivedAt,
        headers,
        size,
        snippet,
        gmailPayload: {
          id,
          historyId,
          threadId,
          labelIds,
          sizeEstimate,
        },
      },
      hash,
    };
    return this.client.mutate({
      mutation: SYNC_MUTATION,
      variables,
    });
  };

  this.upload = async () => {};
}

export default EmailUploader;
