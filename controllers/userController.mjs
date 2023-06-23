import multer from 'multer';
import sharp from 'sharp';

import AppError from '../utils/appError.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import mongoose from 'mongoose';
import CryptoJS from 'crypto-js';
import { encryptData, decryptData } from '../utils/crypto.mjs';
import sendEmail from '../utils/email.mjs';

import {
  getOne,
  deleteOne,
  updateOne,
} from '../controllers/handlerFactory.mjs';

import Machine from '../models/machineModel.mjs';
import Department from '../models/departmentModel.mjs';
import User from '../models/userModel.mjs';

// right here on the top
const multerStorage = multer.memoryStorage(); // stored as a buffer

// This filter only allows the upload of images
// test if uploaded file is an image, when true, --> cb (callBack) = filename and destination
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    //mimetype: 'image/jpeg',
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false); // 400 = bad request, (null(error), false)
  }
};

//const upload = multer({ dest: 'public/img/users' }) // This is the place, where all images will be save

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single('photo');

// Middleware to resize photo to square, must be before the updateMe- function!
export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(); // if no photo was uploaded, then next, otherwise resizing

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer) // Image will be save in a buffer //...const multerStorage = multer.memoryStorage(); // stored as a buffer
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 }) // 90 = 90%
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  // create a array
  const newObj = {};
  // loop to the objekt in array
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// For getOne --> there id comes from query, but we want the id from based- user ( id from logt in user )
export const getMe = (req, res, next) => {
  // before calling getOne
  req.params.id = req.user.id;

  next();
};

export const updateMe = catchAsync(async (req, res, next) => {
  console.log('bin updateMe');
  console.log(req.file);
  console.log(req.body);

  // 1.) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update. Please use /updateMyPassword.',
        400 // 400 =  bad request
      )
    );
  }

  // 3.) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'email',
    'firstName',
    'lastName',
    'gender',
    'language',
    'role'
  );
  // also add photo to the filteredBody if req.file has (photo)
  if (req.file) filteredBody.photo = req.file.filename;

  // 4.) Update user document, not with save-method!
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    // because user can change his role: req.body.role: 'admin', only the fields in filteredBody are allowed
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// For make account inactive, not delete in db, inactive
// To test, in postman you don't see anything, but in compass if active = false
export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    // 204 = for deleted
    status: 'success',
    data: null, // send no data
  });
});

export const getUser = getOne(User);

export const getAllUsers = catchAsync(async (req, res, next) => {
  console.log('bin getAllUsers');

  const users = await User.find().select('+createdAt +password');

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      data: users,
    },
  });
});

