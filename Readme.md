# 🛒 ShopKart API — Backend Learning Project

> A production-style Marketplace Backend inspired by Amazon and Flipkart. Built phase by phase to learn real backend engineering — including file uploads, role-based access, payment gateways, and supplier-side marketplace logic.

---

## 📌 What Is This Project?

ShopKart is a backend API for an online shopping platform. Customers browse products, manage carts, place orders, and leave reviews. Suppliers register their own stores and list products. Admins manage everything behind the scenes.

The goal is NOT to clone Amazon. The goal is to **learn backend engineering** by building something real, piece by piece.

---

## ✅ What Does "Done" Look Like?

- Customer can register, verify email, and login (password + OTP)
- Supplier can register, create a store, and list products with images
- Admin can manage everything on the platform
- Customers can search, filter, wishlist, cart, apply coupons, order, and pay
- Stock automatically reduces after payment
- Customers can review products with photos (only after delivery)
- Notifications fire automatically on key events
- All APIs are secure, validated, and role-protected
- Images (avatars, logos, product photos, review photos) are stored on Cloudinary

---

## 👥 System Roles

| Role | What They Can Do |
|---|---|
| **Customer** | Shop, wishlist, cart, order, pay, review |
| **Supplier** | Register store, upload logo, add/manage own products, view own orders |
| **Admin** | Manage everything — users, suppliers, products, categories, coupons, orders |

### 🔴 What Suppliers CANNOT Do
- Update another supplier's products
- Manage platform-wide coupons
- View or manage all orders (only orders for their own products)
- Manage users

---

## 🔄 Overall Business Workflow

```
Register → Verify Email → Login
    ↓
[Supplier] Create Store → Upload Logo → Add Products
[Customer] Browse Products → Wishlist → Cart → Apply Coupon
    ↓
Checkout → Payment → Order Created
    ↓
Inventory Updated → Order Delivered → Review Product
```

---

## 📡 Response Handling

Use standard Express responses everywhere. Do **not** create custom helper classes like `ApiResponse` or `ApiError` — they add abstraction before you understand what they're abstracting.

**Success response:**
```js
res.status(200).json({
  status: true,
  message: "Product fetched successfully",
  data: product
});
```

**Error response:**
```js
res.status(404).json({
  status: false,
  message: "Product not found"
});
```

Every API across the project returns this same shape. That consistency is what makes Postman testing and frontend integration predictable.

---

## 🚨 Error Handling

Every controller uses an explicit `try/catch` block and forwards errors to the global error middleware via `next(error)`.

**Controller pattern (required in every controller):**
```js
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new Error("Product not found");
    }

    res.status(200).json({
      status: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
```

**Services throw plain errors — controllers catch and forward them:**
```js
// In a service
if (!product) {
  throw new Error("Product not found");
}
```

**Error flow:**
```
Request → Route → Controller (try/catch) → next(error)
                                                ↓
                                     error.middleware.js
                                                ↓
                                          JSON Response
```

The middleware lives at `middlewares/error.middleware.js`. Every async operation is explicit so the full Express request lifecycle stays easy to read and debug.

---

## 🏗️ Project Architecture

Simple layered architecture. Every request travels this path:

```
Route → Middleware → Controller → Service → Model → MongoDB
```

| Layer | Responsibility |
|---|---|
| Routes | Maps URL + HTTP method to the right controller |
| Middlewares | Auth check, role check, file upload, input validation |
| Controllers | Handles request + response, delegates to service |
| Services | All business logic, DB queries, Cloudinary calls |
| MongoDB | Stores all structured data permanently |
| Cloudinary | Stores all images, returns permanent CDN URLs |

No Repository Pattern. No Factory Pattern. No Dependency Injection. No Event Bus. No Microservices. The objective is mastering backend fundamentals before introducing enterprise patterns.

---

## 🧰 Utility Functions

Only create utilities that solve a repeated problem:

```
utils/
├── generateToken.js     ← Creates JWT access + refresh tokens
├── generateOtp.js       ← Generates a random 6-digit OTP
├── sendEmail.js         ← Sends emails via Nodemailer
├── cloudinaryUpload.js  ← Uploads file buffer to Cloudinary
├── cloudinaryDelete.js  ← Deletes image from Cloudinary by publicId
└── slugify.js           ← "My Product Name" → "my-product-name"
```

If a helper doesn't significantly reduce duplication, don't create it.

---

## 🗄️ All Database Collections (13 Total)

| Collection | Purpose |
|---|---|
| users | All registered users (customer, supplier, admin) |
| sessions | Login sessions for refresh-token control, device tracking, and logout |
| otps | Temporary OTPs for verification and login |
| stores | Supplier store profiles |
| categories | Product categories |
| products | The full product catalog |
| wishlists | Customer wishlists |
| carts | Customer shopping carts |
| coupons | Discount codes |
| orders | Placed orders |
| payments | Payment records |
| reviews | Customer reviews |
| notifications | In-app alerts |

### 📐 Recommended Model Build Order

Build Mongoose models in this order — later models reference earlier ones:

