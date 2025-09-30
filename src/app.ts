// src/app.ts
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import apiRoutes from "./routes/index"; 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger setup
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Murakoze API",
      version: "1.0.0",
      description: "Auto-generated Swagger docs from route annotations",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // 👈 scans your generated route files
};

const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount auto-generated routes
app.use("/api", apiRoutes);

// Example: you can keep your manual routes too if needed
// import userRoutes from "./routes/users";
// app.use("/api/users", userRoutes);

export default app;
