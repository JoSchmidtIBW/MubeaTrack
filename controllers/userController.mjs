import multer from 'multer';
import sharp from 'sharp';
import User from '../models/userModel.mjs';
import AppError from '../utils/appError.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import mongoose from 'mongoose';
import CryptoJS from 'crypto-js';
import { encryptData, decryptData } from '../utils/crypto.mjs';
import sendEmail from '../utils/email.mjs';
//import factory from '../controllers/handlerFactory.mjs';
import {
  getAll,
  getOne,
  deleteOne,
  updateOne,
} from '../controllers/handlerFactory.mjs';

import Machine from '../models/machineModel.mjs';
import Department from '../models/departmentModel.mjs';

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

  // if (!users) {
  //   return next(new AppError('No users found', 404));
  // }
  //console.log(users);

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

  console.log(req.body);

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
    birthDate: req.body.birthDate,
    gender: req.body.gender,
    language: req.body.language,
    professional: req.body.professional,
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

export const getUsersMachinery = catchAsync(async (req, res, next) => {
  console.log('bin XXX getUsersMachinery');
  // const departments = await Department.find().sort('_id').populate('machinery');
  // const machinery = await Machine.find().select('+_id').populate('employees');
  // const users = await User.find().populate('machinery'); //.select('+_id'); //.populate('machinery');

  const departments = await Department.find().sort('_id').populate('machinery');
  const machinery = await Machine.find().populate('employees');
  const users = await User.find(); //.populate('machinery');

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
                //
                // await Machine.findByIdAndUpdate(machineID, {
                //   $pull: { employees: employeeIDs },
                // });
                // //--------------------------------------funktioniert
                // await Machine.findByIdAndUpdate(machineID, {
                //   $pull: { employees: userID },
                // });
                //--------------------------------------funktioniert
                // await Machine.updateOne(machineID, {
                //   $pull: { employees: userID },
                // });
                const updatedMachine = await Machine.findByIdAndUpdate(
                  machineID,
                  { $pull: { employees: userID } },
                  { new: true }
                );
                await updatedMachine.save(); // wegen EmploeeCount, weil es anderst irgendwie nicht geht

                //const user = User.findByIdAndUpdate(userID);
                const user = await User.findByIdAndUpdate(
                  userID,
                  { $set: { machinery: [] } },
                  { new: true }
                );

                if (!user) {
                  // Benutzer nicht gefunden
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
                // Mitarbeiter nicht gefunden
                console.log('Keine Mitarbeiter gefunden');
              }
            } else {
              // Keine Mitarbeiter in der Machine vorhanden
              console.log('Keine Mitarbeiter gefunden');
            }
          } else {
            // Machine nicht gefunden
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

      // if (machinesEmployeesWithUserIDBeforeUpdate2 === "" || machinesEmployeesWithUserIDBeforeUpdate2 === null ) {
      // console.log(
      //   '!machinesEmployeesWithUserIDBeforeUpdate2: ' +
      //     machinesEmployeesWithUserIDBeforeUpdate2
      // );
      // }
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
                // Mitarbeiter gefunden
                console.log(
                  'Anzahl der gefundenen Mitarbeiter: ' +
                    findMachine2.employees.length
                );

                for (const employee2 of findMachine2.employees) {
                  console.log('-----------------------------------');
                  console.log('Gefundener Mitarbeiter: ' + employee2.firstName);
                  console.log('-----------------------------------');
                }
                //
                // await Machine.findByIdAndUpdate(machineID, {
                //   $pull: { employees: employeeIDs },
                // });
                // //--------------------------------------funktioniert
                // await Machine.findByIdAndUpdate(machineID, {
                //   $pull: { employees: userID },
                // });
                //--------------------------------------funktioniert
                // await Machine.updateOne(machineID, {
                //   $pull: { employees: userID },
                // });
                const updatedMachine2 = await Machine.findByIdAndUpdate(
                  machineID2,
                  { $pull: { employees: userID } },
                  { new: true }
                );
                await updatedMachine2.save(); // wegen EmploeeCount, weil es anderst irgendwie nicht geht

                console.log('Mitarbeiter erfolgreich entfernt');
                //------------------------------------------
                const machineIDs = req.body.machineryInDepartmentID
                  .split(',')
                  .map((id) => mongoose.Types.ObjectId(id));
                console.log(machineIDs);

                for (const machineToWriteID of machineIDs) {
                  console.log('machineToWriteID: ' + machineToWriteID);
                  //await Machine.findById(machineToWriteID)userID
                  const machine = await Machine.findByIdAndUpdate(
                    machineToWriteID,
                    { $addToSet: { employees: userID } }, // Füge den Benutzer zur "employees" Array-Liste hinzu
                    { new: true }
                  ).populate('employees');
                  await machine.save(); // wegen EmploeeCount, weil es anderst irgendwie nicht geht

                  if (!machine) {
                    // Maschine nicht gefunden
                    return res
                      .status(404)
                      .json({ message: 'Maschine nicht gefunden' });
                  }

                  //const user = User.findByIdAndUpdate(userID);
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
                // Mitarbeiter nicht gefunden
                console.log('Keine Mitarbeiter gefunden');
              }
            } else {
              // Keine Mitarbeiter in der Machine vorhanden
              console.log('Keine Mitarbeiter gefunden');
            }
          } else {
            // Machine nicht gefunden
            console.log('Machine nicht gefunden');
          }
        } catch (error) {
          console.log('Fehler beim Suchen der Machine: ', error);
        }
      }
    }
    // return res
    //   .status(200)
    //   .json({
    //     status: 'success',
    //     message: 'Benutzer erfolgreich zur Maschine hinzugefügt/entfernt',
    //   });
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

  //   var encryptedStringPasswortLClient;
  // // // passwort wird hier gehascht und schreibt es in den: encryptedStringPasswortLClient
  // // //**************************************************************************
  // let data = this.password; //passwortLClient;//Message to Encrypt
  let iv = CryptoJS.enc.Base64.parse(''); //giving empty initialization vector
  let key = CryptoJS.SHA256(process.env.CRYPTOJS_SECRET_KEY); //hashing the key using SHA256  --> diesen in config oder in .env Datei auslagern!!!!
  // // //var encryptedStringPasswortLClient=encryptData(data,iv,key);//muss var sein//
  // encryptedStringPasswortLClient = encryptData(data, iv, key); //muss var sein//
  // //   console.log("encryptedString: "+encryptedStringPasswortLClient);//genrated encryption String:  swBX2r1Av2tKpdN7CYisMg==
  // //--------------------------------------------------------------------------
  // //das ist zum wieder das normale pw anzeigen, möchte das später einbauen
  let decrypteddata = decryptData(userWithEmail.password, iv, key);
  console.log('decrypteddata: ' + decrypteddata);
  // //**************************************************************************

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
    //   user.passwordResetToken = undefined;
    //   user.passwordResetExpires = undefined;
    //   await user.save({ validateBeforeSave: false });
    //
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

