import multer from 'multer';
import sharp from 'sharp';

import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync.mjs';
import AppError from '../utils/appError.mjs';

import Machine from '../models/machineModel.mjs';
import MalReport from '../models/malReportModel.mjs';
import User from '../models/userModel.mjs';

// right here on the top
const multerStorage = multer.memoryStorage(); // Stored as a buffer

// This filter only allows the upload of images
// test if uploaded file is an image, when true, --> cb (callBack) = filename and destination
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    //mimetype: 'image/jpeg',
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false); // 400 = bad request, (null(error), false)
  }
};

//const upload = multer({ dest: 'public/img/users' }) // This is the place, where all images will be save

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// upload.files = mix about upload.single and uploads.array
export const uploadMachineImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

export const resizeMachineImages = catchAsync(async (req, res, next) => {
  //console.log("req.files: " + req.files) // With "S" cause multiple files, this here can not be (un)-command out, it will give an error!

  if (!req.files.imageCover || !req.files.images) return next();

  // 1.) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer) // Image will be save in a buffer //...const multerStorage = multer.memoryStorage(); // stored as a buffer
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 }) // 90 = 90%
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // const imageCoverFilename = `tour-${req.params.id}-${Date.now()}-cover.jpeg`
  // req.body.imageCover = imageCoverFilename

  // 2.) other images in a loop
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      // map, because async await only work in the foreach loop, and not in the whole, with map it works --> req.files.images.foreach(async (file, i) => {...
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer) // Image will be save in a buffer //...const multerStorage = multer.memoryStorage(); // stored as a buffer
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 }) // 90 = 90%
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  console.log(req.body);
  next();
});

export const getClosedMalReportsMachine = catchAsync(async (req, res, next) => {
  console.log('Bin getClosedMalReportsMachine');

  const machineName = req.params.machineName;

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
    return next(new AppError('There is no machine with that name.', 404)); // 404 = not found
  }

  //for console.log --> output LogFal in closedMalReports
  closedMalReports.forEach((closedMalReport) => {
    //console.log('Log Fal Repair:');
    closedMalReport.logFal_Repair.forEach((log) => {
      //console.log(`Create Date: ${log.createAt_Repair}`);
      //console.log(`estimatedTime_Repair: ${log.estimatedTime_Repair}`);
    });
  });

  res.status(200).json({
    status: 'success',
    data: {
      closedMalReports: closedMalReports,
      machineName: machineName,
    },
  });
});

