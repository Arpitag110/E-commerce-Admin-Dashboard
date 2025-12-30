# E-commerce Product Management Dashboard

A Server-Rendered E-commerce Product Management Dashboard built with Next.js, MongoDB, and Tailwind CSS.

## Features

- 🔐 **Authentication System** - Secure login with session management
- 📊 **Dashboard** - Overview with statistics and charts
- 📦 **Product Management** - Full CRUD operations for products
- 🖼️ **Image Upload** - Secure image upload and storage using Cloudinary
- 🔍 **Search & Filter** - Search products and filter by stock status
- 📈 **Data Visualization** - Charts showing stock levels and inventory distribution
- 🎨 **Modern UI** - Dark theme with responsive design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- Cloudinary account (free tier available)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Note:** For production, use strong credentials and environment variables.

### Cloudinary Setup

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard
3. Copy your `Cloud Name`, `API Key`, and `API Secret`
4. Add them to your `.env.local` file as shown above

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Login Credentials

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Important:** Change these credentials in production by setting `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   └── products/      # Product CRUD API
│   ├── dashboard/         # Dashboard page
│   ├── products/          # Product management pages
│   └── page.js            # Login page
├── components/            # React components
├── lib/                   # Utilities (DB, auth, schemas)
└── models/                # Mongoose models
```

## Tech Stack

- **Framework:** Next.js 16.1.1 (App Router)
- **Database:** MongoDB with Mongoose
- **Styling:** Tailwind CSS 4
- **Validation:** Zod
- **Charts:** Recharts
- **Authentication:** Cookie-based sessions
- **Image Storage:** Cloudinary

## Features Overview

### Authentication
- Login page at root route (`/`)
- Session-based authentication
- Protected routes via middleware
- Logout functionality

### Dashboard
- Total products count
- Total stock quantity
- Inventory value
- Stock bar chart
- Inventory distribution pie chart

### Products Management
- View all products in a table with images
- Search products by name
- Filter by stock status (All, Low Stock, Out of Stock)
- Sort by name, price, or stock
- Create new products with image upload
- Edit existing products with image management
- Delete products
- Secure image upload to Cloudinary (max 5MB, JPEG/PNG/WebP)

## Build for Production

```bash
npm run build
npm start
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)