// export const getUpdateUserMachinery = catchAsync(async (req, res, next) => {
//   console.log('Bin getUpdateUserMachinery');
//
//   const userID = req.params.userID;
//   console.log('userID: ' + userID);
//
//   console.log('machineryInDepartmentID: ' + req.body.machineryInDepartmentID);
//
//   if (req.body.machineryInDepartmentID.length === 0) {
//     console.log(
//       'Es wurde keine Machine ausgewählt! Der Benutzer sollte von allen Maschinen entfernt werden'
//     );
//
//     const machinesEmployeesWithUserIDBeforeUpdate = await Machine.find({
//       employees: userID,
//     }).populate('employees');
//
//     for (const machine of machinesEmployeesWithUserIDBeforeUpdate) {
//       console.log('Machine Name: ' + machine.name);
//       console.log('Machine ID: ' + machine._id);
//
//       const machineID = machine._id;
//       console.log('machineID: ' + machineID);
//
//       try {
//         const findMachine = await Machine.findById(machineID).populate(
//           'employees'
//         );
//
//         if (findMachine) {
//           console.log('Gefundene Machine: ', findMachine);
//
//           if (findMachine.employees && findMachine.employees.length > 0) {
//             const employeeIDs = findMachine.employees.map(
//               (employee) => employee._id
//             );
//
//             if (employeeIDs.includes(userID)) {
//               // Mitarbeiter gefunden
//               console.log(
//                 'Anzahl der gefundenen Mitarbeiter: ' +
//                   findMachine.employees.length
//               );
//
//               for (const employee of findMachine.employees) {
//                 console.log('-----------------------------------');
//                 console.log('Gefundener Mitarbeiter: ' + employee.firstName);
//                 console.log('-----------------------------------');
//               }
//
//               await Machine.findByIdAndUpdate(machineID, {
//                 $pull: { employees: employeeIDs },
//               });
//
//               console.log('Mitarbeiter erfolgreich entfernt');
//             } else {
//               // Mitarbeiter nicht gefunden
//               console.log('Keine Mitarbeiter gefunden');
//             }
//           } else {
//             // Keine Mitarbeiter in der Machine vorhanden
//             console.log('Keine Mitarbeiter gefunden');
//           }
//         } else {
//           // Machine nicht gefunden
//           console.log('Machine nicht gefunden');
//         }
//       } catch (error) {
//         console.log('Fehler beim Suchen der Machine: ', error);
//       }
//     }
//   } else {
//     console.log('Es wurde eine Machine ausgewählt');
//   }
// });

