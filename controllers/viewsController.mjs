import User from '../models/userModel.mjs';
import Machine from '../models/machineModel.mjs';
import Department from '../models/departmentModel.mjs';
import MalReport from '../models/malReportModel.mjs';
import AppError from '../utils/appError.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import APIFeatures from '../utils/apiFeatures.mjs';
import mongoose from 'mongoose';
import * as url from 'url';

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
  //console.log(req.user);

  //const departments = await Department.find();

  // console.log('currentUser.department: ' + currentUser.department);

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
  const users = await User.find();

  const currentUser = req.user;
  console.log('currentUser.language: ' + currentUser.language);

  const machinery = await Machine.find();
  const currentUserLanguage = currentUser.language;
  console.log('currentUserLanguage: ' + currentUserLanguage);

  if (currentUser.role === 'admin') {
    const departmentsAllAdmin = await Department.find().sort('_id');

    if (currentUserLanguage === 'de') {
      res.status(200).render('de/overview_de', {
        title: 'Alle Abteilungen',
        departments: departmentsAllAdmin, // erstes tours ist das template, zweites tours sind die tourdata
        machinery: machinery,
        users: users,
        currentUser: currentUser,
        //user: currentUser,
      });
    } else {
      res.status(200).render('overview', {
        title: 'All Departments',
        departments: departmentsAllAdmin, // erstes tours ist das template, zweites tours sind die tourdata
        machinery: machinery,
        users: users,
        currentUser: currentUser,
        //user: currentUser,
      });
    }
  } else {
    const departmentsUser = await Department.find({
      name: currentUser.department,
    }).sort('_id');

    if (currentUserLanguage === 'de') {
      res.status(200).render('overview_de', {
        title: 'Alle Abteilungen',
        departments: departmentsUser, // erstes tours ist das template, zweites tours sind die tourdata
        machinery: machinery,
        users: users,
        currentUser: currentUser,
        //user: currentUser,
      });
    } else {
      res.status(200).render('overview', {
        title: 'All Departments',
        departments: departmentsUser, // erstes tours ist das template, zweites tours sind die tourdata
        machinery: machinery,
        users: users,
        currentUser: currentUser,
        //user: currentUser,
      });
    }
  }
});

export const getMyMalReports = catchAsync(async (req, res, next) => {
  console.log('bin getMyMalReports');
  const currentUser = req.user;
  //console.log(currentUser);

  const myMalReports = await MalReport.find({
    user_Mal: currentUser._id,
  })
    .select(
      'createAt_Mal nameMachine_Mal statusOpenClose_Mal nameSector_Mal nameComponent_de_Mal nameComponent_en_Mal nameComponentDetail_de_Mal nameComponentDetail_en_Mal statusRun_Mal estimatedStatus finishAt_Mal'
    )
    .populate('user_Mal')
    .populate({
      path: 'logFal_Repair',
      populate: {
        path: 'user_Repair',
        model: 'User',
      },
    }); //.select('createAt_Mal');

  console.log(myMalReports);

  if (req.user.language === 'de') {
    res.status(200).render('myMalReports_de', {
      title: 'Meine Error- Logs',
      data: {
        currentUser: currentUser,
        myMalReports: myMalReports,
      },
    });
  } else {
    res.status(200).render('myMalReports', {
      title: 'My ErrorLogs',
      data: {
        currentUser: currentUser,
        myMalReports: myMalReports,
      },
    });
  }
});

export const getMachine = catchAsync(async (req, res, next) => {
  console.log('bin getMachine: ');
  console.log('---------------------');
  //console.log(req.params);
  //console.log(req);
  const referer = req.headers.referer; //'http://127.0.0.1:7566/api/v1/departments/anarbeit';
  //const departmentName = referer.split('/').pop(); // 'anarbeit'
  console.log('********vvv*****');
  console.log(req.params);
  console.log(req.query);
  console.log(req.url);
  const url = '/departments/Anarbeit/machinery/6444566c830afd3adeba2d38';
  const regex = /\/departments\/([^/]+)/;
  const match = url.match(regex);
  const departmentName2 = match[1];
  console.log(departmentName2);
  console.log(referer); //http://127.0.0.1:7566/api/v1/departments/anarbeit
  console.log('*****vvv********');

  const departmentName = departmentName2;
  // referer.split('/').pop().charAt(0).toUpperCase() +
  //   referer.split('/').pop().slice(1) || departmentName2;
  console.log('departmentName: ' + typeof departmentName);
  console.log('departmentName: ' + departmentName);

  //const department = await Department.findOne({ name: departmentName });
  console.log('---------****------------');
  // console.log(department);

  const department = await Department.findOne({ name: departmentName });
  console.log(department);

  console.log('---------****------------');

  console.log('departmentName: ' + departmentName);
  console.log('---------------------');
  console.log(req.params.slug);
  //console.log(req);

  const machine = await Machine.findOne({ name: req.params.slug }).populate(
    'employees'
  );
  // console.log('machine in DB: ' + machine);
  console.log(machine.name);
  console.log('-------------------------');
  //console.log('machine: ' + machine);
  console.log('-------------------------');

  //const currentUser = req.user;

  if (!machine) {
    // wenn dieser block auskommentiert, müsste api-fehler anstatt render kommen
    return next(new AppError('There is no machine with that name.', 404)); //404= not found
  }

  if (req.user.language === 'de') {
    res.status(200).render('machine_de', {
      title: `${machine.name} Maschine`,
      data: {
        machine,
        department,
        //currentUser,
      },
    });
  } else {
    res.status(200).render('machine', {
      title: `${machine.name} machine`,
      data: {
        machine,
        department,
        //currentUser,
      },
    });
  }
});

