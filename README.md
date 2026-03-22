# LuxeWatches

A full-stack MERN e-commerce platform for luxury watch sales with a separate admin dashboard.

## Live

| | URL |
|---|---|
| Customer | https://mern-watch-store-jbhz.vercel.app |
| Admin | https://mern-watch-store.vercel.app |
| API | https://mern-watch-store.onrender.com |

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, MongoDB Atlas
- **Auth**: JWT + bcryptjs

## Local Setup

```bash
# Backend
cd backend && npm install && npm run dev

# Customer Frontend
cd frontend && npm install && npm run dev

# Admin Frontend
cd admin_frontend && npm install && npm run dev
```

## Sample Payloads

### Register — `POST /sign-up`
```json
{ "username": "Meet", "email": "Meet@gmail.com", "password": "Meet@#" }
```

### Login — `POST /sign-in`
```json
{ "username": "Meet", "password": "Meet@#" }
```

### Admin Login — `POST /sign-in`
```json
{ "username": "Admin", "password": "admin#" }
```

### Add Product — `POST /watches`
```json
{
  "url": "https://example.com/watch.jpg",
  "name": "Vintage Mechanical Watch",
  "brand": "Omega",
  "price": 3200,
  "description": "Classic vintage mechanical timepiece.",
  "features": ["Mechanical movement", "Leather strap"],
  "category": "Vintage",
  "inStock": true
}
```

> Categories: `Luxury` `Sports` `Smart` `Vintage` `Casual`

## Developer

**Meet Savaliya** — Full Stack Developer
