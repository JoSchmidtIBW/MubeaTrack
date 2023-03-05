import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requires: [true, 'A Tour must have a name'], //validator
    unique: true, // nicht zwei mit selben Namen
    trim: true, // nama und nicht leerzeichenNameLeerzeichen
  },
  duration: {
    type: Number,
    // required: [true, 'A tour must have a Duration'],
  },
  maxGroupSize: {
    type: Number,
    // required: [true, 'A tour must have a groupe size'],
  },
  difficulty: {
    type: String,
    //  required: [true, 'A tour must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    // required: [true, 'A tour must have a Price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    // required: [true, 'A Tour must have a desription'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    // required: [true, 'A Cover must have a Image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDate: [Date],
});

const User = mongoose.model('User', userSchema); //grossgeschrieben

//module.exports = Tour;
export default User;

// const testTour = new Tour({
//     name: "The Park Camper",
//     price: 99.97
// })

// testTour.save().then(doc => {
//     console.log(doc)
// }).catch(err => {
//     console.log('ERROR doc save... : ', err)
// })