export const getASMAMachine = catchAsync(async (req, res, next) => {
  console.log('Bin getASMAMachine');
  //console.log(req.params.machineName);
  console.log(req.params);
  const departmentName = req.params.departmentName;
  const machineName = req.params.machineName;
  console.log(departmentName);
  console.log(machineName);

  const machine = await Machine.findOne({ name: req.params.machineName });

  const strIDmachine = machine._id.toString();
  console.log('strIDmachine: ' + strIDmachine);

  const malReports = await MalReport.find({
    idMachine_Mal: strIDmachine,
    statusOpenClose_Mal: 'open',
  })
    .populate('user_Mal')
    .populate({
      path: 'logFal_Repair',
      populate: {
        path: 'user_Repair',
        model: 'User',
      },
    });

  malReports.forEach((malReport) => {
    malReport.logFal_Repair.forEach((logFal) => {
      //console.log(logFal);
    });
  });

  // const malReports = await MalReport.find({
  //   idMachine_Mal: strIDmachine,
  // })
  //   .select(
  //     'createAt_Mal nameMachine_Mal statusOpenClose_Mal nameSector_Mal nameComponent_Mal nameComponentDetail_Mal statusRun_Mal estimatedStatus'
  //   )
  //   .populate('user_Mal')
  //   .populate({
  //     path: 'logFal_Repair',
  //     populate: {
  //       path: 'user_Repair',
  //       model: 'User',
  //     },
  //   });
  console.log(malReports);

  //console.log(machine);

  //console.log(req.user); //currentUser

  if (!machine) {
    // wenn dieser block auskommentiert, müsste api-fehler anstatt render kommen
    return next(new AppError('There is no machine with that name.', 404)); //404= not found
  }

  if (req.user.language === 'de') {
    res.status(200).render('ASMAmachine_de', {
      title: 'ASMA- Maschine',
      data: {
        machine: machine,
        currentUser: req.user,
        departmentName: departmentName,
        machineName: machineName,
        malReports: malReports,
      },
    });
  } else {
    res.status(200).render('ASMAmachine', {
      title: 'ASMA- machine',
      data: {
        machine: machine,
        currentUser: req.user,
        departmentName: departmentName,
        machineName: machineName,
        malReports: malReports,
      },
    });
  }
});

export const getASMAUnterhalt = catchAsync(async (req, res, next) => {
  const malReports = await MalReport.find().populate('user_Mal');
  const machinery = await Machine.find();

  const departmentName = req.params.departmentName;
  console.log('departmentName: ' + departmentName);

  const machineryZones = [
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
  ];

  if (req.user.language === 'de') {
    res.status(200).render('ASMAUnterhalt_de', {
      title: 'ASMA-Unterhalt',
      data: {
        malReports: malReports,
        machinery: machinery,
        departmentName: departmentName,
        machineryZones: machineryZones,
      },
    });
  } else {
    res.status(200).render('ASMAUnterhalt', {
      title: 'ASMA-Unterhalt',
      data: {
        malReports: malReports,
        machinery: machinery,
        departmentName: departmentName,
        machineryZones: machineryZones,
      },
    });
  }
});

