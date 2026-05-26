# SmartGov Guide

**Explainable AI for Government Welfare Eligibility**

> *"Know why you are eligible — or why you are not."*

SmartGov Guide is a hackathon-winning GovTech platform that makes welfare eligibility decisions **transparent, explainable, and actionable**.

![SmartGov Guide](https://img.shields.io/badge/Status-Demo%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-24-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan)

---

## 🎯 Core Problem

Millions of citizens are rejected from government welfare schemes without knowing:
- Which schemes apply to them
- Why they are rejected
- Whether rejection is fixable
- What to do next

**SmartGov Guide eliminates blind rejection by making welfare eligibility decisions transparent, explainable, and actionable.**

---

## ✨ Features

- **🏛️ Premium GovTech UI** - Credible, calm, intelligent, and trustworthy design
- **📋 Simple Eligibility Form** - No sensitive data collection (no Aadhaar, bank details)
- **🔍 Rule-by-Rule Breakdown** - See exactly which criteria you pass or fail
- **✅ Verified Official Links** - Direct links to government portals
- **💡 Corrective Guidance** - Know if a rejection is fixable
- **🔒 Privacy First** - Data processed locally, nothing stored

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed

### Installation

```bash
# Clone and navigate to project
cd c:\Users\pluto\Desktop\gov

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Running the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

**Access the app:** Open http://localhost:5173 in your browser

---

## 📁 Project Structure

```
gov/
├── frontend/                  # React + Tailwind + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Landing.tsx       # Hero landing page
│   │   │   ├── EligibilityForm.tsx
│   │   │   └── ResultsScreen.tsx  # Scheme results with breakdown
│   │   ├── App.tsx               # Main app with routing
│   │   └── index.css             # Design system
│   └── package.json
│
├── backend/                   # Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   │   └── eligibility.js     # API endpoints
│   │   ├── services/
│   │   │   └── eligibilityEngine.js  # Core eligibility logic
│   │   └── index.js              # Express server
│   └── package.json
│
└── README.md
```

---

## 🏛️ Supported Schemes

| Scheme | Description |
|--------|-------------|
| **PM-KISAN** | ₹6,000/year for small farmers |
| **Ayushman Bharat (PM-JAY)** | ₹5L health insurance coverage |
| **National Scholarship Portal** | Scholarships for students |
| **PMAY** | Affordable housing with interest subsidy |
| **PMSBY** | ₹2L accident insurance for ₹20/year |
| **PMJJBY** | ₹2L life insurance for ₹436/year |

---

## 🎨 Demo Scenarios

### Scenario 1: Eligible Farmer
- Age: 28, Income: ₹1.8L, State: Tamil Nadu, Occupation: Farmer
- **Result:** Eligible for PM-KISAN, PMAY, insurance schemes

### Scenario 2: Student
- Age: 20, Income: ₹2L, State: Karnataka, Occupation: Student
- **Result:** Eligible for NSP scholarships, PMAY

### Scenario 3: Higher Income
- Age: 35, Income: ₹8L, Occupation: Private Sector
- **Result:** Eligible for PMAY (MIG-I), insurance schemes

---

## 🔒 Trust & Safety

- ✅ Verified government sources only
- ✅ No Aadhaar, bank details, or documents collected
- ✅ No application submission (guidance only)
- ✅ Links to official government portals only

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Tailwind CSS 4, Vite 7
- **Backend:** Node.js, Express 4
- **Icons:** Lucide React
- **Fonts:** Inter (Google Fonts)

---

## 📄 License

Built for hackathon demonstration purposes.

---

*SmartGov Guide - Making government welfare accessible and understandable for everyone.*
