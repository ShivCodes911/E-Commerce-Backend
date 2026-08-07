# 🛒 ShopKart API — Backend Learning Project

> A production-style Marketplace Backend inspired by Amazon and Flipkart.
> Built phase by phase to learn real backend engineering — authentication, file uploads, role-based access, payments, notifications, and more.

---

## 📌 What Is This Project?

ShopKart is a backend REST API for an online shopping platform.

- **Customers** browse products, manage carts, place orders, pay, and leave reviews.
- **Suppliers** register their own stores and list products.
- **Admins** manage everything behind the scenes.

The goal is not to clone Amazon. The goal is to **learn backend engineering** by building something real, piece by piece.

---

## ✅ What Does "Done" Look Like?

- Customer can register, verify email, and login (password + OTP)
- Supplier can register, create a store, and list products with images
- Admin can manage everything on the platform
- Customers can search, filter, wishlist, cart, apply coupons, order, and pay
- Stock automatically reduces after payment and restores on cancellation
- Customers can review products with optional photos (only after delivery)
- Notifications fire automatically on key events (payment, order status, cancellation)
- All APIs are secure, validated (Zod), rate-limited, and role-protected (RBAC)
- Images (avatars, logos, product photos, review photos) are stored on Cloudinary

---

## 👥 System Roles

| Role | What They Can Do |
|---|---|
| **Customer** | Shop, wishlist, cart, apply coupons, order, pay, review |
| **Supplier** | Register store, upload logo, add/manage own products, view own orders |
| **Admin** | Manage everything — users, suppliers, stores, products, orders, payments, coupons |

---

## 🔄 Overall Business Workflow

```
Register → Verify Email → Login
    ↓
[Supplier] Create Store → Upload Logo → Add Products
[Customer] Browse Products → Wishlist → Cart → Apply Coupon
    ↓
Checkout → Payment (Razorpay) → Order Created
    ↓
Inventory Updated → Admin Ships Order → Customer Receives → Review Product
```

---

## 🏗️ Architecture

Every request follows this exact path:

```
Route → Middleware → Controller → Service → Model → MongoDB
```

| Layer | Responsibility |
|---|---|
| Routes | Maps URL + HTTP method to the right controller |
| Middlewares | Auth check, role check, file upload, input validation |
| Controllers | Handles request + response, delegates business logic to service |
| Services | All business logic, DB queries, Cloudinary calls |
| Models | Mongoose schemas that talk to MongoDB |

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB + Mongoose | Database + ODM |
| JWT | Access + refresh token authentication |
| Bcrypt | Password hashing |
| Zod | Input validation (request body, params, query) |
| Multer | File upload handling (in-memory buffer) |
| Cloudinary | Image storage and CDN |
| Razorpay | Payment gateway integration |
| Nodemailer + Gmail OAuth2 | Transactional email (OTP, verification) |
| Helmet | Secure HTTP response headers |
| express-rate-limit | Rate limiting per route group |

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/ShivCodes911/E-Commerce-Backend.git
cd E-Commerce-Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in all values (see Environment Variables section below).

### 4. Start the development server

```bash
npm run dev
```

The server starts at `http://localhost:5000`.

---

## 🔐 Environment Variables

