import mongoose from 'mongoose';
import Department from './departmentModel.mjs';

import slugify from 'slugify';

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
});

machineSchema.index({ slug: 1 });

// Checks if the department exists and the machine only saves itself in it once, when creating a machine
machineSchema.pre('save', async function (next) {
  if (this.department) {
    //console.log('this.department: ' + this.department); //this.department = userDepartment im usermodel
    const department = await Department.findOne({ name: this.department });
    //console.log('Gefunden department in Department: ' + department);

    if (department) {
      if (!department.machinery.includes(this._id)) {
        department.machineery.push(this._id);
        await department.save(); //department in Department
      } else {
        console.log('Die Maschine ist bereits in dieser Abteilung');
      }
    }
  }
  next();
});

const Machine = mongoose.model('Machine', machineSchema);

export default Machine;