// export const getUpdateUserMachinery = catchAsync(async (req, res, next) => {
//   console.log('Bin getUpdateUserMachinery');
//
//   const userID = req.params.userID;
//   console.log('userID: ' + userID);
//
//   console.log('machineryInDepartmentID: ' + req.body.machineryInDepartmentID);
//
//   if (req.body.machineryInDepartmentID.length === 0) {
//     console.log(
//       'Es wurde keine Machine ausgewählt! Der Benutzer sollte von allen Maschinen entfernt werden'
//     );
//
//     const machinesEmployeesWithUserIDBeforeUpdate = await Machine.find({
//       employees: userID,
//     }).populate('employees');
//
//     for (const machine of machinesEmployeesWithUserIDBeforeUpdate) {
//       console.log('Machine Name: ' + machine.name);
//       console.log('Machine ID: ' + machine._id);
//
//       const machineID = machine._id;
//       console.log('machineID: ' + machineID);
//
//       try {
//         const findMachine = await Machine.findById(machineID).populate(
//           'employees'
//         );
//         console.log('Gefundene Machine: ', findMachine);
//
//         if (findMachine && findMachine.employees) {
//           const employeeIDs = findMachine.employees.map(
//             (employee) => employee._id
//           );
//
//           if (employeeIDs.includes(userID)) {
//             // Mitarbeiter gefunden
//             console.log(
//               'Anzahl der gefundenen Mitarbeiter: ' +
//                 findMachine.employees.length
//             );
//
//             for (const employee of findMachine.employees) {
//               console.log('-----------------------------------');
//               console.log('Gefundener Mitarbeiter: ' + employee.firstName);
//               console.log('-----------------------------------');
//             }
//
//             await Machine.findByIdAndUpdate(machineID, {
//               $pull: { employees: employeeIDs },
//             });
//
//             console.log('Mitarbeiter erfolgreich entfernt');
//           } else {
//             // Mitarbeiter nicht gefunden
//             console.log('Keine Mitarbeiter gefunden');
//           }
//         } else {
//           // findMachine oder findMachine.employees ist undefined
//           console.log('Keine Mitarbeiter gefunden');
//         }
//       } catch (error) {
//         console.log('Fehler beim Suchen der Machine: ', error);
//       }
//     }
//   } else {
//     console.log('Es wurde eine Machine ausgewählt');
//   }
// });

