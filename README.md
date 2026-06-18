# 🤖 AI & Robotics Summer Workshop — Kidrove

A responsive workshop landing page built with **React.js** (Vite) + **Express.js**, for Kidrove's AI & Robotics Summer Workshop for kids aged 8–14.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+

### Install everything
```bash
npm run install:all
```

### Run both client + server in dev mode
```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:4000 |

---

## 📁 Project Structure

```
kidrove-workshop/
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── WorkshopDetails.jsx
│   │   │   ├── LearningOutcomes.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── RegistrationForm.jsx
│   │   │   └── Footer.jsx
│   │   ├── hooks/
│   │   │   └── useEnquiryForm.js   # Form state, validation, API call
│   │   └── App.jsx
│   └── index.html                  # Standalone demo (open directly)
├── server/
│   └── index.js                    # Express API
└── README.md
```

---

## 🔌 API

### `POST /api/enquiry`

Accepts registration form data, validates all fields, and returns a success/error response.

**Request body:**
```json
{
  "name": "Aarav Sharma",
  "email": "parent@email.com",
  "phone": "9876543210"
}
```

**Success response (201):**
```json
{
  "success": true,
  "message": "Thanks Aarav! You're registered. We'll reach you at parent@email.com shortly.",
  "data": { "id": "1718700000000", "registeredAt": "2026-06-18T10:00:00.000Z" }
}
```

**Validation error response (400):**
```json
{
  "success": false,
  "message": "Validation failed. Please fix the errors below.",
  "errors": {
    "phone": "A valid 10-digit Indian phone number is required."
  }
}
```

### `GET /api/health`
Returns server status and total registrations count.

---

## ✨ Features

- **Hero section** with animated gradient blobs, headline, description, and Enroll CTA
- **Workshop Details** — 5 detail cards (age group, duration, mode, fee, start date)
- **6 Learning Outcomes** with numbered grid layout
- **5 FAQ accordion items** with smooth open/close animation
- **Registration Form** with:
  - Inline validation on blur + real-time error clearing
  - Loading state with spinner
  - Success/error banners
  - Graceful demo mode when API is offline
- **Fully responsive** down to mobile (375px)
- **Accessible** — keyboard navigable, proper ARIA labels on FAQ accordion

---

## 📝 Submission Note

**Approach:** I treated the page as a product hero for a kids' learning brand — energetic but not chaotic. The design uses a dark hero with violet/coral/mint blobs to feel modern and tech-forward, while the card-based detail section keeps information scannable for parents making a purchasing decision. The form uses a custom React hook (`useEnquiryForm`) to keep logic separate from the UI, and falls back to a demo confirmation gracefully when the server isn't running.

**Improvements with more time:**
- Add MongoDB with Mongoose for persistent storage and an admin dashboard
- Full TypeScript migration across both client and server
- Tailwind CSS for utility-first styling consistency
- Add Razorpay/Stripe payment integration for direct fee collection
- Email confirmation via Nodemailer after successful registration
- Deploy client to Vercel and server to Railway/Render with CI/CD
- Stagger animations on scroll using Intersection Observer for the outcomes grid

---

Built with ❤️ for Kidrove.
