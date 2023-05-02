import mongoose from 'mongoose';

const machineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A machine must have a name!'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: '-',
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

const Machine = mongoose.model('Machine', machineSchema);

export default Machine;