```
1. User  →  2. Session  →  3. OTP  →  4. Store  →  5. Category  →  6. Product
→  7. Wishlist  →  8. Cart  →  9. Coupon  →  10. Order
→  11. Payment  →  12. Review  →  13. Notification
```

> Start simple. Create only required fields first, then add more as each phase begins.

---

## 📂 Project Folder Structure

Set this up in Phase 1 and fill it in as you progress. Everything has a fixed home.

```
shopkart-api/
│
├── src/
│   ├── config/
│   │   ├── db.config.js
│   │   ├── env.config.js
│   │   ├── cloudinary.config.js       ← Phase 4
│   │   └── mail.config.js             ← Phase 3
│   │
│   ├── constants/
│   │   ├── roles.constant.js          ← "customer", "supplier", "admin"
│   │   ├── orderStatus.constant.js    ← "pending", "confirmed", etc.
│   │   └── paymentStatus.constant.js  ← "pending", "paid", "failed", "refunded"
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── session.model.js
│   │   ├── otp.model.js
│   │   ├── store.model.js
│   │   ├── category.model.js
│   │   ├── product.model.js
│   │   ├── wishlist.model.js
│   │   ├── cart.model.js
│   │   ├── coupon.model.js
│   │   ├── order.model.js
│   │   ├── payment.model.js
│   │   ├── review.model.js
│   │   └── notification.model.js
│   │
│   ├── validations/                   ← Phase 20
│   │   ├── auth.validation.js
│   │   ├── user.validation.js
│   │   ├── store.validation.js
│   │   ├── product.validation.js
│   │   ├── cart.validation.js
│   │   ├── coupon.validation.js
│   │   ├── order.validation.js
│   │   └── review.validation.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js         ← Verifies JWT, attaches user to req
│   │   ├── role.middleware.js         ← Checks user role (RBAC)
│   │   ├── validate.middleware.js     ← Runs Zod schema against req.body/params/query
│   │   ├── upload.middleware.js       ← Multer config for file uploads
│   │   ├── error.middleware.js        ← Global error handler
│   │   └── rateLimit.middleware.js    ← Rate limiting per route group
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── generateOtp.js
│   │   ├── sendEmail.js
│   │   ├── cloudinaryUpload.js
│   │   ├── cloudinaryDelete.js
│   │   └── slugify.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   └── auth.service.js
│   │   ├── user/
│   │   │   ├── user.routes.js
│   │   │   ├── user.controller.js
│   │   │   └── user.service.js
│   │   ├── store/
│   │   │   ├── store.routes.js
│   │   │   ├── store.controller.js
│   │   │   └── store.service.js
│   │   ├── category/
│   │   │   ├── category.routes.js
│   │   │   ├── category.controller.js
│   │   │   └── category.service.js
│   │   ├── product/
│   │   │   ├── product.routes.js
│   │   │   ├── product.controller.js
│   │   │   └── product.service.js
│   │   ├── wishlist/
│   │   │   ├── wishlist.routes.js
│   │   │   ├── wishlist.controller.js
│   │   │   └── wishlist.service.js
│   │   ├── cart/
│   │   │   ├── cart.routes.js
│   │   │   ├── cart.controller.js
│   │   │   └── cart.service.js
│   │   ├── coupon/
│   │   │   ├── coupon.routes.js
│   │   │   ├── coupon.controller.js
│   │   │   └── coupon.service.js
│   │   ├── order/
│   │   │   ├── order.routes.js
│   │   │   ├── order.controller.js
│   │   │   └── order.service.js
│   │   ├── payment/
│   │   │   ├── payment.routes.js
│   │   │   ├── payment.controller.js
│   │   │   └── payment.service.js
│   │   ├── review/
│   │   │   ├── review.routes.js
│   │   │   ├── review.controller.js
│   │   │   └── review.service.js
│   │   ├── notification/
│   │   │   ├── notification.routes.js
│   │   │   ├── notification.controller.js
│   │   │   └── notification.service.js
│   │   └── admin/
│   │       ├── admin.routes.js
│   │       ├── admin.controller.js
│   │       └── admin.service.js
│   │
│   ├── routes/
│   │   └── index.routes.js            ← Mounts all module routes
│   │
│   ├── app.js                         ← Express setup (middlewares, routes, error handler)
│   └── server.js                      ← Entry point — starts the HTTP server
│
├── public/
│   └── temp/                          ← Temp files (if disk upload is needed)
│
├── docs/
│   ├── PRD.md
│   ├── API_ROUTES.md
│   └── POSTMAN.md
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### ⚡ Key File Relationships

```
server.js
    → connects to MongoDB (db.config.js)
    → starts app.js

app.js
    → mounts all middlewares
    → mounts index.routes.js

index.routes.js
    → imports every module's routes
    → mounts them at their base path (/api/auth, /api/products, etc.)

Each module (e.g. product/):
    product.routes.js      → applies middlewares + calls controller
    product.controller.js  → receives req, calls service, sends res
    product.service.js     → DB queries, Cloudinary calls, ownership checks
