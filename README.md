# E-commerce Product Management Dashboard

A full-featured e-commerce admin dashboard built with Next.js 16, MongoDB, and Tailwind CSS. Manage products, categories, inventory, and real-time notifications.

## Features

- 🔐 **Authentication System** - Secure session-based login with protected routes
- 📊 **Dashboard** - Real-time statistics, stock charts, and inventory distribution
- 📦 **Product Management** - Full CRUD with search, filter, and sort capabilities
- 🏷️ **Category Management** - Create, edit, and organize product categories
- 🔔 **Smart Notifications System**
  - Low stock alerts (configurable threshold)
  - Uncategorized product warnings
  - Missing product images detection
  - Severity-based severity levels (critical/warning/info)
- 🖼️ **Image Upload** - Secure Cloudinary integration with validation
- 🔍 **Advanced Search & Filter** - Filter by stock status, category, and search by name
- 📈 **Data Visualization** - Interactive charts with Recharts
- 🎨 **Modern UI** - Dark theme, responsive design, Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Cloudinary account ([free tier available](https://cloudinary.com/users/register/free))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce-admin
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` in the root directory:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/ecommerce
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# Admin Credentials (change in production!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Login Credentials

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change these credentials in production using environment variables!

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── logout/          # Session termination
│   │   ├── notifications/       # Smart notification generation
│   │   ├── categories/          # Category CRUD endpoints
│   │   ├── products/            # Product CRUD endpoints
│   │   ├── upload/              # Image upload to Cloudinary
│   │   └── ...
│   ├── categories/              # Category management page
│   ├── dashboard/               # Analytics & overview
│   ├── notifications/           # Notification center
│   ├── products/                # Product listing & details
│   ├── layout.js                # Root layout with sidebar
│   ├── page.js                  # Login page
│   └── globals.css              # Global styles
├── components/
│   ├── Sidebar.jsx              # Navigation & notification badge
│   ├── ProductsTable.jsx        # Product listing with filters
│   ├── CategoriesTable.jsx      # Category management
│   ├── NotificationItem.jsx     # Individual notification display
│   ├── StockChart.jsx           # Stock visualization
│   ├── InventoryPieChart.jsx    # Inventory distribution
│   └── ...
├── lib/
│   ├── db.js                    # MongoDB connection
│   ├── auth.js                  # Authentication utilities
│   ├── notificationHelpers.js   # Notification generation logic
│   ├── categorySchema.js        # Zod validation schema
│   └── ...
├── models/
│   ├── Product.js               # Product schema & model
│   ├── Category.js              # Category schema & model
│   └── ...
├── proxy.js                     # Request middleware for auth
└── ...
```

---

## API Documentation

### Authentication

#### `POST /api/auth/login`
Login with admin credentials
```json
Request: { "username": "admin", "password": "admin123" }
Response: { "message": "Login successful" }
```

#### `POST /api/auth/logout`
Terminate current session
```json
Response: { "message": "Logged out successfully" }
```

### Notifications

#### `GET /api/notifications`
Fetch all generated notifications
```json
Response: {
  "count": 3,
  "notifications": [
    {
      "id": "low-stock-123",
      "type": "low-stock",
      "title": "Low Stock Alert",
      "message": "Product Name has only 2 items left",
      "severity": "warning",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Notification Types:**
- `low-stock` - Products below threshold (default: 5 items)
- `uncategorized` - Products without category assigned
- `no-image` - Products missing product images

**Severity Levels:**
- `critical` - Stock = 0 (red)
- `warning` - Low stock (yellow)
- `info` - Non-critical alerts (blue)

### Products

#### `GET /api/products`
Fetch all products
```json
Response: [
  {
    "_id": "...",
    "name": "Product Name",
    "price": 999,
    "stock": 10,
    "category": { "_id": "...", "name": "Electronics" },
    "imageUrl": "https://res.cloudinary.com/...",
    "description": "...",
    "createdAt": "2024-01-15T..."
  }
]
```

#### `POST /api/products`
Create new product (requires authentication)
```json
Request: {
  "name": "Product Name",
  "price": 999,
  "stock": 10,
  "category": "category-id",
  "description": "..."
}
Response: { "product": {...}, "message": "Product created" }
```

#### `PUT /api/products/[id]`
Update product

#### `DELETE /api/products/[id]`
Delete product

### Categories

#### `GET /api/categories`
Fetch all categories
```json
Response: [
  { "_id": "...", "name": "Electronics", "description": "..." }
]
```

#### `POST /api/categories`
Create category (requires authentication)

#### `PUT /api/categories/[id]`
Update category

#### `DELETE /api/categories/[id]`
Delete category

### Image Upload

#### `POST /api/upload`
Upload product image to Cloudinary
```
Multipart form data:
- file: image file (max 5MB, JPEG/PNG/WebP)

Response: { "url": "https://res.cloudinary.com/..." }
```

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.1.1 | Full-stack framework with App Router |
| **React** | 19.2.3 | UI components |
| **MongoDB** | - | NoSQL database |
| **Mongoose** | ^9.0.2 | MongoDB ODM |
| **Tailwind CSS** | ^4 | Utility-first styling |
| **Recharts** | ^3.6.0 | Data visualization |
| **Zod** | ^4.2.1 | Schema validation |
| **Cloudinary** | - | Image hosting & optimization |

---

## Key Features in Detail

### 📋 Notification System

The notification system automatically monitors your inventory and generates actionable alerts:

**Configuration:**
```javascript
// src/lib/notificationHelpers.js
const LOW_STOCK_THRESHOLD = 5; // Adjust as needed
```

**How it works:**
1. Checks all products on every API request
2. Identifies low stock (< threshold) and out-of-stock items
3. Detects uncategorized and image-less products
4. Displays badge count in sidebar navigation
5. Shows detailed alerts in `/notifications` page

### 🔍 Product Filtering

Products page supports:
- **Search** by product name
- **Stock Status** filter (All, Low Stock, Out of Stock)
- **Category** filter
- **Sort** by name, price, or stock quantity

### 📊 Dashboard Analytics

- Total products and inventory value
- Real-time stock bar chart
- Inventory distribution pie chart
- Product count by status

---

## Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| `MONGODB_URI` | ✅ | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `ADMIN_USERNAME` | ✅ | `admin` |
| `ADMIN_PASSWORD` | ✅ | `secure_password_here` |
| `CLOUDINARY_CLOUD_NAME` | ✅ | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | ✅ | `api_key_here` |
| `CLOUDINARY_API_SECRET` | ✅ | `api_secret_here` |

---

## Security Considerations

⚠️ **Production Deployment:**

1. **Change default credentials** - Set strong `ADMIN_USERNAME` and `ADMIN_PASSWORD`
2. **Use environment variables** - Never commit secrets to git
3. **Enable HTTPS** - Required for production
4. **Validate all inputs** - Using Zod schemas
5. **Rate limiting** - Implement for API endpoints
6. **CORS configuration** - Restrict to trusted domains
7. **Image validation** - File type and size limits enforced

---

## Common Tasks

### Add a New Product
1. Navigate to `/products`
2. Click "Create New Product"
3. Fill in details (name, price, stock, category)
4. Upload image (optional)
5. Submit

### Manage Categories
1. Go to `/categories`
2. Click "Create New Category"
3. Add name and description
4. View/edit/delete existing categories

### Monitor Inventory
1. Check Dashboard for overview
2. Visit Notifications for alerts
3. Filter products by stock status on Products page

### Resolve Low Stock Alert
1. Go to Notifications
2. Click on low-stock alert
3. Navigate to product page
4. Update stock quantity

---

## Troubleshooting

**Issue:** MongoDB connection fails
- **Solution:** Check `MONGODB_URI` format and network access

**Issue:** Image upload fails
- **Solution:** Verify Cloudinary credentials and file size (<5MB)

**Issue:** Products not showing in dashboard
- **Solution:** Ensure products are assigned a category

**Issue:** Can't login
- **Solution:** Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` match `.env.local`

---

## Building for Production

```bash
# Build optimized production bundle
npm run build

# Start production server
npm start
```

Deployment tested on:
- Vercel (recommended)
- Self-hosted Node.js servers
- Docker containers

---

## Performance Optimization

- ✅ Server-side rendering (SSR) for SEO
- ✅ Image optimization with Cloudinary transformations
- ✅ Lean MongoDB queries with `.lean()`
- ✅ Efficient pagination (if implemented)
- ✅ Server-side pagination for Products and Categories (query params `?page=&limit=`)
- ✅ Audit logging for create/update/delete actions (stored in `src/models/AuditLog.js`)
- ✅ Client-side filtering for responsive UX

---

## Contributing

Contributions welcome! Please:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## License

MIT License - feel free to use this project for commercial purposes

---

## Support & Resources

- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Cloudinary API](https://cloudinary.com/documentation)
- [Recharts](https://recharts.org/en-US/api)

---

## Changelog

### v0.1.0 (Initial Release)
- ✅ Authentication system
- ✅ Product CRUD operations
- ✅ Category management
- ✅ Smart notification system
- ✅ Dashboard with charts
- ✅ Image upload to Cloudinary
- ✅ Advanced filtering & search