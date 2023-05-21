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
  zone: {
    type: [String],
    //required: [true, 'A machine must have a zone'],
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
    select: false, //dann sieht man nicht
  },
  imageCover: {
    type: String,
    //required: [true, 'A Cover must have a Image'],
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
              // errors: [{
              //   name: {
              //     type: String,
              //   },
              //   description: {
              //     type: String,
              //   }
              // }]
            },
          ],
        },
      ],
    },
  ],
});

machineSchema.index({ slug: 1 });

// Middleware-Funktion, die das Leerzeichen im Namen entfernt
machineSchema.pre('save', function (next) {
  this.name = this.name.replace(/\s/g, '');
  next();
});

machineSchema.pre('save', function (next) {
  const employees = this;
  employees.employeesCount = employees.employees.length;
  next();
});
// machineSchema.pre('findOneAndUpdate', async function (next) {
//   console.log('Bin in der Middleware');
//   const update = this._update;
//   console.log('Update:', update);
//   console.log('Conditions:', this._conditions);
//   console.log('Options:', this.options);
//
//   if (update.$set && update.$set.$pull && update.$set.$pull.employees) {
//     const employees = update.$set.$pull.employees;
//     console.log('Aktualisierte Mitarbeiter:', employees);
//     update.$set.$pull.employeesCount = employees.length;
//     console.log('Mitarbeiteranzahl aktualisiert:', employees.length);
//   } else {
//     console.log('Keine Mitarbeiter-Änderungen gefunden');
//   }
//
//   console.log('Middleware beendet');
//   next();
// });
// machineSchema.pre('findOneAndUpdate', async function (next) {
//   console.log('Bin in der Middleware');
//   const update = this._update;
//   console.log('Update:', update);
//   console.log('Conditions:', this._conditions);
//   console.log('Options:', this.options);
//
//   try {
//     const machine = await this.model.findOne(this._conditions).exec();
//     console.log('Gefundene Machine:', machine);
//
//     if (update.$pull && update.$pull.employees) {
//       const employees = update.$pull.employees;
//       console.log('Entfernte Mitarbeiter:', employees);
//
//       if (machine && machine.employees && machine.employees.length > 0) {
//         const remainingEmployees = machine.employees.filter(
//           (employee) => !employees.includes(employee.toString())
//         );
//         const employeesCount = remainingEmployees.length;
//         update.$set = update.$set || {};
//         update.$set.employeesCount = employeesCount;
//         console.log('Mitarbeiteranzahl aktualisiert:', employeesCount);
//
//         machine.employees = remainingEmployees; // Aktualisiere die Mitarbeiter in der Machine
//
//         await machine.save(); // Speichere das Dokument in der Datenbank
//
//         console.log('Dokument erfolgreich aktualisiert');
//       } else {
//         console.log('Keine Mitarbeiter vorhanden');
//       }
//     } else {
//       console.log('Keine Mitarbeiter-Änderungen gefunden');
//     }
//   } catch (error) {
//     console.log('Fehler beim Suchen der Machine:', error);
//   }
//
//   console.log('Middleware beendet');
//   next();
// });
// machineSchema.pre('findOneAndUpdate', async function (next) {
//   console.log('Bin in der Middleware');
//   const update = this._update;
//   console.log('Update:', update);
//   console.log('Conditions:', this._conditions);
//   console.log('Options:', this.options);
//
//   try {
//     const machine = await this.model.findOne(this._conditions).exec();
//     console.log('Gefundene Machine:', machine);
//
//     if (update.$pull && update.$pull.employees) {
//       const employees = update.$pull.employees;
//       console.log('Entfernte Mitarbeiter:', employees);
//
//       if (machine && machine.employees && machine.employees.length > 0) {
//         const remainingEmployees = machine.employees.filter(
//           (employee) => !employees.includes(employee.toString())
//         );
//         const employeesCount = remainingEmployees.length;
//         update.$set = update.$set || {};
//         update.$set.employeesCount = employeesCount;
//         console.log('Mitarbeiteranzahl aktualisiert:', employeesCount);
//
//         machine.employees = remainingEmployees;
//         machine.markModified('employeesCount'); // Hinzufügen der Markierung für Änderungen
//
//         await machine.save();
//
//         console.log('Dokument erfolgreich aktualisiert');
//       } else {
//         console.log('Keine Mitarbeiter vorhanden');
//       }
//     } else {
//       console.log('Keine Mitarbeiter-Änderungen gefunden');
//     }
//   } catch (error) {
//     console.log('Fehler beim Suchen der Machine:', error);
//   }
//
//   console.log('Middleware beendet');
//   next();
// });