export const createUser = catchAsync(async (req, res, next) => {
  console.log('bin createUser');

  console.log(req.body);

  console.log(req.body.birthDate);
  const dateArr = req.body.birthDate.split('.');
  const year = dateArr[2];

  console.log(year);

  console.log(new Date().getFullYear());
  const yearNow = new Date().getFullYear();

  if (year >= yearNow.toString()) {
    return next(
      new AppError('The Birth date can not be real...! Please try again.', 400)
    ); // 400 = bad request
  }

  const userData = {
    employeeNumber: req.body.employeeNumber,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthDate: req.body.birthDate,
    gender: req.body.gender,
    language: req.body.language,
    professional: req.body.professional,
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
});

export const getUsersMachinery = catchAsync(async (req, res, next) => {
  console.log('bin getUsersMachinery');

  const departments = await Department.find().sort('_id').populate('machinery');
  const machinery = await Machine.find().populate('employees');
  const users = await User.find();

  console.log(users.length);
  console.log(users[0]._id);

  if (!users) {
    return next(new AppError('No users found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      departments: departments,
      machinery: machinery,
      users: users,
    },
  });
});

export const getUpdateUserMachinery = catchAsync(async (req, res, next) => {
  try {
    console.log('Bin getUpdateUserMachinery');

    const userID = req.params.userID;
    console.log('userID: ' + userID);

    console.log('machineryInDepartmentID: ' + req.body.machineryInDepartmentID);

    if (req.body.machineryInDepartmentID.length === 0) {
      console.log(
        'Es wurde keine Machine ausgewählt! Der Benutzer sollte von allen Maschinen entfernt werden'
      );

      const machinesEmployeesWithUserIDBeforeUpdate = await Machine.find({
        employees: userID,
      }).populate('employees');

      for (const machine of machinesEmployeesWithUserIDBeforeUpdate) {
        console.log('Machine Name: ' + machine.name);
        console.log('Machine ID: ' + machine._id);

        const machineID = machine._id;
        console.log('machineID: ' + machineID);

        try {
          const findMachine = await Machine.findById(machineID).populate(
            'employees'
          );

          if (findMachine) {
            //console.log('Gefundene Machine: ', findMachine);

            if (findMachine.employees && findMachine.employees.length > 0) {
              const employeeIDs = findMachine.employees.map(
                (employee) => employee._id
              );

              if (employeeIDs.includes(userID)) {
                // Mitarbeiter gefunden
                console.log(
                  'Anzahl der gefundenen Mitarbeiter: ' +
                    findMachine.employees.length
                );

                for (const employee of findMachine.employees) {
                  console.log('-----------------------------------');
                  console.log('Gefundener Mitarbeiter: ' + employee.firstName);
                  console.log('-----------------------------------');
                }

                const updatedMachine = await Machine.findByIdAndUpdate(
                  machineID,
                  { $pull: { employees: userID } },
                  { new: true }
                );
                await updatedMachine.save(); // because of EmploeeCount, because it somehow doesn't work otherwise

                const user = await User.findByIdAndUpdate(
                  userID,
                  { $set: { machinery: [] } },
                  { new: true }
                );

                if (!user) {
                  // User not found
                  return res
                    .status(404)
                    .json({ message: 'Benutzer nicht gefunden' });
                }

                res.status(200).json({
                  status: 'success',
                  message:
                    'Benutzer erfolgreich zur Maschine hinzugefügt/entfernt',
                });

                console.log('Mitarbeiter erfolgreich entfernt');
              } else {
                // Employee not found
                console.log('Keine Mitarbeiter gefunden');
              }
            } else {
              // no employees in machine
              console.log('Keine Mitarbeiter gefunden in Maschine');
            }
          } else {
            // machine not found
            console.log('Machine nicht gefunden');
          }
        } catch (error) {
          console.log('Fehler beim Suchen der Machine: ', error);
        }
      }
    } else {
      console.log('Es wurde eine Machine ausgewählt');

      const machinesEmployeesWithUserIDBeforeUpdate2 = await Machine.find({
        employees: userID,
      }).populate('employees');

      if (machinesEmployeesWithUserIDBeforeUpdate2.length === 0) {
        console.log('Der user hat noch in keiner Maschine gearbeitet');

        const machineIDs = req.body.machineryInDepartmentID
          .split(',')
          .map((id) => mongoose.Types.ObjectId(id));
        console.log(machineIDs);

        const userWriteMachineID = await User.findByIdAndUpdate(
          userID,
          { $set: { machinery: machineIDs } },
          { new: true }
        );

        const machines = await Machine.find({ _id: { $in: machineIDs } });
        for (const machine of machines) {
          machine.employees.push(userID);
          await machine.save();
        }
        res.status(200).json({
          status: 'success',
          message: 'Benutzer erfolgreich zur Maschine hinzugefügt/entfernt',
        });
      }

      for (const machine2 of machinesEmployeesWithUserIDBeforeUpdate2) {
        console.log('Machine Name: ' + machine2.name);
        console.log('Machine ID: ' + machine2._id);

        const machineID2 = machine2._id;
        console.log('machineID: ' + machineID2);

        try {
          const findMachine2 = await Machine.findById(machineID2).populate(
            'employees'
          );

          if (findMachine2) {
            //console.log('Gefundene Machine: ', findMachine);

            if (findMachine2.employees && findMachine2.employees.length > 0) {
              const employeeIDs2 = findMachine2.employees.map(
                (employee) => employee._id
              );

              if (employeeIDs2.includes(userID)) {
                // employee found
                console.log(
                  'Anzahl der gefundenen Mitarbeiter: ' +
                    findMachine2.employees.length
                );

                for (const employee2 of findMachine2.employees) {
                  console.log('-----------------------------------');
                  console.log('Gefundener Mitarbeiter: ' + employee2.firstName);
                  console.log('-----------------------------------');
                }

                const updatedMachine2 = await Machine.findByIdAndUpdate(
                  machineID2,
                  { $pull: { employees: userID } },
                  { new: true }
                );
                await updatedMachine2.save(); // because of EmploeeCount, because it somehow doesn't work otherwise

                console.log('Mitarbeiter erfolgreich entfernt');
                //------------------------------------------
                const machineIDs = req.body.machineryInDepartmentID
                  .split(',')
                  .map((id) => mongoose.Types.ObjectId(id));
                console.log(machineIDs);

                for (const machineToWriteID of machineIDs) {
                  console.log('machineToWriteID: ' + machineToWriteID);

                  const machine = await Machine.findByIdAndUpdate(
                    machineToWriteID,
                    { $addToSet: { employees: userID } }, // Add the user to the "employees" array- list
                    { new: true }
                  ).populate('employees');
                  await machine.save(); // because of EmploeeCount, because it somehow doesn't work otherwise

                  if (!machine) {
                    // machine not found
                    return res
                      .status(404)
                      .json({ message: 'Maschine nicht gefunden' });
                  }

                  const userDeleteMachineID = await User.findByIdAndUpdate(
                    userID,
                    { $set: { machinery: [] } },
                    { new: true }
                  );

                  const userWriteMachineID = await User.findByIdAndUpdate(
                    userID,
                    { $set: { machinery: machineIDs } },
                    { new: true }
                  );
                  res.status(200).json({
                    status: 'success',
                    message:
                      'Benutzer erfolgreich zur Maschine hinzugefügt/entfernt',
                  });
                }
              } else {
                // employee not found
                console.log('Keine Mitarbeiter gefunden');
              }
            } else {
              // no employee found in machine
              console.log('Keine Mitarbeiter in der Maschine gefunden');
            }
          } else {
            // machine not found
            console.log('Machine nicht gefunden');
          }
        } catch (error) {
          console.log('Fehler beim Suchen der Machine: ', error);
        }
      }
    }
  } catch (error) {
    console.log('Ein Fehler ist aufgetreten: ', error);
    return res
      .status(500)
      .json({ status: 'fail', message: 'Ein Fehler ist aufgetreten' });
  }
});

export const getForgotPasswordAdmin = catchAsync(async (req, res, next) => {
  console.log('bin getForgotPasswordAdmin');
  console.log(req.body.email);

  const userWithEmail = await User.findOne({ email: req.body.email }).select(
    'password email'
  );
  console.log('userWithEmail: ' + userWithEmail);

  if (!userWithEmail) {
    return next(new AppError('No users found with that email', 404));
  }

  let iv = CryptoJS.enc.Base64.parse(''); //giving empty initialization vector
  let key = CryptoJS.SHA256(process.env.CRYPTOJS_SECRET_KEY); //hashing the key using SHA256
  let decrypteddata = decryptData(userWithEmail.password, iv, key);
  console.log('decrypteddata: ' + decrypteddata);

  const message = `Forgot your password?\n\nYour password is: \n\n${decrypteddata}\n
  \nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: userWithEmail.email,
      subject: 'Your password reset token (valid for 10min)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

// Do NOT update password with this! (update data that is not the password!)
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
