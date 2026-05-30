const Enquiry = require("../models/Enquiry");
const { postEnquiryToAppsScript } = require("../config/googleAppsScript");

function normalizePhone(phone, countryCode) {
  const raw = String(phone || "").trim();
  if (!raw) return raw;

  if (raw.includes(" ")) {
    return raw;
  }

  const digits = raw.replace(/\D/g, "");
  const code = String(countryCode || "").trim();

  if (code && digits) {
    return `${code} ${digits.replace(/^\+/, "")}`;
  }

  return raw.startsWith("+") ? raw : `+${digits}`;
}

function buildAppsScriptPayload(enquiry, countryCode) {
  const code = String(countryCode || "").trim();
  const fullPhone = String(enquiry.phone || "").trim();

  return {
    name: enquiry.name,
    parentName: enquiry.name,
    phone: fullPhone,
    countryCode: code || enquiry.countryCode || "",
    mobile: fullPhone,
    country: enquiry.country,
    class: enquiry.class,
    board: enquiry.board,
    competitiveExams: enquiry.competitiveExams || [],
    timestamp: enquiry.timestamp
      ? enquiry.timestamp.toISOString()
      : new Date().toISOString(),
  };
}

/**
 * POST /api/enquiry
 * Persists enquiry in MongoDB and forwards to Google Apps Script web app.
 */
async function createEnquiry(req, res) {
  try {
    const {
      name,
      phone,
      countryCode,
      country,
      class: classGrade,
      board,
      competitiveExams,
    } = req.body;

    const phoneValue = normalizePhone(phone, countryCode);
    const codeValue = String(countryCode || "").trim();

    const enquiry = await Enquiry.create({
      name,
      phone: phoneValue,
      countryCode: codeValue,
      country,
      class: classGrade,
      board,
      competitiveExams: competitiveExams || [],
    });

    try {
      const scriptPayload = buildAppsScriptPayload(enquiry, codeValue);
      const scriptResult = await postEnquiryToAppsScript(scriptPayload);

      return res.status(201).json({
        success: true,
        message: "Enquiry saved to MongoDB and Google Apps Script",
        data: enquiry,
        scriptResult,
      });
    } catch (scriptError) {
      console.error("Google Apps Script sync failed:", scriptError.message);
      return res.status(207).json({
        success: true,
        warning:
          "Enquiry saved to database but failed to sync to Google Apps Script",
        data: enquiry,
        scriptError: scriptError.message,
      });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, errors: messages });
    }
    console.error("createEnquiry error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save enquiry",
    });
  }
}

/**
 * GET /api/enquiry (admin)
 * Returns all enquiries for the dashboard.
 */
async function getAllEnquiries(req, res) {
  try {
    const enquiries = await Enquiry.find().sort({ timestamp: -1 });
    return res.json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error("getAllEnquiries error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
    });
  }
}

/**
 * DELETE /api/enquiry (admin)
 * Removes all enquiries from MongoDB only (Google Sheet is not modified).
 */
async function deleteAllEnquiries(req, res) {
  try {
    const result = await Enquiry.deleteMany({});
    return res.json({
      success: true,
      message: "All enquiries deleted from MongoDB",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("deleteAllEnquiries error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete enquiries",
    });
  }
}

module.exports = { createEnquiry, getAllEnquiries, deleteAllEnquiries };
