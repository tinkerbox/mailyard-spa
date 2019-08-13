import gql from 'graphql-tag';

const SYNC_MUTATION = gql`
  mutation ($mailboxId: ID!, $message: MessageInput!) {
    sync(mailboxId: $mailboxId, message: $message) {
      preSignedUrl
    }
  }
`;

function EmailUploader(mailboxId, client) {
  this.mailboxId = mailboxId;
  this.client = client;

  this.sync = async (extractor) => {
    const variables = {
      mailboxId: this.mailboxId,
      message: {
        receivedAt: new Date(),
        headers: extractor.headers(),
        gmailPayload: {},
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
