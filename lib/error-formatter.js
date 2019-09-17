const format = (error) => {
  // TODO: cater for multiple GraphQL errors
  if (error.graphQLErrors && error.graphQLErrors.length !== 0) {
    const { invalidArgs } = error.graphQLErrors[0].extensions.exception.data;

    if (invalidArgs) {
      return invalidArgs.reduce((errors, obj) => ({
        ...errors,
        [obj.arg]: obj.message,
      }), {});
    }
    // TODO: handle other types of errors or ignore
  }

  if (error.networkError) return { network: error.networkError.message };

  return {};
};

export default format;
