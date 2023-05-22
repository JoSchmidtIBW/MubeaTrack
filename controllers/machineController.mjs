import multer from 'multer';
import sharp from 'sharp';

import Machine from '../models/machineModel.mjs';
import MalReport from '../models/malReportModel.mjs';

import mongoose from 'mongoose';

import APIFeatures from '../utils/apiFeatures.mjs';
import catchAsync from '../utils/catchAsync.mjs';

import AppError from '../utils/appError.mjs';
//import factory from '../controllers/handlerFactory.mjs';
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from '../controllers/handlerFactory.mjs';
import User from '../models/userModel.mjs';

//erst daten lesen dann verwenden top level code
//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

// right here on the top
const multerStorage = multer.memoryStorage(); // stored as a buffer

// nur für bilder erlaubt zum hochladen, dafür dieser filter
// test if uploaded file is an image, wenn true, --> cb (callBack) = filename und destination
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    //mimetype: 'image/jpeg',
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false); // 400 bad request, (null(error), false)
  }
};

// hier bei beginning
//const upload = multer({ dest: 'public/img/users' }) // das ist der ort, wo alle fotos von user gespeichert werden sollen

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
// in updateMe wird nun geschaut, das das hochgeladene neue bild, ins onbjekt des users geschrieben wird

//video 204     upload.fiels = mix von upload.single und uploads.array
export const uploadMachineImages = upload.fields([
  // in tourModel, images ist ein array, welches aus drei, anstatt einem bild wie bei usermodel besteht
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);
// wenn es nur eins, anstatt drei images wären, würde man das so machen:
// upload.single('image')   // req.file
// // wenn multiple images dann so:
// upload.array('images', 5)// 'images' = name of the field // req.files

// diese middleware macht den process von den geladenen bilder bzw macht die grösse
export const resizeMachineImages = catchAsync(async (req, res, next) => {
  //console.log("req.files: " + req.files) // mit S wegen multiple files  der hier darf nicht stehen, sonst gibt es ein error bei mir!!!

  if (!req.files.imageCover || !req.files.images) return next();

  // 1.) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer) // bild wird in buffer gespeichert //...const multerStorage = multer.memoryStorage(); // stored as a buffer
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 }) //90=90%
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // const imageCoverFilename = `tour-${req.params.id}-${Date.now()}-cover.jpeg`

  // await sharp(req.files.imageCover[0].buffer) // bild wird in buffer gespeichert //...const multerStorage = multer.memoryStorage(); // stored as a buffer
  // .resize(2000, 1333)
  // .toFormat('jpeg')
  // .jpeg({ quality: 90 }) //90=90%
  // .toFile(`public/img/tours/${imageCoverFilename}`)

  // req.body.imageCover = imageCoverFilename

  // 2.) other images in a loop

  req.body.images = [];

  //req.files.images.foreach(async (file, i) => {
  await Promise.all(
    req.files.images.map(async (file, i) => {
      // map, weil async await nur in der foreach schlaufe, und nicht im gesammten, mit map geht
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer) // bild wird in buffer gespeichert //...const multerStorage = multer.memoryStorage(); // stored as a buffer
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 }) //90=90%
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  console.log(req.body);
  next();
});

// middleware get top-5-tours
//http://127.0.0.1:4301/api/v1/tours?limit=5&sort=-ratingsAverage,price
//http: //127.0.0.1:4301/api/v1/tours/top-5-cheap
//exports.aliasTopTours = async (req, res, next) => {
export const aliasTopMachinery = async (req, res, next) => {
  // manipuliere query opject, damit nach next nur nocht top 5 kommen
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'; // was wollen wir zurück aus db

  next();
};

// 2. route handlers
//export const getAllMachinery = getAll(Machine);
export const getMachine = getOne(Machine);
//export const createMachine = createOne(Machine);
export const updateMachine = updateOne(Machine);
// export const updateMachine = catchAsync(async (req, res, next) => {
//   console.log('bin updateMachine');
//   console.log(req.body);
//
//   // const machinery = await Machine.find().select('+createdAt');
//   // // const users = await User.find().select('+createdAt').lean().exec();
//   // // const usersJSON = JSON.parse(JSON.stringify(users));
//   //
//   // res.status(200).json({
//   //   status: 'success',
//   //   results: machinery.length,
//   //   data: {
//   //     data: machinery,
//   //   },
//   // });
// });

export const deleteMachine = deleteOne(Machine);

