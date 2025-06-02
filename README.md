# 🧠 Xeno Mini CRM – SDE Internship Assignment 2025

A simplified, AI-integrated CRM platform built to segment customers, launch personalized campaigns, and log delivery insights.

## 🚀 Live Demo
- 🌐 Frontend (Vercel): https://xeno-asssingment-crm.vercel.app
- 🌐 Backend (Render): https://xeno-asssingment-crm.onrender.com

---

## 📦 Tech Stack

| Layer        | Tech Used                     |
|--------------|------------------------------- |
| Frontend     | Reactjs, Tailwind CSS, Zustand |
| Backend      | Node.js, Express.js            |
| Database     | MongoDB (Mongoose)             |
| Auth         | Google OAuth 2.0    |
| AI Feature   | Gemini 1.5 (via API)       |
| Hosting      | Vercel (Frontend), onRender (Backend) |

---

## ✨ Features

### ✅ 1. Data Ingestion
- **POST `/api/customers`**: Add customer data
- **POST `/api/orders`**: Add order data
- Uses validation and schema checks
- Tested with Postman

### ✅ 2. Campaign Creation UI
- Dynamic rule builder
- **Live audience size preview**
- Campaign history shows:
  - Campaign name, time, rule
  - Sent count, failed count, total audience
- Sorted by most recent campaigns

### ✅ 3. Campaign Delivery
- On saving a segment, a campaign is launched
- Each message is:
  - Sent to all matched customers
  - Logged in the `communication_log` collection



### ✅ 4. Authentication
- Google OAuth 2.0 via NextAuth
- Only logged-in users can:
  - Create/view segments and campaigns
  - View delivery stats

### ✅ 5. AI Integration (Gemini 1.5)
- **Natural Language → Segment Rules**
  - Example prompt: _"Customers who haven’t purchased in 6 months and spent over ₹5000"_
  - Returns: Logical rule blocks with correct structure
- AI handles:
  - Parsing natural language
  - Converting to AND/OR tree logic

> ❌ Not Implemented:
> - Pub/Sub model (no Kafka/RabbitMQ)
> - Batch DB updates (receipt hits update individually)
> - Dummy Vendor API (Sets every customer  delivery status to "delivered")
---

## 📐 Architecture Overview
                +------------------------------+
                |   Frontend (Vite + React)    |
                |------------------------------|
                | - Google Authentication      |
                | - Customer Form              |
                | - Order Form                 |
                | - Campaign UI (Rule Builder) |
                | - AI Prompt to Rule Input    |
                +---------------+--------------+
                                |
                                v
                +---------------+--------------+
                |     Backend (Express.js)     |
                |------------------------------|
                | - REST APIs (CRUD: All Data) |
                | - AI Rule Logic (Gemini 1.5) |
                | - Customer Filtering Logic   |
                +---------------+--------------+
                                |
             +------------------+------------------+
             |                                     |
     +----------------------------+       +------------------------------+
     |      MongoDB (Mongoose)   |       | Gemini 1.5 API (Google AI)   |
     |---------------------------|       |------------------------------|
     | - Customers Collection     |       | - NL prompt → segment rules  |
     | - Orders Collection        |       +------------------------------+
     | - Campaigns Collection     |
     | - Campaign History         |
     | - Communication Logs       |
     +----------------------------+


---

## 🧪 API Endpoints

### Customers
- `POST /api/v1/customers/create` – Add customers
- `GET /api/v1/customers/all` – View all customers

### Orders
- `POST /apiv1//orders/create` – Add orders
- `GET /api/v1/orders/all` – View all orders

### Campaigns
- `POST /api/v1/campaigns/create` – Create campaign from segment rules
- `POST /api/v1/campaigns/preview` – Preview all customers in campaign

### Campaign History and Communication Logs
- `GET /apiv1//campaignsHistory/all` – Fetch all campaigns without the Customer List
- `GET /apiv1//campaignsHistory/all?isIncluded=true` – Fetch all campaigns with the Customer List
- 
### AI
- `POST /api/v1/campaigns/ai` – Convert natural language to rule

---

## 📈 Known Limitations

| Limitation                          | Status         |
|-------------------------------------|----------------|
| Pub/Sub architecture (Kafka, etc.)  | ❌ Not done     |
| Batch DB updates for receipt logs   | ❌ Not done     |
| Vendor API with dynamic per-user msg | ✅ Basic version |
| DevOps (Docker, CI/CD, etc.)        | ❌ Not done     |

---

## 🛠 Local Setup

```bash
# Clone repo
git clone [https://github.com/your-username/xeno-crm.git](https://github.com/Riyasatt/Xeno-Asssingment-CRM)
cd Xeno-Asssingment-CRM

# Backend Setup
cd final-backend
npm install
npm run dev

# Frontend Setup
cd ../final-frontend
npm install
npm run dev

```

## Setup Environment Variables
### Backend
```text
MONGO_URI
PORT
GOOGLE_CLIENT_ID
JWT_SECRET
VITE_FRONTEND_URL
```

### Frontend
```text
GOOGLE_CLIENT_ID
```
