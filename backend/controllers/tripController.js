const prisma = require('../utils/prisma');

/**
 * POST /api/trips
 * Create a new trip for authenticated user
 */
exports.createTrip = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, startDate, endDate, description, coverImage, location, cityId } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Trip name is required.' });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid start date or end date format.' });
    }

    if (start > end) {
      return res.status(400).json({ error: 'End date cannot be earlier than start date.' });
    }

    // Create trip in database
    const trip = await prisma.trip.create({
      data: {
        userId,
        name: name.trim(),
        description: description ? description.trim() : null,
        startDate: start,
        endDate: end,
        coverImage: coverImage || null,
      },
    });

    // If a city/location was selected during trip creation, create initial trip stop
    if (cityId) {
      const cityExists = await prisma.city.findUnique({ where: { id: cityId } });
      if (cityExists) {
        await prisma.tripStop.create({
          data: {
            tripId: trip.id,
            cityId: cityExists.id,
          },
        });
      }
    } else if (location) {
      // Find matching city by name if provided as text
      const matchingCity = await prisma.city.findFirst({
        where: { name: { equals: location.trim(), mode: 'insensitive' } },
      });

      if (matchingCity) {
        await prisma.tripStop.create({
          data: {
            tripId: trip.id,
            cityId: matchingCity.id,
          },
        });
      }
    }

    return res.status(201).json({
      message: 'Trip created successfully',
      trip,
    });
  } catch (error) {
    console.error('Error creating trip:', error);
    return res.status(500).json({ error: 'Failed to create trip.' });
  }
};

/**
 * GET /api/trips/:id
 * Get trip details by ID
 */
exports.getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const trip = await prisma.trip.findFirst({
      where: { id, userId },
      include: {
        tripStops: {
          include: {
            city: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }

    return res.json({ trip });
  } catch (error) {
    console.error('Error fetching trip:', error);
    return res.status(500).json({ error: 'Failed to fetch trip details.' });
  }
};

/**
 * POST /api/trips/:id/stops
 * Add a stop/city to a trip itinerary
 */
exports.addTripStop = async (req, res) => {
  try {
    const { id: tripId } = req.params;
    const userId = req.user.userId;
    const { cityId, cityName } = req.body;

    // Verify trip ownership
    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId } });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or unauthorized.' });
    }

    let targetCityId = cityId;

    if (!targetCityId && cityName) {
      let city = await prisma.city.findFirst({
        where: { name: { equals: cityName.trim(), mode: 'insensitive' } },
      });

      if (!city) {
        // Create city if it doesn't exist
        city = await prisma.city.create({
          data: {
            name: cityName.trim(),
            country: 'Global',
            region: 'Global',
          },
        });
      }
      targetCityId = city.id;
    }

    if (!targetCityId) {
      return res.status(400).json({ error: 'City ID or City Name is required.' });
    }

    const tripStop = await prisma.tripStop.create({
      data: {
        tripId,
        cityId: targetCityId,
      },
      include: {
        city: true,
      },
    });

    return res.status(201).json({ message: 'Stop added to itinerary', tripStop });
  } catch (error) {
    console.error('Error adding trip stop:', error);
    return res.status(500).json({ error: 'Failed to add stop to itinerary.' });
  }
};

/**
 * DELETE /api/trips/:id/stops/:stopId
 * Remove a stop from a trip itinerary
 */
exports.deleteTripStop = async (req, res) => {
  try {
    const { id: tripId, stopId } = req.params;
    const userId = req.user.userId;

    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId } });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or unauthorized.' });
    }

    await prisma.tripStop.delete({ where: { id: stopId } });

    return res.json({ message: 'Stop removed from itinerary.' });
  } catch (error) {
    console.error('Error deleting trip stop:', error);
    return res.status(500).json({ error: 'Failed to remove stop.' });
  }
};

/**
 * GET /api/trips/cities
 * Fetch list of destination cities
 */
exports.getCities = async (req, res) => {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { name: 'asc' },
    });
    return res.json({ cities });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return res.status(500).json({ error: 'Failed to fetch cities.' });
  }
};