```

> Every request: `server → app → index.routes → module.routes → middleware(s) → controller → service → DB → response`. Know this flow and debugging becomes predictable.

---

## 📦 PHASES

---

## PHASE 1 — Project Foundation

### 🎯 Goal
Set up the basic skeleton. No models yet — pure infrastructure.

### 🧱 What You're Building
- A working Express server
- A MongoDB connection
- A `.env` file for all secret config values
- Global error handling via `error.middleware.js`

### 🔁 Request Flow
```
Incoming Request → Route → Controller → Service → Database → Response
```

### 💡 Why This Way?
Separating routes → controllers → services means each layer has exactly one job. When something breaks, you know which layer to look in. The consistent `{ status, message, data }` response shape makes frontend integration and Postman testing much easier.

---

## PHASE 2 — Authentication + Roles

### 🎯 Goal
Let all three user types (Customer, Supplier, Admin) register and log in securely. Set up role-based access control from day one.

### 🧱 What You're Building
- Register API (role is passed during registration)
- Login API (returns Access Token + Refresh Token)
- Logout API (revokes the current session)
- RBAC middleware (checks role before every protected route)

---

### 🗄️ Model 1: User

| Field | Type | Purpose |
|---|---|---|
| name | String | User's display name |
| email | String | Unique login email |
| password | String | Stored as bcrypt hash — NEVER plain text |
| role | String (enum) | `"customer"` / `"supplier"` / `"admin"` — default: `"customer"` |
| phone | String | Contact number |
| avatar | `{ url, publicId }` | Profile picture — added in Phase 5 |
| isEmailVerified | Boolean | Set to true after OTP verification (Phase 3) |
| addresses | Array | Customer delivery addresses — added in Phase 5 |
| isActive | Boolean | False = account is disabled |

> Start with just `name`, `email`, `password`, `role` for Phase 2. Add the rest as those phases arrive.

---

### 🗄️ Model 2: Session

| Field | Type | Purpose |
|---|---|---|
| userId | ObjectId (ref: User) | Which user owns this login session |
| hash | String | Hash of the refresh token/session token, never the raw token |
| ip | String | IP address used when the session was created |
| userAgent | String | Browser/app/device details from the request |
| revoked | Boolean | True after logout or manual session invalidation |
| timestamps | Date | `createdAt` and `updatedAt` for session tracking |

> Sessions let you support multiple devices, logout from one device, logout from all devices, and suspicious-login tracking later.

---

### 🔁 Register Flow
```
Submit name, email, password, role
    ↓
Validate inputs
    ↓
Check: email already exists?
    ↓
Hash password with bcrypt
    ↓
Save user (isEmailVerified = false)
    ↓
Return success message
```

### 🔁 Login Flow
```
Submit email + password
    ↓
Find user by email
    ↓
Compare password with bcrypt hash
    ↓
Generate Access Token (15 mins) + Refresh Token (7 days)
    ↓
Hash refresh token
    ↓
Create session document with userId, hash, ip, userAgent, revoked = false
    ↓
Return both tokens
```

### 🔁 Logout Flow
```
Request with valid access token
    ↓
Find current session
    ↓
Set session.revoked = true
    ↓
Logged out (access token expires on its own, refresh token can no longer be used)
```

### 🔁 RBAC Middleware Flow
```
Request hits protected route
    ↓
Read JWT from Authorization header
    ↓
Verify token — extract user ID and role
    ↓
Role permitted? → Controller runs
Not permitted? → 403 Forbidden
```

### 💡 Why This Way?
Passwords are hashed with bcrypt — a leaked database reveals nothing. Two tokens exist because the access token expires quickly (security), and the refresh token silently fetches a new one without forcing re-login. Storing only a hashed refresh token in a `sessions` collection means logout actually works, without saving raw tokens in the database.

---

## PHASE 3 — Email Verification + OTP

### 🎯 Goal
Verify that users own their email. Support OTP login, resend OTP, and forgot password.

### 🧱 What You're Building
- Email verification after registration
- OTP-based login (passwordless)
- Resend OTP
- Forgot password via OTP

---

### 🗄️ Model 3: OTP

| Field | Type | Purpose |
|---|---|---|
| user | ObjectId (ref: User) | Which user this OTP belongs to |
| email | String | Who this OTP belongs to |
| hashOtp | String | SHA-256 hash of the 6-digit OTP |
| purpose | String (enum) | `"email_verification"` / `"otp_login"` / `"forgot_password"` |
| expireAt | Date | OTP invalid after this timestamp |
| isUsed | Boolean | Marks OTP as consumed after first use |
| attempts | Number | Tracks failed attempts to prevent brute force |

> The `purpose` field prevents an OTP generated for login from being used to reset a password.

---

### 🔁 Email Verification Flow
```
POST /api/v1/auth/signup
    ↓
Validate body: name, email, password, phone, role?
    ↓
Invalid body?
    → 400 { status: false, message }
    ↓
Check user by email
    ↓
Email already exists?
    → 409 { status: false, message: "User already exists" }
    ↓
Hash password with bcrypt
    ↓
Create user with isEmailVerified = false
    ↓
Generate 6-digit OTP
    ↓
Hash OTP with SHA-256
    ↓
