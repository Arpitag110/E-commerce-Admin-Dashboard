# E-commerce Product Management Dashboard (SSR)

A server-side rendered admin dashboard for managing e-commerce products, inventory, and categories.
Built with Next.js (App Router), MongoDB, and Tailwind CSS, and deployed on Vercel.

## Live Demo:
 https://e-commerce-admin-dashboard-xlfp.vercel.app/
## Video Demo:
 https://drive.google.com/file/d/1V7bdbRC13NkVEvLt80-v-UuVVWzF5167/view?usp=drivesdk

# Features

Authentication with protected admin routes
Product management with full CRUD functionality
Search, filter, sort, and server-side pagination
Category management
Smart notification system:
Low stock and out-of-stock alerts
Uncategorized products
Products missing images
Severity-based alerts (critical, warning, info)
Image upload with Cloudinary integration and validation
Dashboard analytics with charts and inventory overview
Audit logs for admin actions (create, update, delete)
Responsive dark-themed UI using Tailwind CSS
Server-side rendering for improved performance and SEO

# Tech Stack

Next.js (App Router) for Full-stack SSR framework
React for UI components
MongoDB	Database
Mongoose MongoDB ODM
Tailwind CSS Styling
Recharts for Data visualization
Zod for Schema validation
Cloudinary for Image storage

# Getting Started

## Prerequisites
Node.js 18+
MongoDB (local or Atlas)
Cloudinary account

## Installation
git clone <repository-url>
cd ecommerce-admin
npm install

## Environment Variables
Create a .env.local file in the root directory:

MONGODB_URI=your_mongodb_connection_string
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Run Locally
npm run dev

Open http://localhost:3000
 in your browser.

## Default Admin Login
Username: admin
Password: admin123

# Project Structure

src/
├── app/
│   ├── api/              # Authentication, products, categories, notifications
│   ├── dashboard/        # Analytics overview
│   ├── products/         # Product pages
│   ├── categories/       # Category pages
│   ├── notifications/    # Alerts
├── components/           # Reusable UI components
├── models/               # Database schemas
├── lib/                  # Database, auth, helpers, validation
├── proxy.js

# Key Functionality

## Pagination:
Server-side pagination for products and categories
Query-based pagination using ?page= and ?limit=

## Audit Logs:
Tracks admin actions for products and categories
Logs create, update, and delete operations
Stores timestamps for accountability and debugging

## Notification System:
Automatically generated on the server
Alerts for:
Low or zero stock
Missing categories
Missing images
Displayed via sidebar badge and notifications page

# Security Considerations

Environment variables for sensitive credentials
Server-side authentication
Zod-based input validation
Protected API routes
Image size and file-type validation

# Deployment

Deployed on Vercel
Environment variables configured in Vercel dashboard
MongoDB Atlas used as the production database
Server-side rendering enabled
Production Build
npm run build
npm start

# Performance Optimizations

Server-side rendering for faster initial load
Lean MongoDB queries
Optimized image delivery via Cloudinary
Client-side filtering for better UX

# Future Enhancements

Role-based access control
Export inventory and audit reports
Email notifications for critical stock
Advanced analytics dashboard