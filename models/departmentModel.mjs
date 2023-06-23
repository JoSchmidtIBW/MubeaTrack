import mongoose from 'mongoose';
import slugify from 'slugify';

import User from './userModel.mjs';
import Machine from './machineModel.mjs';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Department must have a name'], // validator
    unique: true, // not two with the same name, it is not a validator
    trim: true, // name and not space-name-space
    maxlength: [
      40,
      'A department name must have less or equal then 40 characters',
    ], // validator
    minlength: [
      1,
      'A department name must have more or equal then 1 characters',
    ], // validator
  },
  slug: String,
  summary_de: {
    type: String,
    trim: true,
  },
  summary_en: {
    type: String,
    trim: true,
  },
  description_de: {
    type: String,
    trim: true,
    required: [true, 'A Department must have a desription'],
  },
  description_en: {
    type: String,
    trim: true,
    required: [true, 'A Department must have a desription'],
  },
  imageCover: {
    type: String,
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false, // than not see it
  },
  location: {
    type: String,
    default: 'Arbon - Switzerland',
  },
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
  machinery: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Machine',
    },
  ],
  machineryCount: {
    type: Number,
    default: 0,
  },
});

departmentSchema.index({ slug: 1 });

// DOKUMENT MIDDLEWARE   pre-Save and post-Save    pre before post by running

// when departmentModel is loaded, so not only the departments
departmentSchema.pre('save', function (next) {
  // this --> is the currently process document
  //console.log("this: " + this)
  this.slug = slugify(this.name, { lower: true }); // slug: string must be in schema for this
  next(); // if next is comments out, no error comes, but loads and loads...
});

// Count the employees in this.department
departmentSchema.pre('save', function (next) {
  const employees = this;
  employees.employeesCount = employees.employees.length;
  next();
});

// Count the machinery in this.department
departmentSchema.pre('save', function (next) {
  const machinery = this;
  machinery.machineryCount = machinery.machinery.length;
  next();
});

departmentSchema.pre('validate', function (next) {
  const department = this;
  department.employeesCount = department.employees.length;
  next();
});

departmentSchema.pre('validate', function (next) {
  const department = this;
  department.machineryCount = department.machinery.length;
  next();
});

// For example, that you can see the image, name from the user, in department.employees on the page Schweisserei
departmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'employees',
    select: '-__v -passwordChangeAt -password', // what you don't want to see at output
  });

  next();
});

// For example, that you can see the image, name from the machine, in department.employees on the page Schweisserei
departmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'machinery',
    select: '-__v', // what you don't want to see at output
  });

  next();
});

// POST has access to the doc (which was saved) and next (here you have no --> this anymore, but finish --> doc)
// post- middleware is runnung after all pre- middleware has been executed

// departmentSchema.post('save', function (doc, next) {
//   console.log('bin post- middleware departmentModel und meine doc: + doc');
//   next();
// });

// Run after find executed
departmentSchema.post(/^find/, function (docs, next) {
  // currenttime - starttime
  console.log(`bin post: Query took ${Date.now() - this.start} milliseconds`);
  //console.log('bin post find middleware, docs: ' + docs)
  next();
});

const Department = mongoose.model('Department', departmentSchema);

export default Department;
