import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';

import bcrypt from 'bcryptjs';

import Department from './departmentModel.mjs';

import { encryptData, decryptData } from '../utils/crypto.mjs';
import CryptoJS from 'crypto-js';
import AppError from '../utils/appError.mjs';

const userSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  //   //required: [true, 'A User must have a name!'],
  // },
  firstName: {
    type: String,
    required: [true, 'A User must have a firstName'],
    trim: true, // nama und nicht leerzeichenNameLeerzeichen
    maxlength: [20, 'A firstName must have less or equal then 20 characters'], //validator
    minlength: [1, 'A firstName must have more or equal then 1 characters'], //validator
  },
  lastName: {
    type: String,
    required: [true, 'A User must have a lastName'],
    trim: true, // nama und nicht leerzeichenNameLeerzeichen
    maxlength: [20, 'A lastName must have less or equal then 20 characters'], //validator
    minlength: [1, 'A lastName must have more or equal then 1 characters'], //validator
  },
  employeeNumber: {
    type: Number,
    required: [true, 'A user must have a employeeNumber'],
    unique: true, // darf keine gleiche nochmals haben!
    trim: true,
    select: true,
  },
  // age: {
  //   type: Number,
  //   default: 1,
  //   trim: true,
  // },
  birthDate: {
    type: String,
    required: [true, 'A user must have a birth date'],
    trim: true,
  },
  gender: {
    type: String,
    trim: true,
  },
  language: {
    type: String,
    default: 'de',
    trim: true,
  },
  // tour: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'Tour',
  //   //required: [true, 'Review must belong a tour.']
  // },
  professional: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    //required: [true, 'Please provide your email!'],
    // unique: true,
    // validate: [
    //   {
    //     validator: function (value) {
    //       // Überprüfen, ob entweder keine E-Mail-Adresse angegeben ist oder eine eindeutige E-Mail-Adresse verwendet wird
    //       return (
    //         !value ||
    //         this.constructor
    //           .findOne({ email: value })
    //           .exec()
    //           .then((user) => !user)
    //       );
    //     },
    //     message: 'Email address is already in use!',
    //   },
    //   {
    //     validator: function (value) {
    //       // Überprüfen, ob die angegebene E-Mail-Adresse ein gültiges Format hat
    //       return !value || validator.isEmail(value);
    //     },
    //     message: 'Please provide a valid email address!',
    //   },
    // ],

    // validate: {
    //   validator: async function (value) {
    //     // Überprüfen, ob die E-Mail-Adresse bereits verwendet wird
    //     const existingUser = await this.constructor.findOne({ email: value });
    //     return !existingUser; // Gibt true zurück, wenn keine Übereinstimmung gefunden wurde (eindeutig)
    //   },
    // },
    // lowercase: true,
    //validate: [validator.isEmail, 'Please profide a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'Chef', 'Schichtleiter', 'Unterhalt'],
    default: 'user',
    // validate: {
    //   validator: function (value) {
    //     return value !== 'admin';
    //   },
    //   message: 'Admin role is not allowed.',
    // },
  },
  department: {
    //const user = await User.findOne({ _id: userId }).populate('department', 'name');
    type: [String],
    default: ['Engineering'],
    enum: [
      'Engineering',
      'Konstruktion',
      'IT',
      'Unterhalt',
      'Geschäfts-Führung',
      'Schweisserei',
      'Zieherei',
      'Anarbeit',
    ],
    // required: [true, 'Please provide your department'],
  },
  // department: {
  //   type: [String],
  //   //type: mongoose.Schema.Types.ObjectId,
  //   //ref: 'Department',
  //   default: '5c8a24822f8fb814b56fa192',
  //   required: [true, 'Please provide your department'],
  // },
  machines: [
    {
      type: [String],
      enum: [
        'TRT 1',
        'Conni 1',
        'Rattunde 1',
        'Rattunde 2',
        'Rattunde 3',
        'Rattunde 4',
        'Rattunde 5',
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false, //dann sieht man nicht
  },
  // department: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Department',
  //   validate: {
  //     validator: function(value) {
  //       return mongoose.model('Department').findById(value)
  //         .then(doc => {
  //           if (!doc) {
  //             return false;
  //           }
  //           return true;
  //         })
  //         .catch(err => {
  //           return false;
  //         });
  //     },
  //     message: 'Department does not exist'
  //   },
  // },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false, //damit passwort nicht sieht in postman, oder browser
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE, not for Update  (auch nicht bei ... user aktualisiert pw )
      validator: function (el) {
        // das ist die Funktion die überprüft, ob PW gleich pwConfirm     el ist element_passwortConfirm
        return el === this.password; //return true or false     viedeo 127      abc === abc --> true
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangeAt: Date, // hier wurde noch nicht gross darauf eingegagen, aber es braucht es
  passwordResetToken: String,
  passwordResetExpires: Date, // damit resetToken abläuft
  active: {
    // um zb User inaktiv zu machen, // video 140
    type: Boolean,
    default: true, // aktiver user, boolean = true
    select: false, // zeigt nicht im output ob aktiv oder inaktive
  },
});

// Checks that there can only be one admin,
// also that this pre-save-middleware does not have to be commented out, when the first user- data is loaded into mongodb
userSchema.pre('save', async function (next) {
  const adminCount = await this.constructor.countDocuments({ role: 'admin' });
  // console.log('adminCount: ' + adminCount);
  // console.log('this.isNew: ' + this.isNew);

  const saveFields = this;
  // console.log('saveFields');
  // console.log(saveFields);
  // console.log(saveFields.role);

  if (adminCount > 0 && saveFields.role === 'admin') {
    return next(new AppError('Only one admin- user is allowed!', 400));
  }

  next();
});

// Checks when the admin updates that he cannot change his role as admin
userSchema.pre('findOneAndUpdate', async function (next) {
  console.log('schau das Admin nicht seine rolle ändern kann');

  const updatedFields = this.getUpdate();
  console.log('updatedFields');
  console.log(updatedFields);
  console.log(updatedFields.role);

  const user = await this.findOne();

  // console.log('user' + user);
  // console.log('user._id: ' + user._id);
  // console.log('user.role: ' + user.role);

  const ADMIN_ID = '643c1f042df0321cb8a06a47'; //ID von MongoDB

  if (user._id.toString() === ADMIN_ID) {
    //console.log('ist ADMIN!!!!!!!!!!!!!**********!!!!');
    if (updatedFields.role !== 'admin')
      return next(new AppError('Admin- Role can not be changed!!!', 400));
  }

  next();
});

// Checks if the department exists and the user only saves himself in it once, when creating a user
// and if the user has multiple departments, check every department, if they exists and save the user once
userSchema.pre('save', async function (next) {
  if (this.department && Array.isArray(this.department)) {
    try {
      console.log('this.department: ' + this.department);
      for (const dep of this.department) {
        const department = await Department.findOne({ name: dep });
        if (department) {
          if (!department.employees.includes(this._id)) {
            department.employees.push(this._id);
            await department.save();
          } else {
            console.log('Der Benutzer ist bereits in dieser Abteilung');
          }
        }
      }
    } catch (error) {
      // Handle error if any
    }
  } else if (this.department) {
    try {
      const department = await Department.findOne({ name: this.department });
      if (department) {
        if (!department.employees.includes(this._id)) {
          department.employees.push(this._id);
          await department.save();
        } else {
          console.log('Der Benutzer ist bereits in dieser Abteilung');
        }
      }
    } catch (error) {
      // Handle error if any
    }
  }
  next();
});
// userSchema.pre('save', async function (next) {
//   if (this.department && Array.isArray(this.department)) {
//     //['IT','Engineering']
//     console.log('this.department: ' + this.department);
//     for (const dep of this.department) {
//       const department = await Department.findOne({ name: dep });
//       if (department) {
//         if (!department.employees.includes(this._id)) {
//           department.employees.push(this._id);
//           await department.save();
//         } else {
//           console.log('Der Benutzer ist bereits in dieser Abteilung');
//         }
//       }
//     }
//   } else if (this.department) {
//     const department = await Department.findOne({ name: this.department });
//     if (department) {
//       if (!department.employees.includes(this._id)) {
//         department.employees.push(this._id);
//         await department.save();
//       } else {
//         console.log('Der Benutzer ist bereits in dieser Abteilung');
//       }
//     }
//   }
//   next();
// });
// userSchema.pre('save', async function (next) {
//   if (this.department) {
//     console.log('this.department: ' + this.department); //this.department = userDepartment im usermodel
//     const department = await Department.findOne({ name: this.department });
//     //console.log('Gefunden department in Department: ' + department);
//
//     if (department) {
//       if (!department.employees.includes(this._id)) {
//         department.employees.push(this._id);
//         await department.save(); //department in Department
//       } else {
//         console.log('Der Benutzer ist bereits in dieser Abteilung');
//       }
//     }
//   }
//   next();
// });

// soll die departments updaten, mit dem, was gerade aktuell im user.departmentArray drin ist
// update all departments, Checks if user is assigned to departments and checks that
// the user does not appear more than once in the same department
userSchema.pre('findOneAndUpdate', async function (next) {
  const { department } = this._update;

  if (department) {
    const newDepartments = await Department.find({ name: { $in: department } });

    const user = await User.findById(this._conditions._id);
    const oldDepartments = user.department
      ? await Department.find({ name: { $in: user.department } })
      : [];

    for (const dep of oldDepartments) {
      if (!newDepartments.some((newDep) => newDep.name === dep.name)) {
        dep.employees.pull(this._conditions._id);
        await dep.save();
      }
    }

    for (const dep of newDepartments) {
      if (user.department && user.department.includes(dep.name)) {
        console.log('Der Benutzer ist bereits in dieser Abteilung');
        continue;
      }
      dep.employees.addToSet(this._conditions._id);
      await dep.save();
    }
  }
  next();
});

//löschen von user auch löschen in department.employeeCount und Löschen von ADMIN nicht erlaubt, mit ID weil name kann geändert werden
// Checks that when a user is deleted that also matches department.employeeCount,
// and monitors that the ADMIN cannot delete itself, this with its ID because the name can be changed
userSchema.pre('findOneAndDelete', async function (next) {
  console.log('bin remove');
  console.log('this: ' + this);
  console.log('this._id: ' + this._id);
  const user1 = await User.findById(this._conditions._id);
  console.log('user1' + user1);
  const user = await this.findOne();

  console.log('user' + user);
  console.log('user._id: ' + user._id);

  const ADMIN_ID = '643c1f042df0321cb8a06a47'; //ID von MongoDB

  if (user._id.toString() === ADMIN_ID) {
    console.log('ist ADMIN!!!!!!!!!!!!!!!!!');
    // next(new AppError('Admin can not deleted!!!', 400));
    return next(new AppError('Admin can not be deleted!!!', 400));
  }

  console.log('user1._id: ' + user1._id);
  const departments = await Department.find({ employees: user._id });
  console.log('departments: ' + departments);
  for (const department of departments) {
    department.employees.pull(user._id);
    department.employeesCount = department.employees.length;
    await department.save();
  }
  next();
});

//hier auch Passwort hash machen, weil es mit datenmodel zu tun hat und nicht im controller v 127   bruteforce- Angriff (wenn Hacker auf db zugreifen kann, und alle pw sieht)
// document pre-save-middleware
// pre-hook-on-save middleware  runs between getting data, and saving data, when daten in db save gemacht wird!
//comment this out for import data
userSchema.pre('save', async function (next) {
  // hier drin auskommentieren, wenn dev-data geladen wird!!!!
  // password nur encypt, wenn update or new      zb wenn user update email, dann nicht pw
  // Only run this function if password was actually modified

  if (!this.isModified('password')) return next(); //this is the actuelle dokument        isModified ist funktion, wenn etwas im dokument gerade geändert wird, braucht name des fields, das geändert wird

  // wenn nicht das pw geändert, mache next, gehe zur nächsten middleware, ansonsten, bleibe drin
  // npm i bcryptjs

  //----------------------------------------------------------------------------------
  // Hash the password with cost of 12
  // this.password = await bcrypt.hash(this.password, 12); //16 braucht sehr lange // default is 10      .hash (ist ein promise, braucht await) is asynchron version, sinchron version nicht nehmen, weil diese die anderen user ausbremst, bis fertig ist
  //------------------------------------------------------------------------------------

  // test1234 --> UcOdDFH3nfVSNAkY53aMFQ==

  var encryptedStringPasswortLClient;
  // // passwort wird hier gehascht und schreibt es in den: encryptedStringPasswortLClient
  // //**************************************************************************
  let data = this.password; //passwortLClient;//Message to Encrypt
  let iv = CryptoJS.enc.Base64.parse(''); //giving empty initialization vector
  let key = CryptoJS.SHA256('mySecretKey1'); //hashing the key using SHA256  --> diesen in config oder in .env Datei auslagern!!!!
  // //var encryptedStringPasswortLClient=encryptData(data,iv,key);//muss var sein//
  encryptedStringPasswortLClient = encryptData(data, iv, key); //muss var sein//
  // //   console.log("encryptedString: "+encryptedStringPasswortLClient);//genrated encryption String:  swBX2r1Av2tKpdN7CYisMg==
  // //--------------------------------------------------------------------------
  // //das ist zum wieder das normale pw anzeigen, möchte das später einbauen
  let decrypteddata = decryptData(encryptedStringPasswortLClient, iv, key);
  //console.log('decrypteddata: ' + decrypteddata);
  // //**************************************************************************

  // console.log('this.password: in preSave: ' + this.password);
  // console.log(
  //   'encryptedStringPasswortLClient: in preSave: ' +
  //     encryptedStringPasswortLClient
  // );

  this.password = encryptedStringPasswortLClient;

  // danch muss confirmpasswort gelöscht werden, weil nur noch hashpasswort gibt, mit set to undefined
  // Delete the passwordConfirm field
  this.passwordConfirm = undefined; //requrierd Input, not input in database
  next(); // confirmpw braucht es nur am anfang, damit user kein fehler macht
  //ToDo hier könnte mann cryptojs nehmen, dann kann man pw wiederherstellen mit secret key
});

//137 email reset
//-------------------------------------------------------------------------------------------------
//comment this out for import data
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password') || this.isNew) return next(); // hier drin auskommentieren, wenn dev-data geladen wird!!!!
//
//   //----------------------------------------------------------------------------------------
//   //this.passwordChangeAt = Date.now() - 1000; // -1000 = - 1sec in der Vergangenheit, weil tooken schneller generiert wurde, als gespeichert
//   //-----------------------------------------------------------------------------------------
//   next();
// });
//----------------------------------------------------------------------------------------------

//140, wenn user deleteME, sein account inactive, nicht aber gelöscht von db, und damit man nicht sieht bei getalluser, nur sieht alle activen accounts
//passiert bevor query, das mach find
userSchema.pre(/^find/, function (next) {
  // alles was mit find... startet
  // this points to the current query

  // also, bevor User.find() gemacht wird in dieser Methode
  //exports.getAllUsers = catchAsync(async(req, res, next) => {
  // const users = await User.find();

  //this.find({ active: true });// dann zeigt es aber in getalluser gar keine user mehr an, weil ev die vorhandenen das noch nicht haben
  this.find({ active: { $ne: false } });
  next();
});

// um das createdAt zu sepiehcern bei testdaten, was nicht funktioniert
// userSchema.pre('find', function () {
//   this.select('createdAt');
// });

//funktion, um hashpasswort wieder encrypten zu normal
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  console.log('userPassword: ' + userPassword);
  console.log('candidatePassword: ' + candidatePassword);

  //this.password   geht nicht, weil passwort ist secret=false

  // candidatepasswort comming from user, is not hash, userPasswort is hash//compare return true if passwort is same, or false
  //------------------------------------------------------------------------------------------------
  //return await bcrypt.compare(candidatePassword, userPassword); //asynchron funktion
  //const isBcrypt = await bcrypt.compare(candidatePassword, userPassword);
  //------------------------------------------------------------------------------------------------

  //var encryptedStringPasswortLClient;
  //encryptedStringPasswortLClient =
  // // passwort wird hier gehascht und schreibt es in den: encryptedStringPasswortLClient
  // //**************************************************************************
  // let data = this.password; //passwortLClient;//Message to Encrypt
  let iv = CryptoJS.enc.Base64.parse(''); //giving empty initialization vector
  let key = CryptoJS.SHA256('mySecretKey1'); //hashing the key using SHA256  --> diesen in config oder in .env Datei auslagern!!!!
  // //var encryptedStringPasswortLClient=encryptData(data,iv,key);//muss var sein//
  // encryptedStringPasswortLClient = encryptData(data, iv, key); //muss var sein//
  // //   console.log("encryptedString: "+encryptedStringPasswortLClient);//genrated encryption String:  swBX2r1Av2tKpdN7CYisMg==
  // //--------------------------------------------------------------------------
  // //das ist zum wieder das normale pw anzeigen, möchte das später einbauen
  let decrypteddata = decryptData(userPassword, iv, key);
  console.log('decrypteddata: ' + decrypteddata);
  // //**************************************************************************
  // this.password = encryptedStringPasswortLClient;

  if (decrypteddata === candidatePassword || isBcrypt === true) {
    return true;
  } else {
    return false;
  }
  return false;
};

