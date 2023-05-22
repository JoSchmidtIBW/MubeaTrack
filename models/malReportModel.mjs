import mongoose from 'mongoose';
import slugify from 'slugify';

import User from './userModel.mjs';
// import Machine from './machineModel.mjs';

const malReportSchema = new mongoose.Schema({
  userMal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAtMal: {
    type: Date,
    default: Date.now(),
    select: false, //dann sieht man nicht
  },
  machineNameMal: {
    type: String,
  },
  machineStatusRunMal: {
    type: Boolean,
  },
  machineSectorASMAMal: {
    type: String,
  },
  machineComponentMal: {
    type: String,
  },
  machineComponentDetailMal: {
    type: String,
  },
});

//departmentSchema.index({ slug: 1 });

const MalReport = mongoose.model('MalReport', malReportSchema);

export default MalReport;