// export const getUpdateUserMachinery = catchAsync(async (req, res, next) => {
//   console.log('Bin getUpdateUserMachinery');
//
//   const userID = req.params.userID;
//   console.log('userID: ' + userID);
//
//   console.log('machineryInDepartmentID: ' + req.body.machineryInDepartmentID);
//
//   if (req.body.machineryInDepartmentID.length === 0) {
//     console.log(
//       'Es wurde keine Machine ausgewählt! Der Benutzer sollte von allen Maschinen entfernt werden'
//     );
//
//     const machinesEmployeesWithUserIDBeforeUpdate = await Machine.find({
//       employees: userID,
//     }).populate('employees');
//
//     for (const machine of machinesEmployeesWithUserIDBeforeUpdate) {
//       console.log('Machine Name: ' + machine.name);
//       console.log('Machine ID: ' + machine._id);
//
//       const machineID = machine._id;
//       console.log('machineID: ' + machineID);
//
//       const findMachine = await Machine.findOne({ _id: machineID }).populate(
//         'employees'
//       );
//
//       if (findMachine && findMachine.employees) {
//         const employeeIDs = findMachine.employees.map(
//           (employee) => employee._id
//         );
//
//         if (employeeIDs.includes(userID)) {
//           // Mitarbeiter gefunden
//           console.log(
//             'Anzahl der gefundenen Mitarbeiter: ' + findMachine.employees.length
//           );
//
//           for (const employee of findMachine.employees) {
//             console.log('-----------------------------------');
//             console.log('Gefundener Mitarbeiter: ' + employee.firstName);
//             console.log('-----------------------------------');
//           }
//
//           await Machine.findByIdAndUpdate(machineID, {
//             $pull: { employees: employeeIDs },
//           });
//         } else {
//           // Mitarbeiter nicht gefunden
//           console.log('Keine Mitarbeiter gefunden');
//         }
//       } else {
//         // findMachine oder findMachine.employees ist undefined
//         console.log('Keine Mitarbeiter gefunden');
//       }
//     }
//   } else {
//     console.log('Es wurde eine Machine ausgewählt');
//   }
// });

// if (
//   findMachine &&
//   findMachine.employees &&
//   findMachine.employees[0]._id === userID
// ) {
//   //findMachine && findMachine.employees
//   console.log(
//     'Anzahl der gefundenen Mitarbeiter: ' + findMachine.employees.length
//   );
//   for (const employee of findMachine.employees) {
//     console.log('-----------------------------------');
//     console.log('Gefundener Mitarbeiter: ' + employee.firstName);
//     console.log('-----------------------------------');
//   }
// const employeeIDs = findMachine.employees.map((employee) => employee._id);
//
// if (employeeIDs.includes(userID)) {
//   // Mitarbeiter gefunden
//   console.log(
//     'Anzahl der gefundenen Mitarbeiter: ' + findMachine.employees.length
//   );
//
//   for (const employee of findMachine.employees) {
//     console.log('-----------------------------------');
//     console.log('Gefundener Mitarbeiter: ' + employee.firstName);
//     console.log('-----------------------------------');
//   }
//   await Machine.findByIdAndUpdate(machineID, {
//     $pull: { employees: employeeIDs },
//   });
// } else {
//   // Mitarbeiter nicht gefunden
//   console.log('Keine Mitarbeiter gefunden');
// }
// } else {
//   console.log('-----------------------------------');
//   console.log('Keine Mitarbeiter gefunden');
//   console.log('-----------------------------------');
// }

//   console.log('userID: ' + userID);
//
//   if (
//     findMachine &&
//     findMachine.employees &&
//     findMachine.employees.includes(userID)
//   ) {
//     await Machine.findByIdAndUpdate(machineID, {
//       $pull: { employees: userID },
//     });
//     console.log('Mitarbeiter erfolgreich entfernt');
//   } else {
//     console.log('userID: ' + userID);
//     console.log(
//       'JSON.stringify(findMachine.employees): ' +
//         JSON.stringify(findMachine.employees)
//     );
//     console.log(
//       'findMachine.employees.includes(userID): ' +
//         findMachine.employees.includes(userID)
//     );
//     console.log(
//       'findMachine.employees === userID: ' +
//         (findMachine.employees === userID)
//     );
//     console.log('Mitarbeiter nicht gefunden in if');
//     console.log('findMachine.employees: ' + findMachine.employees);
//     console.log(
//       'findMachine.employees.includes(userID): ' +
//         findMachine.employees.includes(userID)
//     );
//     console.log(
//       'userID === findMachine.employees._id: ' +
//         (userID === findMachine.employees._id)
//     );
//     console.log(
//       'req.params.userID === findMachine.employees._id: ' +
//         (req.params.userID === findMachine.employees._id)
//     );
//     console.log('req.params.userID: ' + req.params.userID);
//     console.log('findMachine.employees._id: ' + findMachine.employees._id);
//     console.log('findMachine:', findMachine);
//     console.log('userID:', userID);
//     console.log('findMachine.employees._id:', findMachine.employees._id);
//     console.log('typeof userID:', typeof userID);
//     console.log(
//       'typeof findMachine.employees._id:',
//       typeof findMachine.employees._id
//     );
//     console.log('findMachine:', findMachine);
//     console.log('findMachine.employees:', findMachine.employees);
//     console.log('findMachine.employees._id:', findMachine.employees._id);
//   }
//     }
//   } else {
//     console.log('Es wurde eine Machine ausgewählt');
//   }
// });