// 132 20min..     wechselt passowrt nach jwt webtoken bei protected middlware, nr 4 in authcontroller
userSchema.methods.changesPasswordAfter = function (JWTTimestamp) {
  // return false, --> user has not change passwort after the token was isued  nachdem der token ausgestellt wurde
  if (this.passwordChangeAt) {
    //wenn user nie passwort gewechselt hat, existiert das hier nicht
    console.log(
      'passwordChangeAt, JWTTimestamp: ' + passwordChangeAt,
      JWTTimestamp
    ); //ausgabe was mit millisekunden

    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    ); //base is 10 numbers
    console.log(
      'changedTimestamp, JWTTimestamp: ' + changedTimestamp,
      JWTTimestamp
    );
    return JWTTimestamp < changedTimestamp; // token time 100, pw chaged time 200
  }

  // false means not changed
  return false; //token time 300, pw changed time 200
};

// 135
userSchema.methods.createPasswordResetToken = function () {
  //passwort- reset- token should be a randomString
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken); // logged as an object resetToken32, und resetTokenHash

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10*60*1000 = 10 minutes      not saved in db, onli modified

  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;

// userSchema.pre('findOneAndUpdate', async function (next) {
//   const { department } = this._update;
//
//   if (department) {
//     console.log('Department wird geupdatet');
//     const newDepartments = await Department.find({ name: { $in: department } });
//     console.log('newDepartments:', newDepartments);
//
//     newDepartments.forEach(async (dep) => {
//       dep.employees.addToSet(this._conditions._id); // Hinzufügen der Benutzer-ID
//       await dep.save();
//     });
//   }
//   next();
// });

