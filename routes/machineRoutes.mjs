import express from 'express';

import {
  createMachine,
  deleteMachine,
  getMachine,
  getMachinery,
  updateMachine,
  getMachineryASMA,
  createSectorASMA,
  updateSectorASMA,
  deleteSectorASMA,
  createComponentASMA,
  updateComponentASMA,
  deleteComponentASMA,
  createComponentDetailASMA,
  updateComponentDetailASMA,
  deleteComponentDetailASMA,
  updateASMAMachine,
} from '../controllers/machineController.mjs';

import { protect, restrictTo } from '../controllers/authController.mjs';

const router = express.Router({ mergeParams: true });

router.route('/').get(getMachinery); // No protect

router
  .route('/createMachine')
  .post(protect, restrictTo('admin', 'Chef'), createMachine);

router
  .route('/machineryASMA')
  .get(protect, restrictTo('admin', 'Chef'), getMachineryASMA);

router
  .route('/updateASMAMachine/:machineID')
  .patch(
    protect,
    restrictTo('admin', 'Chef', 'user', 'Schichtleiter'),
    updateASMAMachine
  );

router
  .route('/createSectorASMA/:id')
  .patch(protect, restrictTo('admin', 'Chef'), createSectorASMA);

router
  .route('/:machineID/updateSectorASMA/:sectorASMAID')
  .patch(protect, restrictTo('admin', 'Chef'), updateSectorASMA)
  .delete(protect, restrictTo('admin', 'Chef'), deleteSectorASMA);

router
  .route('/createSectorASMA/:machineID/createComponent/:sectorASMAID')
  .patch(protect, restrictTo('admin', 'Chef'), createComponentASMA);

router
  .route('/:machineID/:sectorASMAID/updateComponentASMA/:componentASMAID')
  .patch(protect, restrictTo('admin', 'Chef'), updateComponentASMA)
  .delete(protect, restrictTo('admin', 'Chef'), deleteComponentASMA);

router
  .route(
    '/createSectorASMA/:machineID/:sectorASMAID/createComponentDetail/:componentASMAID'
  )
  .patch(protect, restrictTo('admin', 'Chef'), createComponentDetailASMA);

router
  .route(
    '/:machineID/:sectorASMAID/:componentASMAID/updateComponentDetailASMA/:componentDetailASMAID'
  )
  .patch(protect, restrictTo('admin', 'Chef'), updateComponentDetailASMA)
  .delete(protect, restrictTo('admin', 'Chef'), deleteComponentDetailASMA);

router
  .route('/:id')
  .get(protect, getMachine)
  .patch(protect, restrictTo('admin', 'Chef'), updateMachine)
  .delete(protect, restrictTo('admin', 'Chef'), deleteMachine);

export default router;
