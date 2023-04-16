import express from 'express';

//import tourController from '../controllers/tourController.mjs';
import {
  aliasTopTours,
  getToursWithin,
  getDistances,
  createTour,
  deleteTour,
  getTour,
  getAllTours,
  getTourStats,
  updateTour,
  getMonthlyPlan,
} from '../controllers/tourController.mjs';
//import authController from '../controllers/authController.mjs';
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
//import catchAsync from '../utils/catchAsync.mjs';

//const reviewController = require('../controllers/reviewController')
//const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();

//video159
//router.use('/:tourId/reviews', reviewRouter); // muss oben sein     mointing a router       der reviewrouter braucht aber noch die tourId
router.use('/:tourId', getTour);
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
router.route('/top-5-cheap').get(aliasTopTours, getAllTours); // middleware, welche getalltours nutzt, aber mit funktion aliasTopTours

//http://127.0.0.1:4301/api/v1/tours/tour-stats
router.route('/tour-stats').get(getTourStats);

//http://127.0.0.1:4301/api/v1/tours/monthly-plan/
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

//video 171// unit = km oder miles
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

// video 172
router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/')
  .get(getAllTours) // hier möchte man keine protect
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

// router
//     .route('/')
//     .get(catchAsync(tourController.getAllTours))// könnte hier machen, anstatt bei tourcontroller... aber dann nicht weiss, welche async sind und welche nicht
//     .post(tourController.createTour);

router
  .route('/:id')
  .get(getTour) //Kostenlos für jederman
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

//video 158 nestet rout, user in review sollte eingeloggt sein, tour die current tour
// url   POST tour/233444idTour/reviews     das ist eine nestet route       reviews ist ein child von tours, sieht man in url
// GET tour/233444idTour/reviews
//GET tour/233444idTour/reviews/9985IDreviews
//router.route('/:tourId/reviews').post(authController.protect, authController.restrictTo('user'), reviewController.createReview)
// weil die route mit tour startet, obwohl kein sinn, reviewcontroller in tourRoutes

//module.exports = router;
export default router;