// userSchema.pre('findOneAndUpdate', async function (next) {
//   console.log('bin findOne');
//   //const docToUpdate = await this.model.findOne(this.getQuery());
//
//   //console.log(this);
//   console.log(this._conditions._id);
//
//   if (this._update.department) console.log('Department wird geupdatet');
//
//   // const oldDepartment = await Department.findOne({ employees: this._id });
//   // console.log('oldDepartment: ' + oldDepartment);
//   const newDepartment = await Department.findOne({
//     name: this._update.department,
//   });
//   console.log('newDepartment: ' + newDepartment);
//
//   // // Check if the department has been updated
//   // if (
//   //   this._update.department &&
//   //   this._update.department !== docToUpdate.department
//   // ) {
//   //   // Remove the user from the old department
//   //   const oldDepartment = await Department.findOne({
//   //     name: docToUpdate.department,
//   //   });
//   //   oldDepartment.employees.pull(docToUpdate._id);
//   //
//   //   // Add the user to the new department
//   //   const newDepartment = await Department.findOne({
//   //     name: this._update.department,
//   //   });
//   newDepartment.employees.push(this._conditions._id);
//   //
//   //   await oldDepartment.save();
//   await newDepartment.save();
//   // }
//
//   next();
// });

// userSchema.pre(/^find/, async function (next) {
//   console.log('bin find sssssssssssssssssss');
//   console.log('This.department: ' + this.department);
//   //console.log(this);
//   if (this.department) {
//     console.log('this.department: ' + this.department);
//     const department = await Department.findOne({ name: this.department });
//     console.log('Gefunden department in Department: ' + department);
//
//     if (department) {
//       department.employees.push(this._id);
//       await department.save();
//     }
//   }
//   next();
// });

