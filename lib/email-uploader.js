import gql from 'graphql-tag';

const SYNC_MUTATION = gql`
  mutation ($mailboxId: ID!, $message: MessageInput!) {
    sync(mailboxId: $mailboxId, message: $message) {
      putRequest
    }
  }
`;

function EmailUploader(mailboxId, client) {
  this.mailboxId = mailboxId;
  this.client = client;

  this.sync = async (result, extractor) => {
    const headers = extractor.headers();
    const receivedAt = new Date(parseInt(result.internalDate, 10));
    const { id, historyId, threadId, labelIds, sizeEstimate } = result;

    const variables = {
      mailboxId: this.mailboxId,
      message: {
        receivedAt,
        headers,
        gmailPayload: {
          id,
          historyId,
          threadId,
          labelIds,
          sizeEstimate,
        },
      },
    };
    return this.client.mutate({
      mutation: SYNC_MUTATION,
      variables,
    });
  };

  this.upload = async () => {};
}

export default EmailUploader;
