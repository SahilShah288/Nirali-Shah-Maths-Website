const Slot = require("../models/Slot");

/**
 * GET /api/slots
 */
async function getAllSlots(req, res) {
  try {
    const slots = await Slot.find().sort({ date: 1, time: 1 });
    return res.json({ success: true, count: slots.length, data: slots });
  } catch (error) {
    console.error("getAllSlots error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch slots",
    });
  }
}

/**
 * POST /api/slots/book
 * Body: { slotId, studentName }
 */
async function bookSlot(req, res) {
  try {
    const { slotId, studentName } = req.body;

    if (!slotId) {
      return res.status(400).json({
        success: false,
        message: "slotId is required",
      });
    }

    if (!studentName || !String(studentName).trim()) {
      return res.status(400).json({
        success: false,
        message: "studentName is required to book a slot",
      });
    }

    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }

    if (slot.isBooked) {
      return res.status(409).json({
        success: false,
        message: "This slot is already booked",
      });
    }

    slot.isBooked = true;
    slot.studentName = String(studentName).trim();
    await slot.save();

    return res.json({
      success: true,
      message: "Slot booked successfully",
      data: slot,
    });
  } catch (error) {
    console.error("bookSlot error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to book slot",
    });
  }
}

/**
 * POST /api/slots/admin
 * Body: { date, time } — ISO date string and HH:mm time
 */
async function createSlot(req, res) {
  try {
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: "date and time are required",
      });
    }

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "date must be a valid ISO date string",
      });
    }

    const slot = await Slot.create({
      date: parsedDate,
      time: String(time).trim(),
      isBooked: false,
      studentName: null,
    });

    return res.status(201).json({
      success: true,
      message: "Slot created",
      data: slot,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A slot already exists for this date and time",
      });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, errors: messages });
    }
    console.error("createSlot error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create slot",
    });
  }
}

/**
 * DELETE /api/slots/:id
 */
async function deleteSlot(req, res) {
  try {
    const slot = await Slot.findByIdAndDelete(req.params.id);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }

    return res.json({
      success: true,
      message: "Slot deleted",
      data: slot,
    });
  } catch (error) {
    console.error("deleteSlot error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete slot",
    });
  }
}

/**
 * PATCH /api/slots/:id
 * Body may include: date, time, isBooked, studentName
 * Pass resetBooking: true to clear booking without deleting the slot.
 */
async function updateSlot(req, res) {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }

    const { date, time, isBooked, studentName, resetBooking } = req.body;

    if (resetBooking === true) {
      slot.isBooked = false;
      slot.studentName = null;
    } else {
      if (date !== undefined) {
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "date must be a valid ISO date string",
          });
        }
        slot.date = parsedDate;
      }
      if (time !== undefined) slot.time = String(time).trim();
      if (isBooked !== undefined) slot.isBooked = Boolean(isBooked);
      if (studentName !== undefined) {
        slot.studentName = studentName ? String(studentName).trim() : null;
      }
    }

    await slot.save();

    return res.json({
      success: true,
      message: "Slot updated",
      data: slot,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A slot already exists for this date and time",
      });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, errors: messages });
    }
    console.error("updateSlot error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update slot",
    });
  }
}

module.exports = {
  getAllSlots,
  bookSlot,
  createSlot,
  deleteSlot,
  updateSlot,
};
