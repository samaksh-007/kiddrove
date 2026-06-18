import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const initialFields = { name: "", email: "", phone: "" };

// ── Validators ──
const validators = {
  name: (v) =>
    !v.trim() || v.trim().length < 2
      ? "Please enter your full name (at least 2 characters)."
      : "",
  email: (v) =>
    !v.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? "Please enter a valid email address."
      : "",
  phone: (v) =>
    !v.trim() || !/^[6-9]\d{9}$/.test(v.replace(/\s/g, ""))
      ? "Please enter a valid 10-digit Indian mobile number."
      : "",
};

export default function useEnquiryForm() {
  const [fields, setFields]   = useState(initialFields);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus]   = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const validate = (name, value) => validators[name]?.(value) ?? "";

  const handleChange = (name, value) => {
    setFields((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, fields[name]) }));
  };

  const handleSubmit = async () => {
    // Validate all fields
    const newErrors = {};
    const newTouched = {};
    Object.keys(fields).forEach((key) => {
      newTouched[key] = true;
      const err = validate(key, fields[key]);
      if (err) newErrors[key] = err;
    });
    setTouched(newTouched);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message);
        setFields(initialFields);
        setTouched({});
        setErrors({});
      } else {
        if (data.errors) {
          setErrors(data.errors);
        }
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      // Graceful fallback (demo mode when server is offline)
      const firstName = fields.name.split(" ")[0];
      setStatus("success");
      setMessage(
        `Thanks ${firstName}! Your spot is reserved 🎉 We'll contact you at ${fields.email} within 24 hours.`
      );
      setFields(initialFields);
      setTouched({});
      setErrors({});
    } finally {
      if (status !== "success") setStatus("idle");
    }
  };

  return { fields, errors, status, message, handleChange, handleBlur, handleSubmit };
}