// machineSchema.pre('findOneAndUpdate', async function (next) {
//   console.log('Bin in der Middleware');
//   const update = this._update;
//   console.log('Update:', update);
//   console.log('Conditions:', this._conditions);
//   console.log('Options:', this.options);
//
//   if (update.$set && update.$set.employees) {
//     const employees = update.$set.employees;
//     console.log('Aktualisierte Mitarbeiter:', employees);
//     update.$set.employeesCount = employees.length;
//     console.log('Mitarbeiteranzahl aktualisiert:', employees.length);
//   } else {
//     console.log('Keine Mitarbeiter-Änderungen gefunden');
//   }
//
//   console.log('Middleware beendet');
//   next();
// });

// machineSchema.pre('findOneAndUpdate', async function (next) {
//   const machineId = this.getQuery()._id;
//   const update = this.getUpdate();
//
//   // Überprüfen, ob das update.$pull.employees definiert ist
//   if (update.$pull && update.$pull.employees) {
//     const newEmployees = update.$pull.employees;
//     const machine = await this.model.findById(machineId);
//
//     if (machine) {
//       machine.employeesCount = machine.employees.length - newEmployees.length;
//       await machine.save();
//     }
//   }
//
//   next();
// });
// machineSchema.pre('findOneAndUpdate', function (next) {
//   console.log('bin findOneAndUpdate');
//   const machine = this;
//   console.log(this);
//   const employees = machine.getUpdate().$set.employees; // Zugriff auf die aktualisierten Mitarbeiterdaten
//   console.log(employees);
//   console.log(employees.length);
//
//   if (employees) {
//     machine
//       .updateOne({ employeesCount: employees.length }) // Aktualisierung der Mitarbeiteranzahl
//       .then(() => next())
//       .catch((error) => next(error));
//   } else {
//     next();
//   }
// });
// machineSchema.post('findByIdAndUpdate', async function (doc) {
//   try {
//     console.log('bin post findByIdAndUpdate');
//     const machine = this;
//     console.log(machine);
//
//     const updatedEmployees = doc.employees;
//     console.log(updatedEmployees);
//     console.log(updatedEmployees.length);
//
//     if (!updatedEmployees || updatedEmployees.length === 0) {
//       machine.employeesCount = 0;
//     } else {
//       machine.employeesCount = updatedEmployees.length;
//     }
//
//     await machine.save();
//   } catch (error) {
//     console.error(error);
//   }
// });

// machineSchema.pre('findOneAndUpdate', async function (next) {
//   try {
//     console.log('bin findOneAndUpdate');
//     const machine = this;
//     console.log(this);
//
//     const employees = machine.getUpdate().$pull.employees; // Zugriff auf die zu entfernenden Mitarbeiterdaten
//     console.log(employees);
//     console.log(employees.length);
//
//     if (employees) {
//       const machineId = machine._conditions._id;
//       const foundMachine = await Machine.findById(machineId).populate(
//         'employees'
//       );
//
//       if (
//         foundMachine &&
//         foundMachine.employees &&
//         foundMachine.employees.length > 0
//       ) {
//         const updatedEmployees = foundMachine.employees.filter(
//           (employee) => !employees.includes(employee._id)
//         );
//         machine._update.$set.employees = updatedEmployees; // Aktualisierte Mitarbeiterliste
//         machine._update.$set.employeesCount = updatedEmployees.length; // Aktualisierung der Mitarbeiteranzahl
//       }
//     }
//
//     next();
//   } catch (error) {
//     next(error);
//   }
// });
// const machine = await Machine.findOne({ _id: machineId }); // Maschine suchen
//
// if (machine) {
//   machine.employees = machine.employees.filter(employee => employee.toString() !== userId); // Mitarbeiter entfernen
//   machine.employeesCount = machine.employees.length; // Mitarbeiteranzahl aktualisieren
//   await machine.save(); // Maschine speichern
// }

