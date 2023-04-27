import User from '../models/userModel.mjs';
import Department from '../models/departmentModel.mjs';
import AppError from '../utils/appError.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import APIFeatures from '../utils/apiFeatures.mjs';

// http://127.0.0.1:7566/
export const getStart = catchAsync(async (req, res, next) => {
  res.status(200).render('start', {
    title: 'Start',
  });
});

// The user can only see departments, where he works
export const getOverviewDepartment = catchAsync(async (req, res, next) => {
  // 1.) Get tour data from collection
  console.log('bin getOverviewDepartment');
  //console.log(req.body);
  console.log(req.user);

  //const departments = await Department.find();
  const currentUser = req.user;
  console.log('currentUser.department: ' + currentUser.department);

  const departments = await Department.find({
    name: currentUser.department,
  }).sort('_id');

  const reihenfolgeDerAuflistung = [
    'Schweisserei',
    'Anarbeit',
    'Zieherei',
    'Unterhalt',
    'IT',
    'Engineering',
    'Konstruktion',
    'Geschäfts-Führung',
  ];
  // const departments = await Department.find({
  //   department: currentUser.department,
  // }).sort(
  //   (a, b) =>
  //     reihenfolgeDerAuflistung.indexOf(a.name) -
  //     reihenfolgeDerAuflistung.indexOf(b.name)
  // );

  // const departments = await Department.find({
  //   name: currentUser.department,
  // }).sort('-createdAt');

  // console.log('departments: ' + departments);
  // console.log('user.department: ' + req.user.department);
  // const userDepartmentObject = req.user.department;
  //
  // res.status(200).render('overview', {
  //   title: 'All Departments',
  //   departments: departments, // erstes tours ist das template, zweites tours sind die tourdata
  //   //user: currentUser,
  // });

  // 2. Build template, but in real not in this controller

  // 3.) Render that template using tour data from 1.)

  res.status(200).render('overview', {
    title: 'All Departments',
    departments: departments, // erstes tours ist das template, zweites tours sind die tourdata
    //user: currentUser,
  });
});

export const getDepartment = catchAsync(async (req, res, next) => {
  // 1.) Get the data, from the requested tour (inclouding rewievs and guides)
  // const tour = await Tour.findOne({ slug: req.params.slug }).populate({
  //   path: 'reviews',
  //   fields: 'review rating user',
  // });
  console.log('bin getTour in viewController');
  console.log('req.params: ' + JSON.stringify(req.params));

  const department = await Department.findOne({ slug: req.params.slug });

  //todo hier wenn nicht abteilung, darf dies hier nicht sehen

  // console.log('-------------------------');
  // console.log('tour: ' + tour);
  // console.log('-------------------------');

  if (!department) {
    // wenn dieser block auskommentiert, müsste api-fehler anstatt render kommen
    return next(new AppError('There is no tour with that name.', 404)); //404= not found
  }

  // 2. Build template, but in real not in this controller

  // 3.) Render that template using tour data from 1.)

  console.log('department: ' + department.name);
  console.log('user.department: ' + req.user.department);
  const userDepartmentObject = req.user.department;
  console.log('userDepartmentObject: ' + userDepartmentObject);
  const userDepartmentString = JSON.stringify(userDepartmentObject);
  console.log(typeof userDepartmentString);
  const departmentsArray = JSON.parse(userDepartmentString.split(','));
  console.log(departmentsArray); // ["IT", "Engineering", "Anarbeit"]

  //const currentDepartmentName =

  if (departmentsArray.includes(department.name)) {
    console.log('Arbeitet dort');
    res.status(200).render('department', {
      title: `${department.name} department`, //'The Forrest Hiker Tour',
      department,
    });
  } else {
    console.log('Arbeitet Nicht dort');
    // res.status(403).render('error', {
    //   title: 'Something went wrong!',
    //   msg: 'err.message',
    // });
    return next(
      new AppError('You do not have permission to perform this action!', 403)
    ); //403 = forbidden
  }
});

export const getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account', //
  });
};

export const getManageUsers = catchAsync(async (req, res) => {
  const allUsers = await User.find().select(
    '+createdAt +employeeNumber +password'
  );
  //console.log(allUsers.length);

  // const features = new APIFeatures(User.find(), req.query)
  //   .filter()
  //   .sort()
  //   .limitFields()
  //   .paginate(); // Hier wird das Limit auf 5 gesetzt
  // const users = await features.query;

  res.status(200).render('manageUsers', {
    title: 'Manage Users',
    users: allUsers, //users, //allUsers,
  });
});

export const getAccount = (req, res) => {
  // da protect und isLoggedin middleware bereits user wissen, muss hier nicht fragen
  // frage, der user ist in der req.user drin, jedoch wiso wird der user nicht gesendet unterhalb des titels?
  res.status(200).render('account', {
    title: 'Your account',
  });
};

//video 195 POST userData MEaccount, ohne API, mit POST wie bei ejs method=post
//exports.updateUserData = catchAsync(async (req, res, next) => {
export const updateUserData = catchAsync(async (req, res, next) => {
  console.log('req.User: ', req.user);
  console.log('Updating User: ', req.body); //in app.js muss app.use(express.urlencoded()) sein, um die daten zu sehen

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      //req.user.id den suchen wir, um zu updaten
      name: req.body.name, // req.body.name kommt von name des inputfeldes in pug or ejs
      email: req.body.email,
    },
    {
      // damit nur name und email update, aber keine anderen sachen        PW nicht mit findbyidandupdate machen!!!
      new: true, // die updatet dokument soll neu sein,
      runValidators: true,
    }
  );

  //danach die gleiche seite, aber mit updatet sachen neu laden
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser, // user(daten) auf der seite sind updateUser,
  });
});