Create OTP document:
    user, email, hashOtp, purpose = "email_verification", expireAt = now + 10 mins
    ↓
Send OTP email
    ↓
Return 201 { status: true, message: "OTP sent to email" }

catch(error)
    → next(error)
    → errorMiddleware returns 500 if unhandled
```

### 🔁 Verify Email Route Flow
```
POST /api/v1/auth/verify-email
    ↓
Validate body: email, otp
    ↓
Invalid body?
    → 400 { status: false, message }
    ↓
Take otp + email from validated data
    ↓
Hash submitted OTP with SHA-256
    ↓
Find OTP document by:
    email,
    hashOtp,
    purpose = "email_verification",
    isUsed = false
    ↓
OTP document not found?
    → 400 { status: false, message: "Invalid OTP" }
    ↓
OTP expired? (otpDoc.expireAt < new Date())
    → delete OTPs for this email
    → 400 { status: false, message: "OTP Expired" }
    ↓
Find user by otpDoc.user
    ↓
User not found?
    → 404 { status: false, message: "User not found" }
    ↓
User already verified? (user.isEmailVerified === true)
    → 400 { status: false, message: "User already verified" }
    ↓
Update user:
    isEmailVerified = true
    ↓
Delete all OTPs for this user
    ↓
Return 200:
    {
      status: true,
      message: "Email verified successfully",
      user: { id, name, email, isEmailVerified }
    }

catch(error)
    → next(error)
    → errorMiddleware returns 500 if unhandled
```

### 🔁 Forgot Password Flow
```
User submits email
    ↓
Generate OTP → Save with purpose = "forgot_password" → Send
    ↓
User submits OTP + new password
    ↓
Verify OTP + expiry + purpose
    ↓
Hash new password → Update user document → Mark OTP as used
```

### 💡 Why This Way?
OTPs expire fast so they're useless if intercepted. `isUsed` prevents replaying the same OTP twice. `attempts` lets you lock out brute-force attackers. `purpose` ties each OTP to exactly one action.

---

## PHASE 4 — Multer + Cloudinary Setup

### 🎯 Goal
Build the image upload system as a reusable toolkit. No model — pure infrastructure. All later phases (5, 6, 8, 17) just call these helpers.

### 🧱 What You're Building
- Multer config: receives files in memory (not disk)
- Cloudinary config: connects using `.env` credentials
- File validator: type must be image, size must be under limit
- `uploadSingleImage(file)` helper
- `uploadMultipleImages(files)` helper
- `deleteImageFromCloudinary(publicId)` helper

### 🔁 How Any File Upload Works
```
Client sends request with image (multipart/form-data)
    ↓
Multer holds file in memory as a buffer
    ↓
Validate: correct image MIME type? Under size limit?
    ↓
Rejected → 400 error
Passed → Upload buffer to Cloudinary
    ↓
Cloudinary returns: url + publicId
    ↓
Save both to the database
```

### ⚠️ Why publicId Matters
`publicId` is the only way to delete an image from Cloudinary later. If you only store the URL and lose the `publicId`, the image stays on Cloudinary forever, consuming your quota. Always save both.

---

## PHASE 5 — User Profile + Avatar Upload

### 🎯 Goal
Let users view and update their profile. Let customers manage delivery addresses. Add avatar upload.

### 🧱 What You're Building
- Get profile API
- Update profile (name, phone)
- Upload / replace avatar
- Add / update / delete delivery addresses
- Set default address

### 🔁 Avatar Upload Flow
```
User sends new image file
    ↓
Validate file
    ↓
Does user already have avatar.publicId in DB?
    ↓
Yes → deleteImageFromCloudinary(avatar.publicId)
    ↓
Upload new image → get url + publicId
    ↓
Update user.avatar in DB → return updated profile
```

### 🔁 Set Default Address Flow
```
Customer selects an address as default
    ↓
Set isDefault = false on all addresses
    ↓
Set isDefault = true on the selected one
    ↓
Save user document
```

---

## PHASE 6 — Supplier Store Module

### 🎯 Goal
Let suppliers create a store profile with a logo. One store per supplier — enforce this.

### 🧱 What You're Building
- Create store + upload logo
- Update store info and logo
- Get store details (public)
- Admin verifies / approves a store

---

### 🗄️ Model 4: Store

| Field | Type | Purpose |
|---|---|---|
| supplier | ObjectId (ref: User) | The supplier who owns this store |
| storeName | String | Display name |
| slug | String | URL-safe version (e.g. `"tech-bazaar"`) |
| description | String | What the store sells |
| logo.url | String | Cloudinary URL |
| logo.publicId | String | For deleting old logo |
| contactEmail | String | Public contact email |
| contactPhone | String | Public contact phone |
| address | `{ city, state, pincode, country }` | Store location |
| isVerified | Boolean | Admin sets this to true after approving |
| isActive | Boolean | Can be toggled to deactivate a store |
| ratingAverage | Number | Average rating from product reviews |
| ratingCount | Number | Total ratings received |

---

### 🔁 Create Store Flow
```
Supplier sends store details + logo
    ↓
