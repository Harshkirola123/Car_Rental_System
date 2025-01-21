# Car Rental System

## Overview

The **Car Rental System** is a backend application that allows managing car rentals, vehicle availability tracking, and user booking management. It supports features like user profiles (with KYC), vehicle listings, booking conflict resolution, a dummy payment gateway, and booking history with cancellation policies.

This system can be used for:

- **Local car rental services**
- **Corporate fleet management**
- **Integration with GPS tracking systems** (future feature)

## Features

- **User Profiles & KYC**: Renters and admins can create profiles, complete KYC, and access personal information.
- **Vehicle Listing & Availability**: List vehicles and check availability.
- **Booking Management**: Renters can create bookings with conflict resolution.
- **Payment Gateway (Dummy)**: A dummy payment gateway simulates real payment processing.
- **Booking History & Cancellations**: Renters can view their booking history and cancel bookings as per policies.

## Technologies

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB (using Mongoose ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Integration**: Dummy payment gateway for testing
- **Other Libraries**: Mongoose, Passport.js (authentication), Axios (API requests)

## Setup & Installation

Follow these steps to set up the project locally:

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v14 or above)
- MongoDB (local or using MongoDB Atlas)

### Installation Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/car-rental-system.git
   cd car-rental-system
   ```

2. **Install dependencies**:
   Use the following command to install the necessary packages:

   ```bash
   npm install
   ```

   Since we're using TypeScript, ensure you have the required TypeScript dependencies:

   ```bash
   npm install --save-dev typescript @types/node @types/express @types/mongoose
   ```

3. **Setup environment variables**:
   Create a `.env` file in the root directory and define the following variables:

   ```
   MONGO_URI=<your-mongo-db-uri>
   JWT_SECURITY_REFRESH=<your-jwt-secret-refresh>
   JWT_SECURITY_ACCESS = <your-jwt-secret-access>
   PORT = <your-port-number>
   PAYMENT_GATEWAY_API_KEY=<your-dummy-payment-api-key>
   ```

4. **Compile TypeScript**:
   The code is written in TypeScript, so you need to compile it before running it. You can use the following command to compile TypeScript files:

   ```bash
   npx tsc
   ```

   Alternatively, you can use **ts-node** for development purposes (this will allow running TypeScript directly without pre-compiling):

   ```bash
   npm install --save-dev ts-node
   ```

5. **Start the server**:
   To start the application, use the following command:

   ```bash
   npm run start
   ```

   By default, the server will be running at [http://localhost:5000](http://localhost:5000).

   If you're using **ts-node** for development, run:

   ```bash
   npm run dev
   ```

   The app will automatically reload when you make changes to TypeScript files.

## Project Structure

Here’s a high-level overview of the project structure:

![Screenshot 2025-01-21 at 15 47 35](https://github.com/user-attachments/assets/27b40167-6cc6-4c1e-9aff-b5aaf336b413)


## Example API Endpoints

- `POST /auth/register`: Register a new user (Renter/Admin).
- `POST /auth/login`: User login (returns JWT token).
- `GET /vehicles`: Get a list of available vehicles.
- `POST /bookings`: Create a new booking.
- `GET /bookings/:userId`: Get booking history for a user.
- `POST /payments`: Simulate payment for a booking (Dummy).
- `PUT /bookings/cancel/:bookingId`: Cancel a booking.

## Testing the Application

You can test the application endpoints using Postman:

1. **Register a user** via `POST /auth/register`.
2. **Login** via `POST /auth/login` to get a JWT token.
3. **Use the JWT token** to access protected routes such as creating bookings and viewing booking history.

## TypeScript Compilation

If you want to build the project into JavaScript, you can use the following command:

```bash
npm run build
```
