
const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Car Rental API",
    description: "API documentation for the Car Rental system",
  },
  host: "localhost:5000",
  schemes: ["http"],
  securityDefinitions: {
    BearerAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description: "Enter your Bearer token here",
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  definitions: {
    User: {
      type: "object",
      properties: {
        _id: { type: "string", description: "User ID" },
        name: { type: "string", description: "User's name" },
        email: { type: "string", description: "User's email" },
        role: { type: "string", description: "User's role (USER or ADMIN)" },
        kycCompleted: { type: "boolean", description: "Whether the KYC process is completed" },
      },
    },
    Car: {
      type: "object",
      properties: {
        _id: { type: "string", description: "Car ID" },
        name: { type: "string", description: "Car name" },
        pricePerDay: { type: "number", description: "Price per day for rental" },
        available: { type: "boolean", description: "Whether the car is available for rent" },
      },
    },
    Rental: {
      type: "object",
      properties: {
        _id: { type: "string", description: "Rental ID" },
        user: { type: "string", description: "User ID who rented the car" },
        car: { type: "string", description: "Car ID rented" },
        startDate: { type: "string", description: "Rental start date" },
        endDate: { type: "string", description: "Rental end date" },
        status: { type: "string", description: "Rental status (pending, active, completed)" },
        paymentStatus: { type: "string", description: "Payment status (paid, pending)" },
      },
    },
  },
};

const outputFile = "./swagger_output.json"; // Path to the generated Swagger JSON file
const endpointsFiles = ["./index.ts"]; // Path to all your route files (adjust as needed)

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger documentation generated!");
});
