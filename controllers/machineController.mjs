import multer from 'multer';
import sharp from 'sharp';

import Machine from '../models/machineModel.mjs';
import MalReport from '../models/malReportModel.mjs';

import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync.mjs';

import AppError from '../utils/appError.mjs';

import {
  getOne,
  updateOne,
  deleteOne,
} from '../controllers/handlerFactory.mjs';

// right here on the top
const multerStorage = multer.memoryStorage(); // Stored as a buffer

// This filter only allows the upload of images
// test if uploaded file is an image, when true, --> cb (callBack) = filename and destination
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    //mimetype: 'image/jpeg',
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false); // 400 bad request, (null(error), false)
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
    .jpeg({ quality: 90 }) //90=90%
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

// 2. route handlers
export const getMachine = getOne(Machine);
export const updateMachine = updateOne(Machine);
export const deleteMachine = deleteOne(Machine);

export const getMachinery = catchAsync(async (req, res, next) => {
  console.log('bin getMachinery');

  const machinery = await Machine.find().select('+createdAt');

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

  // eslint-disable, because "" and ESlind '""'... (selectedRunID.length === '""') {  //const componentDetailID = mongoose.Types.ObjectId(selectedIdsArr);
  if (selectedRunID.length === 2) {
    console.log('es wurde keine selectedRunID angewählt: ' + selectedRunID);
  } else {
    console.log('selectedRunID selectedRunID ist nicht leer: ' + selectedRunID);

    try {
      await Machine.updateOne({ _id: machineID }, { statusRun: false });
      console.log(
        `statusRun für machine mit ID ${machineID} erfolgreich auf false gesetzt.`
      );

      const machine = await Machine.findById({ _id: machineID });

      const malReport = new MalReport({
        user_Mal: currentUserID,
        nameMachine_Mal: machine.name,
        idMachine_Mal: machineID,
        nameSector_Mal: '-',
        idSector_Mal: '-',
        nameComponent_de_Mal: '-',
        nameComponent_en_Mal: '-',
        idComponent_Mal: '-',
        nameComponentDetail_de_Mal: '-',
        nameComponentDetail_en_Mal: '-',
        idComponentDetail_Mal: '-',
        statusRun_Mal: false,
        statusOpenClose_Mal: 'open',
        estimatedStatus: 0,
        logFal_Repair: [
          {
            Status_Repair: 0,
            messageProblem_de_Repair: '-',
            messageProblem_en_Repair: '-',
            messageMission_de_Repair: '-',
            messageMission_en_Repair: '-',
            estimatedTime_Repair: '-',
            isElectroMechanical_Repair: 'elekt.-mech',
          },
        ],
      });
      await malReport.save();
    } catch (error) {
      console.error(
        `Fehler beim Setzen von statusRun für machine mit ID ${machineID}:`,
        error
      );
    }
  }

  if (selectedIdsArr.length === 0) {
    console.log('es wurde keine selectedIdsArr angewählt!');
  } else {
    // detail.status set to false
    console.log('es gibt eine oder mehrere componentDetailIds');
    console.log('selectedIdsArr: ' + selectedIdsArr);
    console.log('machineID: ' + machineID);

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
    } catch (error) {
      console.error('Fehler beim Suchen der Komponenten-Detail:', error);
    }

    // Write in MalReport
    const machine = await Machine.findById(machineID);
    if (machine) {
      for (const selectedId of selectedIdsArr) {
        const componentDetailID = selectedId;
        const componentInfo = await findComponentDetailInfo(
          machineID,
          componentDetailID
        );

        if (componentInfo) {
          console.log('SectorASMA Name:', componentInfo.sectorASMAName);
          console.log('SectorASMA ID:', componentInfo.sectorASMAID);
          console.log('component ID:', componentInfo.componentID);
          console.log('componentDetail ID:', componentInfo.componentDetailID);
          console.log(
            'Component Name (name_de):',
            componentInfo.componentNameDE
          );
          console.log(
            'Component Name (name_en):',
            componentInfo.componentNameEN
          );
          console.log(
            'Component Detail Name (name_de):',
            componentInfo.componentDetailNameDE
          );
          console.log(
            'Component Detail Name (name_en):',
            componentInfo.componentDetailNameEN
          );

          const malReport = new MalReport({
            user_Mal: currentUserID,
            nameMachine_Mal: machine.name,
            idMachine_Mal: machineID,
            nameSector_Mal: componentInfo.sectorASMAName,
            idSector_Mal: componentInfo.sectorASMAID,
            nameComponent_de_Mal: componentInfo.componentNameDE,
            nameComponent_en_Mal: componentInfo.componentNameEN,
            idComponent_Mal: componentInfo.componentID,
            nameComponentDetail_de_Mal: componentInfo.componentDetailNameDE,
            nameComponentDetail_en_Mal: componentInfo.componentDetailNameEN,
            idComponentDetail_Mal: componentInfo.componentDetailID,
            statusRun_Mal: true,
            statusOpenClose_Mal: 'open',
            estimatedStatus: 0,
            logFal_Repair: [
              {
                Status_Repair: 0,
                messageProblem_de_Repair: '-',
                messageProblem_en_Repair: '-',
                messageMission_de_Repair: '-',
                messageMission_en_Repair: '-',
                estimatedTime_Repair: '-',
                isElectroMechanical_Repair: 'elekt.-mech',
              },
            ],
          });
          await malReport.save();
          console.log(
            'MalReport erfolgreich erstellt für componentDetail: ' +
              componentInfo.componentDetailNameDE
          );
        }
      }
    } else {
      console.log('Machine nicht gefunden.');
    }
  }

  res.status(200).json({
    status: 'success',
    message: 'ASMAMachine succefully updated!',
  });
});

