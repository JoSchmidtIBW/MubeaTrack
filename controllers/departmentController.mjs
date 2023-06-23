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

const multerStorage = multer.memoryStorage(); // Stored as a buffer

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
  // In departmentModel, images is a array, which consists of three, instead of one picture like the usermodel
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

export const resizeDepartmentImages = catchAsync(async (req, res, next) => {
  //console.log("req.files: " + req.files) // With "S" cause multiple files, this here can not be (un)-command out, it will give an error!

  if (!req.files.imageCover || !req.files.images) return next();

  // 1.) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer) // Image will be save in a buffer //...const multerStorage = multer.memoryStorage(); // stored as a buffer
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 }) //90=90%
    .toFile(`public/img/departments/departments-cover/${req.body.imageCover}`);

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      // map, because async await only work in the foreach loop, and not in the whole, with map it works --> req.files.images.foreach(async (file, i) => {...
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer) // Image will be save in a buffer //...const multerStorage = multer.memoryStorage(); // stored as a buffer
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 }) // 90 = 90%
        .toFile(`public/img/departments/${filename}`);

      req.body.images.push(filename);
    })
  );

  console.log(req.body);
  next();
});

export const getAllDepartments = getAll(Department);
export const getDepartment = getOne(Department);
export const createDepartment = createOne(Department);
export const updateDepartment = updateOne(Department);
export const deleteDepartment = deleteOne(Department);
