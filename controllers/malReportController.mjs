import multer from 'multer';
import sharp from 'sharp';

import Machine from '../models/machineModel.mjs';
import MalReport from '../models/malReportModel.mjs';

import mongoose from 'mongoose';

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


export const getMalReports = catchAsync(async (req, res, next) =>{
  console.log("bin getMalReports")
})