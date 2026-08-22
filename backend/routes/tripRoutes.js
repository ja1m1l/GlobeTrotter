const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authMiddleware = require('../middleware/auth');

// All trip endpoints require authentication
router.use(authMiddleware);

router.get('/cities', tripController.getCities);
router.post('/', tripController.createTrip);
router.get('/:id', tripController.getTripById);
router.post('/:id/stops', tripController.addTripStop);
router.delete('/:id/stops/:stopId', tripController.deleteTripStop);

module.exports = router;
