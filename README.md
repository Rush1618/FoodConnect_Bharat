# 🍛 FoodConnect Bharat

> **"Not just hunger — we solve cultural compatibility too."**
>
> A real-time, map-based food redistribution platform built for India — connecting donors, bhandaras, NGOs, volunteers, and people in need while respecting dietary preferences and ensuring dignity.

---

## 👥 Team Name & Members

| Name | Role | GitHub ID |
|------|------|-----------|
| Rushabh Singh | Full Stack Developer | [@rush1618](https://github.com/rush1618) |
| Pallavi Pathak | Tester | [@pallavipthk](https://github.com/pallavipthk) |



---

## 🎯 Problem Statement

Every day in India:
- **40% of food** produced goes to waste (FSSAI data)
- Weddings, bhandaras, and events discard tonnes of cooked food
- People in need exist within the same 2km radius — but there is **no bridge**
- Existing platforms ignore **dietary needs** (Jain, Veg, Non-veg) — causing food rejection

The result: food waste and hunger coexist, side by side.

---

## 💡 Our Solution

**FoodConnect Bharat** is a live map platform where:
- **Donors** pin surplus food with type, quantity, and expiry urgency
- **Needers** filter by dietary preference and request anonymously
- **Volunteers/NGOs** get pickup → delivery routing tasks
- **Bhandara organizers** broadcast live free food events on the map

Every pin is tagged Veg / Jain / Non-veg. Every request is matched by dietary compatibility. Every delivery is tracked to completion.

---

## ✨ Key Features

### Core Features (Built)
| Feature | Description |
|--------|-------------|
| 🗺️ Live Map | Real-time food pins using Leaflet.js — color coded by dietary type |
| 👤 Role Selection | Donor / Needer / Volunteer — switch anytime |
| 🥗 Dietary Filter | Veg · Jain · Non-veg — smart matching (Jain users only see Jain food) |
| 🍛 Bhandara Mode | Special flow for free food events with crowd estimate + time window |
| 📋 Donation Form | Food type, quantity, location, expiry time, allergen flag |
| 🤝 Volunteer Tasks | Accept task → get directions → mark complete |

### Unique Differentiators (Judge Magnets)

**⏱️ AI Expiry Urgency Score**
- System auto-calculates urgency on submission
- Cooked food = 🔴 Critical (2–4 hrs)
- Packed food = 🟡 Moderate (24–72 hrs)
- Shows countdown timer on each map pin

**🏆 Food Karma Leaderboard**
- Donors earn karma points per kg of food saved
- Weekly public leaderboard visible on home screen
- Drives repeat engagement and community pride

**🆘 One-Tap SOS Request**
- Single red button for emergency food need
- Anonymous — no login required
- Instantly visible to volunteers within 2km radius
- Designed for dignity: no forms, no questions

**📲 WhatsApp Share**
- Every bhandara/donation has a pre-filled share button
- Message format: `"Free food near [location] — Veg — 200 plates — till 3 PM. FoodConnect Bharat"`
- Uses `wa.me` API — zero cost, instant viral spread

**📊 Zero Waste Impact Dashboard**
- Live counters: Meals redistributed · Kg saved · CO₂ avoided
- Shareable impact cards for donors
- Judges and NGOs respond to measurable social metrics

---

## 🧠 Smart Matching Logic

```
User preference = Jain   → show only Jain food
User preference = Veg    → show Veg + Jain food
User preference = Non-veg→ show all food
User preference = Any    → show all food (default)
```

Food expiry urgency is factored into sort order — most urgent appears first.

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose | Why |
|-----------|---------|-----|
| React.js (Vite) | UI framework | Fast setup, component-based |
| Leaflet.js | Interactive maps | Free, no API key, works offline |
| Tailwind CSS (CDN) | Styling | Rapid development, no build step |
| Socket.io-client | Real-time updates | Live pin drops without refresh |

### Backend
| Technology | Purpose | Why |
|-----------|---------|-----|
| Node.js + Express | REST API server | Fast to write, huge ecosystem |
| Socket.io | Real-time events | Instant map pin updates |
| JWT (jsonwebtoken) | Auth tokens | Lightweight, stateless |
| bcryptjs | Password hashing | Security baseline |

### Database
| Technology | Purpose | Why |
|-----------|---------|-----|
| MongoDB Atlas | Cloud database | Free tier, no local setup needed |
| Mongoose | ODM | Schema validation, easy queries |

### APIs & Services
| Service | Purpose | Cost |
|---------|---------|------|
| Leaflet.js + OpenStreetMap | Map tiles + rendering | Free forever |
| OpenRouteService API | Volunteer routing/directions | Free tier (2000 req/day) |
| `wa.me` WhatsApp share | Viral sharing | Free, no key needed |

### Dev Tools
| Tool | Purpose |
|------|---------|
| GitHub | Version control + submission |
| Postman | API testing |
| VS Code | Development |
| Vite | React dev server |

---

## 🗄️ Database Schema (MongoDB)

### Users Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "phone": "string",
  "role": "donor | needer | volunteer | ngo",
  "dietaryPref": "veg | jain | nonveg | any",
  "karmaScore": 0,
  "location": { "lat": 0, "lng": 0 },
  "createdAt": "Date"
}
```

### Donations Collection
```json
{
  "_id": "ObjectId",
  "donorId": "ObjectId",
  "foodType": "veg | jain | nonveg",
  "isBhandara": false,
  "quantity": "50 plates",
  "description": "Dal, rice, sabji",
  "containsOnionGarlic": false,
  "allergens": ["nuts"],
  "location": { "lat": 19.076, "lng": 72.877, "address": "Dadar, Mumbai" },
  "expiryTime": "Date",
  "urgencyScore": "critical | moderate | stable",
  "status": "available | claimed | completed",
  "volunteerId": "ObjectId | null",
  "createdAt": "Date"
}
```

### Requests Collection
```json
{
  "_id": "ObjectId",
  "neederId": "ObjectId | null",
  "dietaryPref": "veg | jain | nonveg | any",
  "numberOfPeople": 5,
  "isAnonymous": true,
  "isSOS": false,
  "status": "pending | matched | fulfilled",
  "matchedDonationId": "ObjectId | null",
  "location": { "lat": 0, "lng": 0 },
  "createdAt": "Date"
}
```

---

## 🔁 Complete User Flow

```
DONOR
  └── Open app → Select "Donor"
      └── Fill form (food type, qty, location, expiry)
          └── Pin appears on map (color coded)
              └── Nearby volunteers notified via Socket.io

NEEDER
  └── Open app → Select "Need Food"
      └── Set dietary preference → Map filters instantly
          └── Tap nearest pin → Request food
              └── OR press SOS → Emergency broadcast

VOLUNTEER
  └── Open app → Select "Volunteer"
      └── View nearby tasks (pickup + delivery)
          └── Accept task → Get directions (OpenRouteService)
              └── Mark complete → Donor/Needer karma updated

BHANDARA ORGANIZER (special donor flow)
  └── Select "Bhandara" → Add location + time + crowd estimate
      └── Live pin on map (gold color)
          └── Nearby people see it → Walk in OR volunteer distributes leftovers
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)
- Git