async function findComponentDetailInfo(machineID, componentDetailID) {
  try {
    const machine = await Machine.findById(machineID);

    for (const sector of machine.sectorASMA) {
      for (const component of sector.components) {
        const componentDetail = component.componentDetails.find(
          (detail) => detail._id.toString() === componentDetailID
        );
        if (componentDetail) {
          return {
            sectorASMAName: sector.name,
            sectorASMAID: sector._id,
            componentNameDE: component.name_de,
            componentNameEN: component.name_en,
            componentID: component._id,
            componentDetailNameDE: componentDetail.name_de,
            componentDetailNameEN: componentDetail.name_en,
            componentDetailID: componentDetail._id,
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Fehler beim Suchen des Component Details:', error);
    return null;
  }
}

export const createMachine = catchAsync(async (req, res) => {
  console.log('bin createMachine');

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
    department: req.body.department,
    statusRun: true,
    employees: [],
    employeesCount: 0,
  };

  const newMachine = new Machine(machineData);
  await newMachine.save();

  res.status(200).json({
    status: 'success',
    message: 'A new machine is successfully created!',
  });
});

export const getMachineryASMA = catchAsync(async (req, res, next) => {
  const machinery = await Machine.find();
  res.status(200).json({
    status: 'success',
    data: {
      data: machinery,
    },
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
    message: `New componentDetail has been successfully added to the machine ${machine.name}, with sectorASMA ${sectorASMA.name} and component ${componentASMA.name_de}: ${componentDetailASMA_New}`,
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
    componentDetails: [], //componentDetails are empty yet
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
  const sectorASMAName = sectorASMA ? sectorASMA.name : 'Unbekannt';

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

  console.log('machineID: ' + req.params.machineID);
  console.log('sectorASMAID: ' + req.params.sectorASMAID);
  console.log('componentASMAID: ' + req.params.componentASMAID);
  console.log('componentDetailASMAID: ' + req.params.componentDetailASMAID);
  const machineID = req.params.machineID;
  const sectorASMAID = req.params.sectorASMAID;
  const componentASMAID = req.params.componentASMAID;
  const componentDetailASMAID = req.params.componentDetailASMAID;

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
  );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const deleteComponentASMA = catchAsync(async (req, res, next) => {
  console.log('bin deleteComponentASMA');

  console.log('machineID: ' + req.params.machineID);
  console.log('sectorASMAID: ' + req.params.sectorASMAID);
  console.log('sectorASMAID: ' + req.params.componentASMAID);
  const machineID = req.params.machineID;
  const sectorASMAID = req.params.sectorASMAID;
  const componentASMAID = req.params.componentASMAID;

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
  );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const createSectorASMA = catchAsync(async (req, res, next) => {
  console.log('bin createSectorASMA');

  const machineSectorASMAData = {
    name: req.body.sectionName,
    description_de: req.body.sectionDescription_de,
    description_en: req.body.sectionDescription_en,
    components: [], // Components are empty yet
  };

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
  );

  res.status(200).json({
    status: 'success',
    message: 'erfolgreich',
  });
});

export const deleteSectorASMA = catchAsync(async (req, res, next) => {
  console.log(req);

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