export const getMachinery = catchAsync(async (req, res, next) => {
  console.log('bin getMachinery');

  const machinery = await Machine.find().select('+createdAt');
  // const users = await User.find().select('+createdAt').lean().exec();
  // const usersJSON = JSON.parse(JSON.stringify(users));

  res.status(200).json({
    status: 'success',
    results: machinery.length,
    data: {
      data: machinery,
    },
  });
});

export const updateASMAMachine = catchAsync(async (req, res, next) => {
  console.log('bin updateASMAMachine');
  console.log(req.body.currentUserID);
  console.log(req.body.machineID);
  //console.log(req.body.url);
  console.log(req.body);
  //console.log(req.body.currentUserID)

  const currentUserID = req.body.currentUserID;
  const selectedRunID = req.body.selectedRunIdBtn;
  //const selectedIdsArr = req.body.selectedIdsBtnArr;
  const selectedIdsArr = JSON.parse(req.body.selectedIdsBtnArr);
  const machineID = req.body.machineID;

  console.log('selectedRunID: ' + selectedRunID);
  console.log('selectedIdsArr: ' + selectedIdsArr);
  console.log('machineID: ' + machineID);

  const componentDetailID = mongoose.Types.ObjectId(selectedIdsArr);


  if (selectedRunID.length === 0) {
    console.log('es wurde keine selectedRunID angewählt');
  } else {
    //const machine = Machine.findById({ _id: machineID });
    try {
      await Machine.updateOne({ _id: machineID }, { statusRun: false });
      console.log(
        `statusRun für machine mit ID ${machineID} erfolgreich auf false gesetzt.`
      );
      //---------------------------------------------
      const malReport = new MalReport({
        userMal: currentUserID,
      });
      await malReport.save();
    } catch (error) {
      console.error(
        `Fehler beim Setzen von statusRun für machine mit ID ${machineID}:`,
        error
      );
      //-----------------------------------------------
    }
  }

  if (selectedIdsArr.length === 0) {
    console.log('es wurde keine selectedIdsArr angewählt');
  } else {
    const selectedObjectIdsArr = selectedIdsArr.map((id) =>
      mongoose.Types.ObjectId(id)
    );

    try {
      await Machine.updateOne(
        { _id: machineID },
        {
          $set: {
            'sectorASMA.$[].components.$[].componentDetails.$[detail].status': false,
          },
        },
        { arrayFilters: [{ 'detail._id': { $in: selectedObjectIdsArr } }] }
      );
      console.log(
        `Status der ausgewählten componentDetails für machine mit ID ${machineID} erfolgreich auf false gesetzt.`
      );
      //---------------------------------------------
      const componentDetailID = 'ID der Komponenten-Detail';

      try {

        const machine = await Machine.findOne({
          'sectorASMA.components.componentDetails._id': componentDetailID,
        });

        if (machine) {
          const component = machine.sectorASMA.components.find((comp) =>
            comp.componentDetails.some(
              (detail) => detail._id.toString() === componentDetailID
            )
          );

          if (component) {
            const componentDetail = component.componentDetails.find(
              (detail) => detail._id.toString() === componentDetailID
            );

            if (componentDetail) {
              const selectedSectorASMAName = machine.sectorASMA.name;
              const selectedComponentName = component.name_de;
              const selectedIdsArr = [componentDetailID];

              console.log('selectedSectorASMAName:', selectedSectorASMAName);
              console.log('selectedComponentName:', selectedComponentName);
              console.log('selectedIdsArr:', selectedIdsArr);


            }
          }
        }
      } catch (error) {
        console.error('Fehler beim Suchen der Komponenten-Detail:', error);
      }
      //   const machine = await Machine.findById(machineID);
      //   if (machine) {
      //     console.log(machine);
      //     const malReport = new MalReport({
      //       userMal: currentUserID,
      //       machineNameMal: machine.name,
      //     });
      //     await malReport.save();
      //     console.log('MalReport erfolgreich erstellt.');
      //   } else {
      //     console.log('Maschine nicht gefunden.');
      //   }
    } catch (error) {
      console.error(
        `Fehler beim Setzen des status für componentDetails der machine mit ID ${machineID}:`,
        error
      );
      //---------------------------------------------
    }
  }

  res.status(200).json({
    status: 'success',
    message: 'ASMAMachine succefully updated!',
  });
});