Check: does this supplier already have a store?
    ↓
Validate + upload logo to Cloudinary
    ↓
Generate slug from storeName
    ↓
Save store with isVerified = false, isActive = true
```

### 💡 Why This Way?
The `supplier` field is the ownership key for the marketplace. Products link back to a store and supplier. Verification is quality control — unverified stores can exist but their products shouldn't be publicly visible until approved.

---

## PHASE 7 — Categories

### 🎯 Goal
Organize products into categories for browsing and filtering.

### 🧱 What You're Building
- Admin creates, updates, and manages categories
- Admin uploads category image
- Customers view all active categories

---

### 🗄️ Model 5: Category

| Field | Type | Purpose |
|---|---|---|
| name | String | Display name (e.g. `"Electronics"`) |
| slug | String | URL-safe version |
| description | String | What falls under this category |
| image.url | String | Cloudinary URL |
| image.publicId | String | For deleting old image |
| isActive | Boolean | Inactive = hidden from customers |

---

### 💡 Why This Way?
Categories must exist before products — every product needs a category reference. `isActive` lets admins hide a category without deleting it.

---

## PHASE 8 — Product Module + Image Uploads

### 🎯 Goal
Build the core product catalog. Support multiple images. Enforce supplier ownership.

### 🧱 What You're Building
- Create product with multiple images
- Update product details
- Delete a specific product image
- Delist a product without deleting it
- Ownership enforcement: suppliers can only edit their own products

---

### 🗄️ Model 6: Product

| Field | Type | Purpose |
|---|---|---|
| title | String | Product name |
| slug | String | URL-safe version |
| description | String | Full description |
| brand | String | Brand name |
| category | ObjectId (ref: Category) | Which category |
| supplier | ObjectId (ref: User) | Which supplier listed it |
| store | ObjectId (ref: Store) | Which store it belongs to |
| price | Number | Original price |
| discountPrice | Number | Selling price after discount |
| stock | Number | Units available |
| images | Array of `{ url, publicId }` | All product images |
| specifications | Array of `{ key, value }` | Tech specs or product details |
| ratingAverage | Number | Stored average rating |
| ratingCount | Number | Total reviews |
| isActive | Boolean | False = delisted |
| isFeatured | Boolean | Admin can feature products on homepage |

---

### 🔁 Supplier Ownership Check
```
Supplier sends a modification request
    ↓
Fetch product from DB
    ↓
Compare product.supplier with req.user._id
    ↓
Match → Allow
No match → 403 Forbidden
```

### ⚠️ Important Rules
- Suppliers can only update/delete **their own** products
- Admins can update **any** product
- Always display `discountPrice` when it exists, not `price`
- `isActive = false` hides the product but keeps order history intact

---

## PHASE 9 — Search + Filtering + Pagination

### 🎯 Goal
Help customers find products through search, filters, and sorting — efficiently.

### 🧱 What You're Building
- Text search by title or brand
- Filter by category, price range, brand, store, minimum rating
- Sort by price, newest, highest rated
- Pagination with total count

### 🔁 Flow
```
Request with query params:
  ?search=phone&category=electronics&minPrice=5000&maxPrice=20000&sort=price_asc&page=1&limit=20
    ↓
Build MongoDB filter object from params
    ↓
Apply text search, filters, and sort — all at the DB level
    ↓
Run count query → total matching products
    ↓
Run paginated query → products for this page
    ↓
Return: products + totalCount + currentPage + totalPages
```

### 💡 Why This Way?
Every filter runs inside the MongoDB query — not in JavaScript after fetching. For a 50,000-product catalog, JavaScript filtering would be catastrophically slow. Returning `totalCount` lets the frontend show "1–20 of 847 results" without a separate request.

---

## PHASE 10 — Wishlist

### 🎯 Goal
Let customers save products and move them to cart when ready.

### 🧱 What You're Building
- Add / remove product from wishlist
- View full wishlist (with product details)
- Move wishlist item to cart

---

### 🗄️ Model 7: Wishlist

| Field | Type | Purpose |
|---|---|---|
| user | ObjectId (ref: User) | Which customer owns this wishlist |
| products[].product | ObjectId (ref: Product) | The wishlisted product |
| products[].addedAt | Date | When it was saved |

---

### 🔁 Add to Wishlist Flow
```
Customer saves a product
    ↓
Already in wishlist? → Return "already wishlisted"
Not in wishlist? → Push to products array
```

---

## PHASE 11 — Cart

### 🎯 Goal
Let customers collect items with quantities, see a running total, and apply coupons before checkout.

### 🧱 What You're Building
- Add item (with live stock check)
- Update quantity
- Remove item
- View cart with calculated totals

---

### 🗄️ Model 8: Cart

| Field | Type | Purpose |
|---|---|---|
| user | ObjectId (ref: User) | Which customer's cart |
| items[].product | ObjectId (ref: Product) | The product |
| items[].quantity | Number | Units |
| items[].priceAtAddition | Number | Price when added |
| coupon | ObjectId (ref: Coupon) | Applied coupon (optional) |
| subtotal | Number | Total before discount |
| discount | Number | Discount from coupon |
| total | Number | Final amount |

---

### 🔁 Add to Cart Flow
```
Customer adds product + quantity
    ↓