| Variable | What It Does |
|---|---|
| `PORT` | Port the Express server listens on (e.g. `5000`) |
| `MONGO_URI` | MongoDB connection string from MongoDB Atlas |
| `ACCESS_TOKEN_SECRET` | Secret key used to sign JWT access tokens (short-lived, 15 min) |
| `REFRESH_TOKEN_SECRET` | Secret key used to sign JWT refresh tokens (long-lived, 7 days) |
| `NODE_ENV` | Environment mode — `development` or `production` |
| `GOOGLE_CLIENT_ID` | Google OAuth2 client ID (used for Nodemailer Gmail auth) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 client secret |
| `GOOGLE_REFRESH_TOKEN` | Long-lived refresh token from Google OAuth2 Playground |
| `GOOGLE_USER_ID` | The Gmail address that sends the emails (e.g. `yourapp@gmail.com`) |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RAZORPAY_API_KEY` | Razorpay key ID (used in frontend to open payment popup) |
| `RAZORPAY_API_SECRET` | Razorpay key secret (used on backend to verify payment signatures) |

---

## 📡 Response Shape

Every API in this project returns the same shape:

**Success:**
```json
{ "status": true, "message": "...", "data": { } }
```

**Error:**
```json
{ "status": false, "message": "..." }
```

---

## 📋 Complete Route Table

### 🔐 Auth — `/api/v1/auth`

| Method | Path | Auth | Role | What It Does |
|---|---|---|---|---|
| POST | `/signup` | No | Any | Register a new user |
| POST | `/verify-email` | No | Any | Verify email with OTP |
| POST | `/login` | No | Any | Login with email + password |
| POST | `/logout` | Yes | Any | Logout and revoke session |
| POST | `/forgot-password` | No | Any | Send password reset OTP |
| POST | `/reset-password` | No | Any | Reset password using OTP |
| POST | `/resend-otp` | No | Any | Resend OTP to email |
| POST | `/login-otp` | No | Any | Request OTP-based login |
| POST | `/verify-login-otp` | No | Any | Complete OTP-based login |
| GET | `/refresh-token` | No | Any | Get a new access token using refresh token |

---

### 👤 Users — `/api/v1/users`

| Method | Path | Auth | Role | What It Does |
|---|---|---|---|---|
| GET | `/profile` | Yes | Any | Get logged-in user's profile |
| PATCH | `/profile` | Yes | Any | Update name and phone |
| POST | `/avatar` | Yes | Any | Upload or replace profile avatar |
| POST | `/addresses` | Yes | Customer | Add a delivery address |
| PATCH | `/addresses/:addressId` | Yes | Customer | Update a specific address |
| DELETE | `/addresses/:addressId` | Yes | Customer | Delete a specific address |
| PATCH | `/addresses/:addressId/default` | Yes | Customer | Set an address as default |

---

### 🏪 Stores — `/api/v1/stores`

| Method | Path | Auth | Role | What It Does |
|---|---|---|---|---|
| POST | `/` | Yes | Supplier | Create a new store |
| GET | `/:storeId` | No | Public | Get store details |
| PATCH | `/:storeId` | Yes | Supplier | Update store info |
| POST | `/:storeId/logo` | Yes | Supplier | Upload or replace store logo |

---

### 🗂️ Categories — `/api/v1/categories`

| Method | Path | Auth | Role | What It Does |
|---|---|---|---|---|
| POST | `/` | Yes | Admin | Create a new category |
| GET | `/` | No | Public | Get all active categories |
| GET | `/:id` | No | Public | Get single category |
| PATCH | `/:id` | Yes | Admin | Update category |
| DELETE | `/:id` | Yes | Admin | Delete category |

---

### 📦 Products — `/api/v1/products`

| Method | Path | Auth | Role | What It Does |
|---|---|---|---|---|
| POST | `/` | Yes | Supplier | Create a new product with images |
| GET | `/` | No | Public | Search and filter products |
| GET | `/:id` | No | Public | Get single product detail |
| PATCH | `/:id` | Yes | Supplier | Update own product |
| DELETE | `/:id/images/:imageId` | Yes | Supplier | Delete a specific product image |
| PATCH | `/:id/delist` | Yes | Supplier | Delist (hide) a product |

---

### ❤️ Wishlist — `/api/v1/wishlist`

| Method | Path | Auth | Role | What It Does |
|---|---|---|---|---|
| POST | `/add` | Yes | Customer | Add product to wishlist |
| DELETE | `/remove/:productId` | Yes | Customer | Remove product from wishlist |
| GET | `/` | Yes | Customer | Get my wishlist |
| POST | `/move-to-cart/:productId` | Yes | Customer | Move product from wishlist to cart |

---

### 🛒 Cart — `/api/v1/cart`

| Method | Path | Auth | Role | What It Does |
|---|---|---|---|---|
| POST | `/add` | Yes | Customer | Add product to cart |
| PATCH | `/update/:productId` | Yes | Customer | Update item quantity |
| DELETE | `/remove/:productId` | Yes | Customer | Remove item from cart |
| GET | `/` | Yes | Customer | Get my cart |
| DELETE | `/clear` | Yes | Customer | Clear the entire cart |
| POST | `/apply-coupon` | Yes | Customer | Apply a coupon code to cart |
| DELETE | `/remove-coupon` | Yes | Customer | Remove applied coupon from cart |

---

### 🎟️ Coupons — `/api/v1/coupons`

| Method | Path | Auth | Role | What It Does |
|---|---|---|---|---|
| POST | `/` | Yes | Admin | Create a new coupon |
| GET | `/` | Yes | Admin | List all coupons |
| GET | `/:id` | Yes | Admin | Get single coupon |
| PATCH | `/:id` | Yes | Admin | Update a coupon |
| PATCH | `/:id/deactivate` | Yes | Admin | Deactivate a coupon |

---

### 📋 Orders — `/api/v1/orders`

| Method | Path | Auth | Role | What It Does |
|---|---|---|---|---|
| POST | `/checkout` | Yes | Customer | Place an order from cart |
| GET | `/` | Yes | Customer | Get all my orders |
| GET | `/:id` | Yes | Customer | Get single order detail |
| PATCH | `/:id/cancel` | Yes | Customer | Cancel an order |

---

### 💳 Payments — `/api/v1/payments`

| Method | Path | Auth | Role | What It Does |
|---|---|---|---|---|
| POST | `/create` | Yes | Customer | Create a Razorpay order to initiate payment |
| POST | `/verify` | Yes | Customer | Verify payment signature and confirm order |
| POST | `/failure` | Yes | Customer | Record a failed payment attempt |

---

### ⭐ Reviews — `/api/v1/reviews`

| Method | Path | Auth | Role | What It Does |
|---|---|---|---|---|
| POST | `/` | Yes | Customer | Submit a review (only after delivery) |
| GET | `/product/:productId` | No | Public | Get all reviews for a product |
| DELETE | `/:id` | Yes | Customer | Delete own review |

---

### 🔔 Notifications — `/api/v1/notifications`

| Method | Path | Auth | Role | What It Does |
|---|---|---|---|---|
| GET | `/` | Yes | Customer / Supplier | Get all my notifications |
| GET | `/unread-count` | Yes | Customer / Supplier | Get count of unread notifications |
| PATCH | `/:id/read` | Yes | Customer / Supplier | Mark a single notification as read |
| PATCH | `/read-all` | Yes | Customer / Supplier | Mark all notifications as read |

---

### 🏭 Supplier — `/api/v1/supplier`

| Method | Path | Auth | Role | What It Does |
|---|---|---|---|---|
| GET | `/orders` | Yes | Supplier | Get all orders containing your products |
| GET | `/orders/:orderId` | Yes | Supplier | Get single order (filtered to your items only) |

---

### 🔧 Admin — `/api/v1/admin`

| Method | Path | Auth | Role | What It Does |
|---|---|---|---|---|
| GET | `/users` | Yes | Admin | List all users (filter by role, isActive) |
| GET | `/users/:id` | Yes | Admin | View single user's full profile |
| PATCH | `/users/:id/toggle` | Yes | Admin | Activate or deactivate a user account |
| GET | `/suppliers` | Yes | Admin | List all suppliers |
| GET | `/stores` | Yes | Admin | List all stores |
| PATCH | `/stores/:id/verify` | Yes | Admin | Approve or reject a store |
| GET | `/products` | Yes | Admin | List all products across all suppliers |
| PATCH | `/products/:id` | Yes | Admin | Edit any product |
| DELETE | `/products/:id` | Yes | Admin | Delete any product |
| GET | `/orders` | Yes | Admin | List all orders (filter by status, date) |
| PATCH | `/orders/:id/status` | Yes | Admin | Update an order's status |
| GET | `/payments` | Yes | Admin | List all payment records |
| GET | `/coupons` | Yes | Admin | List all coupons |
| POST | `/coupons` | Yes | Admin | Create a new coupon |
| PATCH | `/coupons/:id` | Yes | Admin | Update a coupon |
| PATCH | `/coupons/:id/deactivate` | Yes | Admin | Deactivate a coupon |

---

## 🗄️ Database Collections

| Collection | Purpose |
|---|---|
| users | All registered users (customer, supplier, admin) |
| sessions | Login sessions for refresh-token control and logout |
| otps | Temporary OTPs for verification, login, password reset |
| stores | Supplier store profiles |
| categories | Product categories |
| products | The full product catalog |
| wishlists | Customer wishlists |
| carts | Customer shopping carts |
| coupons | Discount codes |
| orders | Placed orders (with full item snapshot) |
| payments | Razorpay payment records |
| reviews | Customer product reviews |
| notifications | In-app alerts for customers and suppliers |

---

## 🔒 Security

| Layer | Implementation |
|---|---|
| Password hashing | bcrypt |
| Token auth | JWT access token (15 min) + refresh token (7 days) |
| Session storage | Hashed refresh token in sessions collection — logout actually works |
| Input validation | Zod on every route (body, params, query) |
| HTTP headers | Helmet.js |
| Rate limiting | 100 req/min general · 10 req/15min for login/signup · 5 req/15min for OTP routes |
| RBAC | Role-based middleware on every protected route |

---

## 📁 Project Structure

```
src/
├── config/          → db, cloudinary, razorpay, mail
├── constants/       → roles, orderStatus, paymentStatus
├── models/          → 13 Mongoose schemas
├── validations/     → Zod schemas per module
├── middlewares/     → auth, role, upload, error, rateLimit
├── utils/           → generateToken, generateOtp, sendEmail, cloudinaryUpload/Delete, slugify
├── services/        → notification, inventory (shared business logic)
└── modules/         → auth, users, stores, categories, products,
                       wishlist, cart, coupon, order, payment,
                       review, notification, supplier, admin
```