export const getMyMalReports = catchAsync(async (req, res, next) => {
  console.log('Bin getMyMalReports');
  const userID = req.params.userID;
  console.log(userID);

  const currentUser = await User.findOne({ _id: userID });

  const myMalReports = await MalReport.find({
    user_Mal: userID,
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

  console.log(currentUser);

  res.status(200).json({
    status: 'success',
    data: {
      myMalReports: myMalReports,
      currentUser: currentUser,
    },
  });
});

export const getMalReportsMachine = catchAsync(async (req, res, next) => {
  console.log('bin getMalReportsMachine');

  const machineID = req.params.machineID;
  console.log(machineID);

  const machine = await Machine.findOne({ _id: machineID });
  console.log(machine.name);
  const machineName = machine.name;

  if (!machine) {
    return next(new AppError('No machine found', 404));
  }

  const malReportsMachine = await MalReport.find({
    nameMachine_Mal: machineName,
    statusOpenClose_Mal: 'open',
  })
    .select(
      'createAt_Mal nameMachine_Mal statusOpenClose_Mal nameSector_Mal nameComponent_de_Mal nameComponent_en_Mal nameComponentDetail_de_Mal nameComponentDetail_en_Mal statusRun_Mal estimatedStatus'
    )
    .populate('user_Mal')
    .populate({
      path: 'logFal_Repair',
      populate: {
        path: 'user_Repair',
        model: 'User',
      },
    });

  if (!malReportsMachine) {
    return next(new AppError('No malReportsMachine found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      malReportsMachine: malReportsMachine,
    },
  });
});

export const getUpdateLogFal = catchAsync(async (req, res, next) => {
  console.log('bin getUpdateLogFal');
  // /:malReportID/updateLogFal/:malReportLogFalID'
  const malReportID = req.params.malReportID;
  const logFalID = req.params.malReportLogFalID;
  console.log(malReportID);
  console.log(logFalID);

  console.log(req.body);
  const estimatedStatus = req.body.estimatedStatus;
  console.log(estimatedStatus);

  console.log('---------------------------------');
  console.log(req.body.currentUser._id);
  const currentUser = JSON.parse(req.body.currentUser);
  const user_Repair = mongoose.Types.ObjectId(currentUser._id);
  console.log(user_Repair);
  console.log('---------------------------------');
  const createAt_Repair = req.body.createAt_Repair;
  const Status_Repair = req.body.Status_Repair;
  const messageProblem_de_Repair = req.body.messageProblem_de;
  const messageProblem_en_Repair = req.body.messageProblem_en;
  const messageMission_de_Repair = req.body.messageMission_de;
  const messageMission_en_Repair = req.body.messageMission_en;
  const estimatedTime_Repair = req.body.estimatedTime;
  const isElectroMechanical_Repair = req.body.elektroMech;

  const logFal = await MalReport.findOneAndUpdate(
    { _id: malReportID, 'logFal_Repair._id': logFalID },
    {
      $set: {
        'logFal_Repair.$.user_Repair': user_Repair,
        'logFal_Repair.$.createAt_Repair': createAt_Repair,
        'logFal_Repair.$.Status_Repair': Status_Repair,
        'logFal_Repair.$.messageProblem_de_Repair': messageProblem_de_Repair,
        'logFal_Repair.$.messageProblem_en_Repair': messageProblem_en_Repair,
        'logFal_Repair.$.messageMission_de_Repair': messageMission_de_Repair,
        'logFal_Repair.$.messageMission_en_Repair': messageMission_en_Repair,
        'logFal_Repair.$.estimatedTime_Repair': estimatedTime_Repair
          .replace('&lt;', '<')
          .replace('&gt;', '>'),
        'logFal_Repair.$.isElectroMechanical_Repair':
          isElectroMechanical_Repair,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!logFal) {
    return next(new AppError('No logFal found with that ID', 404));
  }

  const malReport = await MalReport.findByIdAndUpdate(
    malReportID,
    { estimatedStatus: estimatedStatus },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!malReport) {
    return next(new AppError('No malReport found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    msg: 'malReport-Status and logFal successfully updated',
  });
});

export const getCloseMalReport = catchAsync(async (req, res, next) => {
  console.log('bin getCloseMalReport');
  const malReportID = req.params.malReportID;
  console.log('malReportID: ' + malReportID);

  const malReportToClose = await MalReport.findOne({ _id: malReportID });

  if (!malReportToClose) {
    return next(new AppError('No malReport found with that ID', 404));
  }

  let isAllClose = false;

  for (const logFal of malReportToClose.logFal_Repair) {
    if (logFal.Status_Repair === 100) {
      console.log('Status_Repair ist 100');
      isAllClose = true;
    } else {
      console.log('Status_Repair ist nicht 100');
      isAllClose = false;
      return next(new AppError('the malReport has open Points!!!', 400));
    }
  }

  if (isAllClose === true) {
    console.log('es sind alle 100%');

    if (malReportToClose.nameSector_Mal === '-') {
      console.log('Hat nichts nameSector_Mal');
      malReportToClose.statusOpenClose_Mal = 'close';
      malReportToClose.statusRun_Mal = true;
      malReportToClose.finishAt_Mal = new Date().toISOString();
      malReportToClose.estimatedStatus = 100;

      await malReportToClose.save();

      const machine = await Machine.findOneAndUpdate(
        {
          _id: malReportToClose.idMachine_Mal,
        },
        {
          $set: {
            statusRun: true,
          },
        },
        {
          new: true,
          arrayFilters: [],
        }
      );

      console.log('-----------------------');
      console.log(machine);
      console.log('-----------------------');
      if (!machine) {
        return next(new AppError('No machine found with that ID', 404));
      }

      res.status(200).json({
        status: 'success',
        msg: 'malReport successfully closed',
      });
    } else {
      console.log('Hat was in nameSector_Mal');
      malReportToClose.statusOpenClose_Mal = 'close';
      malReportToClose.finishAt_Mal = new Date().toISOString();
      malReportToClose.estimatedStatus = 100;

      await malReportToClose.save();

      console.log(malReportToClose);
      console.log(malReportToClose.idMachine_Mal);

      console.log(
        'malReportToClose.idComponentDetail_Mal: ' +
          malReportToClose.idComponentDetail_Mal
      );

      console.log('machineID: ' + malReportToClose.idMachine_Mal);
      const machineId = mongoose.Types.ObjectId(malReportToClose.idMachine_Mal);
      console.log(machineId);

      const sectorID = mongoose.Types.ObjectId(malReportToClose.idSector_Mal);
      const componentID = mongoose.Types.ObjectId(
        malReportToClose.idComponent_Mal
      );

      const componentDetailId = mongoose.Types.ObjectId(
        malReportToClose.idComponentDetail_Mal
      );
      console.log(componentDetailId);

      const machine = await Machine.findOneAndUpdate(
        {
          _id: machineId,
          'sectorASMA._id': sectorID,
          'sectorASMA.components._id': componentID,
          'sectorASMA.components.componentDetails._id': componentDetailId,
        },
        {
          $set: {
            'sectorASMA.$[sector].components.$[comp].componentDetails.$[detail].status': true,
          },
        },
        {
          new: true,
          arrayFilters: [
            { 'sector._id': sectorID },
            { 'comp._id': componentID },
            { 'detail._id': componentDetailId },
          ],
        }
      );

      console.log('-----------------------');
      console.log(machine);
      console.log('-----------------------');
      if (!machine) {
        return next(new AppError('No machine found with that ID', 404));
      }
      console.log(machine);
      console.log('componentDetail ist wieder true');
    }

    res.status(200).json({
      status: 'success',
      msg: 'malReport successfully closed',
    });
  }
});

export const getCreateLogFal = catchAsync(async (req, res, next) => {
  console.log('bin getCreateLogFal');

  const malReportID = req.params.malReportID;
  console.log(malReportID);

  const currentUser = JSON.parse(req.body.currentUser);
  const user_Repair = mongoose.Types.ObjectId(currentUser._id);
  console.log(user_Repair);

  const estimatedStatus = req.body.estimatedStatus;
  const isElectroMechanical_Repair = req.body.elektroMech;
  const estimatedTime_Repair = req.body.estimatedTime_Repair;
  const Status_Repair = req.body.Status_Repair;
  console.log('--------------' + req.body);
  console.log(JSON.stringify(req.body));
  const messageProblem_de_Repair = req.body.messageProblem_de_Repair
    ? req.body.messageProblem_de_Repair
    : '-';
  const messageMission_de_Repair = req.body.messageMission_de_Repair
    ? req.body.messageMission_de_Repair
    : '-';
  const messageProblem_en_Repair = req.body.messageProblem_en_Repair
    ? req.body.messageProblem_en_Repair
    : '-';
  const messageMission_en_Repair = req.body.messageMission_en_Repair
    ? req.body.messageMission_en_Repair
    : '-';
  const createAt_Repair = req.body.createAt_Repair;

  console.log('estimatedStatus: ' + estimatedStatus);
  console.log('isElectroMechanical_Repair: ' + isElectroMechanical_Repair);
  console.log('estimatedTime_Repair: ' + estimatedTime_Repair);
  console.log('Status_Repair: ' + Status_Repair);
  console.log('messageProblem_de_Repair: ' + messageProblem_de_Repair);
  console.log('messageMission_de_Repair: ' + messageMission_de_Repair);
  console.log('messageProblem_en_Repair: ' + messageProblem_en_Repair);
  console.log('messageMission_en_Repair: ' + messageMission_en_Repair);
  console.log('createAt_Repair: ' + createAt_Repair);

  const malReport = await MalReport.findOne({ _id: malReportID });
  console.log(malReport);

  if (!malReport) {
    return next(new AppError('No malReport found with that ID', 404));
  }

  const newLogFal = {
    user_Repair: user_Repair,
    isElectroMechanical_Repair: isElectroMechanical_Repair,
    estimatedTime_Repair: estimatedTime_Repair
      .replace('&lt;', '<')
      .replace('&gt;', '>'),
    Status_Repair: Status_Repair,
    messageProblem_de_Repair: messageProblem_de_Repair,
    messageMission_de_Repair: messageMission_de_Repair,
    messageProblem_en_Repair: messageProblem_en_Repair,
    messageMission_en_Repair: messageMission_en_Repair,
    createAt_Repair: createAt_Repair,
  };

  malReport.estimatedStatus = estimatedStatus;
  malReport.logFal_Repair.push(newLogFal);
  await malReport.save();

  console.log('MalReport updated with new LogFal');

  res.status(200).json({
    status: 'success',
    msg: 'MalReport updated with new LogFal',
  });
});
