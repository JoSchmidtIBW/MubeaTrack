import multer from 'multer';
import sharp from 'sharp';
import User from '../models/userModel.mjs';
import AppError from '../utils/appError.mjs';
import catchAsync from '../utils/catchAsync.mjs';
//import factory from '../controllers/handlerFactory.mjs';
import {
  getAll,
  getOne,
  deleteOne,
  updateOne,
} from '../controllers/handlerFactory.mjs';

// setting destination and fileName     SPEICHERT IN...
// const multerStorage = multer.diskStorage({
//   // stored in your filesystem, diskSpeicher
//   destination: (req, file, cb) => {
//     // hat zugriff auf req, file, cb = callBack, heisst nicht next, weil nicht von express kommt
//     cb(null, 'public/img/users'); // null = error or Not,
//   },
//   filename: (req, file, cb) => {
//     // file = req.file
//     // user-77586_id-3232322323232(timestamp).jpeg(ext)      // damit falls bild vorhanden, nicht überschrieben wird
//     const ext = file.mimetype.split('/')[1]; //mimetype: 'image/jpeg',
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`); //user-77586_id-3232322323232(timestamp).jpeg(ext)
//   },
// });
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
//const upload = multer({ dest: 'public/img/users' }); // das ist der ort, wo alle fotos von user gespeichert werden sollen
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// in updateMe wird nun geschaut, das das hochgeladene neue bild, ins onbjekt des users geschrieben wird

//Middleware
export const uploadUserPhoto = upload.single('photo');

// video 202
// middleware to resize photo to square, muss vor updateMe sein!
export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(); // wenn kein photo uploaded wurde, dann next, ansonsten resizing

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`; // der Pfad, wo es gespeichert wird definiert, hier, weil es wo anderst gebraucht wird, und nicht definiert ist

  await sharp(req.file.buffer) // bild wird in buffer gespeichert //...const multerStorage = multer.memoryStorage(); // stored as a buffer
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 }) //90=90%
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

//video 139
const filterObj = (obj, ...allowedFields) => {
  // create a array
  const newObj = {};
  //loop to the objekt in array
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// 2. route handlers
//exports.getAllUsers = factory.getAll(User)
// exports.getAllUsers = catchAsync(async(req, res, next) => {

//     const users = await User.find();

//     res.status(200).json({
//         status: 'success',
//         result: users.length,
//         data: {
//             users: users
//         }
//     })
// });

//video164  für getOne --> dort kommt id von query, wie wollen aber id von based user   id von login user
// dafür eine middleware machen
//exports.getMe = (req, res, next) => {
export const getMe = (req, res, next) => {
  // bevor calling getOne
  req.params.id = req.user.id;

  next();
};

//video 139
//exports.updateMe = catchAsync(async (req, res, next) => {
export const updateMe = catchAsync(async (req, res, next) => {
  console.log('bin updateMe');
  console.log(req.file);
  console.log(req.body);

  // Für User sich selber, ohne Admin
  // 1.) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update. Please use /updateMyPassword.',
        400
      )
    ); // 400 =  bad request
  }

  // könnte man mit user.save() machen, aber dann gibt es fehler
  // zu demonstrieren:
  //const user = await User.findById(req.user.id);// um saveMethode nicht zu nutzen hier, weil sonst fehler kommt

  // 3.) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    //'name',
    'email',
    'firstName',
    'lastName',
    'gender',
    'language',
    'role'
  ); // in req.body sind alle daten,
  // dem filteredBody auch noch photo hinzufügen, wenn req.file (photo) hat
  if (req.file) filteredBody.photo = req.file.filename;

  // 4.) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    // x, weil user könnte machen: req.body.role: 'admin, wir erlauben nur die felder email, und name zu ändern
    new: true,
    runValidators: true,
  });

  // user.name = 'Jonas'; //    //"password": "pass123",
  // user.save();    // sollte fehler kommen, please passwordConfirm, kommt aber nicht   aber darum ist auch die save-methode nicht gut hier

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

//video 140 delete user// aber nur account inaktiv schalten, nicht löschen von db
// zum testen, in postman sieht man nichts, aber in compass, ob active = false ist
//exports.deleteMe = catchAsync(async (req, res, next) => {
export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    // 204 = for deletet
    status: 'success',
    data: null, // sendet keine daten
  });
});

