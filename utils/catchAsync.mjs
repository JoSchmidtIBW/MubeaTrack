export default (fn) => {
  // damit keine try catch blöcke --> error is next
  // fn = function
  return (req, res, next) => {
    //anonymus function
    //fn(req, res, next).catch(err => next(err));//catch(next)
    fn(req, res, next).catch(next);
  };
};
