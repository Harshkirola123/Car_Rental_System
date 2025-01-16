# Car_Rental_System
Overview

The Car Rental System is a backend application that allows managing car rentals, vehicle availability tracking, and user booking management. 
It supports features like user profiles (with KYC), vehicle listings, booking conflict resolution, a dummy payment gateway, and booking history with cancellation policies.

This system can be used for:

Local car rental services

Corporate fleet management

Integration with GPS tracking systems (future feature)

Features
User Profiles & KYC: Renters and admins can create profiles, complete KYC, and access personal information.

Vehicle Listing & Availability: List vehicles and check availability.
Booking Management: Renters can create bookings with conflict resolution.
Payment Gateway (Dummy): A dummy payment gateway simulates real payment processing.

Booking History & Cancellations: Renters can view their booking history and cancel bookings as per policies.
Technologies

Backend: Node.js, Express.js

Language: TypeScript

Database: MongoDB (using Mongoose ORM)

Authentication: JWT (JSON Web Tokens)

Payment Integration: Dummy payment gateway for testing

Other Libraries: Mongoose, Passport.js (authentication), Axios (API requests)

Setup & Installation

Follow these steps to set up the project locally.

Prerequisites

Ensure you have the following installed on your machine:

Node.js (v14 or above)

MongoDB (local or using MongoDB Atlas)

Installation Steps
Clone the repository:


git clone https://github.com/your-username/car-rental-system.git
cd car-rental-system
Install dependencies:

Use the following command to install the necessary packages:


npm install
Since we're using TypeScript, ensure you have the required TypeScript dependencies:


npm install --save-dev typescript @types/node @types/express @types/mongoose
Setup environment variables:

Create a .env file in the root directory and define the following variables:


MONGO_URI=<your-mongo-db-uri>

JWT_SECRET=<your-jwt-secret>

PAYMENT_GATEWAY_API_KEY=<your-dummy-payment-api-key>

Compile TypeScript:

The code is written in TypeScript, so you need to compile it before running it. You can use the following command to compile TypeScript files:

npx tsc
Alternatively, you can use ts-node for development purposes (this will allow running TypeScript directly without pre-compiling):


npm install --save-dev ts-node

Start the server:

To start the application, use the following command:

npm run start

By default, the server will be running at http://localhost:5000.

If you're using ts-node for development, run:

npm run dev

The app will automatically reload when you make changes to TypeScript files.

Project Structure

Here’s a high-level overview of the project structure:

![Screenshot 2025-01-16 at 18 51 39](https://github.com/user-attachments/assets/de61571f-c87d-4094-8c7a-fb41244869d8)

Example API Endpoints

POST /auth/register – Register a new user (Renter/Admin).

POST /auth/login – User login (returns JWT token).

GET /vehicles – Get a list of available vehicles.

POST /bookings – Create a new booking.

GET /bookings/:userId – Get booking history for a user.

POST /payments – Simulate payment for a booking (Dummy).

PUT /bookings/cancel/:bookingId – Cancel a booking.

Testing the Application

You can test the application endpoints using Postman.

Register a user via POST /auth/register.

Login via POST /auth/login to get a JWT token.

Use the JWT token to access protected routes such as creating bookings and viewing booking history.

TypeScript Compilation

If you want to build the project into JavaScript, you can use the following command:


npm run build

This will compile all TypeScript files into JavaScript and output them to the dist/ directory.

Development Mode

For automatic compilation and server restart during development, use ts-node:


npm run dev

This command runs ts-node and watches for changes to TypeScript files.

Contributing

We welcome contributions to the project! Please follow these steps to contribute:

Fork the repository.

Create a new branch: git checkout -b feature/feature-name.

Commit your changes: git commit -am 'Add new feature'.

Push to your branch: git push origin feature/feature-name.

Submit a pull request.

License

This project is licensed Harshit Kirola.

Acknowledgements

Express.js for the web framework.

MongoDB & Mongoose altas for database management.

JWT for user authentication.

TypeScript for type safety and better code maintainability.

This updated README is now specific to your Node.js + Express + TypeScript setup and includes relevant details about installing, running, and contributing to the project. You can expand the instructions based on your specific needs, but this should provide a solid starting point!
