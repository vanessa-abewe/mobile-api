import express from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"

import categories2Routes from "./routes/categories2"
import authRoutes from "./routes/auth"
import businessRoutes from "./routes/businesses"
import reviewRoutes from "./routes/reviews"
import userRoutes from "./routes/users"
import recommendationRoutes from "./routes/recommendations"
import locationRoutes from "./routes/locations"
import searchRoutes from "./routes/search"
import notificationRoutes from "./routes/notifications"
import analyticsRoutes from "./routes/analytics"

const app = express()
app.use(cors())
app.use(express.json())

// Swagger setup
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mobile API",
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
  apis: ["./src/routes/*.ts"], // 👈 scans your routes folder for docs
}

const swaggerSpec = swaggerJsdoc(options)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Routes
app.use("/categories2", categories2Routes)
app.use("/api/auth", authRoutes)
app.use("/api/businesses", businessRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/users", userRoutes)
app.use("/api/recommendations", recommendationRoutes)
app.use("/api/locations", locationRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/analytics", analyticsRoutes)

export default app