Fetch product → check stock
    ↓
Not enough stock? → Return error
Already in cart? → Update quantity + recalculate
New item? → Add to cart + recalculate
```

### 🔁 Total Calculation
```
subtotal = sum of (quantity × current price) for all items
discount = coupon discount (0 if none)
total    = subtotal - discount
```

---

## PHASE 12 — Coupons

### 🎯 Goal
Let admins create discount codes with rules and limits. Let customers apply them at checkout.

### 🧱 What You're Building
- Admin creates, updates, and deactivates coupons
- Customer applies a coupon (validate all rules before applying)
- Customer removes a coupon from cart

---

### 🗄️ Model 9: Coupon

| Field | Type | Purpose |
|---|---|---|
| code | String | The code customers type (e.g. `"SAVE20"`) |
| discountType | String (enum) | `"percentage"` or `"fixed"` |
| discountValue | Number | 20 = 20% off, or ₹200 flat |
| minimumOrderAmount | Number | Cart subtotal must be at least this |
| maximumDiscountAmount | Number | Cap on percentage discounts |
| usageLimit | Number | Total times this code can be used |
| usedCount | Number | Times used so far |
| expiresAt | Date | Coupon stops working after this |
| isActive | Boolean | Admin can deactivate manually |

---

### 🔁 Apply Coupon Flow
```
Customer enters coupon code
    ↓
Check 1: coupon exists?
Check 2: isActive = true?
Check 3: not expired?
Check 4: usedCount < usageLimit?
Check 5: cart subtotal ≥ minimumOrderAmount?
    ↓
All pass → calculate discount → save coupon to cart
```

---

## PHASE 13 — Orders

### 🎯 Goal
Convert a cart into a confirmed, permanent order — with a full price and product snapshot.

### 🧱 What You're Building
- Checkout API: cart → order document
- Snapshot: title, image, price, supplier, store per item
- Snapshot: shipping address
- Cart is cleared after order is created

---

### 🗄️ Model 10: Order

| Field | Type | Purpose |
|---|---|---|
| user | ObjectId (ref: User) | Customer who placed the order |
| items[].product | ObjectId (ref: Product) | Product reference |
| items[].supplier | ObjectId (ref: User) | Supplier who owns this item |
| items[].store | ObjectId (ref: Store) | Store this item came from |
| items[].title | String | **Snapshot** — product name at purchase time |
| items[].image | String | **Snapshot** — product image at purchase time |
| items[].price | Number | **Snapshot** — price at purchase time |
| items[].quantity | Number | Units ordered |
| items[].totalPrice | Number | price × quantity |
| shippingAddress | Full address object | **Snapshot** — copied from user's address |
| coupon | ObjectId (ref: Coupon) | Applied coupon (optional) |
| subtotal | Number | Total before discount |
| discount | Number | Discount applied |
| shippingFee | Number | Delivery charge |
| totalAmount | Number | Final amount paid |
| paymentStatus | String (enum) | `"pending"` / `"paid"` / `"failed"` / `"refunded"` |
| orderStatus | String (enum) | `"pending"` / `"confirmed"` / `"packed"` / `"shipped"` / `"delivered"` / `"cancelled"` |
| paidAt | Date | When payment was confirmed |
| deliveredAt | Date | When order was delivered |

---

### ⚠️ Why Store Snapshots?

This is one of the most important design decisions in the project:

- `title`, `image`, `price` are copied from the product at checkout
- If the product's price changes next week, the order still shows what was actually paid
- If the product is deleted, the order history is still readable
- The shipping address is also snapshotted — editing your address later won't change past orders

This is how every real e-commerce platform works. The order is a legal record of the transaction.

---

## PHASE 14 — Payments (Razorpay)

### 🎯 Goal
Accept real online payments. Create the payment on the backend (amount can't be tampered with), verify it after the customer pays, confirm the order.

### 🧱 What You're Building
- Create Razorpay order (backend — before showing payment UI)
- Verify payment after customer pays (HMAC signature check)
- Handle payment failure

---

### 🗄️ Model 11: Payment

| Field | Type | Purpose |
|---|---|---|
| order | ObjectId (ref: Order) | Links payment to the order |
| user | ObjectId (ref: User) | Who paid |
| razorpayOrderId | String | ID Razorpay generates when creating an order |
| razorpayPaymentId | String | ID Razorpay gives after payment succeeds |
| razorpaySignature | String | HMAC signature for verification |
| amount | Number | Amount in paise (₹1 = 100 paise) |
| currency | String | `"INR"` |
| status | String (enum) | `"created"` / `"success"` / `"failed"` / `"refunded"` |
| paidAt | Date | Timestamp of successful payment |

---

### 🔁 Payment Flow
```
Step 1 — Backend creates Razorpay order
    Customer clicks "Pay Now"
    Backend calls Razorpay: createOrder(amount, currency)
    Save payment doc with status = "created"
    Send razorpayOrderId to frontend

