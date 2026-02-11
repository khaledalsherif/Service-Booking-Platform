//Higher Oeder function
module.exports = (fun) => (req, res, next) =>
  fun(req, res, next).catch((err) => next(err));

// fun(req, res, next).catch((err) => next(err)); // That is the same thing
