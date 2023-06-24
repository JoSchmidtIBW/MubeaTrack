export default (fn) => {
  // for no try catch blocks --> error is next
  // fn = function
  return (req, res, next) => {
    //anonymous function
    //fn(req, res, next).catch(err => next(err)); // catch(next)
    fn(req, res, next).catch(next);
  };
};