// userSchema.pre(/^find/, async function (next) {
//   const user = this;
//   console.log('bin save USER');
//   // if department has changed
//   if (user.isModified('department')) {
//     const oldDepartment = await Department.findOne({ employees: user._id });
//     const newDepartment = await Department.findOne({ name: user.department });
//
//     if (
//       oldDepartment &&
//       newDepartment &&
//       oldDepartment._id.toString() !== newDepartment._id.toString()
//     ) {
//       oldDepartment.employees.pull(user._id);
//       await oldDepartment.save();
//
//       newDepartment.employees.push(user._id);
//       await newDepartment.save();
//     }
//   }
//
//   next();
// });
// userSchema.pre(/^find/, async function (next) {
//   console.log('bin save USER');
//
//   const user = this;
//
//   // get changes to the user document
//   const changes = user.modifiedPaths();
//
//   // check if department has changed
//   if (changes.includes('department')) {
//     const oldDepartment = await Department.findOne({ employees: user._id });
//     const newDepartment = await Department.findOne({ name: user.department });
//
//     if (
//       oldDepartment &&
//       newDepartment &&
//       oldDepartment._id.toString() !== newDepartment._id.toString()
//     ) {
//       oldDepartment.employees.pull(user._id);
//       await oldDepartment.save();
//
//       newDepartment.employees.push(user._id);
//       await newDepartment.save();
//     }
//   }
//
//   next();
// });

// userSchema.virtual('tours', {
//   //forenfield and localfield
//   ref: 'Tour',
//   foreignField: 'user', //in reviewModel hat es tour, wo id tour gespeichert
//   localField: '_id', //
// });

// userSchema.pre('save', async function (next) {
//   const department = await mongoose
//     .model('Department')
//     .findOne({ name: this.department });
//   if (department) {
//     if (!department.users.includes(this._id)) {
//       department.users.push(this._id);
//       await department.save();
//     }
//   } else {
//     const newDepartment = await mongoose.model('Department').create({
//       name: this.department,
//       users: [this._id],
//     });
//     this.department = newDepartment._id;
//   }
//   next();
// });

// userSchema.pre('save', async function (next) {
//   const department = await Department.findOne({ name: this.department });
//   if (department) {
//     if (!department.users.includes(this._id)) {
//       department.users.push(this._id);
//       await department.save();
//     }
//   }
//   next();
// });

// userSchema.pre('save', async function (next) {
//   const department = await mongoose
//     .model('Department')
//     .findOne({ name: this.department });
//   if (department) {
//     if (!department.users.includes(this._id)) {
//       department.users.push(this._id);
//       await department.save();
//     }
//   }
//   // } else {
//   //   await mongoose.model('Department').create({
//   //     name: this.department,
//   //     users: [this._id],
//   //   });
//   // }
//   next();
// });

// für Datum funktioniert nicht
// function formatCreatedAt(date) {
//   return `${date.getDate()}.${
//     date.getMonth() + 1
//   }.${date.getFullYear()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
// }
//
// // Vor dem Speichern den createdAt-Wert konvertieren
// userSchema.pre('save', function (next) {
//   if (this.isNew || this.isModified('createdAt')) {
//     this.createdAt = formatCreatedAt(this.createdAt);
//   }
//   next();
// });

// userSchema.pre('save', function (next) {
//   if (!this.department) {
//     this.department = 'Engineering';
//   }
//   next();
// });

// userSchema.pre('save', function (next) {
//   const user = this;
//
//   User.distinct('department', function (err, departments) {
//     if (err) {
//       console.log(err);
//     } else {
//       user.departments = departments;
//       console.log(user.departments);
//       next();
//     }
//   });
// });

// userSchema.post('save', function () {
//   User.distinct('department', function (err, departments) {
//     if (err) {
//       console.log(err);
//     } else {
//       User.departments = departments;
//       console.log(User.departments);
//     }
//   });
// });

// userSchema.pre('save', async function (next) {
//   console.log('bin pre save Engineering...');
//   if (this.department === 'Engineering') {
//     const department = await Department.findOne({ name: 'Engineering' });
//     if (department) {
//       this.department = department._id;
//     }
//   }
//   next();
// });
// userSchema.pre('save', async function (next) {
//   const departmentName = this.department;
//   const department = await Department.findOne({ name: departmentName });
//   department.users.push(this._id);
//   await department.save();
//   next();
// });
//
// userSchema.pre('save', async function (next) {
//   if (this.department) {
//     console.log('this.department: ' + this.department);
//     const department = await Department.findOne({ name: this.department });
//     console.log('Gefunden department in Department: ' + department);
//
//     if (department) {
//       department.employees.push(this._id);
//       await department.save();
//     }
//   }
//   next();
// });

