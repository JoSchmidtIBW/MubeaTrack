import mongoose from 'mongoose';

const machineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A machine must have a name!'],
  },
});

const Machine = mongoose.model('Machine', machineSchema);

export default Machine;
