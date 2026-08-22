const prisma = require('../utils/prisma');

/**
 * POST /api/trips
 * Create a new trip
 */
exports.createTrip = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, description, startDate, endDate, coverImage, cityId } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Trip name is required.' });
    }

    // Try parsing dates, fallback to reasonable defaults if invalid/missing
    let parsedStart = new Date();
    let parsedEnd = new Date(Date.now() + 7 * 24 * 3600 * 1000); // Default 7 days trip

    if (startDate) {
      const s = new Date(startDate);
      if (!isNaN(s.getTime())) parsedStart = s;
    }
    if (endDate) {
      const e = new Date(endDate);
      if (!isNaN(e.getTime())) parsedEnd = e;
    }

    // Create the trip
    const trip = await prisma.trip.create({
      data: {
        userId,
        name,
        description: description || null,
        startDate: parsedStart,
        endDate: parsedEnd,
        coverImage: coverImage || null
      }
    });

    // If cityId is provided, link it to the trip via TripStop
    if (cityId) {
      const city = await prisma.city.findUnique({ where: { id: cityId } });
      if (city) {
        await prisma.tripStop.create({
          data: {
            tripId: trip.id,
            cityId: city.id
          }
        });
      }
    }

    return res.status(201).json({
      message: 'Trip created successfully',
      trip
    });

  } catch (error) {
    console.error('Create trip error:', error);
    return res.status(500).json({ error: 'Internal server error creating trip.' });
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
    const { name, description, startDate, endDate, coverImage } = req.body;

    const trip = await prisma.trip.findFirst({
      where: { id, userId }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or unauthorized.' });
    }

    const dataToUpdate = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (description !== undefined) dataToUpdate.description = description;
    if (coverImage !== undefined) dataToUpdate.coverImage = coverImage;

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
      data: dataToUpdate
    });

    return res.json({
      message: 'Trip updated successfully',
      trip: updated
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