//todo hier muss ev noch hinzugefügt werden, die MaschinenEinheiten und deteils, für danach fehler
export const createMachine = catchAsync(async (req, res) => {
  console.log('bin createMachine');

  //console.log(req.body);

  const machineData = {
    name: req.body.name,
    description: req.body.description,
    zone: req.body.zone ? req.body.zone : 'Sägen',
    type: req.body.type ? req.body.type : '-',
    constructionYear: req.body.constructionYear
      ? req.body.constructionYear
      : '-',
    companyMachine: req.body.companyMachine ? req.body.companyMachine : '-',
    voltage: req.body.voltage ? req.body.voltage : '-',
    controlVoltage: req.body.controlVoltage ? req.body.controlVoltage : '-',
    ratedCurrent: req.body.ratedCurrent ? req.body.ratedCurrent : '-',
    electricalFuse: req.body.electricalFuse ? req.body.electricalFuse : '-',
    compressedAir: req.body.compressedAir ? req.body.compressedAir : '-',
    weightMass: req.body.weightMass ? req.body.weightMass : '-',
    dimensions: req.body.dimensions ? req.body.dimensions : '-',
    drawingNumber: req.body.drawingNumber ? req.body.drawingNumber : '-',
    //photo: req.body.photo,
    department: req.body.department,
    statusRun: true,
    employees: [],
    employeesCount: 0,
  };

  const newMachine = new Machine(machineData);
  await newMachine.save();

  res.status(200).json({
    status: 'success',
    message: 'A new machine is succefully created!',
  });
});

export const getMachineryASMA = catchAsync(async (req, res, next) => {
  const machinery = await Machine.find(); //.select('createdAt');
  res.status(200).json({
    status: 'success',
    data: {
      data: machinery,
    },
    //title: 'Manage ASMA/machine',
    //data: {
    //machinery: machinery,
    //},
  });
});

export const createComponentDetailASMA = catchAsync(async (req, res, next) => {
  console.log('bin createComponentDetailASMA');

  console.log(req.params.machineID);
  console.log(req.params.sectorASMAID);
  console.log(req.params.componentASMAID);
  const machineID = req.params.machineID;
  const sectorASMAID = req.params.sectorASMAID;
  const componentASMAID = req.params.componentASMAID;

  console.log('name_de: ' + req.body.componentDetailName_de);
  console.log('name_en: ' + req.body.componentDetailName_en);

  const sectorComponentDetailASMAData = {
    name_de: req.body.componentDetailName_de,
    name_en: req.body.componentDetailName_en,
    status: true,
  };

  const machine = await Machine.findOneAndUpdate(
    {
      _id: machineID,
      'sectorASMA._id': sectorASMAID,
      'sectorASMA.components._id': componentASMAID,
    },
    {
      $push: {
        'sectorASMA.$[sectorIndex].components.$[componentIndex].componentDetails':
          sectorComponentDetailASMAData,
      },
    },
    {
      arrayFilters: [
        { 'sectorIndex._id': sectorASMAID },
        { 'componentIndex._id': componentASMAID },
      ],
      new: true,
      runValidators: true,
    }
  );

  if (!machine) {
    return next(new AppError('No machine found with that ID', 404));
  }

  // console.log(machine);
  machine.sectorASMA.forEach((sector) => {
    sector.components.forEach((component) => {
      component.componentDetails.forEach((detail) => {
        console.log(detail);
      });
    });
  });

  // const sectorASMA = await machine.sectorASMA.find(
  //   (s) => s._id.toString() === sectorASMAID
  // );
  // console.log('sector: ' + sectorASMA.name);

  // const componentASMA = await machine.sectorASMA.components.find(
  //   (s) => s._id.toString() === componentASMAID
  // );
  // console.log('component: ' + componentASMA.name_de);
  const componentIndex = machine.sectorASMA.findIndex(
    (s) => s._id.toString() === sectorASMAID
  );
  const sectorASMA = machine.sectorASMA[componentIndex];
  const componentASMAIndex = sectorASMA.components.findIndex(
    (c) => c._id.toString() === componentASMAID
  );
  console.log('sector: ' + sectorASMA.name);
  const componentASMA = sectorASMA.components[componentASMAIndex];
  console.log('component: ' + componentASMA.name_de);

  const componentDetailASMA_New =
    componentASMA.componentDetails[componentASMA.componentDetails.length - 1];
  console.log('Neuestes hinzugefügtes Component Detail:');
  console.log(componentDetailASMA_New);

  console.log(
    `Neues componentDetail wurde zur Maschine ${machine.name}, dem sectorASMA ${sectorASMA.name}, mit der componente ${componentASMA.name_de} hinzugefügt:`,
    componentDetailASMA_New
  );

  res.status(200).json({
    status: 'success',
    message: `New componentDetail has been successfully added to the machine ${machine.name}, with sectorASMA ${sectorASMA.name_de} and component ${componentASMA.name_de}: ${componentDetailASMA_New}`,
  });
});

