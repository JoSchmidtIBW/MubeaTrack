import mongoose from 'mongoose';
import User from './userModel.mjs';

const malReportSchema = new mongoose.Schema({
  user_Mal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createAt_Mal: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  nameMachine_Mal: {
    type: String,
  },
  statusRun_Mal: {
    type: Boolean,
  },
  nameSector_Mal: {
    type: String,
  },
  nameComponent_Mal: {
    type: String,
  },
  nameComponentDetail_Mal: {
    type: String,
  },
  statusOpenClose_Mal: {
    type: String,
    enum: ['open', 'close'],
    default: 'open',
  },
  estimatedStatus: {
    type: Number,
  },
  logFal_Repair: [
    {
      user_Repair: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      createAt_Repair: {
        type: Date,
        default: Date.now,
      },
      // Status_Repair: {
      //   type: Number,
      // },
      Status_Repair: {
        type: Number,
      },
      // percentage: {
      //   type: String,
      //   get: function (value) {
      //     if (typeof value === 'number') {
      //       return value + '%';
      //     }
      //     return value;
      //   },
      // },
      message_Repair: {
        type: String,
      },
      estimatedTime_Repair: {
        type: String,
      },
      isElectroMechanical_Repair: {
        type: String,
      },
    },
  ],
});

const MalReport = mongoose.model('MalReport', malReportSchema);

export default MalReport;
// import mongoose from 'mongoose';
// import slugify from 'slugify';
//
// import User from './userModel.mjs';
// // import Machine from './machineModel.mjs';
//
// const malReportSchema = new mongoose.Schema({
//   userMal: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//   },
//   createdAtMal: {
//     type: Date,
//     default: Date.now(),
//     select: false, //dann sieht man nicht
//   },
//   machineNameMal: {
//     type: String,
//   },
//   machineStatusRunMal: {
//     type: Boolean,
//   },
//   machineSectorASMAMal: {
//     type: String,
//   },
//   machineComponentMal: {
//     type: String,
//   },
//   machineComponentDetailMal: {
//     type: String,
//   },
// });
//
// //departmentSchema.index({ slug: 1 });
//
// const MalReport = mongoose.model('MalReport', malReportSchema);
//
// export default MalReport;
