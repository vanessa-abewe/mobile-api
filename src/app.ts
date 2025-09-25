import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import userRoutes from "./routes/user";
import categories2Routes from "./routes/categories2";
const app = express();
app.use(cors());
app.use(express.json());

// Swagger setup
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mobile API",
      version: "1.0.0",
      description: "Auto-generated Swagger docs from route annotations"
    }
  },
  apis: ["./src/routes/*.ts"], // 👈 scans your routes folder for docs
};

const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes

app.use("/users", userRoutes);
app.use("/categories2", categories2Routes);
export default app;