export const getASMAUnterhaltMachineOpenMalReports = catchAsync(
  async (req, res, next) => {
    console.log('bin getASMAUnterhaltMachineOpenMalReports');
    const departmentName = req.params.departmentName;
    console.log('departmentName: ' + departmentName);

    const machineName = req.params.machineName;
    console.log('machineName: ' + machineName);

    const machine = await Machine.findOne({ name: machineName });
    console.log(machine._id);

    const malReports = await MalReport.find({
      nameMachine_Mal: machineName,
      statusOpenClose_Mal: 'open',
    })
      .select(
        'createAt_Mal nameMachine_Mal statusOpenClose_Mal nameSector_Mal nameComponent_Mal nameComponentDetail_Mal statusRun_Mal estimatedStatus'
      )
      .populate('user_Mal')
      .populate({
        path: 'logFal_Repair',
        populate: {
          path: 'user_Repair',
          model: 'User',
        },
      });
    // .populate('repairStatus')
    // .populate('repairStatus.user_Repair');

    //.select('Status_Repair');

    // .populate({
    //     path: 'repairStatus.Status_Repair',
    //     model: 'Status_Repair',
    //   })
    // console.log(malReports);
    //console.log(malReports);
    //console.log(JSON.stringify(malReports, null, 2));
    malReports.forEach((malReport) => {
      //console.log(malReport);
    });

    if (req.user.language === 'de') {
      res.status(200).render('ASMAUnterhaltMachineOpenMalReports_de', {
        title: 'Offene Error- Reports',
        data: {
          malReports: malReports,
          departmentName: departmentName,
          machineName: machineName,
          machineID: machine._id,
          currentUser: req.user,
        },
      });
    } else {
      res.status(200).render('ASMAUnterhaltMachineOpenMalReports', {
        title: 'Open error- reports',
        data: {
          malReports: malReports,
          departmentName: departmentName,
          machineName: machineName,
          machineID: machine._id,
          currentUser: req.user,
        },
      });
    }
  }
);

export const getASMAUnterhaltMachineClosedMalReports = catchAsync(
  async (req, res, next) => {
    console.log('Bin getASMAUnterhaltMachineClosedMalReports');
    const machineName = req.params.machineName;
    const departmentName = req.params.departmentName;
    const currentUser = req.user;

    const closedMalReports = await MalReport.find({
      nameMachine_Mal: machineName,
      statusOpenClose_Mal: 'close',
    })
      .select(
        'createAt_Mal nameMachine_Mal statusOpenClose_Mal nameSector_Mal nameComponent_de_Mal nameComponent_en_Mal nameComponentDetail_de_Mal nameComponentDetail_en_Mal statusRun_Mal estimatedStatus finishAt_Mal'
      )
      .populate('user_Mal')
      .populate({
        path: 'logFal_Repair',
        populate: {
          path: 'user_Repair',
          model: 'User',
        },
      });

    if (!closedMalReports) {
      // wenn dieser block auskommentiert, müsste api-fehler anstatt render kommen
      return next(new AppError('There is no machine with that name.', 404)); //404= not found
    }

    //ausgabe LogFal in closedMalReports
    closedMalReports.forEach((closedMalReport) => {
      //console.log('Log Fal Repair:');

      closedMalReport.logFal_Repair.forEach((log) => {
        // console.log(`Create Date: ${log.createAt_Repair}`);
        //console.log(`estimatedTime_Repair: ${log.estimatedTime_Repair}`);
      });
      //console.log('------------------------');
    });

    if (req.user.language === 'de') {
      res.status(200).render('ASMAUnterhaltMachineClosedMalreports_de', {
        title: 'Geschlossene Error- Report',
        data: {
          machineName: machineName,
          departmentName: departmentName,
          closedMalReports: closedMalReports,
          currentUser: currentUser,
        },
      });
    } else {
      res.status(200).render('ASMAUnterhaltMachineClosedMalreports', {
        title: 'Closed error- reports',
        data: {
          machineName: machineName,
          departmentName: departmentName,
          closedMalReports: closedMalReports,
          currentUser: currentUser,
        },
      });
    }
  }
);