//
// // damit man zb bild, name von user in machine.employees auf der Seite Rattunde1 sieht
// machineSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'employees',
//     select: '-__v -passwordChangeAt -password', // was man nicht sehen möchte bei output
//   });
//
//   next();
// });

// Checks if the department exists and the machine only saves itself in it once, when creating a machine
machineSchema.pre('save', async function (next) {
  console.log('bin pre-save für create-machine in machineModel');
  console.log('this._id hat id: ' + this._id);
  console.log(this.department);
  if (this.department) {
    console.log('this.department: ' + this.department); //this.department = machineDepartment im machineModel
    const department = await Department.findOne({ name: this.department });

    if (department) {
      console.log('department gefunden');
      console.log(department.name);
      // for (const departmentFind in department) {
      //   console.log(departmentFind.name);
      // }
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

      // const machineryIds = department.machinery.map((machinery) =>
      //   machinery.toString()
      // );
      // console.log('machineryIds: ' + machineryIds);
      // console.log('this._id.toString(): ' + this._id.toString());
    }
  }

  if (!this._id) {
    console.log('this._id hat KEINE id');
    console.log(this.department);
    if (this.department) {
      console.log('this.department: ' + this.department); //this.department = machineDepartment im machineModel
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
// machineSchema.pre('save', async function (next) {
//   console.log('bin pre-save für create');
//   console.log(this.department);
//   if (this.department) {
//     console.log('this.department: ' + this.department); //this.department = machineDepartment im machineModel
//     const department = await Department.findOne({ name: this.department });
//     //console.log('Gefunden department in Department: ' + department);
//
//     if (department) {
//       if (!department.machinery.includes(this._id)) {
//         department.machinery.push(this._id);
//         await department.save(); //department in Department
//       } else {
//         console.log('The machine is already assigned to this department.');
//       }
//     }
//   }
//   next();
// });

// update all departments, Checks if machine is assigned to departments and checks that
// the machine does not appear more than once in the same department
machineSchema.pre('findOneAndUpdate', async function (next) {
  console.log('bin findOneAndUpdate in machineModel');
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

// // update all departments, Checks if machine is assigned to departments and checks that
// // the machine does not appear more than once in the same department
// machineSchema.pre('findByIdAndUpdate', async function (next) {
//   console.log('bin findByIdAndUpdate in machineModel');
//   const { department } = this._update;
//
//   if (department) {
//     const newDepartments = await Department.find({ name: { $in: department } });
//
//     const machine = await Machine.findById(this._conditions._id);
//     const oldDepartments = machine.department
//       ? await Department.find({ name: { $in: machine.department } })
//       : [];
//
//     for (const dep of oldDepartments) {
//       if (!newDepartments.some((newDep) => newDep.name === dep.name)) {
//         dep.machinery.pull(this._conditions._id);
//         await dep.save();
//       }
//     }
//
//     for (const dep of newDepartments) {
//       if (machine.department && machine.department.includes(dep.name)) {
//         console.log('Die Maschine ist bereits in dieser Abteilung');
//         continue;
//       }
//       dep.machinery.addToSet(this._conditions._id);
//       await dep.save();
//     }
//   }
//   next();
// });

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