// export const getUpdateUserMachinery = catchAsync(async (req, res, next) => {
//   console.log('Bin getUpdateUserMachinery');
//
//   const userID = req.params.userID;
//   console.log('userID   p: ' + userID);
//
//   console.log('machineryInDepartmentID: ' + req.body.machineryInDepartmentID);
//   //const machineDepartmentID = req.body
//   //const updateUser = await User.findById(userID);
//   //const machineIDs = req.body.machineryInDepartmentID;
//
//   if (req.body.machineryInDepartmentID.length === 0) {
//     console.log(
//       'Es wurde keine Machine angewählt! das heisst, der user sollte in allen machinen geöäscht werden'
//     );
//     const machinesEmployeesWithUserIDBeforeUpdate = await Machine.find({
//       employees: userID,
//     }).populate('employees');
//
//     //console.log(machinesEmployeesBeforeUpdate);
//     for (const machine of machinesEmployeesWithUserIDBeforeUpdate) {
//       console.log(machine.name);
//       console.log(machine._id);
//
//       const machineID = machine._id;
//       console.log('machineID: ' + machineID);
//       // machine.employees.pull(userID);
//       // await machine.save();
//       // if (machine.employees && machine.employees.length > 0) {
//       //console.log('Bin in Ifschlaufe');
//       const findMachine = await Machine.findById(machineID).populate(
//         'employees'
//       );
//       //console.log('gefunden: ' + findMachine.name);
//       //console.log('gefunden Employees: ' + findMachine.employees);
//       // console.log('gefunden Employees.length: ' + findMachine.employees.length);
//       if (findMachine && findMachine.employees) {
//         for (const employee of findMachine.employees) {
//           console.log('gefunden EmployeesFirstName: ' + employee.firstName);
//         }
//       }
//
//       console.log('userID: ' + userID);
//
//       if (
//         findMachine &&
//         findMachine.employees &&
//         findMachine.employees.length > 0
//       ) {
//         await Machine.findByIdAndUpdate(machineID, {
//           $pull: { employees: userID },
//         });
//       }
//     }
//   } else {
//     console.log('Es wurde Machine angewählt');
//   }
// });
// await Machine.findByIdAndUpdate(machineID, {
//   $pull: { employees: userID },
// });
// await Machine.findByIdAndUpdate(machineID, {
//   $pull: { employees: userID },
//   });
// }

// if (
//   findMachine &&
//   findMachine.employees &&
//   Array.isArray(findMachine.employees)
// ) {
//   console.log(findMachine.employees);
//
//   // Aktualisieren Sie das Feld "employees" der Maschine, um die userID zu entfernen
//   await Machine.findByIdAndUpdate(machineID, {
//     $pull: { employees: userID },
//   });
// }

// for (const machine of machinesEmployeesWithUserIDBeforeUpdate) {
//   console.log(machine.name);
//   console.log(machine._id);
//
//   //const machineID = machine._id;
//
//   const machineID = mongoose.Types.ObjectId(machine._id);
//   console.log(machineID);
//   const findMachine = await Machine.findById(machineID);
//   console.log('gefunden: ' + findMachine.name);
//
//   await Machine.findByIdAndUpdate(machineID, {
//     $pull: { employees: userID },
//   });
// }

// const machineIDs = req.body.machineryInDepartmentID
//   .split(',')
//   .map((id) => mongoose.Types.ObjectId(id));
// console.log(machineIDs);

