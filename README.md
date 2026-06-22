# QuickShop

QuickShop is a full-stack e-commerce application built with a React + Vite frontend and an Express + MongoDB backend. It includes product browsing, cart and checkout flow, Razorpay payment integration, order management, and an admin area for products, orders, users, and analytics.

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Tailwind CSS
- Axios
- Sonner

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Cloudinary for product image uploads
- Razorpay for payments
- Nodemailer for transactional emails

## Features

- User registration and login
- Product listing with search, category filtering, and pagination
- Product detail page
- Cart and checkout flow
- Razorpay order creation and payment verification
- Customer order history
- Admin dashboard with analytics
- Admin product creation and management
- Admin order listing with status updates
- Admin user listing
- Database seed script with demo users, products, and orders

## Project Structure

```text
QuickShop/
|-- app/        # React frontend
|-- server/     # Express backend
|-- package.json
`-- README.md
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB running locally or a MongoDB connection string
- Cloudinary account
- Razorpay account
- Email account credentials for Nodemailer

## Environment Variables

### Server

Create `server/.env` from `server/.env.example`.

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/quickshop
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Notes:
- `CLIENT_URL` should point to the frontend URL. For local Vite dev, use `http://localhost:5173`.
- The backend runs on `http://localhost:3000` by default.

### Frontend

Create `app/.env`.

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Installation

Install everything from the project root:

```bash
npm run install-all
```

Or install manually:

```bash
npm install
cd app && npm install
cd ../server && npm install
```

## Running Locally

### Start frontend and backend together

```bash
npm run dev
```

### Start them separately

Frontend:

```bash
npm run dev:client
```

Backend:

```bash
npm run dev:server
```

Default local URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Seed Demo Data

To populate the database with sample users, products, and orders:

```bash
npm run seed
```

Demo credentials from the seed script:

- Admin: `admin@quickshop.com` / `admin123`
- User: `jayesh@example.com` / `jayesh123`
- User: `priya@example.com` / `priya123`

## Available Scripts

From the project root:

```bash
npm run install-all   # install root, app, and server dependencies
npm run dev           # run frontend and backend together
npm run dev:client    # run frontend only
npm run dev:server    # run backend only
npm run build         # build frontend
npm run start         # start backend in production mode
npm run seed          # seed database
npm run format        # run prettier
```

Frontend only:

```bash
cd app
npm run dev
npm run build
npm run lint
npm run preview
```

Backend only:

```bash
cd server
npm run dev
npm run start
npm run seed
```

## API Overview

Base URL:

```text
http://localhost:3000/api
```

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/users` admin only

### Products
- `GET /products`
- `GET /products/:id`
- `POST /products` admin only
- `PUT /products/:id` admin only
- `DELETE /products/:id` admin only

### Orders
- `POST /orders`
- `GET /orders/my-orders`
- `GET /orders` admin only
- `PUT /orders/:id/status` admin only

### Payments
- `POST /payment/order`
- `POST /payment/verify`

### Analytics
- `GET /analytics` admin only

## Admin Routes

The frontend currently includes these admin pages:

- `/admin`
- `/admin/add-product`
- `/admin/products`
- `/admin/orders`
- `/admin/users`

## Notes

- Product creation and updates use multipart form uploads with the field name `images`.
- The backend uses Cloudinary for storing uploaded product images.
- Razorpay is configured from the backend using `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`, while the frontend uses `VITE_RAZORPAY_KEY_ID`.
- The project uses `react-router` directly instead of `react-router-dom`.

## Repository

- GitHub: `https://github.com/jayeshyadav07/QuickShop`

## Author

Jayesh Yadav
