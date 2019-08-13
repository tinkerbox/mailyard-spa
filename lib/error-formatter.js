const format = (error) => {
  // TODO: cater for multiple GraphQL errors
  if (error.graphQLErrors && error.graphQLErrors.length !== 0) {
    const { invalidArgs } = error.graphQLErrors[0].extensions.exception.data;
    return invalidArgs.reduce((errors, obj) => ({
      ...errors,
      [obj.arg]: obj.message,
    }), {});
  }

  if (error.networkError) return { network: error.networkError.message };

  return {};
};

export default format;
