export default function asyncHandler(fnct) {
  return function (req, res, next) {
    return Promise.resolve(fnct(req, res, next)
        .catch(next));
  };
}