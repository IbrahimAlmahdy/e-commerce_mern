# E-Commerce Application

A full-stack E-Commerce application currently under development. The backend provides RESTful APIs for user authentication, product management, shopping cart operations, order management, and checkout functionality.

## Project Status

**Backend: Completed**

The backend APIs have been implemented and tested using Postman. The next step is to build the frontend and integrate it with the backend to complete the application.

## Features

- User Registration and Login
- JWT Authentication and Protected Routes
- Product Management APIs
- Shopping Cart Management:
  - Add items to cart
  - Update item quantities
  - Remove items from cart
  - Clear the cart
- Order Management
- Checkout Functionality
- Environment Variables Configuration
- Error Handling using try-catch

## Tech Stack

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
- dotenv

## Project Structure

```text
e-commerce_mern/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middlewares/
│   │   └── index.ts
│   ├── .env.example
│   └── package.json
├── frontend/          # Planned
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
```

### Navigate to the Backend Directory

```bash
cd e-commerce_mern/backend
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file inside the `backend` directory and configure the required variables based on `.env.example`.

Never commit your actual `.env` file or expose sensitive credentials in your repository.

### Run the Development Server

```bash
npm run dev
```

The server runs on port `3001` by default, depending on your environment configuration.

## API Testing

The backend APIs have been tested using Postman.

The API includes endpoints for:

- User registration and login
- Product management
- Retrieving the authenticated user's cart
- Adding items to the cart
- Updating cart item quantities
- Removing items from the cart
- Clearing the cart
- Order management and checkout

Protected routes require a valid JWT passed through the `Authorization` header using the `Bearer Token` scheme.

## Future Improvements

- Build the frontend
- Integrate the frontend with the backend API
- Improve the overall user experience
- Deploy the complete full-stack application

## Author

**Ibrahim Almahdy**

- GitHub: [IbrahimAlamhdy](https://github.com/IbrahimAlmahdy)
- LinkedIn: [Ibrahim Almahdy](https://www.linkedin.com/in/ibrahim-almahdy-eng/)

---

This project is part of my journey in backend and full-stack development. More updates will be shared as development progresses.
