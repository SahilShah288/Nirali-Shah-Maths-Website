const axios = require("axios");

/**
 * POST enquiry data to the deployed Google Apps Script web app.
 * Requires process.env.GOOGLE_SCRIPT_URL (deployment URL, no query string required).
 */
async function postEnquiryToAppsScript(payload) {
  const baseUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!baseUrl) {
    throw new Error(
      "GOOGLE_SCRIPT_URL is not defined. Add your Apps Script web app URL to .env"
    );
  }

  const separator = baseUrl.includes("?") ? "&" : "?";
  const url = `${baseUrl}${separator}action=enquiry`;

  const response = await axios.post(url, payload, {
    headers: { "Content-Type": "application/json" },
    maxRedirects: 5,
    timeout: 30000,
    validateStatus: (status) => status >= 200 && status < 400,
  });

  const data = response.data;

  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return { success: true, raw: data };
    }
  }

  if (data && data.success === false) {
    throw new Error(data.error || data.message || "Google Script rejected the enquiry");
  }

  return data;
}

module.exports = { postEnquiryToAppsScript };