export const getASMAUnterhaltMachineUpdateLogFal = catchAsync(
  async (req, res, next) => {
    console.log('Bin getASMAUnterhaltMachineUpdateLogFal');
    const machineName = req.params.machineName;
    const departmentName = req.params.departmentName;
    const logFalID = req.params.logFalID;
    console.log('logFalID: ' + logFalID);

    console.log('machineName: ' + machineName);
    console.log('departmentName: ' + departmentName);
    console.log('logFalID: ' + logFalID);

    // const malReportLogFal = await MalReport.find({
    //   nameMachine_Mal: machineName,
    //   'logFal_Repair._id': mongoose.Types.ObjectId(logFalID),
    // }).populate('logFal_Repair');

    // const logFal = await MalReport.aggregate([
    //   {
    //     $match: {
    //       'logFal_Repair._id': mongoose.Types.ObjectId(logFalID),
    //     },
    //   },
    //   {
    //     $unwind: '$logFal_Repair',
    //   },
    //   {
    //     $match: {
    //       'logFal_Repair._id': mongoose.Types.ObjectId(logFalID),
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       user_Mal: 1,
    //       logFal_Repair: 1,
    //     },
    //   },
    // ]);
    const logFal = await MalReport.aggregate([
      {
        $match: {
          'logFal_Repair._id': mongoose.Types.ObjectId(logFalID),
        },
      },
      {
        $unwind: '$logFal_Repair',
      },
      {
        $match: {
          'logFal_Repair._id': mongoose.Types.ObjectId(logFalID),
        },
      },
    ]);

    console.log(logFal);

    const malReportLogFal = logFal[0];
    console.log(malReportLogFal);
    // console.log(malReportLogFal);
    //
    // // ...
    //
    // console.log(malReportLogFal);

    if (req.user.language === 'de') {
      res.status(200).render('updateLogFal_de', {
        title: 'Aktualisiere LogFal',
        data: {
          machineName: machineName,
          departmentName: departmentName,
          malReportLogFal: malReportLogFal, //JSON.stringify(malReportLogFal),
          currentUser: req.user,
          logFal: JSON.stringify(logFal),
        },
      });
    } else {
      res.status(200).render('updateLogFal', {
        title: 'Update LogFal',
        data: {
          machineName: machineName,
          departmentName: departmentName,
          malReportLogFal: malReportLogFal,
          currentUser: req.user,
          logFal: JSON.stringify(logFal),
        },
      });
    }
  }
);

export const getUpdateMalReport = catchAsync(async (req, res, next) => {
  console.log('bin getUpdateMalReport');

  const machineName = req.params.machineName;
  const departmentName = req.params.departmentName;
  const malReportID = req.params.malReportID;

  console.log('machineName: ' + machineName);
  console.log('departmentName: ' + departmentName);
  console.log('malReportID: ' + malReportID);

  const malReport = await MalReport.findOne({
    _id: malReportID,
  });

  console.log(malReport);

  // const malReportLogFal = await MalReport.findOne({
  //   nameMachine_Mal: machineName,
  //   'logFal_Repair._id': logFalID,
  // });

  if (req.user.language === 'de') {
    res.status(200).render('updateMalReport_de', {
      title: 'Aktualisiere Error- Report',
      data: {
        malReport: malReport,
        machineName: machineName,
        departmentName: departmentName,
        currentUser: req.user,
      },
    });
  } else {
    res.status(200).render('updateMalReport', {
      title: 'Update MalReport',
      data: {
        malReport: malReport,
        machineName: machineName,
        departmentName: departmentName,
        currentUser: req.user,
      },
    });
  }
});