//.getUser = factory.getOne(User);
//exports.getUser = getOne(User);
export const getUser = getOne(User);
//nicht wie tutorial
// exports.getUser = async(req, res) => {
//     // res.status(500).json({
//     //         status: 'error',
//     //         message: 'this route is not defined'
//     //     }) // server error not implement
//     const user = await User.findById(req.params.id);

//     res.status(200).json({
//         status: 'success',
//         data: {
//             user: user
//         }
//     })
// }

//exports.getAllUsers = factory.getAll(User);
//exports.getAllUsers = getAll(User);

//export const getAllUsers = getAll(User);

export const getAllUsers = catchAsync(async (req, res, next) => {
  console.log('bin getAllUsers');

  const users = await User.find().select('+createdAt +password');
  // const users = await User.find().select('+createdAt').lean().exec();
  // const usersJSON = JSON.parse(JSON.stringify(users));

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      data: users,
    },
  });
});

// hier braucht es keine createOne, weil wir haben die signup- funktion
//exports.createUser = (req, res) => {
export const createUser = catchAsync(async (req, res) => {
  console.log('bin createNewUser');

  //console.log(req.body);

  // const newUser = await User.create({
  //   // nur das wird aktzepiert zum ein user machen
  //   employeeNumber: req.body.employeeNumber,
  //   firstName: req.body.firstName,
  //   lastName: req.body.lastName,
  //   age: req.body.age,
  //   gender: req.body.gender,
  //   language: req.body.language,
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   passwordConfirm: req.body.passwordConfirm,
  //   passwordChangeAt: req.body.passwordChangeAt,
  //   role: req.body.role,
  //   photo: req.body.photo,
  //   department: req.body.department,
  //   active: req.body.active,
  // });

  const userData = {
    employeeNumber: req.body.employeeNumber,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    age: req.body.age,
    gender: req.body.gender,
    language: req.body.language,
    //name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangeAt: req.body.passwordChangeAt,
    role: req.body.role,
    photo: req.body.photo,
    department: req.body.department,
    active: req.body.active,
  };

  const newUser = new User(userData);
  await newUser.save();

  res.status(200).json({
    status: 'success',
    message: 'A new user is succefully created!',
  });

  // res.status(500).json({
  //   status: 'error',
  //   message: 'this route is not defined, pleace use /signup insteat',
  // }); // server error not implement
});

// Do NOT update password with this!
//exports.updateUser = factory.updateOne(User); // nur für admin, und update data that is not the passwort
//exports.updateUser = updateOne(User);
export const updateUser = updateOne(User);

// export const updateUser = catchAsync(async (req, res, next) => {
//   // name: req.body.name,
//   // email: req.body.email,
//   // password: req.body.password,
//   // passwordConfirm: req.body.passwordConfirm,
//   // passwordChangeAt: req.body.passwordChangeAt,
//   // role: req.body.role,
//   // photo: req.body.photo,
//   // department: req.body.department,
//
//   console.log('req.body: ' + JSON.stringify(req.body));
//
//   try {
//     const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//       //achtung mit patch und put, bei updatebyid
//       new: true,
//       runValidators: true, // falls price: 500 wäre ein string
//     }); // in url /:63fb4c3baac7bf9eb4b72a76 , body: was geupdatet wird, 3, damit nur das geupdatet neue return wird
//     // Tour.findOne({ _id: req.params.id})
//
//     res.status(200).json({
//       //postman: url/63fb4c3baac7bf9eb4b72a76 und body muss json sein sonst geht nicht
//       status: 'success',
//       // results: tours.length,
//       //message: "helllloooo",
//       data: {
//         //     tours: 'updated tours here...' //{ tours: tours }
//         user: user, // wenn gleicher name tout tour, kann auch nur tour stehen
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// });

// weil findbyidandupdate, die ganzen save- middleware is not run

// exports.updateUser = (req, res) => { // für ADMIN
//     res.status(500).json({
//             status: 'error',
//             message: 'this route is not defined'
//         }) // server error not implement
// }

//exports.deleteUser = factory.deleteOne(User);
//exports.deleteUser = deleteOne(User);
export const deleteUser = deleteOne(User);
// exports.deleteUser = (req, res) => {
//     res.status(500).json({
//             status: 'error',
//             message: 'this route is not defined'
//         }) // server error not implement
// }