export const createComponentASMA = catchAsync(async (req, res, next) => {
  console.log('bin createComponentASMA');

  console.log(req.params.machineID);
  console.log(req.params.sectorASMAID);
  const machineID = req.params.machineID;
  const sectorASMAID = req.params.sectorASMAID;

  const sectorComponentASMAData = {
    name_de: req.body.componentName_de,
    name_en: req.body.componentName_en,
    description_de: req.body.componentDescription_de,
    description_en: req.body.componentDescription_en,
    componentDetails: [], //komponentsDetail sind noch leer
    //zone: req.body.zone ? req.body.zone : 'Sägen',
  };

  const machine = await Machine.findByIdAndUpdate(
    machineID,
    {
      $push: {
        'sectorASMA.$[sectorIndex].components': sectorComponentASMAData,
      },
    },
    {
      arrayFilters: [{ 'sectorIndex._id': sectorASMAID }],
      new: true,
      runValidators: true,
    }
  );

  //console.log(machine);
  machine.sectorASMA.forEach((sector) => {
    sector.components.forEach((component) => {
      console.log(component);
    });
  });

  if (!machine) {
    return next(new AppError('No machine found with that ID', 404));
  }

  const sectorASMA = await machine.sectorASMA.find(
    (s) => s._id.toString() === sectorASMAID
  );
  console.log(sectorASMA.name);
  const sectorASMAName = sectorASMA ? sectorASMA.name : 'unbekannt';

  console.log(
    `Neue Komponente wurde zur Maschine ${machine.name} und dem sectorASMA ${sectorASMAName} hinzugefügt:`,
    sectorComponentASMAData
  );

  res.status(200).json({
    status: 'success',
    message:
      'New component has been successfully added to the machine ${machine.name} and the sectorASMA ${sectorASMAName}',
  });
});

export const updateComponentDetailASMA = catchAsync(async (req, res, next) => {
  console.log('bin updateComponentDetailASMA');

  console.log('machineID: ' + req.params.machineID);
  console.log('sectorASMAID: ' + req.params.sectorASMAID);
  console.log('componentASMAID: ' + req.params.componentASMAID);
  console.log('componentDetailASMAID: ' + req.params.componentDetailASMAID);

  const machineID = req.params.machineID;
  const sectorASMAID = req.params.sectorASMAID;
  const componentASMAID = req.params.componentASMAID;
  const componentDetailASMAID = req.params.componentDetailASMAID;

  const name_de = req.body.componentDetailASMAName_de;
  const name_en = req.body.componentDetailASMAName_en;
  const status = true;

  console.log('name_de: ' + name_de);
  console.log('name_en: ' + name_en);
  console.log('status: ' + status);

  const updatedMachine = await Machine.findOneAndUpdate(
    {
      _id: machineID,
      'sectorASMA._id': sectorASMAID,
      'sectorASMA.components._id': componentASMAID,
      'sectorASMA.components.componentDetails._id': componentDetailASMAID,
    },
    {
      $set: {
        'sectorASMA.$[sector].components.$[component].componentDetails.$[detail].name_de':
          name_de,
        'sectorASMA.$[sector].components.$[component].componentDetails.$[detail].name_en':
          name_en,
        'sectorASMA.$[sector].components.$[component].componentDetails.$[detail].status':
          status,
      },
    },
    {
      arrayFilters: [
        { 'sector._id': sectorASMAID },
        { 'component._id': componentASMAID },
        { 'detail._id': componentDetailASMAID },
      ],
      new: true,
    }
  ).populate('sectorASMA.components.componentDetails');

  if (!updatedMachine) {
    return next(new AppError('No machine found with that ID', 404));
  }

  // //console.log('Updated machine:', updatedMachine);
  console.log(
    `ComponentDetails wurde bei Maschine ${
      updatedMachine.name
    }, dem sectorASMA ${
      updatedMachine.sectorASMA.find((s) => s._id.toString() === sectorASMAID)
        .name
    }, \nder componente 
    ${
      updatedMachine.sectorASMA
        .find((s) => s._id.toString() === sectorASMAID)
        .components.find((c) => c._id.toString() === componentASMAID).name_de
    },\n und dem componentDetail 
        ${
          updatedMachine.sectorASMA
            .find((s) => s._id.toString() === sectorASMAID)
            .components.find((c) => c._id.toString() === componentASMAID)
            .componentDetails.find(
              (c) => c._id.toString() === componentDetailASMAID
            ).name_de
        } geupdatet`
  );

  res.status(200).json({
    status: 'success',
    message: `${updatedMachine.name}, sectorASMA ${
      updatedMachine.sectorASMA.find((s) => s._id.toString() === sectorASMAID)
        .name
    } with the component ${
      updatedMachine.sectorASMA
        .find((s) => s._id.toString() === sectorASMAID)
        .components.find((c) => c._id.toString() === componentASMAID).name_de
    } and the componentDetail ${
      updatedMachine.sectorASMA
        .find((s) => s._id.toString() === sectorASMAID)
        .components.find((c) => c._id.toString() === componentASMAID)
        .componentDetails.find(
          (c) => c._id.toString() === componentDetailASMAID
        ).name_de
    }
     has been successfully updated`,
  });
});