export const getDepartment = catchAsync(async (req, res, next) => {
  // 1.) Get the data, from the requested tour (inclouding rewievs and guides)
  // const tour = await Tour.findOne({ slug: req.params.slug }).populate({
  //   path: 'reviews',
  //   fields: 'review rating user',
  // });
  //console.log('bin getTour in viewController');
  //console.log('req.params: ' + JSON.stringify(req.params));

  const department = await Department.findOne({ slug: req.params.slug });

  //todo hier wenn nicht abteilung, darf dies hier nicht sehen

  //console.log('-------------------------');
  //console.log('department: ' + department);
  //console.log('-------------------------');

  if (!department) {
    // wenn dieser block auskommentiert, müsste api-fehler anstatt render kommen
    return next(new AppError('There is no department with that name.', 404)); //404= not found
  }

  // 2. Build template, but in real not in this controller

  // 3.) Render that template using tour data from 1.)

  // console.log('department: ' + department.name);
  // console.log('user.department: ' + req.user.department);
  const userDepartmentObject = req.user.department;
  //  console.log('userDepartmentObject: ' + userDepartmentObject);
  const userDepartmentString = JSON.stringify(userDepartmentObject);
  // console.log(typeof userDepartmentString);
  const departmentsArray = JSON.parse(userDepartmentString.split(','));
  // console.log(departmentsArray); // ["IT", "Engineering", "Anarbeit"]

  //const currentDepartmentName =
  const currentUser = req.user;

  const machineryZones = [
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
  ];

  if (
    departmentsArray.includes(department.name) ||
    currentUser.role === 'admin'
  ) {
    console.log('Arbeitet dort');

    if (req.user.language === 'de') {
      res.status(200).render('department_de', {
        title: `${department.name} Abteilung`, //'The Forrest Hiker Tour',
        department,
        currentUser,
        machineryZones,
      });
    } else {
      res.status(200).render('department', {
        title: `${department.name} department`, //'The Forrest Hiker Tour',
        department,
        currentUser,
        machineryZones,
      });
    }
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

export const getManageMachinery = catchAsync(async (req, res) => {
  const machinery = await Machine.find().select('+createdAt');

  const currentUser = req.user;

  if (req.user.language === 'de') {
    res.status(200).render('manageMachinery_de', {
      title: 'Verwalte Maschinen',
      data: {
        machinery,
        currentUser,
      },
    });
  } else {
    res.status(200).render('manageMachinery', {
      title: 'Manage Machinery',
      data: {
        machinery,
        currentUser,
      },
    });
  }
});

export const getManageUsers = catchAsync(async (req, res) => {
  const allUsers = await User.find().select(
    '+createdAt +password' // +employeeNumber +password'
  );
  //const allUsers = await User.find();
  //console.log(allUsers.length);

  // const features = new APIFeatures(User.find(), req.query)
  //   .filter()
  //   .sort()
  //   .limitFields()
  //   .paginate(); // Hier wird das Limit auf 5 gesetzt
  // const users = await features.query;

  if (req.user.language === 'de') {
    res.status(200).render('manageUsers_de', {
      title: 'Benutzer- Verwaltung',
      users: allUsers, //users, //allUsers,
    });
  } else {
    res.status(200).render('manageUsers', {
      title: 'Manage Users',
      users: allUsers, //users, //allUsers,
    });
  }
});

export const getCreateMachineForm = (req, res) => {
  if (req.user.language === 'de') {
    res.status(200).render('createMachine_de', {
      title: 'Erstelle neue Maschine',
    });
  } else {
    res.status(200).render('createMachine', {
      title: 'Create new machine',
    });
  }
};

export const getManageASMAMachine = catchAsync(async (req, res, next) => {
  const machinery = await Machine.find(); //.select('createdAt');

  if (req.user.language === 'de') {
    res.status(200).render('manageASMAMachine_de', {
      title: 'ASMA/Maschine Verwaltung',
      //data: {
      machinery: machinery,
      //},
    });
  } else {
    res.status(200).render('manageASMAMachine', {
      title: 'Manage ASMA/machine',
      //data: {
      machinery: machinery,
      //},
    });
  }
});

export const getCreateASMAMachine = catchAsync(async (req, res, next) => {
  console.log('bin getUpdateASMAMachine');
  const machine = await Machine.findById(req.params.id);
  console.log(req.params.id);

  if (req.user.language === 'de') {
    res.status(200).render('createASMAMachine_de', {
      title: 'Erstelle ASMAmachine',
      data: {
        machine: machine,
      },
    });
  } else {
    res.status(200).render('createASMAMachine', {
      title: 'Create ASMAmachine',
      data: {
        machine: machine,
      },
    });
  }
});

export const getCreateComponentDetailsASMA = catchAsync(
  async (req, res, next) => {
    console.log('bin getCreateComponentDetailsASMA');
    console.log(req.params.machineID);
    console.log(req.params.sectorASMAID);
    console.log(req.params.componentASMAID);

    const machine = await Machine.findById(req.params.machineID);
    // console.log(machine);
    // const sectorASMA = machine.sectorsASMA.find((sector) =>
    //   sector._id.equals(req.params.sectorASMAID)
    // );
    // const sectorASMA = machine.sectorsASMA.find((sector) =>
    //   sector._id.equals(req.params.sectorASMAID)
    // );
    const sectorASMA = machine.sectorASMA.find(
      (sector) => String(sector._id) === req.params.sectorASMAID
    );

    const componentASMA = machine.sectorASMA
      .find((s) => s._id.toString() === req.params.sectorASMAID)
      .components.find((c) => c._id.toString() === req.params.componentASMAID);

    console.log(componentASMA);

    //console.log(sectorASMA);
    //console.log(sectorASMA.name);

    if (req.user.language === 'de') {
      res.status(200).render('createComponentDetailsASMa_de', {
        title: 'Erstelle componentDetailsASMA',
        data: {
          machine: machine,
          sectorASMA: sectorASMA,
          componentASMA: componentASMA,
        },
      });
    } else {
      res.status(200).render('createComponentDetailsASMa', {
        title: 'Create componentDetailsASMA',
        data: {
          machine: machine,
          sectorASMA: sectorASMA,
          componentASMA: componentASMA,
        },
      });
    }
  }
);

export const getUpdateComponentDetailsASMA = catchAsync(
  async (req, res, next) => {
    console.log('bin getUpdateComponentDetailsASMA');
    console.log(req.params.machineID);
    console.log(req.params.sectorASMAID);
    console.log(req.params.componentASMAID);
    console.log(req.params.componentDetailASMAID);

    const machine = await Machine.findById(req.params.machineID);
    if (!machine) {
      return next(new AppError('No machine found with that ID', 404));
    }

    let sectorASMA;
    for (let i = 0; i < machine.sectorASMA.length; i++) {
      if (machine.sectorASMA[i]._id.equals(req.params.sectorASMAID)) {
        sectorASMA = machine.sectorASMA[i];
        break;
      }
    }
    //console.log(sectorASMA);
    console.log('------------------');

    let componentASMA;
    for (let i = 0; i < sectorASMA.components.length; i++) {
      if (sectorASMA.components[i]._id.equals(req.params.componentASMAID)) {
        componentASMA = sectorASMA.components[i];
        break;
      }
    }
    //console.log(componentASMA);

    let componentDetailASMA;
    for (let i = 0; i < componentASMA.componentDetails.length; i++) {
      if (
        componentASMA.componentDetails[i]._id.equals(
          req.params.componentDetailASMAID
        )
      ) {
        componentDetailASMA = componentASMA.componentDetails[i];
        break;
      }
    }
    console.log(componentDetailASMA);

    if (req.user.language === 'de') {
      res.status(200).render('updateComponentDetailASMa_de', {
        title: 'Aktualisiere componentASMA',
        data: {
          machine: machine,
          sectorASMA: sectorASMA,
          componentASMA: componentASMA,
          componentDetailASMA: componentDetailASMA,
        },
      });
    } else {
      res.status(200).render('updateComponentDetailASMa', {
        title: 'Update componentASMA',
        data: {
          machine: machine,
          sectorASMA: sectorASMA,
          componentASMA: componentASMA,
          componentDetailASMA: componentDetailASMA,
        },
      });
    }
  }
);

export const getCreateComponents = catchAsync(async (req, res, next) => {
  console.log('bin getCreateComponents');
  console.log(req.params.machineID);
  console.log(req.params.sectorASMAID);

  const machine = await Machine.findById(req.params.machineID);
  // console.log(machine);
  // const sectorASMA = machine.sectorsASMA.find((sector) =>
  //   sector._id.equals(req.params.sectorASMAID)
  // );
  // const sectorASMA = machine.sectorsASMA.find((sector) =>
  //   sector._id.equals(req.params.sectorASMAID)
  // );
  const sectorASMA = machine.sectorASMA.find(
    (sector) => String(sector._id) === req.params.sectorASMAID
  );

  //console.log(sectorASMA);

  if (req.user.language === 'de') {
    res.status(200).render('createComponentsASMa_de', {
      title: 'Erstelle componentsASMA',
      data: {
        machine: machine,
        sectorASMA: sectorASMA,
      },
    });
  } else {
    res.status(200).render('createComponentsASMa', {
      title: 'Create componentsASMA',
      data: {
        machine: machine,
        sectorASMA: sectorASMA,
      },
    });
  }
});

export const getUpdateComponentASMA = catchAsync(async (req, res, next) => {
  console.log('bin getUpdateComponentASMA');
  console.log('machineID: ' + req.params.machineID);
  console.log('sectorASMAID: ' + req.params.sectorASMAID);
  console.log('componentASMAID: ' + req.params.componentASMAID);

  const machine = await Machine.findById(req.params.machineID);
  if (!machine) {
    return next(new AppError('No machine found with that ID', 404));
  }

  let sectorASMA;
  for (let i = 0; i < machine.sectorASMA.length; i++) {
    if (machine.sectorASMA[i]._id.equals(req.params.sectorASMAID)) {
      sectorASMA = machine.sectorASMA[i];
      break;
    }
  }
  console.log(sectorASMA);
  console.log('------------------');

  let componentASMA;
  for (let i = 0; i < sectorASMA.components.length; i++) {
    if (sectorASMA.components[i]._id.equals(req.params.componentASMAID)) {
      componentASMA = sectorASMA.components[i];
      break;
    }
  }
  console.log(componentASMA);

  if (req.user.language === 'de') {
    res.status(200).render('updateComponentASMa_de', {
      title: 'Aktualisiere componentASMA',
      data: {
        machine: machine,
        sectorASMA: sectorASMA,
        componentASMA: componentASMA,
      },
    });
  } else {
    res.status(200).render('updateComponentASMa', {
      title: 'Update componentASMA',
      data: {
        machine: machine,
        sectorASMA: sectorASMA,
        componentASMA: componentASMA,
      },
    });
  }
});

export const getUpdateSectorASMA = catchAsync(async (req, res, next) => {
  console.log('bin getUpdateSectorASMA');
  const path = req.path; //
  console.log('path: ' + path);
  const pathArray = path.split('/');
  const machineID = pathArray[2]; // 6444566c830afd3adeba2d38
  // console.log('machineID: ' + machineID);
  //
  // console.log(req.params); // id SectorASMA
  // console.log('-----------');
  // console.log(req.params.id);
  // console.log('-----------');
  const machine = await Machine.findById(machineID);
  const sectorASMAID = mongoose.Types.ObjectId(req.params.id); // req.params.id; //mongoose.Types.ObjectId(req.params.id); //req.params.id;

  // console.log(machine);

  // const sector = machine.sectorASMA.find(
  //   (sector) => sector._id === sectorASMAID
  // );
  let sector;
  for (let i = 0; i < machine.sectorASMA.length; i++) {
    if (machine.sectorASMA[i]._id.equals(sectorASMAID)) {
      sector = machine.sectorASMA[i];
      break;
    }
  }

  //console.log(sector);
  // console.log('------****-----');
  // console.log(sector);
  // console.log('------****-----');

  if (req.user.language === 'de') {
    res.status(200).render('updateSectorASMA_de', {
      title: 'Aktualisiere sectorASMA',
      data: {
        machine: machine,
        sectorASMA: sector,
      },
    });
  } else {
    res.status(200).render('updateSectorASMA', {
      title: 'Update sectorASMA',
      data: {
        machine: machine,
        sectorASMA: sector,
      },
    });
  }
});

export const getAboutMubeaTrack = catchAsync(async (req, res, next) => {
  if (req.user.language === 'de') {
    res.status(200).render('aboutMubeaTrack_de', {
      title: 'Über MubeaTrack',
    });
  } else {
    res.status(200).render('aboutMubeaTrack', {
      title: 'About MubeaTrack',
    });
  }
});

export const getAboutASMA = catchAsync(async (req, res, next) => {
  if (req.user.language === 'de') {
    res.status(200).render('aboutASMA_de', {
      title: 'Über ASMA',
    });
  } else {
    res.status(200).render('aboutASMA', {
      title: 'About ASMA',
    });
  }
});

export const getContact = catchAsync(async (req, res, next) => {
  if (req.user.language === 'de') {
    res.status(200).render('contact_de', {
      title: 'Kontakt',
    });
  } else {
    res.status(200).render('contact', {
      title: 'Contact',
    });
  }
});

export const getManageUserMachine = catchAsync(async (req, res, next) => {
  const departments = await Department.find().sort('_id').populate('machinery');
  const machinery = await Machine.find().populate('employees');
  const users = await User.find(); //.populate('machinery');

  console.log(users.length);

  // Machine.find({_id: })
  // console.log()

  if (req.user.language === 'de') {
    res.status(200).render('manageUserMachine_de', {
      title: 'Verwaltung Benutzer/Maschine',
      data: {
        departments: departments,
        machinery: machinery,
        users: users,
      },
    });
  } else {
    res.status(200).render('manageUserMachine', {
      title: 'Manage user/machine',
      data: {
        departments: departments,
        machinery: machinery,
        users: users,
      },
    });
  }
});

export const getUpdateUserMachine = catchAsync(async (req, res, next) => {
  console.log('bin getUpdateUsersMachinery');
  const userID = req.params.id;
  console.log('userID: ' + userID);

  const user = await User.findById(userID).populate('departments');
  console.log(user.firstName);

  const departments = await Department.find().populate(
    'employees',
    'machinery'
  );
  const machinery = await Machine.find();

  if (req.user.language === 'de') {
    res.status(200).render('updateUserMachine_de', {
      title: 'Aktualisiere Benutzer/Maschine',
      data: {
        user: user,
        departments: departments,
        machine: machinery,
      },
    });
  } else {
    res.status(200).render('updateUserMachine', {
      title: 'Update user/machine',
      data: {
        user: user,
        departments: departments,
        machine: machinery,
      },
    });
  }
});

export const getCreateUserForm = catchAsync(async (req, res, next) => {
  const allDepartments = await Department.find().sort({ name: 1 });

  if (req.user.language === 'de') {
    res.status(200).render('createUser_de', {
      title: 'Erstellen neuer User',
      data: {
        departments: allDepartments,
      },
    });
  } else {
    res.status(200).render('createUser', {
      title: 'Create new user',
      data: {
        departments: allDepartments,
      },
    });
  }
});

export const getUpdateMachine = catchAsync(async (req, res, next) => {
  console.log('bin getUpdateMachine');
  const machineToUpdate = await Machine.findById({ _id: req.params.id });
  //console.log(machineToUpdate);

  if (!machineToUpdate) {
    return next(new AppError('There is no machine with that ID.', 404));
  }

  if (req.user.language === 'de') {
    res.status(200).render('updateMachine_de', {
      title: 'Aktualisiere machine',
      data: {
        machineToUpdate,
      },
    });
  } else {
    res.status(200).render('updateMachine', {
      title: 'Update machine',
      data: {
        machineToUpdate,
      },
    });
  }
});

export const getUpdateUser = catchAsync(async (req, res, next) => {
  //console.log(req.body);
  const currentUserLoggedIn = req.user;

  console.log('bin getUpdateUser');
  // console.log(currentUserLoggedIn);
  // console.log('----------');
  // console.log(req.params.id);

  //const userToUpdate = await User.findById({ _id: req.params.id })
  //  .select('+password')
  //  .populate('machinery');
  const userToUpdate = await User.findById(req.params.id)
    .select('+password')
    .populate('machinery');

  const allDepartments = await Department.find()
    .sort('_id')
    .populate('machinery');

  // console.log(userToUpdate.firstName);
  //
  // console.log(userToUpdate);
  if (!userToUpdate) {
    return next(new AppError('There is no User with that ID.', 404));
  }

  const currentUser = req.user;
  //console.log('currentUser: ' + currentUser);

  // res.status(200).render('updateUserAdminPW', {
  //   title: 'Update user',
  //   //data: userToUpdate,
  //   data: {
  //     userToUpdate: userToUpdate,
  //     departments: allDepartments,
  //     currentUser: currentUser,
  //     //currentUserLoggedIn,
  //   },
  // });

  if (userToUpdate.role === 'admin' && req.user.role !== 'admin') {
    //damit niemand den admin verändert
    //res.redirect('/api/v1/manage_users');
    //return next(new AppError('There is sadfghno User with that ID.', 404));

    //res.redirect('/api/v1/manage_users');
    res.status(401).render('error', {
      msg: 'You do not have permission to perform this action!',
    });
    // return next(
    //   new AppError('You do not have permission to perform this action!', 403)
    // );
  } else if (req.user.role === 'admin') {
    if (req.user.language === 'de') {
      res.status(200).render('updateUserAdminPW_de', {
        title: 'Aktualisiere Benutzer',
        //data: userToUpdate,
        data: {
          userToUpdate: userToUpdate,
          departments: allDepartments,
          currentUser: currentUser,
          //currentUserLoggedIn,
        },
      });
    } else {
      res.status(200).render('updateUserAdminPW', {
        title: 'Update user',
        //data: userToUpdate,
        data: {
          userToUpdate: userToUpdate,
          departments: allDepartments,
          currentUser: currentUser,
          //currentUserLoggedIn,
        },
      });
    }
  } else {
    if (req.user.language === 'de') {
      res.status(200).render('updateUserByChef_de', {
        title: 'Aktualisiere Benutzer',
        //data: userToUpdate,
        data: {
          userToUpdate: userToUpdate,
          //currentUserLoggedIn,
          departments: allDepartments,
          currentUser: currentUser,
        },
      });
    } else {
      res.status(200).render('updateUserByChef', {
        title: 'Update user',
        //data: userToUpdate,
        data: {
          userToUpdate: userToUpdate,
          //currentUserLoggedIn,
          departments: allDepartments,
          currentUser: currentUser,
        },
      });
    }
  }
});

export const getAccount = (req, res) => {
  // da protect und isLoggedin middleware bereits user wissen, muss hier nicht fragen
  // frage, der user ist in der req.user drin, jedoch wiso wird der user nicht gesendet unterhalb des titels?

  if (req.user.language === 'de') {
    res.status(200).render('account_de', {
      title: 'Dein Konto',
      user: req.user,
    });
  } else {
    res.status(200).render('account', {
      title: 'Your account',
      user: req.user,
    });
  }
};

//video 195 POST userData MEaccount, ohne API, mit POST wie bei ejs method=post
//exports.updateUserData = catchAsync(async (req, res, next) => {
// export const updateUserData = catchAsync(async (req, res, next) => {
//   //console.log('req.User: ', req.user);
//   //console.log('Updating User: ', req.body); //in app.js muss app.use(express.urlencoded()) sein, um die daten zu sehen
//
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       //req.user.id den suchen wir, um zu updaten
//       //name: req.body.name, // req.body.name kommt von name des inputfeldes in pug or ejs
//       email: req.body.email,
//     },
//     {
//       // damit nur name und email update, aber keine anderen sachen        PW nicht mit findbyidandupdate machen!!!
//       new: true, // die updatet dokument soll neu sein,
//       runValidators: true,
//     }
//   );
//
//   //danach die gleiche seite, aber mit updatet sachen neu laden
//   res.status(200).render('account', {
//     title: 'Your account',
//     user: updatedUser, // user(daten) auf der seite sind updateUser,
//   });
// });