//-----------------------------------------------Old-03.05.2023------------------------------------------------------
// import crypto from 'crypto';
// import mongoose from 'mongoose';
// import validator from 'validator';
// import bcrypt from 'bcryptjs';
//
// import Department from './departmentModel.mjs';
//
// import { encryptData, decryptData } from '../utils/crypto.mjs';
// import CryptoJS from 'crypto-js';
//
// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'A User must have a name!'],
//   },
//   firstName: {
//     type: String,
//     required: [true, 'A User must have a firstName'],
//     trim: true, // nama und nicht leerzeichenNameLeerzeichen
//     maxlength: [20, 'A firstName must have less or equal then 20 characters'], //validator
//     minlength: [1, 'A firstName must have more or equal then 1 characters'], //validator
//   },
//   lastName: {
//     type: String,
//     required: [true, 'A User must have a lastName'],
//     trim: true, // nama und nicht leerzeichenNameLeerzeichen
//     maxlength: [20, 'A lastName must have less or equal then 20 characters'], //validator
//     minlength: [1, 'A lastName must have more or equal then 1 characters'], //validator
//   },
//   employeeNumber: {
//     type: Number,
//     required: [true, 'A user must have a employeeNumber'],
//     unique: true, // darf keine gleiche nochmals haben!
//     trim: true,
//     select: true,
//   },
//   age: {
//     type: Number,
//     default: 1,
//     trim: true,
//   },
//   gender: {
//     type: String,
//     trim: true,
//   },
//   language: {
//     type: String,
//     default: 'Deutsch',
//     trim: true,
//   },
//   // tour: {
//   //   type: mongoose.Schema.ObjectId,
//   //   ref: 'Tour',
//   //   //required: [true, 'Review must belong a tour.']
//   // },
//   email: {
//     type: String,
//     required: [true, 'Please provide your email!'],
//     unique: true,
//     lowercase: true,
//     validate: [validator.isEmail, 'Please profide a valid email'],
//   },
//   photo: {
//     type: String,
//     default: 'default.jpg',
//   },
//   role: {
//     type: String,
//     enum: [
//       'user',
//       'guide',
//       'lead-guide',
//       'admin',
//       'Chef',
//       'Schichtleiter',
//       'Bediener',
//       'Mechaniker',
//       'Elektriker',
//     ],
//     default: 'user',
//     // validate: {
//     //   validator: function (value) {
//     //     return value !== 'admin';
//     //   },
//     //   message: 'Admin role is not allowed.',
//     // },
//   },
//   department: {
//     //const user = await User.findOne({ _id: userId }).populate('department', 'name');
//     type: [String],
//     default: ['Engineering'],
//     enum: [
//       'Engineering',
//       'Konstruktion',
//       'IT',
//       'Unterhalt',
//       'Geschäfts-Führung',
//       'Schweisserei',
//       'Zieherei',
//       'Anarbeit',
//     ],
//     // required: [true, 'Please provide your department'],
//   },
//   // department: {
//   //   type: [String],
//   //   //type: mongoose.Schema.Types.ObjectId,
//   //   //ref: 'Department',
//   //   default: '5c8a24822f8fb814b56fa192',
//   //   required: [true, 'Please provide your department'],
//   // },
//   machines: [
//     {
//       type: [String],
//       enum: [
//         'TRT 1',
//         'Conni 1',
//         'Rattunde 1',
//         'Rattunde 2',
//         'Rattunde 3',
//         'Rattunde 4',
//         'Rattunde 5',
//       ],
//     },
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now(),
//     select: false, //dann sieht man nicht
//   },
//   // department: {
//   //   type: mongoose.Schema.Types.ObjectId,
//   //   ref: 'Department',
//   //   validate: {
//   //     validator: function(value) {
//   //       return mongoose.model('Department').findById(value)
//   //         .then(doc => {
//   //           if (!doc) {
//   //             return false;
//   //           }
//   //           return true;
//   //         })
//   //         .catch(err => {
//   //           return false;
//   //         });
//   //     },
//   //     message: 'Department does not exist'
//   //   },
//   // },
//   password: {
//     type: String,
//     required: [true, 'Please provide a password'],
//     minlength: 8,
//     select: false, //damit passwort nicht sieht in postman, oder browser
//   },
//   passwordConfirm: {
//     type: String,
//     required: [true, 'Please confirm your password'],
//     validate: {
//       // This only works on CREATE and SAVE, not for Update  (auch nicht bei ... user aktualisiert pw )
//       validator: function (el) {
//         // das ist die Funktion die überprüft, ob PW gleich pwConfirm     el ist element_passwortConfirm
//         return el === this.password; //return true or false     viedeo 127      abc === abc --> true
//       },
//       message: 'Passwords are not the same!',
//     },
//   },
//   passwordChangeAt: Date, // hier wurde noch nicht gross darauf eingegagen, aber es braucht es
//   passwordResetToken: String,
//   passwordResetExpires: Date, // damit resetToken abläuft
//   active: {
//     // um zb User inaktiv zu machen, // video 140
//     type: Boolean,
//     default: true, // aktiver user, boolean = true
//     select: false, // zeigt nicht im output ob aktiv oder inaktive
//   },
// });
//
// //--------------------------Ausblenden um Dev-data einzufügen---------------------
// // userSchema.pre('save', function (next) {
// //   if (this.role === 'admin') {
// //     const error = new Error('Admin role is not allowed2.');
// //     return next(error);
// //   }
// //   next();
// // });
//
// //genau gleich wie:
// // role: {
// //   type: String,
// // enum: [
// //     'user',
// //     'guide',
// //     'lead-guide',
// //     'admin',
// //     'Chef',
// //     'Schichtleiter',
// //     'Bediener',
// //     'Mechaniker',
// //     'Elektriker',
// //   ],
// // default: 'user',
// //   // validate: {
// //   //   validator: function (value) {
// //   //     return value !== 'admin';
// //   //   },
// //   //   message: 'Admin role is not allowed.',
// //   // },
// // },
// //----------------------------------------------------------------------------
//
// // userSchema.pre('save', async function (next) {
// //   const department = await mongoose
// //     .model('Department')
// //     .findOne({ name: this.department });
// //   if (department) {
// //     if (!department.users.includes(this._id)) {
// //       department.users.push(this._id);
// //       await department.save();
// //     }
// //   } else {
// //     const newDepartment = await mongoose.model('Department').create({
// //       name: this.department,
// //       users: [this._id],
// //     });
// //     this.department = newDepartment._id;
// //   }
// //   next();
// // });
//
// // userSchema.pre('save', async function (next) {
// //   const department = await Department.findOne({ name: this.department });
// //   if (department) {
// //     if (!department.users.includes(this._id)) {
// //       department.users.push(this._id);
// //       await department.save();
// //     }
// //   }
// //   next();
// // });
//
// // userSchema.pre('save', async function (next) {
// //   const department = await mongoose
// //     .model('Department')
// //     .findOne({ name: this.department });
// //   if (department) {
// //     if (!department.users.includes(this._id)) {
// //       department.users.push(this._id);
// //       await department.save();
// //     }
// //   }
// //   // } else {
// //   //   await mongoose.model('Department').create({
// //   //     name: this.department,
// //   //     users: [this._id],
// //   //   });
// //   // }
// //   next();
// // });
//
//
// // für Datum funktioniert nicht
// function formatCreatedAt(date) {
//   return `${date.getDate()}.${
//     date.getMonth() + 1
//   }.${date.getFullYear()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
// }
//
// // Vor dem Speichern den createdAt-Wert konvertieren
// userSchema.pre('save', function (next) {
//   if (this.isNew || this.isModified('createdAt')) {
//     this.createdAt = formatCreatedAt(this.createdAt);
//   }
//   next();
// });
//
// // userSchema.pre('save', function (next) {
// //   if (!this.department) {
// //     this.department = 'Engineering';
// //   }
// //   next();
// // });
//
// // userSchema.pre('save', function (next) {
// //   const user = this;
// //
// //   User.distinct('department', function (err, departments) {
// //     if (err) {
// //       console.log(err);
// //     } else {
// //       user.departments = departments;
// //       console.log(user.departments);
// //       next();
// //     }
// //   });
// // });
//
// // userSchema.post('save', function () {
// //   User.distinct('department', function (err, departments) {
// //     if (err) {
// //       console.log(err);
// //     } else {
// //       User.departments = departments;
// //       console.log(User.departments);
// //     }
// //   });
// // });
//
// // userSchema.pre('save', async function (next) {
// //   console.log('bin pre save Engineering...');
// //   if (this.department === 'Engineering') {
// //     const department = await Department.findOne({ name: 'Engineering' });
// //     if (department) {
// //       this.department = department._id;
// //     }
// //   }
// //   next();
// // });
// // userSchema.pre('save', async function (next) {
// //   const departmentName = this.department;
// //   const department = await Department.findOne({ name: departmentName });
// //   department.users.push(this._id);
// //   await department.save();
// //   next();
// // });
// //
// // userSchema.pre('save', async function (next) {
// //   if (this.department) {
// //     console.log('this.department: ' + this.department);
// //     const department = await Department.findOne({ name: this.department });
// //     console.log('Gefunden department in Department: ' + department);
// //
// //     if (department) {
// //       department.employees.push(this._id);
// //       await department.save();
// //     }
// //   }
// //   next();
// // });
//
// userSchema.pre('save', async function (next) {
//   if (this.department) {
//     console.log('this.department: ' + this.department); //this.department = userDepartment im usermodel
//     const department = await Department.findOne({ name: this.department });
//     console.log('Gefunden department in Department: ' + department);
//
//     if (department) {
//       if (!department.employees.includes(this._id)) {
//         department.employees.push(this._id);
//         await department.save(); //department in Department
//       } else {
//         console.log('Der Benutzer ist bereits in dieser Abteilung');
//       }
//     }
//   }
//   next();
// });
//
// // soll die departments updaten, mit dem, was gerade aktuell im user.departmentArray drin ist
// userSchema.pre('findOneAndUpdate', async function (next) {
//   const { department } = this._update;
//
//   if (department) {
//     const newDepartments = await Department.find({ name: { $in: department } });
//
//     const user = await User.findById(this._conditions._id);
//     const oldDepartments = user.department
//       ? await Department.find({ name: { $in: user.department } })
//       : [];
//
//     for (const dep of oldDepartments) {
//       if (!newDepartments.some((newDep) => newDep.name === dep.name)) {
//         dep.employees.pull(this._conditions._id);
//         await dep.save();
//       }
//     }
//
//     for (const dep of newDepartments) {
//       if (user.department && user.department.includes(dep.name)) {
//         console.log('Der Benutzer ist bereits in dieser Abteilung');
//         continue;
//       }
//       dep.employees.addToSet(this._conditions._id);
//       await dep.save();
//     }
//   }
//
//   // if (department) {
//   //   console.log('Department wird geupdatet');
//   //   const newDepartments = await Department.find({ name: { $in: department } });
//   //   console.log('newDepartments:', newDepartments);
//   //
//   //   const oldDepartments = await Department.find({
//   //     employees: this._conditions._id,
//   //   });
//   //   console.log('oldDepartments:', oldDepartments);
//   //
//   //   for (const dep of oldDepartments) {
//   //     if (!newDepartments.some((newDep) => newDep.name === dep.name)) {
//   //       dep.employees.pull(this._conditions._id);
//   //       await dep.save();
//   //     }
//   //   }
//   //
//   //   for (const dep of newDepartments) {
//   //     if (this.department.includes(dep.name)) {
//   //       console.log('Der Benutzer ist bereits in dieser Abteilung');
//   //       continue;
//   //     }
//   //     dep.employees.addToSet(this._conditions._id);
//   //     await dep.save();
//   //   }
//   // }
//
//   // if (department) {
//   //   console.log('Department wird geupdatet');
//   //   const newDepartments = await Department.find({ name: { $in: department } });
//   //   console.log('newDepartments:', newDepartments);
//   //
//   //   for (const dep of newDepartments) {
//   //     if (!dep.employees.includes(this._conditions._id)) {
//   //       dep.employees.addToSet(this._conditions._id);
//   //       await dep.save();
//   //     }
//   //   }
//   // }
//
//   next();
// });
//
// // userSchema.pre('findOneAndUpdate', async function (next) {
// //   const { department } = this._update;
// //
// //   if (department) {
// //     console.log('Department wird geupdatet');
// //     const newDepartments = await Department.find({ name: { $in: department } });
// //     console.log('newDepartments:', newDepartments);
// //
// //     newDepartments.forEach(async (dep) => {
// //       dep.employees.addToSet(this._conditions._id); // Hinzufügen der Benutzer-ID
// //       await dep.save();
// //     });
// //   }
// //   next();
// // });
//
// // userSchema.pre('findOneAndUpdate', async function (next) {
// //   console.log('bin findOne');
// //   //const docToUpdate = await this.model.findOne(this.getQuery());
// //
// //   //console.log(this);
// //   console.log(this._conditions._id);
// //
// //   if (this._update.department) console.log('Department wird geupdatet');
// //
// //   // const oldDepartment = await Department.findOne({ employees: this._id });
// //   // console.log('oldDepartment: ' + oldDepartment);
// //   const newDepartment = await Department.findOne({
// //     name: this._update.department,
// //   });
// //   console.log('newDepartment: ' + newDepartment);
// //
// //   // // Check if the department has been updated
// //   // if (
// //   //   this._update.department &&
// //   //   this._update.department !== docToUpdate.department
// //   // ) {
// //   //   // Remove the user from the old department
// //   //   const oldDepartment = await Department.findOne({
// //   //     name: docToUpdate.department,
// //   //   });
// //   //   oldDepartment.employees.pull(docToUpdate._id);
// //   //
// //   //   // Add the user to the new department
// //   //   const newDepartment = await Department.findOne({
// //   //     name: this._update.department,
// //   //   });
// //   newDepartment.employees.push(this._conditions._id);
// //   //
// //   //   await oldDepartment.save();
// //   await newDepartment.save();
// //   // }
// //
// //   next();
// // });
//
// // userSchema.pre(/^find/, async function (next) {
// //   console.log('bin find sssssssssssssssssss');
// //   console.log('This.department: ' + this.department);
// //   //console.log(this);
// //   if (this.department) {
// //     console.log('this.department: ' + this.department);
// //     const department = await Department.findOne({ name: this.department });
// //     console.log('Gefunden department in Department: ' + department);
// //
// //     if (department) {
// //       department.employees.push(this._id);
// //       await department.save();
// //     }
// //   }
// //   next();
// // });
//
// // userSchema.pre(/^find/, async function (next) {
// //   const user = this;
// //   console.log('bin save USER');
// //   // if department has changed
// //   if (user.isModified('department')) {
// //     const oldDepartment = await Department.findOne({ employees: user._id });
// //     const newDepartment = await Department.findOne({ name: user.department });
// //
// //     if (
// //       oldDepartment &&
// //       newDepartment &&
// //       oldDepartment._id.toString() !== newDepartment._id.toString()
// //     ) {
// //       oldDepartment.employees.pull(user._id);
// //       await oldDepartment.save();
// //
// //       newDepartment.employees.push(user._id);
// //       await newDepartment.save();
// //     }
// //   }
// //
// //   next();
// // });
// // userSchema.pre(/^find/, async function (next) {
// //   console.log('bin save USER');
// //
// //   const user = this;
// //
// //   // get changes to the user document
// //   const changes = user.modifiedPaths();
// //
// //   // check if department has changed
// //   if (changes.includes('department')) {
// //     const oldDepartment = await Department.findOne({ employees: user._id });
// //     const newDepartment = await Department.findOne({ name: user.department });
// //
// //     if (
// //       oldDepartment &&
// //       newDepartment &&
// //       oldDepartment._id.toString() !== newDepartment._id.toString()
// //     ) {
// //       oldDepartment.employees.pull(user._id);
// //       await oldDepartment.save();
// //
// //       newDepartment.employees.push(user._id);
// //       await newDepartment.save();
// //     }
// //   }
// //
// //   next();
// // });
//
// // userSchema.virtual('tours', {
// //   //forenfield and localfield
// //   ref: 'Tour',
// //   foreignField: 'user', //in reviewModel hat es tour, wo id tour gespeichert
// //   localField: '_id', //
// // });
//
// //hier auch Passwort hash machen, weil es mit datenmodel zu tun hat und nicht im controller video 127   bruteforce- Angriff (wenn Hacker auf db zugreifen kann, und alle pw sieht)
// // document pre-save-middleware
// // pre-hook-on-save middleware  runs between getting data, and saving data, when daten in db save gemacht wird!
// //comment this out for import data
// userSchema.pre('save', async function (next) {
//   // hier drin auskommentieren, wenn dev-data geladen wird!!!!
//   // password nur encypt, wenn update or new      zb wenn user update email, dann nicht pw
//   // Only run this function if password was actually modified
//
//   if (!this.isModified('password')) return next(); //this is the actuelle dokument        isModified ist funktion, wenn etwas im dokument gerade geändert wird, braucht name des fields, das geändert wird
//
//   // wenn nicht das pw geändert, mache next, gehe zur nächsten middleware, ansonsten, bleibe drin
//   // npm i bcryptjs
//
//   //----------------------------------------------------------------------------------
//   // Hash the password with cost of 12
//   // this.password = await bcrypt.hash(this.password, 12); //16 braucht sehr lange // default is 10      .hash (ist ein promise, braucht await) is asynchron version, sinchron version nicht nehmen, weil diese die anderen user ausbremst, bis fertig ist
//   //------------------------------------------------------------------------------------
//
//   // test1234 --> UcOdDFH3nfVSNAkY53aMFQ==
//
//   var encryptedStringPasswortLClient;
//   // // passwort wird hier gehascht und schreibt es in den: encryptedStringPasswortLClient
//   // //**************************************************************************
//   let data = this.password; //passwortLClient;//Message to Encrypt
//   let iv = CryptoJS.enc.Base64.parse(''); //giving empty initialization vector
//   let key = CryptoJS.SHA256('mySecretKey1'); //hashing the key using SHA256  --> diesen in config oder in .env Datei auslagern!!!!
//   // //var encryptedStringPasswortLClient=encryptData(data,iv,key);//muss var sein//
//   encryptedStringPasswortLClient = encryptData(data, iv, key); //muss var sein//
//   // //   console.log("encryptedString: "+encryptedStringPasswortLClient);//genrated encryption String:  swBX2r1Av2tKpdN7CYisMg==
//   // //--------------------------------------------------------------------------
//   // //das ist zum wieder das normale pw anzeigen, möchte das später einbauen
//   let decrypteddata = decryptData(encryptedStringPasswortLClient, iv, key);
//   //console.log('decrypteddata: ' + decrypteddata);
//   // //**************************************************************************
//
//   // console.log('this.password: in preSave: ' + this.password);
//   // console.log(
//   //   'encryptedStringPasswortLClient: in preSave: ' +
//   //     encryptedStringPasswortLClient
//   // );
//
//   this.password = encryptedStringPasswortLClient;
//
//   // danch muss confirmpasswort gelöscht werden, weil nur noch hashpasswort gibt, mit set to undefined
//   // Delete the passwordConfirm field
//   this.passwordConfirm = undefined; //requrierd Input, not input in database
//   next(); // confirmpw braucht es nur am anfang, damit user kein fehler macht
//   //ToDo hier könnte mann cryptojs nehmen, dann kann man pw wiederherstellen mit secret key
// });
//
// //video 137 email reset
// //-------------------------------------------------------------------------------------------------
// //comment this out for import data
// // userSchema.pre('save', async function (next) {
// //   if (!this.isModified('password') || this.isNew) return next(); // hier drin auskommentieren, wenn dev-data geladen wird!!!!
// //
// //   //----------------------------------------------------------------------------------------
// //   //this.passwordChangeAt = Date.now() - 1000; // -1000 = - 1sec in der Vergangenheit, weil tooken schneller generiert wurde, als gespeichert
// //   //-----------------------------------------------------------------------------------------
// //   next();
// // });
// //----------------------------------------------------------------------------------------------
//
// //video 140, wenn user deleteME, sein account inactive, nicht aber gelöscht von db, und damit man nicht sieht bei getalluser, nur sieht alle activen accounts
// //passiert bevor query, das mach find
// userSchema.pre(/^find/, function (next) {
//   // alles was mit find... startet
//   // this points to the current query
//
//   // also, bevor User.find() gemacht wird in dieser Methode
//   //exports.getAllUsers = catchAsync(async(req, res, next) => {
//   // const users = await User.find();
//
//   //this.find({ active: true });// dann zeigt es aber in getalluser gar keine user mehr an, weil ev die vorhandenen das noch nicht haben
//   this.find({ active: { $ne: false } });
//   next();
// });
//
// // userSchema.pre('find', function () {
// //   this.select('createdAt');
// // });
//
// //funktion, um hashpasswort wieder encrypten zu normal
// userSchema.methods.correctPassword = async function (
//   candidatePassword,
//   userPassword
// ) {
//   console.log('userPassword: ' + userPassword);
//   console.log('candidatePassword: ' + candidatePassword);
//
//   //this.password   geht nicht, weil passwort ist secret=false
//
//   // candidatepasswort comming from user, is not hash, userPasswort is hash//compare return true if passwort is same, or false
//   //------------------------------------------------------------------------------------------------
//   //return await bcrypt.compare(candidatePassword, userPassword); //asynchron funktion
//   //const isBcrypt = await bcrypt.compare(candidatePassword, userPassword);
//   //------------------------------------------------------------------------------------------------
//
//   //var encryptedStringPasswortLClient;
//   //encryptedStringPasswortLClient =
//   // // passwort wird hier gehascht und schreibt es in den: encryptedStringPasswortLClient
//   // //**************************************************************************
//   // let data = this.password; //passwortLClient;//Message to Encrypt
//   let iv = CryptoJS.enc.Base64.parse(''); //giving empty initialization vector
//   let key = CryptoJS.SHA256('mySecretKey1'); //hashing the key using SHA256  --> diesen in config oder in .env Datei auslagern!!!!
//   // //var encryptedStringPasswortLClient=encryptData(data,iv,key);//muss var sein//
//   // encryptedStringPasswortLClient = encryptData(data, iv, key); //muss var sein//
//   // //   console.log("encryptedString: "+encryptedStringPasswortLClient);//genrated encryption String:  swBX2r1Av2tKpdN7CYisMg==
//   // //--------------------------------------------------------------------------
//   // //das ist zum wieder das normale pw anzeigen, möchte das später einbauen
//   let decrypteddata = decryptData(userPassword, iv, key);
//   console.log('decrypteddata: ' + decrypteddata);
//   // //**************************************************************************
//   // this.password = encryptedStringPasswortLClient;
//
//   if (decrypteddata === candidatePassword || isBcrypt === true) {
//     return true;
//   } else {
//     return false;
//   }
//   return false;
// };
//
// //video 132 20min..     wechselt passowrt nach jwt webtoken bei protected middlware, nr 4 in authcontroller
// userSchema.methods.changesPasswordAfter = function (JWTTimestamp) {
//   // return false, --> user has not change passwort after the token was isued  nachdem der token ausgestellt wurde
//   if (this.passwordChangeAt) {
//     //wenn user nie passwort gewechselt hat, existiert das hier nicht
//     console.log(
//       'passwordChangeAt, JWTTimestamp: ' + passwordChangeAt,
//       JWTTimestamp
//     ); //ausgabe was mit millisekunden
//
//     const changedTimestamp = parseInt(
//       this.passwordChangeAt.getTime() / 1000,
//       10
//     ); //base is 10 numbers
//     console.log(
//       'changedTimestamp, JWTTimestamp: ' + changedTimestamp,
//       JWTTimestamp
//     );
//     return JWTTimestamp < changedTimestamp; // token time 100, pw chaged time 200
//   }
//
//   // false means not changed
//   return false; //token time 300, pw chaged time 200
// };
//
// //video 135
// userSchema.methods.createPasswordResetToken = function () {
//   //passwort- reset- token should be a randomString
//   const resetToken = crypto.randomBytes(32).toString('hex');
//
//   this.passwordResetToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');
//
//   console.log({ resetToken }, this.passwordResetToken); // logged as an object resetToken32, und resetTokenHash
//
//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10*60*1000 = 10 minutes      not saved in db, onli modified
//
//   return resetToken;
// };
//
// const User = mongoose.model('User', userSchema); //grossgeschrieben
//
// //module.exports = User;
// export default User;
