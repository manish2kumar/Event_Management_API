# Event Management API

A RESTful API to manage events and user registrations, built using **Node.js**, **Express**, and **PostgreSQL**.

---

## Tech Stack

- Node.js
- Express
- PostgreSQL
- pg (node-postgres)
- dotenv

---

## Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/your-username/event-management-api.git
cd event-management-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure .env file**
```bash
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=eventdb
```

5. **Create database and tables**
- Check out db folder
- 
6. **Run the server**
```bash
npm run dev
```

---

## Folder Structure

```bash
event-management-api/
├── controllers/
│   └── eventController.js
├── models/
│   └── eventModel.js (optional)
├── routes/
│   └── events.js
├── utils/
│   └── validation.js
├── db/
│   └── index.js
├── docs/
│   └── schema-notes.md
├── .env
├── .gitignore
├── package.json
├── server.js
└── README.md
```

---

##  API Endpoints

### Create Event
``http
POST /api/events
``
- Request
``json
{
  "title": "Tech Fest",
  "date_time": "2025-12-25T10:00:00",
  "location": "Delhi",
  "capacity": 500
}
``
- Response
``json
{ "event_id": 1 }
``

### Get Event Details
``http
GET /api/events/:id
``
- Response
``json
{
  "id": 1,
  "title": "Tech Fest",
  "date_time": "2025-12-25T10:00:00.000Z",
  "location": "Delhi",
  "capacity": 500,
  "registrations": [
    { "id": 1, "name": "Test User", "email": "test@example.com" }
  ]
}
``

### Register for Event
``http
POST /api/events/:id/register
``
- Request
``json
{ "user_id": 1 }
``
- Response
``json
{ "message": "User registered successfully" }
``

### Cancel Registration
``http
DELETE /api/events/:id/register
``
- Request
``json
{ "user_id": 1 }
``
- Response
``json
{ "message": "Registration cancelled" }
``

### List Upcoming Events
``http
GET /api/events/upcoming
``
- Response
``json
[
  {
    "id": 1,
    "title": "Tech Fest",
    "date_time": "2025-12-25T10:00:00.000Z",
    "location": "Delhi",
    "capacity": 500
  }
]
``

### Event Stats

``http
GET /api/events/:id/stats
``
- Response
``json
{
  "total_registrations": 1,
  "remaining_capacity": 499,
  "percentage_filled": "0.20%"
}
``

## Features Implemented

- Input validation
- Capacity check
- Prevent duplicate registrations
- Block past event registrations
- Full user-event many-to-many relationship
- Custom sorting of upcoming events
- Stats calculation for each event

