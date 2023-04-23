import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import Tour from './tourModel.mjs';
import Department from './departmentModel.mjs';

import { encryptData, decryptData } from '../utils/crypto.mjs';
import CryptoJS from 'crypto-js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A User must have a name!'],
  },
  // tour: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'Tour',
  //   //required: [true, 'Review must belong a tour.']
  // },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please profide a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: [
      'user',
      'guide',
      'lead-guide',
      'admin',
      'Chef',
      'Schichtleiter',
      'Bediener',
      'Mechaniker',
      'Elektriker',
    ],
    default: 'user',
  },
  department: {
    type: String,
    //required: [true, 'Please provide your department'],
    // enum: {
    //   //geht nur bei strings, nicht bei nummern
    //   values: [
    //     'Engineering',
    //     'Konstruktion',
    //     'IT',
    //     'Unterhalt',
    //     'Geschäfts-Führung',
    //     'Schweisserei',
    //     'Zieherei',
    //     'Anarbeit',
    //   ], // validator, kann nur drei sachen eingeben,
    //   message:
    //     'departments are: Engineering, Konstruktion, IT, Unterhalt, Geschäfts-Führung, Schweisserei, Zieherei, Anarbeit',
    // },
    default: 'Engineering',
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
    //default: 'Engineering',
    // required: [true, 'Please provide your department'],
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
userSchema.pre('save', async function (next) {
  if (this.department) {
    console.log('this.department: ' + this.department);
    const department = await Department.findOne({ name: this.department });
    console.log('Gefunden department in Department: ' + department);

    if (department) {
      department.employees.push(this._id);
      await department.save();
    }
  }
  next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  console.log('bin findOne');
  //const docToUpdate = await this.model.findOne(this.getQuery());

  //console.log(this);
  console.log(this._conditions._id);

  if (this._update.department) console.log('Department wird geupdatet');

  // const oldDepartment = await Department.findOne({ employees: this._id });
  // console.log('oldDepartment: ' + oldDepartment);
  const newDepartment = await Department.findOne({
    name: this._update.department,
  });
  console.log('newDepartment: ' + newDepartment);

  // // Check if the department has been updated
  // if (
  //   this._update.department &&
  //   this._update.department !== docToUpdate.department
  // ) {
  //   // Remove the user from the old department
  //   const oldDepartment = await Department.findOne({
  //     name: docToUpdate.department,
  //   });
  //   oldDepartment.employees.pull(docToUpdate._id);
  //
  //   // Add the user to the new department
  //   const newDepartment = await Department.findOne({
  //     name: this._update.department,
  //   });
  newDepartment.employees.push(this._conditions._id);
  //
  //   await oldDepartment.save();
  await newDepartment.save();
  // }

  next();
});

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

//hier auch Passwort hash machen, weil es mit datenmodel zu tun hat und nicht im controller video 127   bruteforce- Angriff (wenn Hacker auf db zugreifen kann, und alle pw sieht)
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

//video 137 email reset
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

//video 140, wenn user deleteME, sein account inactive, nicht aber gelöscht von db, und damit man nicht sieht bei getalluser, nur sieht alle activen accounts
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

//video 132 20min..     wechselt passowrt nach jwt webtoken bei protected middlware, nr 4 in authcontroller
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
  return false; //token time 300, pw chaged time 200
};

//video 135
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

const User = mongoose.model('User', userSchema); //grossgeschrieben

//module.exports = User;
export default User;
