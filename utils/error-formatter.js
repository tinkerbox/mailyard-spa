const format = (error) => {
  // console.log(error.graphQLErrors[0].extensions.exception);
  // TODO: cater for multiple GraphQL errors
  return error.graphQLErrors[0].extensions.exception.data.invalidArgs.reduce((errors, obj) => {
    errors[obj.arg] = obj.message;
    return errors;
  }, {});
};

export default format;
