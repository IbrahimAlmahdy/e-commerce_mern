# NEXORA — Full-Stack E-Commerce Application

NEXORA is a full-stack E-Commerce application built with the MERN stack and TypeScript. It provides a shopping experience with user authentication, product browsing, shopping cart management, checkout, and order tracking.

The project follows a feature-based frontend architecture, with a RESTful backend API powering the application.

## Project Status

**Backend:** Completed

**Frontend:** Implemented and integrated with the backend — currently under development and continuous improvement.

The core authentication, product browsing, shopping cart, checkout, and order management workflows are implemented.

## Features

### Authentication

- User Registration and Login
- JWT Authentication
- Protected Routes
- Persistent Authentication State

### Products

- Product Listing
- Product Details
- Product Search
- Product Sorting
- Add to Cart

### Shopping Cart

- Add Items to Cart
- Update Item Quantities
- Remove Items from Cart
- Clear Cart
- Cart Total Calculation

### Orders & Checkout

- Checkout Functionality
- Order Creation
- Order History
- Order Success Page

### Application Architecture

- Feature-Based Frontend Architecture
- Centralized Application Providers
- Server State Management with TanStack Query
- Global Authentication State with Zustand
- Reusable UI Components
- Centralized Axios Configuration
- Environment Variables Configuration
- Error and Loading State Handling

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- TanStack Query
- Zustand
- Axios
- Lucide React

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- MongoDB
- Mongoose

### Authentication

- JSON Web Tokens (JWT)

### Development Tools

- Git & GitHub
- Postman
- npm
- Visual Studio Code

## Project Structure

```text
e-commerce_mern/
backend/
├── src/
│   ├── middlewares/
│   │   └── validateJWT.ts
│   ├── models/
│   │   ├── cartModel.ts
│   │   ├── orderModel.ts
│   │   ├── productModel.ts
│   │   └── userModel.ts
│   ├── routes/
│   │   ├── cartRoute.ts
│   │   ├── ProductRoute.ts
│   │   └── userRoute.ts
│   ├── services/
│   │   ├── cartService.ts
│   │   ├── productService.ts
│   │   └── userService.ts
│   └── index.ts
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── providers/
│   │   │   ├── routes/
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── constants/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── cart/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   └── wishlist/
│   │   ├── lib/
│   │   ├── theme/
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB

### Clone the Repository

```bash
git clone https://github.com/IbrahimAlmahdy/e-commerce_mern.git
cd e-commerce_mern
```

### Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend directory and configure the required environment variables based on `.env.example`.

Never commit your actual `.env` file or expose sensitive credentials.

Start the development server:

```bash
npm run dev
```

The backend runs on port `3001` by default, depending on your environment configuration.

### Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file inside the frontend directory:

```env
VITE_API_URL=http://localhost:3001
```

Start the development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

### Available Frontend Scripts

```bash
npm run dev
npm run build
npm run lint
```

## API Integration

The frontend communicates with the backend through RESTful APIs using Axios.

Implemented API endpoints include:

| Method | Endpoint                 | Description                  |
| ------ | ------------------------ | ---------------------------- |
| POST   | `/user/register`         | Register a new user          |
| POST   | `/user/login`            | Authenticate a user          |
| GET    | `/product`               | Retrieve products            |
| GET    | `/cart`                  | Retrieve the user's cart     |
| DELETE | `/cart`                  | Clear the cart               |
| POST   | `/cart/items`            | Add an item to the cart      |
| PUT    | `/cart/items`            | Update cart item quantity    |
| DELETE | `/cart/items/:productId` | Remove an item from the cart |
| POST   | `/cart/checkout`         | Complete checkout            |
| GET    | `/cart/orders`           | Retrieve order history       |

Protected endpoints require a valid JWT passed through the `Authorization` header using the `Bearer Token` scheme.

## Architecture

The frontend follows a **Feature-Based Architecture**, organizing code by business functionality rather than technical file type alone.

Each feature maintains its own responsibilities, including:

- Pages
- Components
- Hooks
- Services
- Types
- State Management where needed

Application-level concerns such as routing, providers, shared UI components, API configuration, and theme management are maintained separately.

This structure improves maintainability, scalability, and separation of concerns.

## Future Improvements

- Implement Wishlist Functionality
- Enhance Product Details Experience
- Improve Checkout and Order Management
- Add Automated Testing
- Improve Overall User Experience
- Deploy the Full-Stack Application

## Author

**Ibrahim Almahdy**

- GitHub: [IbrahimAlmahdy](https://github.com/IbrahimAlmahdy)
- LinkedIn: [Ibrahim Almahdy](https://www.linkedin.com/in/ibrahim-almahdy-eng/)

---

This project is part of my journey in Full-Stack Web Development. More features and improvements are coming soon.
