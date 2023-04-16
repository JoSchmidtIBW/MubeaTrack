import mongoose from 'mongoose';
//import validator from 'validator';  // github validator für email oder isAplpha Character

const userSchema = new mongoose.Schema({
  firstName: {
    type: String, //validate: [validator.isAlpha, 'Tour name must only contain characters and no spaces'] // github --> validator     npm i validator
    required: [true, 'A User must have a firstname'], //validator
    //unique: true, // nicht zwei mit selben Namen
    trim: true, // nama und nicht leerzeichenNameLeerzeichen
    maxlength: [20, 'A firstName must have less or equal then 20 characters'], //validator
    minlength: [1, 'A firstName must have more or equal then 1 characters'], //validator
  },
  lastName: {
    type: String,
    required: [true, 'A User must have a lasttname'], //validator
    //unique: true, // nicht zwei mit selben Namen
    trim: true, // nama und nicht leerzeichenNameLeerzeichen
    maxlength: [20, 'A lastName must have less or equal then 20 characters'], //validator
    minlength: [1, 'A lastName name must have more or equal then 1 characters'], //validator
  },
  employeeNumber: {
    type: Number,
    required: [true, 'A user must have a employeeNumber'],
    unique: true, // darf keine gleiche nochmals haben!
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 1,
    trim: true,
  },
  // passwordConfirm: {
  //   type: String,
  //   required: [true, 'Please confirm your password']
  // },
  age: {
    type: Number,
    default: 1,
    trim: true,
  },
  company_department: {
    type: String,
    // required: [true, 'A user must have a company_department'],
    enum: {
      //geht nur bei strings, nicht bei nummern
      values: ['Schweisserei', 'Zieherei', 'Anarbeit'], // validator, kann nur drei sachen eingeben,
      message: 'company_department is either: Schweisserei, Zieherei, Anarbeit',
    },
  },
  machine: {
    type: String,
    trim: true,
    // required: [true, 'A Tour must have a desription'],
  },
  avatarColor: {
    type: String,
    default: 'black',
  },
  email: {
    type: String,
    //required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    //validate: [validator.isEmail, 'Please profide a valid email'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    //select: false //dann sieht man nicht
  },
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
