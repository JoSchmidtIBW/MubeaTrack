import express from 'express';

import {
  aliasTopMachinery,
  createMachine,
  deleteMachine,
  getMachine,
  getAllMachinery,
  getMachineStats,
  updateMachine,
  uploadMachineImages,
  resizeMachineImages,
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

const router = express.Router();

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

router
  .route('/')
  .get(getAllMachinery) // hier möchte man keine protect
  .post(protect, restrictTo('admin', 'lead-guide'), createMachine);

router
  .route('/:id')
  .get(getMachine) //Kostenlos für jederman
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadMachineImages,
    resizeMachineImages,
    updateMachine
  )
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteMachine);

export default router;
