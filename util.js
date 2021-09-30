// wrap an endpoint function with a try catch block to pass on to next
exports.asyncWrapper = (func) => {
  return async function wrappedFn(req, res, next) {
    try {
      await func(req, res);
    } catch (err) {
      next(err);
    }
  };
};