export const updateComponentASMA = catchAsync(async (req, res, next) => {
  console.log('bin updateComponentASMA');

  console.log('machineID: ' + req.params.machineID);
  console.log('sectorASMAID: ' + req.params.sectorASMAID);
  console.log('componentASMAID: ' + req.params.componentASMAID);

  const machineID = req.params.machineID;
  const sectorASMAID = req.params.sectorASMAID;
  const componentASMAID = req.params.componentASMAID;

  const name_de = req.body.componentASMAName_de;
  const name_en = req.body.componentASMAName_en;
  const description_de = req.body.componentASMADescription_de;
  const description_en = req.body.componentASMADescription_en;

  console.log('name_de: ' + name_de);
  console.log('name_en: ' + name_en);
  console.log('description_de: ' + description_de);
  console.log('description_en: ' + description_en);

  const updatedMachine = await Machine.findOneAndUpdate(
    {
      _id: machineID,
      'sectorASMA._id': sectorASMAID,
      'sectorASMA.components._id': componentASMAID,
    },
    {
      $set: {
        'sectorASMA.$[sector].components.$[component].name_de': name_de,
        'sectorASMA.$[sector].components.$[component].name_en': name_en,
        'sectorASMA.$[sector].components.$[component].description_de':
          description_de,
        'sectorASMA.$[sector].components.$[component].description_en':
          description_en,
      },
    },
    {
      arrayFilters: [
        { 'sector._id': sectorASMAID },
        { 'component._id': componentASMAID },
      ],
      new: true,
    }
  ).populate('sectorASMA.components');

  if (!updatedMachine) {
    return next(new AppError('No machine found with that ID', 404));
  }

  //console.log('Updated machine:', updatedMachine);
  console.log(
    `Neue Componente wurde bei Maschine ${
      updatedMachine.name
    } und dem sectorASMA ${
      updatedMachine.sectorASMA.find((s) => s._id.toString() === sectorASMAID)
        .name
    }  erfolgreich gupdatet:\n`,
    `${
      updatedMachine.sectorASMA
        .find((s) => s._id.toString() === sectorASMAID)
        .components.find((c) => c._id.toString() === componentASMAID).name_de
    },\n`,
    `${
      updatedMachine.sectorASMA
        .find((s) => s._id.toString() === sectorASMAID)
        .components.find((c) => c._id.toString() === componentASMAID).name_en
    },\n`,
    `${
      updatedMachine.sectorASMA
        .find((s) => s._id.toString() === sectorASMAID)
        .components.find((c) => c._id.toString() === componentASMAID)
        .description_de
    },\n`,
    `${
      updatedMachine.sectorASMA
        .find((s) => s._id.toString() === sectorASMAID)
        .components.find((c) => c._id.toString() === componentASMAID)
        .description_en
    }`
  );

  // console.log(
  //   `SectorASMA wurde bei Maschine ${
  //     updatedSectorASMA.name
  //   } und den SectorASMA: ${
  //     updatedSectorASMA.sectorASMA.find(
  //       (s) => s._id.toString() === sectorASMAID
  //     ).name
  //   }  aktualisiert:`,
  //   updatedSectorASMA.sectorASMA.find((s) => s._id.toString() === sectorASMAID)
  //     .name,
  //   updatedSectorASMA.sectorASMA.find((s) => s._id.toString() === sectorASMAID)
  //     .description_de,
  //   updatedSectorASMA.sectorASMA.find((s) => s._id.toString() === sectorASMAID)
  //     .description_en
  //   //updatedSectorASMA.sectorASMA.find((s) => s._id.toString() === sectorASMAID),// ganzes objekt, mit Komponente
  // );

  res.status(200).json({
    status: 'success',
    message: `${updatedMachine.name}, sectorASMA ${
      updatedMachine.sectorASMA.find((s) => s._id.toString() === sectorASMAID)
        .name
    } with the component ${
      updatedMachine.sectorASMA
        .find((s) => s._id.toString() === sectorASMAID)
        .components.find((c) => c._id.toString() === componentASMAID).name_de
    }
     has been successfully updated`,
  });
});

