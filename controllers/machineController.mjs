import multer from 'multer';
import sharp from 'sharp';

import Machine from '../models/machineModel.mjs';

import APIFeatures from '../utils/apiFeatures.mjs';
import catchAsync from '../utils/catchAsync.mjs';

import AppError from '../utils/appError.mjs';
//import factory from '../controllers/handlerFactory.mjs';
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from '../controllers/handlerFactory.mjs';
import User from '../models/userModel.mjs';

//erst daten lesen dann verwenden top level code
//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

// right here on the top
const multerStorage = multer.memoryStorage(); // stored as a buffer

// nur für bilder erlaubt zum hochladen, dafür dieser filter
// test if uploaded file is an image, wenn true, --> cb (callBack) = filename und destination
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    //mimetype: 'image/jpeg',
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false); // 400 bad request, (null(error), false)
  }
};

// hier bei beginning
//const upload = multer({ dest: 'public/img/users' }) // das ist der ort, wo alle fotos von user gespeichert werden sollen

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
// in updateMe wird nun geschaut, das das hochgeladene neue bild, ins onbjekt des users geschrieben wird

//video 204     upload.fiels = mix von upload.single und uploads.array
export const uploadMachineImages = upload.fields([
  // in tourModel, images ist ein array, welches aus drei, anstatt einem bild wie bei usermodel besteht
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);
// wenn es nur eins, anstatt drei images wären, würde man das so machen:
// upload.single('image')   // req.file
// // wenn multiple images dann so:
// upload.array('images', 5)// 'images' = name of the field // req.files

// diese middleware macht den process von den geladenen bilder bzw macht die grösse
export const resizeMachineImages = catchAsync(async (req, res, next) => {
  //console.log("req.files: " + req.files) // mit S wegen multiple files  der hier darf nicht stehen, sonst gibt es ein error bei mir!!!

  if (!req.files.imageCover || !req.files.images) return next();

  // 1.) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer) // bild wird in buffer gespeichert //...const multerStorage = multer.memoryStorage(); // stored as a buffer
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 }) //90=90%
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // const imageCoverFilename = `tour-${req.params.id}-${Date.now()}-cover.jpeg`

  // await sharp(req.files.imageCover[0].buffer) // bild wird in buffer gespeichert //...const multerStorage = multer.memoryStorage(); // stored as a buffer
  // .resize(2000, 1333)
  // .toFormat('jpeg')
  // .jpeg({ quality: 90 }) //90=90%
  // .toFile(`public/img/tours/${imageCoverFilename}`)

  // req.body.imageCover = imageCoverFilename

  // 2.) other images in a loop

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
        .toFile(`public/img/tours/${filename}`);

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
export const aliasTopMachinery = async (req, res, next) => {
  // manipuliere query opject, damit nach next nur nocht top 5 kommen
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'; // was wollen wir zurück aus db

  next();
};

// 2. route handlers
//export const getAllMachinery = getAll(Machine);
export const getMachine = getOne(Machine);
//export const createMachine = createOne(Machine);
export const updateMachine = updateOne(Machine);
// export const updateMachine = catchAsync(async (req, res, next) => {
//   console.log('bin updateMachine');
//   console.log(req.body);
//
//   // const machinery = await Machine.find().select('+createdAt');
//   // // const users = await User.find().select('+createdAt').lean().exec();
//   // // const usersJSON = JSON.parse(JSON.stringify(users));
//   //
//   // res.status(200).json({
//   //   status: 'success',
//   //   results: machinery.length,
//   //   data: {
//   //     data: machinery,
//   //   },
//   // });
// });

export const deleteMachine = deleteOne(Machine);

export const getMachinery = catchAsync(async (req, res, next) => {
  console.log('bin getMachinery');

  const machinery = await Machine.find().select('+createdAt');
  // const users = await User.find().select('+createdAt').lean().exec();
  // const usersJSON = JSON.parse(JSON.stringify(users));

  res.status(200).json({
    status: 'success',
    results: machinery.length,
    data: {
      data: machinery,
    },
  });
});

//todo hier muss ev noch hinzugefügt werden, die MaschinenEinheiten und deteils, für danach fehler
export const createMachine = catchAsync(async (req, res) => {
  console.log('bin createMachine');

  console.log(req.body);

  const machineData = {
    name: req.body.name,
    description: req.body.description,
    type: req.body.type ? req.body.type : '-',
    constructionYear: req.body.constructionYear
      ? req.body.constructionYear
      : '-',
    companyMachine: req.body.companyMachine ? req.body.companyMachine : '-',
    voltage: req.body.voltage ? req.body.voltage : '-',
    controlVoltage: req.body.controlVoltage ? req.body.controlVoltage : '-',
    ratedCurrent: req.body.ratedCurrent ? req.body.ratedCurrent : '-',
    electricalFuse: req.body.electricalFuse ? req.body.electricalFuse : '-',
    compressedAir: req.body.compressedAir ? req.body.compressedAir : '-',
    weightMass: req.body.weightMass ? req.body.weightMass : '-',
    dimensions: req.body.dimensions ? req.body.dimensions : '-',
    drawingNumber: req.body.drawingNumber ? req.body.drawingNumber : '-',
    //photo: req.body.photo,
    department: req.body.department,
  };

  const newMachine = new Machine(machineData);
  await newMachine.save();

  res.status(200).json({
    status: 'success',
    message: 'A new machine is succefully created!',
  });
});

//Video 102 Agregation Pipeline for MongoDB
// soll statistiken zeigen von tours
//exports.getTourStats = catchAsync(async (req, res, next) => {
export const getMachineStats = catchAsync(async (req, res, next) => {
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

  // } catch (err) {
  //     res.status(404).json({
  //         status: 'fail',
  //         message: err
  //     })
  // }
});

// video 103    DAS GEHT NICHT WEIL DATENBANK ZUERST mit TERMINEN GELADEN WERDEN MUSS IM BEISPIEL
////http://127.0.0.1:4301/api/v1/tours/monthly-plan/:year   2021
//exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
export const getMonthlyPlan = catchAsync(async (req, res, next) => {
  // try {
  const year = req.params.year * 1; //  *1 mache nummer

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', // für jeden termin ein seperates Dokument
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        }, //2021
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0, // 0 id nicht anzeigen, 1 = anzeigen in deb
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    {
      $limit: 6,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });

  // } catch (err) {
  //     res.status(404).json({
  //         status: 'fail',
  //         message: err
  //     })
  // }
});