### Setup

```bash
# Clone the repo
git clone https://github.com/[yourgithub]/foodconnect-bharat
cd foodconnect-bharat

# Install dependencies for both folders
npm install

# Backend setup (.env file)
# Create server/.env file containing:
# MONGO_URI=your_atlas_connection_string
# JWT_SECRET=your_secret_key

# Run both Client and Server at once
npm start
```

Open `http://localhost:5173` in browser.

---

## 📁 Project Structure

```
foodconnect-bharat/
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map.jsx          # Leaflet map with pins
│   │   │   ├── DonationForm.jsx # Add food form
│   │   │   ├── RoleSelect.jsx   # Donor/Needer/Volunteer picker
│   │   │   ├── SOSButton.jsx    # One-tap emergency
│   │   │   ├── Dashboard.jsx    # Impact metrics
│   │   │   └── Leaderboard.jsx  # Karma scores
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                   # Node.js backend
│   ├── models/
│   │   ├── User.js
│   │   ├── Donation.js
│   │   └── Request.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── donations.js
│   │   └── requests.js
│   ├── utils/
│   │   ├── matching.js       # Dietary matching logic
│   │   └── urgency.js        # Expiry score calculator
│   ├── index.js              # Entry point + Socket.io
│   └── package.json
│
└── package.json              # Root concurrently runner
```

---

## 🤖 AI Tools Used

| Tool | How it was used |
|------|----------------|
| Claude (Anthropic) | Project ideation, architecture planning, README drafting, code logic for matching engine |
| GitHub Copilot | Inline code completion during development |

> All code was written during the hackathon. AI tools were used for assistance as permitted by the event rules.

---

## 🔴 Demo

- **Live Demo:** [Link will be added after deployment]
- **Demo Video:** [Screen recording uploaded here]
- **GitHub Repo:** [https://github.com/yourgithub/foodconnect-bharat]

---

## 🎤 Pitch Statement (60 seconds)

> "Every day in Mumbai, a wedding throws away 500 plates of biryani while families two streets away go hungry. FoodConnect Bharat closes that gap — in real time.
>
> Our map shows live food availability, matched by dietary preference — Jain, vegetarian, non-vegetarian — because in India, food that's culturally wrong is food that won't be eaten. Donors pin surplus food. Needers filter and request anonymously, with a single SOS button for emergencies. Volunteers get routed pickup-to-delivery tasks like a Swiggy for social good.
>
> In five hours, we built what India's food redistribution system should have always been — smart, inclusive, and dignified."

---

## 📊 Potential Impact

| Metric | Estimate |
|--------|---------|
| Food saved per bhandara | 50–200 kg |
| CO₂ avoided per 100kg food | ~250 kg CO₂ equivalent |
| Volunteer reach radius | 2 km (configurable) |
| Dietary matching accuracy | 100% (rule-based, deterministic) |

---

## 📜 License

MIT License — open source, free to extend.

---

*Built with purpose at DevSprint 2026 — Thakur Shyamnarayan College of Engineering*
