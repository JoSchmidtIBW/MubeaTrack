import AppError from '../utils/appError.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import APIFeatures from '../utils/apiFeatures.mjs';

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //console.log(req.requestTime)

    // To allow for nestet GET reviews on tour (hack)
    let filter = {}; //gettAll...
    //if (req.params.tourId) filter = { tour: req.params.tourId }; //getAll...

    // EXECUTED QUERY

    // API features
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

export const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    console.log('bin getOne in HandlerFactory');
    console.log(req.params.id);
    console.log(JSON.stringify(req.params.id));
    let query = Model.findById(req.params.id);
    console.log('query: ' + query);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;
    console.log('doc: ' + doc);

    if (!doc) {
      // Null is false
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log('zum löschen:');
    console.log(req.params.id);

    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      // Null is false
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log('Bin UpdateOne in handlerFactory');

    console.log(req.body);

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      // Attention with patch and put, by updatebyid...
      new: true,
      runValidators: true,
    });

    if (!doc) {
      // Null is false
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      //201 = created
      status: 'succsess',
      data: {
        data: doc,
      },
    });
  });
