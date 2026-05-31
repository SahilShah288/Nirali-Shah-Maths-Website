import { useState } from "react";
import { Phone } from "lucide-react";
import { submitEnquiry } from "../api/enquiryApi";
import {
  BOARDS,
  CLASSES,
  COUNTRIES,
  EXAMS,
  PHONE_COUNTRY_CODES,
} from "../constants/formOptions";
import SplitText from "../components/SplitText";
import {
  formatFullPhone,
  isValidLocalPhone,
  sanitizePhoneDigits,
} from "../utils/phone";

const initialForm = {
  name: "",
  countryCode: "+91",
  phone: "",
  country: "",
  class: "",
  board: "",
  competitiveExams: [],
};

export default function EnquiryPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    if (field === "phone") {
      setForm((prev) => ({ ...prev, phone: sanitizePhoneDigits(value) }));
      return;
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleExam = (exam) => {
    setForm((prev) => ({
      ...prev,
      competitiveExams: prev.competitiveExams.includes(exam)
        ? prev.competitiveExams.filter((e) => e !== exam)
        : [...prev.competitiveExams, exam],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const localPhone = sanitizePhoneDigits(form.phone);
    if (!localPhone) {
      setError("Phone number is required.");
      return;
    }
    if (!isValidLocalPhone(localPhone)) {
      setError("Please enter a valid phone number (7–12 digits).");
      return;
    }

    const fullPhone = formatFullPhone(form.countryCode, localPhone);

    setLoading(true);

    try {
      await submitEnquiry({
        name: form.name.trim(),
        phone: fullPhone,
        countryCode: form.countryCode,
        country: form.country,
        class: Number(form.class),
        board: form.board,
        competitiveExams: form.competitiveExams,
      });
      setSubmitted(true);
      setForm(initialForm);
    } catch (err) {
      const msg =
        err.response?.data?.errors?.join(" ") ||
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="mx-auto max-w-lg animate-fade-in">
        <div className="premium-card text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl text-emerald-600 ring-1 ring-emerald-100">
            ✓
          </div>
          <h2 className="font-display text-2xl font-semibold text-midnight sm:text-3xl">
            Thank you! Nirali Shah will contact you shortly.
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            We have received your enquiry and will be in touch soon.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="btn-secondary mt-8"
          >
            Submit another enquiry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-12">
      <div className="page-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cerulean">
          Parent enquiry
        </p>
        <SplitText
          tag="h2"
          text="Start your maths journey"
          className="mx-auto mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight text-midnight sm:text-5xl"
          delay={80}
          duration={0.65}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 36 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.15}
          rootMargin="-80px"
          textAlign="center"
        />
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Tell us about your child&apos;s learning needs. Expert tuition for
          Classes 4–12 across CBSE, ICSE, IB, IGCSE, and State boards.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="premium-card animate-fade-in mx-auto max-w-2xl space-y-7"
      >
        {error && (
          <div
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </div>
        )}

        <div>
          <label htmlFor="enquiry-name" className="premium-label">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="enquiry-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="premium-input"
            placeholder="Parent or student name"
          />
        </div>

        <div>
          <label
            htmlFor="enquiry-phone"
            className="premium-label flex items-center gap-2"
          >
            <Phone className="h-4 w-4 text-cerulean" aria-hidden />
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="phone-input-group">
            <select
              id="enquiry-country-code"
              value={form.countryCode}
              onChange={(e) => handleChange("countryCode", e.target.value)}
              aria-label="Country code"
            >
              {PHONE_COUNTRY_CODES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
            <input
              id="enquiry-phone"
              type="tel"
              required
              inputMode="numeric"
              autoComplete="tel-national"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="9876543210"
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Select your country code, then enter your mobile number (digits only).
          </p>
        </div>

        <div className="grid gap-7 sm:grid-cols-2">
          <div>
            <label htmlFor="enquiry-country" className="premium-label">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              id="enquiry-country"
              required
              value={form.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="premium-input"
            >
              <option value="">Select country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="enquiry-class" className="premium-label">
              Class <span className="text-red-500">*</span>
            </label>
            <select
              id="enquiry-class"
              required
              value={form.class}
              onChange={(e) => handleChange("class", e.target.value)}
              className="premium-input"
            >
              <option value="">Select class</option>
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  Class {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="enquiry-board" className="premium-label">
            Board <span className="text-red-500">*</span>
          </label>
          <select
            id="enquiry-board"
            required
            value={form.board}
            onChange={(e) => handleChange("board", e.target.value)}
            className="premium-input"
          >
            <option value="">Select board</option>
            {BOARDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="rounded-2xl border border-slate-100 bg-ghost p-5">
          <legend className="premium-label px-1">
            Competitive exams{" "}
            <span className="font-normal text-slate-500">(optional)</span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {EXAMS.map((exam) => {
              const selected = form.competitiveExams.includes(exam);
              return (
                <label
                  key={exam}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    selected
                      ? "border-cerulean bg-white text-midnight shadow-sm ring-2 ring-blue-100"
                      : "border-slate-200 bg-white text-slate-600 hover:border-cerulean/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleExam(exam)}
                    className="h-4 w-4 rounded border-slate-300 text-cerulean focus:ring-cerulean"
                  />
                  {exam}
                </label>
              );
            })}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-4"
        >
          {loading ? "Submitting…" : "Submit Enquiry"}
        </button>
      </form>
    </section>
  );
}
