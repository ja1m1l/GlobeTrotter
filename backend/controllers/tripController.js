const prisma = require('../utils/prisma');

/**
 * POST /api/trips
 * Create a new trip for authenticated user
 */
exports.createTrip = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, startDate, endDate, description, coverImage, location, cityId } = req.body;

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

    // Resolve cover image from City or Location name
    let resolvedCoverImage = coverImage || null;
    let matchingCity = null;

    if (cityId) {
      matchingCity = await prisma.city.findUnique({ where: { id: cityId } });
    } else if (location) {
      matchingCity = await prisma.city.findFirst({
        where: { name: { equals: location.trim(), mode: 'insensitive' } }
      });
      if (!matchingCity) {
        const cleanLoc = location.trim().split(',')[0].trim();
        matchingCity = await prisma.city.findFirst({
          where: { name: { equals: cleanLoc, mode: 'insensitive' } }
        });
      }
    }

    if (matchingCity && matchingCity.image) {
      resolvedCoverImage = matchingCity.image;
    } else if (location && !resolvedCoverImage) {
      const kw = location.toLowerCase();
      if (kw.includes("delhi")) resolvedCoverImage = "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500";
      else if (kw.includes("jaipur")) resolvedCoverImage = "https://images.unsplash.com/photo-1477584322902-471a5db55b36?w=500";
      else if (kw.includes("agra")) resolvedCoverImage = "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500";
      else if (kw.includes("kerala")) resolvedCoverImage = "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=500";
      else if (kw.includes("goa")) resolvedCoverImage = "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500";
      else if (kw.includes("mumbai")) resolvedCoverImage = "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=500";
      else if (kw.includes("paris")) resolvedCoverImage = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500";
      else if (kw.includes("london")) resolvedCoverImage = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500";
      else if (kw.includes("dubai")) resolvedCoverImage = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500";
      else if (kw.includes("tokyo")) resolvedCoverImage = "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=500";
      else if (kw.includes("sydney")) resolvedCoverImage = "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=500";
      else if (kw.includes("new york")) resolvedCoverImage = "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500";
    }

    // Create trip in database
    const trip = await prisma.trip.create({
      data: {
        userId,
        name: name.trim(),
        description: description ? description.trim() : null,
        startDate: start,
        endDate: end,
        coverImage: resolvedCoverImage,
      },
    });

    // If cityId or location text provided, add initial trip stop
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
        tripActivities: {
          include: {
            activity: true,
          },
          orderBy: { createdAt: 'desc' },
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
 * PUT /api/trips/:id
 * Update an existing trip
 */
exports.updateTrip = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { name, description, startDate, endDate, coverImage, maxBudget } = req.body;

    const trip = await prisma.trip.findFirst({
      where: { id, userId },
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or unauthorized.' });
    }

    const dataToUpdate = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (description !== undefined) dataToUpdate.description = description;
    if (coverImage !== undefined) dataToUpdate.coverImage = coverImage;
    if (maxBudget !== undefined && !isNaN(parseFloat(maxBudget))) dataToUpdate.maxBudget = parseFloat(maxBudget);

    if (startDate) {
      const s = new Date(startDate);
      if (!isNaN(s.getTime())) dataToUpdate.startDate = s;
    }
    if (endDate) {
      const e = new Date(endDate);
      if (!isNaN(e.getTime())) dataToUpdate.endDate = e;
    }

    const updated = await prisma.trip.update({
      where: { id },
      data: dataToUpdate,
    });

    return res.json({
      message: 'Trip updated successfully',
      trip: updated,
    });
  } catch (error) {
    console.error('Update trip error:', error);
    return res.status(500).json({ error: 'Internal server error updating trip.' });
  }
};

/**
 * DELETE /api/trips/:id
 * Delete a trip
 */
exports.deleteTrip = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const trip = await prisma.trip.findFirst({
      where: { id, userId }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or unauthorized.' });
    }

    await prisma.trip.delete({
      where: { id }
    });

    return res.json({ message: 'Trip deleted successfully' });

  } catch (error) {
    console.error('Delete trip error:', error);
    return res.status(500).json({ error: 'Internal server error deleting trip.' });
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
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or unauthorized.' });
    }

    await prisma.trip.delete({
      where: { id },
    });

    return res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    return res.status(500).json({ error: 'Internal server error deleting trip.' });
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

    await prisma.tripStop.delete({
      where: { id: stopId }
    });

    return res.json({ message: 'Stop removed from itinerary.' });
  } catch (error) {
    console.error('Error deleting trip stop:', error);
    return res.status(500).json({ error: 'Failed to remove stop.' });
  }
};
