import mongoose from 'mongoose';
import Department from './departmentModel.mjs';

import slugify from 'slugify';
import User from './userModel.mjs';
import AppError from '../utils/appError.mjs';

const machineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A machine must have a name!'],
    unique: true,
    trim: true,
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'A machine must have a description!'],
  },
  machineNumber: {
    type: String,
    trim: true,
    default: '-',
  },
  type: {
    type: String,
    default: '-',
  },
  constructionYear: {
    type: String,
    default: '-',
  },
  companyMachine: {
    type: String,
    default: '-',
  },
  voltage: {
    type: String,
    default: '-',
  },
  controlVoltage: {
    type: String,
    default: '-',
  },
  ratedCurrent: {
    type: String,
    default: '-',
  },
  electricalFuse: {
    type: String,
    default: '-',
  },
  compressedAir: {
    type: String,
    default: '-',
  },
  weightMass: {
    type: String,
    default: '-',
  },
  dimensions: {
    type: String,
    default: '-',
  },
  drawingNumber: {
    type: String,
    default: '-',
  },
  department: {
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
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false, //dann sieht man nicht
  },
  imageCover: {
    type: String,
    //required: [true, 'A Cover must have a Image'],
  },
  images: [String],
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
});

machineSchema.index({ slug: 1 });

machineSchema.pre('save', function (next) {
  const employees = this;
  employees.employeesCount = employees.employees.length;
  next();
});

machineSchema.pre('validate', function (next) {
  const machine = this;
  machine.employeesCount = machine.employees.length;
  next();
});

// damit man zb bild, name von user in machine.employees auf der Seite Rattunde1 sieht
machineSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'employees',
    select: '-__v -passwordChangeAt -password', // was man nicht sehen möchte bei output
  });

  next();
});

// Checks if the department exists and the machine only saves itself in it once, when creating a machine
machineSchema.pre('save', async function (next) {
  console.log('bin pre-save für create');
  console.log(this.department);
  if (this.department) {
    console.log('this.department: ' + this.department); //this.department = machineDepartment im machineModel
    const department = await Department.findOne({ name: this.department });
    //console.log('Gefunden department in Department: ' + department);

    if (department) {
      if (!department.machinery.includes(this._id)) {
        department.machinery.push(this._id);
        await department.save(); //department in Department
      } else {
        console.log('The machine is already assigned to this department.');
      }
    }
  }
  next();
});

// update all departments, Checks if machine is assigned to departments and checks that
// the machine does not appear more than once in the same department
machineSchema.pre('findOneAndUpdate', async function (next) {
  const { department } = this._update;

  if (department) {
    const newDepartments = await Department.find({ name: { $in: department } });

    const machine = await Machine.findById(this._conditions._id);
    const oldDepartments = machine.department
      ? await Department.find({ name: { $in: machine.department } })
      : [];

    for (const dep of oldDepartments) {
      if (!newDepartments.some((newDep) => newDep.name === dep.name)) {
        dep.machinery.pull(this._conditions._id);
        await dep.save();
      }
    }

    for (const dep of newDepartments) {
      if (machine.department && machine.department.includes(dep.name)) {
        console.log('Die Maschine ist bereits in dieser Abteilung');
        continue;
      }
      dep.machinery.addToSet(this._conditions._id);
      await dep.save();
    }
  }
  next();
});

// Checks that when a machine is deleted that also matches department.machineryCount,
machineSchema.pre('findOneAndDelete', async function (next) {
  console.log('bin remove');
  console.log('this: ' + this);
  console.log('this._id: ' + this._id);

  const machine = await this.findOne();

  console.log('machine' + machine);
  console.log('machine._id: ' + machine._id);

  const departments = await Department.find({ machinery: machine._id });
  console.log('departments: ' + departments);
  for (const department of departments) {
    department.machinery.pull(machine._id);
    department.machineryCount = department.machinery.length;
    await department.save();
  }
  next();
});

const Machine = mongoose.model('Machine', machineSchema);

export default Machine;
