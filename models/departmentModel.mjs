import mongoose from 'mongoose';
import slugify from 'slugify';
import validator from 'validator'; //'validator/es/index.js';
import User from './userModel.mjs';
import Machine from './machineModel.mjs';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    requires: [true, 'A Department must have a name'], //validator
    //unique: true, // nicht zwei mit selben Namen, kein validator
    trim: true, // nama und nicht leerzeichenNameLeerzeichen
    maxlength: [
      40,
      'A department name must have less or equal then 40 characters',
    ], //validator
    minlength: [
      1,
      'A department name must have more or equal then 1 characters',
    ], //validator
    //validate: [validator.isAlpha, 'Tour name must only contain characters and no spaces'] // github --> validator     npm i validator
  },
  slug: String,
  summary: {
    type: String,
    trim: true,
    //required: [true, 'A Department must have a desription'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    //required: [true, 'A Cover must have a Image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false, //dann sieht man nicht
  },
  location: {
    type: String,
    default: 'Arbon - Switzerland',
  },
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  employees: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  employeesCount: {
    type: Number,
    default: 0,
  },
  machines: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Machine',
    },
  ],
  machinesCount: {
    type: Number,
    default: 0,
  },
});

// departmentSchema.pre('save', async function (next) {
//   const department = this;
//   console.log('department: ' + department);
//   if (department.isModified('name')) {
//     const user = await User.findOne({ department: department.name });
//     console.log('user Gefunden: ' + user);
//     if (user) {
//       department.users.push(user._id);
//     }
//   }
//   next();
// });

// departmentSchema.pre('save', async function (next) {
//   const department = this;
//   if (department.isModified('guides') || department.isNew) {
//     const User = mongoose.model('User');
//     const guidesPromises = department.guides.map(async (guideId) => {
//       return await User.findByIdAndUpdate(
//         guideId,
//         { department: department._id },
//         { new: true }
//       );
//     });
//     const Promise = await Promise.all(guidesPromises);
//     console.log(Promise);
//   }
//   next();
// });

// departmentSchema.pre('save', async function (next) {
//   // guidePromises ist ein array full of promises
//   const usersPromises = this.users.map(async (id) => await User.findById(id)); //User.findById(id) diese id ist die current id, mit await
//   this.users = await Promise.all(usersPromises);
//   next();
// });

// const department = await Department.findOne({ name: 'Engineering' });
// const user = new User({
//   // ...
//   department: department._id,
// });
//
// await user.save();

// ,
// {
//   //virtuele eigenschaften video 104  kann nicht sagen, tour.find where durationweeks = 7 weil nicht in db
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true },
// }

// reviews: [ // parent tour will children kennen      implement child-referencing     the tout reference to reviews   aber das wollen wir nicht
//     {
//         type: mongoose.Schema.ObjectId,
//         ref: 'Review',
//     }
// ],

//in postman bekommt man nur die ID dazu
// "guides": [
//     "6426c4604e93f288b8cdb610",
//     "6420daf8fe4c2d18107505dc"
// ],
// "_id": "64270fb4e2aa741650a4af58",

//anstatt child referencing wollen wir virtual populate speichert nicht in db       das machen wir in tourSchema

//guides: Array, // hier wird der user hineingeschrieben  EMBADDING mit der Pre- Save funktion VIDEO 151
// in Postman bekommt man alle Daten von user in einer tour
//     {
//         "role": "admin",
//         "_id": "6420daf8fe4c2d18107505dc",
//         "name": "admin",
//         "email": "admin@jonas.io",
//         "__v": 0,
//         "passwordChangeAt": "2023-03-30T00:18:41.646Z"
//     }
// ],
// "_id": "6427073a8ed4617a9818f914",
// "name": "The Test Tour",

//video167  suchen nach id, nicht jedes dokument abklappern bis findet, zb wenn millionen von dokuments, index on price
//tourSchema.index({ price: 1 }) // 1 =      -1 = desending order
// testen in postman: {{URL}}api/v1/tours?price[lt]=1000
// tourSchema.index({ price: 1, ratingsAverage: -1 });
departmentSchema.index({ slug: 1 });

// video 105 Middleware in Mongoose, pre- pro hooks, 4 typen von middleware pre, post, query, agregation
// pre run befor a event, zb befor speicher
// DOCUMENT MIDDLEWARE: runs before .save()  .create(), aber nicht bei  .insertMany() oder findbyid update()...
// um diese funktion auszulösen, mit comand .save() oder .create() --> braucht neue route...
// npm i slugify, slug ist string...
// pre-save-hook or pre-save-middleware
// hook ist 'save'
// save ist document-middleware
departmentSchema.pre('save', function (next) {
  // this --> ist der currently prozess dokument
  //console.log("bin tourModel Middleware, zeige This, bevor save in db bei einem post")
  //console.log("this: " + this)
  this.slug = slugify(this.name, { lower: true });
  next(); // slug: string muss dafür ins schema// wenn next auskommentiert, bei post, kommt kein fehler, aber ladet und ladet...
});

// Count the employees in this.department
departmentSchema.pre('save', function (next) {
  const employees = this;
  employees.employeesCount = employees.employees.length;
  next();
});

// Count the employees in this.department
departmentSchema.pre('save', function (next) {
  const machines = this;
  machines.machinesCount = machines.machines.length;
  next();
});

// DOKUMENT MIDDLEWARE
//
// video 151    jedes mal wenn tour save    implement embedding user in tourguide
// funktioniert nur für creating tours, not for updating tours        tourModel:      guides: Array,
// departmentSchema.pre('save', async function(next) { // guidePromises ist ein array full of promises
//     const guidesPromises = this.guides.map(async id => await User.findById(id)); //User.findById(id) diese id ist die current id, mit await
//     this.guides = await Promise.all(guidesPromises)
//     next();
// });

// //multible post pre for the same hook
// departmentSchema.pre('save', function(next) {
//     console.log("bin pre-save-hook: will save document...")
//     next();
// })

// // hat zugriff auf dok (welches gespeichert wurde) und next
// // post middleware wird ausgeführt, nachdem alle pre middleware ausgeführt wurden
// // hier hat man kein this mehr, dafür finish doc
// departmentSchema.post('save', function(doc, next) {
//     console.log("bin post- middleware tourModel: und doc: " + doc)
//     next();
// })

departmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangeAt', // was man nicht sehen möchte bei output
  });

  next();
});

departmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'employees',
    select: '-__v -passwordChangeAt', // was man nicht sehen möchte bei output
  });

  next();
});

departmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'machines',
    select: '-__v', // was man nicht sehen möchte bei output
  });

  next();
});

//für find post
// läufter after find executed
departmentSchema.post(/^find/, function (docs, next) {
  // currenttime - starttime
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  //console.log('bin post find middleware, docs: ' + docs)
  next();
});

const Department = mongoose.model('Department', departmentSchema);

export default Department;