Step 2 — Customer pays (frontend)
    Razorpay popup → customer pays
    Razorpay returns: razorpay_order_id, razorpay_payment_id, razorpay_signature

Step 3 — Backend verifies
    Frontend sends all three values to backend
    Backend checks:
        expectedSignature = HMAC_SHA256(orderId + "|" + paymentId, secret)
    Match → Payment real:
        Update payment: status = "success"
        Update order: paymentStatus = "paid", orderStatus = "confirmed"
        Trigger inventory reduction (Phase 15)
    No match → Payment fake:
        Update payment: status = "failed"
        Return 400 error
```

### ⚠️ Always create the Razorpay order on the backend. If you create it on the frontend, a user could change the amount in browser devtools. The backend takes the amount from its own database — the customer can't touch it.

---

## PHASE 15 — Inventory Management

### 🎯 Goal
Keep stock accurate after every confirmed payment and every cancellation.

### 🧱 What You're Building
- Reduce stock after payment is confirmed
- Mark product unavailable if stock hits 0
- Restore stock on cancellation
- Prevent overselling with atomic DB operations

---

> No new model. This phase adds logic to the `stock` and `isActive` fields on the Product model.

---

### 🔁 Stock Reduction
```
Payment verified as successful
    ↓
For each order item:
    Atomically reduce product.stock by item.quantity (using $inc)
    ↓
If stock reaches 0 → set product.isActive = false
```

### 🔁 Stock Restore on Cancellation
```
Order cancelled
    ↓
For each order item:
    Add item.quantity back to product.stock
    ↓
If product was out of stock → set isActive = true
```

### ⚠️ Use MongoDB's `findOneAndUpdate` with a condition: only reduce stock if current stock >= requested quantity. This prevents two simultaneous purchases both succeeding when only one unit remains.

---

## PHASE 16 — Order Lifecycle (Status Tracking)

### 🎯 Goal
Track every order from placement to delivery. Give suppliers visibility into orders for their products.

---

> No new model. Uses the `orderStatus` field on the Order model.

---

### 🔁 Status Journey
```
Pending → Confirmed → Packed → Shipped → Delivered
                                (or Cancelled before Delivered)
```

| Status | Who Sets It |
|---|---|
| Pending | System (auto on payment success) |
| Confirmed | Admin |
| Packed | Admin |
| Shipped | Admin |
| Delivered | Admin |
| Cancelled | Admin or Customer (before shipping) |

### 🔁 Supplier Order View
```
Supplier requests "my orders"
    ↓
Query orders where items[].supplier = this supplier's ID
    ↓