//   // Überprüfen, ob die Maschine ein Feld "employees" hat und ob es definiert ist
//   if (
//     findMachine &&
//     findMachine.employees &&
//     Array.isArray(findMachine.employees)
//   ) {
//     console.log(findMachine.employees);
//
//     // Überprüfen, ob die userID im employees-Array vorhanden ist
//     const index = findMachine.employees.indexOf(userID);
//     if (index !== -1) {
//       // userID aus dem employees-Array entfernen
//       findMachine.employees.splice(index, 1);
//       await findMachine.save();
//     }
//   }
// }

// // Überprüfen, ob die Maschine ein Feld "employees" hat und ob es definiert ist
// if (
//   findMachine &&
//   findMachine.employees &&
//   Array.isArray(findMachine.employees)
// ) {
//   console.log(findMachine.employees);
//
//   // Überprüfen, ob die userID in der Mitarbeiterliste enthalten ist
//   const index = findMachine.employees.indexOf(userID);
//   if (index !== -1) {
//     // Entfernen Sie die userID aus dem Array
//     findMachine.employees.splice(index, 1);
//
//     // Speichern Sie die aktualisierte Maschine
//     await findMachine.save();
//   }
//
//   }
// try {
//   // Benutzer anhand der userID aktualisieren und die neuen Maschinen-IDs setzen
//   const updatedUser = await User.findByIdAndUpdate(
//     userID,
//     { $addToSet: { machinery: { $each: machineIDs } } },
//     { new: true }
//   );
//
//   // each machineID in machineIDs
//   //
//   // const updateMachine = await Machine.findByIdAndUpdate()
//
//   if (!updatedUser) {
//     return next(new AppError('No user found with that ID', 404));
//   } else {
//     console.log('Benutzer erfolgreich gefunden');
//   }
// } catch (error) {
//   console.log('Fehler beim Aktualisieren des Benutzers:', error);
//   // Fehlerbehandlung für den Fall, dass ein Fehler beim Aktualisieren des Benutzers auftritt
// }

//-------------------machine---------------------------------------------------
//const = machineIDs

// const machinesEmployeesBeforeUpdate = await Machine.find({
//   employees: userID,
// });
//
// //console.log(machinesEmployeesBeforeUpdate);
// for (const machineFoundUserID of machinesEmployeesBeforeUpdate) {
//   console.log(machineFoundUserID.name);
// }

// for (const machine of machinesEmployeesBeforeUpdate) {
//   machine.employees.pull(userID);
//   await machine.save();
// }
//
// console.log('Benutzer erfolgreich aus den Maschinen entfernt');

//
//
// //finde alle maschinen wo userID drin ist.
// const machinesEmployeesbebeforUpdate = await Machine.find({
//   employees: userID,
// });
// for (const machine of machinesEmployeesbebeforUpdate) {
// }
//
// for (const machineID of machineIDs) {
//   // Aktualisiere das Feld "employees" der Maschine
//   await Machine.findByIdAndUpdate(machineID, {
//     $addToSet: { employees: userID },
//   });
// }
// try {
//   const machinesToRemove = machinesUserbeforIDs
//     .filter((machine) => !machineIDs.includes(machine._id.toString()))
//     .map((machine) => machine._id);
//
//   await Machine.updateMany(
//     { _id: { $in: machinesToRemove } },
//     { $pull: { employees: userID } }
//   );
//
//   // await Machine.updateMany(
//   //   { _id: { $in: machineIDs } },
//   //   { $addToSet: { employees: userID } }
//   // );
//
//   //try {
//   // Iteriere über jede Maschinen-ID
//   for (const machineID of machineIDs) {
//     // Aktualisiere das Feld "employees" der Maschine
//     await Machine.findByIdAndUpdate(machineID, {
//       $addToSet: { employees: userID },
//     });
//   }
//
//   console.log('Maschinen erfolgreich aktualisiert');
//   // Weitere Aktionen oder Rückgabe der Antwort...
// } catch (error) {
//   console.log('Fehler beim Aktualisieren der Maschinen:', error);
//   // Fehlerbehandlung für den Fall, dass ein Fehler beim Aktualisieren der Maschinen auftritt
// }
//});

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
