import mongoose from 'mongoose';
import User from './userModel.mjs';

const malReportSchema = new mongoose.Schema({
  user_Mal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createAt_Mal: {
    type: Date,
    default: Date.now,
  },
  nameMachine_Mal: {
    type: String,
  },
  idMachine_Mal: {
    type: String,
  },
  statusRun_Mal: {
    type: Boolean,
  },
  nameSector_Mal: {
    type: String,
  },
  idSector_Mal: {
    type: String,
  },
  nameComponent_de_Mal: {
    type: String,
  },
  nameComponent_en_Mal: {
    type: String,
  },
  idComponent_Mal: {
    type: String,
  },
  nameComponentDetail_de_Mal: {
    type: String,
  },
  nameComponentDetail_en_Mal: {
    type: String,
  },
  idComponentDetail_Mal: {
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
  finishAt_Mal: {
    type: Date,
    default: Date.now,
    select: false,
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
      Status_Repair: {
        type: Number,
      },
      messageProblem_de_Repair: {
        type: String,
      },
      messageProblem_en_Repair: {
        type: String,
      },
      messageMission_de_Repair: {
        type: String,
      },
      messageMission_en_Repair: {
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
