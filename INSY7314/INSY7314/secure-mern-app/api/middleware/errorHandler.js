// Catch-all error handler. Express only recognises a middleware as an error
// handler when it takes four arguments so next has to stay in the signature
// even though nothing calls it here

const errorHandler = (err, req, res, next) => {
  // Keep the real error on the server where we can actually read it
  console.error(err.message);

  // The client only ever gets a generic message. Returning stack traces or file
  // paths would hand an attacker a map of the internals
  res.status(500).json({ error: 'Something went wrong' });
};

module.exports = errorHandler;
