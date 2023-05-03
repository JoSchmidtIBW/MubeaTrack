import multer from 'multer';
import sharp from 'sharp';

import Department from '../models/departmentModel.mjs';

import catchAsync from '../utils/catchAsync.mjs';

import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from '../controllers/handlerFactory.mjs';

const multerStorage = multer.memoryStorage(); // stored as a buffer

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    //mimetype: 'image/jpeg',
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false); // 400 bad request, (null(error), false)
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadDepartmentImages = upload.fields([
  // in tourModel, images ist ein array, welches aus drei, anstatt einem bild wie bei usermodel besteht
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);
// wenn es nur eins, anstatt drei images wären, würde man das so machen:
// upload.single('image')   // req.file
// // wenn multiple images dann so:
// upload.array('images', 5)// 'images' = name of the field // req.files

// diese middleware macht den process von den geladenen bilder bzw macht die grösse
export const resizeDepartmentImages = catchAsync(async (req, res, next) => {
  //console.log("req.files: " + req.files) // mit S wegen multiple files  der hier darf nicht stehen, sonst gibt es ein error bei mir!!!

  if (!req.files.imageCover || !req.files.images) return next();

  // 1.) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer) // bild wird in buffer gespeichert //...const multerStorage = multer.memoryStorage(); // stored as a buffer
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 }) //90=90%
    .toFile(`public/img/departments/departments-cover/${req.body.imageCover}`);

  req.body.images = [];

  //req.files.images.foreach(async (file, i) => {
  await Promise.all(
    req.files.images.map(async (file, i) => {
      // map, weil async await nur in der foreach schlaufe, und nicht im gesammten, mit map geht
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer) // bild wird in buffer gespeichert //...const multerStorage = multer.memoryStorage(); // stored as a buffer
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 }) //90=90%
        .toFile(`public/img/departments/${filename}`);

      req.body.images.push(filename);
    })
  );

  console.log(req.body);
  next();
});

// middleware get top-5-tours
//http://127.0.0.1:4301/api/v1/tours?limit=5&sort=-ratingsAverage,price
//http: //127.0.0.1:4301/api/v1/tours/top-5-cheap
//exports.aliasTopTours = async (req, res, next) => {
export const aliasTopDepartments = async (req, res, next) => {
  // manipuliere query opject, damit nach next nur nocht top 5 kommen
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'; // was wollen wir zurück aus db

  next();
};

export const getAllDepartments = getAll(Department);
export const getDepartment = getOne(Department);
export const createDepartment = createOne(Department);
export const updateDepartment = updateOne(Department);
export const deleteDepartment = deleteOne(Department);

//Video 102 Agregation Pipeline for MongoDB
// soll statistiken zeigen von tours
//exports.getTourStats = catchAsync(async (req, res, next) => {
export const getDepartmentStats = catchAsync(async (req, res, next) => {
  // try {
  const stats = await Tour.aggregate([
    // array = stages, wo die Daten manipuliert werden können
    {
      $match: { ratingsAverage: { $gte: 4.5 } }, // match stage
    },
    {
      $group: {
        // zb um durchschnitt zu erechnen von den 5 gefundenen
        //_id: null,
        //_id: '$difficulty', // _id: null, // für alle welche kommen
        //_id: '$ratingsAverage',
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 }, //1 pro dokument, jedesmal added 1  1++
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        // müssen namen von neuen objekten (oben) sein
        avgPrice: 1,
      },
    },
    // { // beispiel, um mehrere male match zu machen
    //     $match: { _id: { $ne: 'EASY' } } //alle welche not easy sind,  EASY weil ez neu in DB gross (difficulty)
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats: stats,
    },
  });
});