Return only items belonging to this supplier
    (other suppliers' items in the same order are hidden)
```

---

## PHASE 17 — Reviews + Review Images

### 🎯 Goal
Let customers leave reviews (with optional photos) on products they actually received. Auto-update product ratings.

### 🧱 What You're Building
- Submit review with optional images (after delivery only)
- One review per user per product
- Auto-update product `ratingAverage` and `ratingCount`

---

### 🗄️ Model 12: Review

| Field | Type | Purpose |
|---|---|---|
| product | ObjectId (ref: Product) | Which product |
| user | ObjectId (ref: User) | Who wrote it |
| order | ObjectId (ref: Order) | Proof of purchase |
| rating | Number (1–5) | Star rating |
| comment | String | Review text |
| images | Array of `{ url, publicId }` | Optional review photos |
| isVerifiedPurchase | Boolean | True if purchase confirmed |

---

### 🔁 Submit Review Flow
```
Customer wants to review a product
    ↓
Check: delivered order exists for this customer + product?
    ↓
No → "You can only review products you've received"
Yes → Already reviewed? → "You've already reviewed this product"
    ↓
Save review with isVerifiedPurchase = true
    ↓
Upload any images to Cloudinary
    ↓
Recalculate product.ratingAverage and ratingCount
```

---

## PHASE 18 — Notifications

### 🎯 Goal
Automatically inform users about key events — orders, payments, deliveries.

### 🧱 What You're Building
- Notification documents created automatically on key events
- Customer views all notifications
- Customer marks notifications as read

---

### 🗄️ Model 13: Notification

| Field | Type | Purpose |
|---|---|---|
| user | ObjectId (ref: User) | Who receives this |
| title | String | Short heading (e.g. "Order Shipped!") |
| message | String | Full notification text |
| type | String (enum) | `"order"` / `"payment"` / `"coupon"` / `"review"` / `"system"` |
| isRead | Boolean | false = unread |
| relatedOrder | ObjectId (ref: Order) | Optional link |
| relatedProduct | ObjectId (ref: Product) | Optional link |

---

### 🔁 When Notifications Are Created

| Event | Who Gets It | Type |
|---|---|---|
| Payment Success | Customer | `"payment"` |
| Order Confirmed | Customer | `"order"` |
| Order Shipped | Customer | `"order"` |
| Order Delivered | Customer | `"order"` |
| New Order Placed | Supplier | `"order"` |

---

## PHASE 19 — Admin Dashboard APIs

### 🎯 Goal
Give admins full visibility and control over the entire platform.

### 🧱 What Admin Can Do

| Feature | Actions |
|---|---|
| Users | View all, activate/deactivate accounts |
| Suppliers | View all, verify/reject their stores |
| Products | View, edit, or remove any product |
| Orders | View all, filter by status, update status |
| Payments | View all payment records |
| Coupons | Create, update, deactivate |

> No new models. All admin APIs operate on existing collections.

---

## PHASE 20 — Security + Validation

### 🎯 Goal
Make every API production-ready: validated, sanitized, protected.

| Layer | Tool | What It Does |
|---|---|---|
| Input Validation | **Zod** | Validates request body, params, query before controllers |
| HTTP Headers | **Helmet** | Prevents XSS, clickjacking, MIME sniffing |
| Rate Limiting | **express-rate-limit** | Caps requests per IP per minute |
| Password Hashing | **bcrypt** | Built in Phase 2, audited here |
| Auth Tokens | **JWT** | Audited across all protected routes |
| File Safety | Multer + custom | Rejects wrong types and oversized files |
| Role Enforcement | RBAC Middleware | Audited on every route |

### 🔁 Validation Flow
```
Request arrives
    ↓
Zod validates against the route's schema
    ↓
Invalid → 400 Bad Request with field + error message
Valid → Cleaned data passed to controller
```

### ⚠️ Rate Limiting Strategy
- Login / Register: 5–10 requests per 15 minutes per IP
- OTP requests: 3–5 per 15 minutes
- General API: 100 per minute per IP

---

## PHASE 21 — Testing + Documentation

### 🎯 Goal
Ensure everything works end to end and document it clearly.

### 🧱 What You're Delivering

**Postman Collection**
- Every API organized by module
- Example request body and expected response per route
- Edge cases: wrong password, expired OTP, out of stock, expired coupon, unauthorized access
- Environment variables set up (baseUrl, token, etc.)

**Project README**
- Project overview and tech stack
- Local setup instructions
- `.env` variables list
- API route table: Method | Path | Auth Required | Description

### ✅ Final Quality Checklist
- No broken routes (every route returns a response, even on errors)
- No duplicate logic (shared logic lives in services)
- Consistent response format: `{ status, message, data }` on every API
- Every error has a clear message and the right HTTP status code
- No sensitive data in responses (passwords, tokens, secrets)
- All Cloudinary images cleaned up when replaced
- All role checks verified (admin routes return 403 for customers)
- All ownership checks verified (editing another supplier's product returns 403)

---

## 📁 Where Images Are Used

| Feature | Upload Type | Model Field | Who Uploads |
|---|---|---|---|
| User Avatar | Single | `user.avatar` | Customer / Supplier / Admin |
| Category Image | Single | `category.image` | Admin |
| Store Logo | Single | `store.logo` | Supplier |
| Product Images | Multiple | `product.images[]` | Supplier / Admin |
| Review Photos | Multiple | `review.images[]` | Customer |

---

## 🗂️ All 21 Phases at a Glance

| Phase | Name | Model Built | Key Skill |
|---|---|---|---|
| 1 | Project Foundation | — | Express, MongoDB, error handling, folder structure |
| 2 | Auth + Roles | **User, Session** | Register, Login, JWT, session tracking, RBAC middleware |
| 3 | Email Verification + OTP | **OTP** | Nodemailer, OTP flows, forgot password |
| 4 | Multer + Cloudinary Setup | — | File upload helpers |
| 5 | User Profile + Avatar | User (avatar + addresses) | Profile CRUD, avatar upload |
| 6 | Supplier Store | **Store** | Store creation, logo upload, verification |
| 7 | Categories | **Category** | Category CRUD, slug, category image |
| 8 | Product Module + Images | **Product** | Catalog, multi-image, ownership enforcement |
| 9 | Search + Filter + Pagination | — | DB-level filtering, pagination |
| 10 | Wishlist | **Wishlist** | Save for later, move to cart |
| 11 | Cart | **Cart** | Stock check, quantities, totals |
| 12 | Coupons | **Coupon** | Discount logic, validation chain |
| 13 | Orders | **Order** | Checkout, price snapshot, supplier reference |
| 14 | Payments | **Payment** | Razorpay, HMAC signature verification |
| 15 | Inventory | — | Atomic stock operations, oversell prevention |
| 16 | Order Lifecycle | — | Status flow, supplier order view |
| 17 | Reviews + Images | **Review** | Post-delivery reviews, rating recalculation |
| 18 | Notifications | **Notification** | Event-driven alerts, read/unread |
| 19 | Admin Dashboard | — | Full platform control, supplier verification |
| 20 | Security + Validation | — | Zod, Helmet, rate limiting |
| 21 | Testing + Docs | — | Postman collection, final checklist |

---

## 💡 Code Philosophy

```
Clarity > Abstraction
Learning > Boilerplate Reduction
Explicit Error Handling > Hidden Error Handling
```

Every file should be understandable by a developer with 6 months of Node.js experience. Take it one phase at a time. Build the model first, then the routes, then test in Postman before moving on. Understand **why** each decision is made, not just how to implement it. 🚀
