import mongoose from 'mongoose';
import slugify from 'slugify';
import validator from 'validator'; //'validator/es/index.js';
import User from './userModel.mjs';
import Machine from './machineModel.mjs';

//

// departmentSchema.pre('validate', function (next) {
//   this.populate(
//     {
//       path: 'employees',
//       select: '-password -__v',
//       model: 'User',
//     },
//     (err) => {
//       if (err) {
//         return next(err);
//       }
//       next();
//     }
//   );
// });

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Department must have a name'], //validator
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
      name: String,
      machineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machine',
      },
    },
  ],
  machinesCount: {
    type: Number,
    default: 0,
  },
});

departmentSchema.index({ slug: 1 });

// wenn departmentModel geladen wird, also nicht nur die departments
departmentSchema.pre('validate', function (next) {
  this.populate(
    {
      path: 'employees',
      select: '-password -__v',
      model: 'User',
    },
    (err) => {
      if (err) {
        return next(err);
      }
      next();
    }
  );
});
// userSchema.pre('validate', function (next) {
//   this.populate('department', '-employees -__v', (err) => {
//     if (err) {
//       return next(err);
//     }
//     next();
//   });
// });
// wenn departmentModel geladen wird, also nicht nur die departments
departmentSchema.pre('validate', function (next) {
  const department = this;
  department.employeesCount = department.employees.length;
  next();
});

departmentSchema.pre('save', function (next) {
  // this --> ist der currently prozess dokument
  //console.log("bin tourModel Middleware, zeige This, bevor save in db bei einem post")
  //console.log("this: " + this)
  this.slug = slugify(this.name, { lower: true });
  next(); // slug: string muss dafür ins schema// wenn next auskommentiert, bei post, kommt kein fehler, aber ladet und ladet...
});

//damit in compass, in department der vollständige user angezeigt wird, jedoch ohne sein passwort
departmentSchema.pre('save', function (next) {
  this.populate('employees', '-password', (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
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

// // Damit man im Compass bei department/machine den maschinenNamen sieht,anstatt die ID
// // Definieren Sie eine statische Methode für das Department-Modell, um die Namen der Maschinen abzurufen, die dem Department zugeordnet sind
// departmentSchema.statics.getMachinesForDepartment = async function (
//   departmentId
// ) {
//   // Führen Sie eine Aggregations-Pipeline aus, um die Maschinennamen abzurufen
//
//   // Verwenden Sie `$match`, um das Dokument mit der angegebenen `departmentId` zu finden
//   const department = await this.aggregate([
//     {
//       $match: {
//         _id: mongoose.Types.ObjectId(departmentId), // Filtere das Dokument mit der angegebenen `departmentId`
//       },
//     },
//     // Verwenden Sie `$lookup`, um die Maschinendokumente abzurufen, die zu dem Department gehören
//     {
//       $lookup: {
//         from: 'machines', // Verwenden Sie den Namen der `machine`-Sammlung
//         localField: 'machines', // Verwenden Sie das Feld `machines` im Department-Dokument
//         foreignField: '_id', // Verwenden Sie das `_id`-Feld im Maschinen-Dokument
//         as: 'machineNames', // Erstellen Sie ein neues Feld namens `machineNames`, um die Namen der Maschinen zu speichern
//       },
//     },
//     // Verwenden Sie `$project`, um nur das `_id`, den `name` des Departments und den Array von Maschinennamen zurückzugeben
//     {
//       $project: {
//         _id: 1, // Gib das `_id` des gefundenen Departments zurück
//         name: 1, // Gib den `name` des Departments zurück
//         machineNames: '$machineNames.name', // Gib ein Array von Maschinennamen zurück
//         // Verwenden Sie den `name` des Maschinendokuments im `machineNames`-Array
//       },
//     },
//   ]);
//
//   // Rückgabe des ersten gefundenen Departments (es sollte nur eins geben)
//   return department[0];
// };

const Department = mongoose.model('Department', departmentSchema);

export default Department;