export const deleteComponentDetailASMA = catchAsync(async (req, res, next) => {
  console.log('bin deleteComponentDetailASMA');
  //console.log(req.params);
  //console.log(req);
  //console.log(path);

  // const machineID = req.params.machineID;
  // const sectorASMAID = req.params.sectorASMAID;

  console.log('machineID: ' + req.params.machineID);
  console.log('sectorASMAID: ' + req.params.sectorASMAID);
  console.log('componentASMAID: ' + req.params.componentASMAID);
  console.log('componentDetailASMAID: ' + req.params.componentDetailASMAID);
  const machineID = req.params.machineID;
  const sectorASMAID = req.params.sectorASMAID;
  const componentASMAID = req.params.componentASMAID;
  const componentDetailASMAID = req.params.componentDetailASMAID;

  // const referer = req.headers.referer;
  // const ids = referer.match(/\/([\w\d]+)\/updateSectorASMA\/([\w\d]+)/);
  // const machineID = ids[1];
  // const sectorASMAID = ids[2];

  // console.log(`MachineID: ${machineID}`);
  // console.log(`SectorASMAID: ${sectorASMAID}`);

  const updatedMachine = await Machine.findByIdAndUpdate(
    machineID,
    {
      $pull: {
        'sectorASMA.$[sector].components.$[component].componentDetails': {
          _id: componentDetailASMAID,
        },
      },
    },
    {
      arrayFilters: [
        { 'sector._id': sectorASMAID },
        { 'component._id': componentASMAID },
      ],
      new: true,
    }
  );

  console.log(
    `Componente wurde bei Maschine ${updatedMachine.name} und dem sectorASMA ${
      updatedMachine.sectorASMA.find((s) => s._id.toString() === sectorASMAID)
        .name
    } und in der componente ${
      updatedMachine.sectorASMA
        .find((s) => s._id.toString() === sectorASMAID)
        .components.find((s) => s._id.toString() === componentASMAID).name_de
    }erfolgreich gelöscht...`,
    'kann gelöschtes Objekt nicht mehr anzeigen...'
    // `${
    //   updatedMachine.sectorASMA
    //     .find((s) => s._id.toString() === sectorASMAID)
    //     .components.find((c) => c._id.toString() === componentASMAID).name_de
    // }...`
  );

  // const updatedMachine = await Machine.findByIdAndUpdate(
  //   machineID,
  //   { $pull: { sectorASMA: { _id: sectorASMAID } } },
  //   { new: true }
  // );
  //
  // console.log(
  //   `SectorASMA wurde bei Maschine ${updatedMachine.name} und den SectorASMA: ${sectorASMAID} gelöscht:`,
  //   updatedMachine.sectorASMA
  // );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const deleteComponentASMA = catchAsync(async (req, res, next) => {
  console.log('bin deleteComponentASMA');
  //console.log(req.params);
  //console.log(req);
  //console.log(path);

  // const machineID = req.params.machineID;
  // const sectorASMAID = req.params.sectorASMAID;

  console.log('machineID: ' + req.params.machineID);
  console.log('sectorASMAID: ' + req.params.sectorASMAID);
  console.log('sectorASMAID: ' + req.params.componentASMAID);
  const machineID = req.params.machineID;
  const sectorASMAID = req.params.sectorASMAID;
  const componentASMAID = req.params.componentASMAID;

  // const referer = req.headers.referer;
  // const ids = referer.match(/\/([\w\d]+)\/updateSectorASMA\/([\w\d]+)/);
  // const machineID = ids[1];
  // const sectorASMAID = ids[2];

  // console.log(`MachineID: ${machineID}`);
  // console.log(`SectorASMAID: ${sectorASMAID}`);

  const updatedMachine = await Machine.findByIdAndUpdate(
    machineID,
    {
      $pull: {
        'sectorASMA.$[sector].components': { _id: componentASMAID },
      },
    },
    {
      arrayFilters: [{ 'sector._id': sectorASMAID }],
      new: true,
    }
  );

  console.log(
    `Componente wurde bei Maschine ${updatedMachine.name} und dem sectorASMA ${
      updatedMachine.sectorASMA.find((s) => s._id.toString() === sectorASMAID)
        .name
    } erfolgreich gelöscht...`,
    'kann gelöschtes Objekt nicht mehr anzeigen...'
    // `${
    //   updatedMachine.sectorASMA
    //     .find((s) => s._id.toString() === sectorASMAID)
    //     .components.find((c) => c._id.toString() === componentASMAID).name_de
    // }...`
  );

  // const updatedMachine = await Machine.findByIdAndUpdate(
  //   machineID,
  //   { $pull: { sectorASMA: { _id: sectorASMAID } } },
  //   { new: true }
  // );
  //
  // console.log(
  //   `SectorASMA wurde bei Maschine ${updatedMachine.name} und den SectorASMA: ${sectorASMAID} gelöscht:`,
  //   updatedMachine.sectorASMA
  // );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const createSectorASMA = catchAsync(async (req, res, next) => {
  console.log('bin createSectorASMA');
  // console.log(req.body);
  // console.log(req.params.id);
  //
  // console.log(req.body.sectionName);
  // console.log(req.body.sectionDescription_de);
  // console.log(req.body.sectionDescription_en);

  // const machineForASMA = await Machine.findById(req.params.id);
  // console.log(machineForASMA);

  const machineSectorASMAData = {
    name: req.body.sectionName,
    description_de: req.body.sectionDescription_de,
    description_en: req.body.sectionDescription_en,
    components: [], //komponents sind noch leer
    //zone: req.body.zone ? req.body.zone : 'Sägen',
  };

  // const machineForASMA = await Machine.findByIdAndUpdate(
  //   req.params.id,
  //   req.body,
  //   {
  //     //achtung mit patch und put, bei updatebyid
  //     new: true,
  //     runValidators: true, // falls price: 500 wäre ein string
  //   }
  // ); // in url /:63fb4c3baac7bf9eb4b72a76 , body: was geupdatet wird, 3, damit nur das geupdatet neue return wird
  // //         // Tour.findOne({ _id: req.params.id})

  const machineForASMA = await Machine.findByIdAndUpdate(
    req.params.id,
    { $push: { sectorASMA: machineSectorASMAData } },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!machineForASMA) {
    return next(new AppError('No machine found with that ID', 404));
  }

  console.log(
    `Neuer sectorASMA wurde zur Maschine ${machineForASMA._id} hinzugefügt:`,
    machineSectorASMAData
  );
  // machineForASMA.sectorASMA.push(machineSectorASMAData);
  //
  // machineForASMA.save((err, updatedMachine) => {
  //   //speichere doku
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(
  //       `Neuer sectorASMA wurde zur Maschine ${updatedMachine._id} hinzugefügt:`,
  //       sectorASMA
  //     );
  //   }
  // });

  res.status(200).json({
    status: 'success',
    message:
      'New sectorASMA has been successfully added to the machine ${updatedMachine._id}:',
  });
});

export const updateSectorASMA = catchAsync(async (req, res, next) => {
  console.log('bin updateSectorASMA');

  console.log(req.body);
  console.log('------------');
  console.log(req.params);
  console.log('machineID: ' + req.params.machineID);
  console.log('sectorASMAID: ' + req.params.sectorASMAID);

  const machineID = req.params.machineID;
  const sectorASMAID = req.params.sectorASMAID;

  const name = req.body.sectorASMAName;
  const description_de = req.body.sectorASMADescription_de;
  const description_en = req.body.sectorASMADescription_en;

  console.log('name: ' + name);
  console.log('description_de: ' + description_de);
  console.log('description_en: ' + description_en);

  const updatedSectorASMA = await Machine.findByIdAndUpdate(
    machineID,
    {
      $set: {
        'sectorASMA.$[element].name': name,
        'sectorASMA.$[element].description_de': description_de,
        'sectorASMA.$[element].description_en': description_en,
      },
    },
    { arrayFilters: [{ 'element._id': sectorASMAID }], new: true }
  );

  console.log(
    `SectorASMA wurde bei Maschine ${
      updatedSectorASMA.name
    } und den SectorASMA: ${
      updatedSectorASMA.sectorASMA.find(
        (s) => s._id.toString() === sectorASMAID
      ).name
    }  aktualisiert:`,
    updatedSectorASMA.sectorASMA.find((s) => s._id.toString() === sectorASMAID)
      .name,
    updatedSectorASMA.sectorASMA.find((s) => s._id.toString() === sectorASMAID)
      .description_de,
    updatedSectorASMA.sectorASMA.find((s) => s._id.toString() === sectorASMAID)
      .description_en
    //updatedSectorASMA.sectorASMA.find((s) => s._id.toString() === sectorASMAID),// ganzes objekt, mit Komponente
  );

  res.status(200).json({
    status: 'success',
    message: 'erfolgreich',
    //'sectorASMA ${updatedSectorASMA.sectorASMA.id.name} has been successfully updated to the machine ${machine.name}:'
    //   message: `sectorASMA ${
    //     updatedSectorASMA.sectorASMA.find(
    //       (s) => s._id.toString() === sectorASMAID
    //     ).name
    //   } has been successfully updated to the machine ${updatedSectorASMA.name}.`,
  });
});

export const deleteSectorASMA = catchAsync(async (req, res, next) => {
  //console.log('bin deleteSectorASMA');
  //console.log(req.params);
  console.log(req);
  //console.log(path);

  // const machineID = req.params.machineID;
  // const sectorASMAID = req.params.sectorASMAID;
  // console.log('machineID: ' + req.params.machineID);
  // console.log('sectorASMAID: ' + req.params.sectorASMAID);

  const referer = req.headers.referer;
  const ids = referer.match(/\/([\w\d]+)\/updateSectorASMA\/([\w\d]+)/);
  const machineID = ids[1];
  const sectorASMAID = ids[2];

  console.log(`MachineID: ${machineID}`);
  console.log(`SectorASMAID: ${sectorASMAID}`);

  const updatedMachine = await Machine.findByIdAndUpdate(
    machineID,
    { $pull: { sectorASMA: { _id: sectorASMAID } } },
    { new: true }
  );

  console.log(
    `SectorASMA wurde bei Maschine ${updatedMachine.name} und den SectorASMA: ${sectorASMAID} gelöscht:`,
    updatedMachine.sectorASMA
  );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//Video 102 Agregation Pipeline for MongoDB
// soll statistiken zeigen von tours
//exports.getTourStats = catchAsync(async (req, res, next) => {
export const getMachineStats = catchAsync(async (req, res, next) => {
  // try {
  const stats = await Tour.aggregate([
    // array = stages, wo die Daten manipuliert werden können
    {
      $match: { ratingsAverage: { $gte: 4.5 } }, // match stage
    },
    {
      $group: {
        // zb um durchschnitt zu erechnen von den 5 gefundenen
        //_id: null,
        //_id: '$difficulty', // _id: null, // für alle welche kommen
        //_id: '$ratingsAverage',
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 }, //1 pro dokument, jedesmal added 1  1++
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        // müssen namen von neuen objekten (oben) sein
        avgPrice: 1,
      },
    },
    // { // beispiel, um mehrere male match zu machen
    //     $match: { _id: { $ne: 'EASY' } } //alle welche not easy sind,  EASY weil ez neu in DB gross (difficulty)
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats: stats,
    },
  });

  // } catch (err) {
  //     res.status(404).json({
  //         status: 'fail',
  //         message: err
  //     })
  // }
});

// video 103    DAS GEHT NICHT WEIL DATENBANK ZUERST mit TERMINEN GELADEN WERDEN MUSS IM BEISPIEL
////http://127.0.0.1:4301/api/v1/tours/monthly-plan/:year   2021
//exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
export const getMonthlyPlan = catchAsync(async (req, res, next) => {
  // try {
  const year = req.params.year * 1; //  *1 mache nummer

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', // für jeden termin ein seperates Dokument
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        }, //2021
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0, // 0 id nicht anzeigen, 1 = anzeigen in deb
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    {
      $limit: 6,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });

  // } catch (err) {
  //     res.status(404).json({
  //         status: 'fail',
  //         message: err
  //     })
  // }
});
