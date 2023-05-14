import express from 'express';

import {
  aliasTopMachinery,
  createMachine,
  deleteMachine,
  getMachine,
  getMachinery,
  getMachineStats,
  updateMachine,
  uploadMachineImages,
  resizeMachineImages,
  getMachineryASMA,
  createSectorASMA,
  updateSectorASMA,
  deleteSectorASMA,
  createComponentASMA,
  updateComponentASMA,
  deleteComponentASMA,
} from '../controllers/machineController.mjs';

import {
  signup,
  login,
  logout,
  protect,
  isLoggedIn,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controllers/authController.mjs';
import {
  deleteUser,
  getUser,
  updateUser,
} from '../controllers/userController.mjs';

//const router = express.Router();
const router = express.Router({ mergeParams: true });

//video159
//router.use('/:tourId/reviews', reviewRouter); // muss oben sein     mointing a router       der reviewrouter braucht aber noch die tourId
//router.use('/:machineId', getTour);
//param mittleware      tour id is 5  --> http://127.0.0.1:4301/api/v1/tours/5      check id, sonst fail
// router.param('id', (req, res, next, val) => {
//     //console.log(`tour- id is: ${val}`)

//     // if (req.params.id * 1 > tours.length) {
//     //     res.status(404).json({ status: 'fail', message: 'Invalid ID' })
//     // }

//     next();
// })

//router.param('id', tourController.checkID)

// checkbody mittdleware for post   dort müssen auch daten validiert werden
// check name   if not, send 400 (bad request)
// router
//     .route('/')
//     .get(tourController.getAllTours)
//     .post(tourController.checkBody, tourController.createTour);

// implementieren einer route, wo zuerst der Durchschnitt und danach nach price sortiert wird
//http://127.0.0.1:4301/api/v1/tours?limit=5&sort=-ratingsAverage,price
//http://127.0.0.1:4301/api/v1/tours/top-5-cheap
//router.route('/top-5-cheap').get(aliasTopTours, getAllTours); // middleware, welche getalltours nutzt, aber mit funktion aliasTopTours

//http://127.0.0.1:4301/api/v1/tours/tour-stats
router.route('/machine-stats').get(getMachineStats);

router.route('/').get(getMachinery); // hier möchte man keine protect
router
  .route('/machineryASMA')
  .get(protect, restrictTo('admin'), getMachineryASMA);
//.post(protect, restrictTo('admin', 'lead-guide'), createMachine);

router
  .route('/createSectorASMA/:id')
  .patch(protect, restrictTo('admin'), createSectorASMA);

router
  .route('/:machineID/updateSectorASMA/:sectorASMAID')
  .patch(protect, restrictTo('admin'), updateSectorASMA)
  .delete(protect, restrictTo('admin'), deleteSectorASMA);

router
  .route('/createSectorASMA/:machineID/createComponent/:sectorASMAID') //createSectorASMA/${machineId}/createComponent/${sectorASMAID}
  .patch(protect, restrictTo('admin'), createComponentASMA);

router // `${apiUrl}/machinery/${machineID}/${sectorASMAID}/updateComponentASMA/${componentASMAID}`, // +
  .route('/:machineID/:sectorASMAID/updateComponentASMA/:componentASMAID')
  .patch(protect, restrictTo('admin'), updateComponentASMA)
  .delete(protect, restrictTo('admin'), deleteComponentASMA);

router
  .route('/createMachine')
  .post(protect, restrictTo('admin', 'lead-guide'), createMachine);

// router
//   .route('/:id')
//   .get(getMachine) //Kostenlos für jederman
//   .patch(protect, restrictTo('admin'), updateMachine)
//   .delete(protect, restrictTo('admin'), deleteMachine);

router
  .route('/:id')
  .get(protect, getMachine)
  .patch(updateMachine)
  .delete(deleteMachine);

export default router;
