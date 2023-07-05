import mongoose from 'mongoose';
import Department from './departmentModel.mjs';
import User from './userModel.mjs';

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
  zone: {
    type: [String],
    default: ['Sägen'],
    enum: [
      'Sägen',
      'Schweissen',
      'Spalten',
      'Spitzen',
      'Ziehen',
      'Richten',
      'Glühen',
      'Recken',
      'Beizen',
      'Sonstige',
    ],
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
    select: false,
  },
  imageCover: {
    type: String,
  },
  images: [String],
  employees: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    default: [],
  },
  statusRun: {
    type: Boolean,
  },
  employeesCount: {
    type: Number,
    default: 0,
  },
  sectorASMA: [
    {
      name: {
        type: String,
      },
      description_de: {
        type: String,
      },
      description_en: {
        type: String,
      },
      components: [
        {
          name_de: {
            type: String,
          },
          name_en: {
            type: String,
          },
          description_de: {
            type: String,
          },
          description_en: {
            type: String,
          },
          componentDetails: [
            {
              name_de: {
                type: String,
              },
              name_en: {
                type: String,
              },
              status: {
                type: Boolean,
              },
            },
          ],
        },
      ],
    },
  ],
});

machineSchema.index({ slug: 1 });

// Middleware function that removes the space in the name
machineSchema.pre('save', function (next) {
  this.name = this.name.replace(/\s/g, '');
  next();
});

// Count the employees in this.machine
machineSchema.pre('save', function (next) {
  const employees = this;
  employees.employeesCount = employees.employees.length;
  next();
});

// Checks if the department exists and the machine only saves itself in it once, when creating a machine
machineSchema.pre('save', async function (next) {
  console.log('bin pre-save für create-machine in machineModel');
  console.log('this._id hat id: ' + this._id);
  console.log(this.department);
  if (this.department) {
    console.log('this.department: ' + this.department);
    const department = await Department.findOne({ name: this.department });

    if (department) {
      console.log('department gefunden');
      console.log(department.name);

      let machineExistsInDepartment = false;

      for (const machineryFind of department.machinery) {
        console.log('machineryFind: ' + machineryFind.name);
        console.log('machineIDs: ' + machineryFind._id);

        if (machineryFind._id.equals(this._id)) {
          machineExistsInDepartment = true;
          break;
        }
      }

      if (!machineExistsInDepartment) {
        console.log('Die Maschine gibt es noch nicht in department');
        console.log('this._id machine: ' + this._id);
        department.machinery.push(this._id);
        await department.save();
        console.log(`The machine is saved in ${department.name}`);
      } else {
        console.log('Die Maschine gibt es schon in department');
        console.log('The machine is already assigned to this department.');
      }
    }
  }

  if (!this._id) {
    console.log('this._id hat KEINE id');
    console.log(this.department);
    if (this.department) {
      console.log('this.department: ' + this.department);
      const department = await Department.findOne({ name: this.department });

      if (department) {
        if (!department.machinery.includes(this._id)) {
          department.machinery.push(this._id);
          await department.save(); //department in Department
          console.log(`The machine save in ${department.name}`);
        } else {
          console.log('The machine is already assigned to this department.');
        }
      }
    }
  }
  next();
});

// update all departments, Checks if machine is assigned to departments and checks that
// the machine does not appear more than once in the same department
machineSchema.pre('findOneAndUpdate', async function (next) {
  console.log('bin findOneAndUpdate in machineModel');
  console.log(this._conditions._id);
  const { componentDetail, department } = this._update;

  if (componentDetail) {
    //console.log('bin if componentDetail in findOneAndUpdate in machineModel');
    next();
  }

  if (department) {
    console.log('bin if department');
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
        // console.log('Die Maschine ist bereits in dieser Abteilung');
        continue;
      }
      dep.machinery.addToSet(this._conditions._id);
      await dep.save();
    }
  }
  console.log('mache next');
  next();
});

// Checks that when a machine is deleted that also matches department.machineryCount,
machineSchema.pre('findOneAndDelete', async function (next) {
  // console.log('bin remove');
  // console.log('this: ' + this);
  // console.log('this._id: ' + this._id);

  const machine = await this.findOne();

  // console.log('machine' + machine);
  // console.log('machine._id: ' + machine._id);

  const departments = await Department.find({ machinery: machine._id });
  // console.log('departments: ' + departments);
  for (const department of departments) {
    department.machinery.pull(machine._id);
    department.machineryCount = department.machinery.length;
    await department.save();
  }
  next();
});

const Machine = mongoose.model('Machine', machineSchema);

export default Machine;
