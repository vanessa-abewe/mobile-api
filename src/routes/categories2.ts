import { Router } from "express";
import { getCategories2 } from "../controllers/GetCategories2Controller";

const router = Router();
/**
 * @openapi
 * /categories2:
 *   get:
 *     summary: Get all categories2
 *     responses:
 *       200:
 *         description: List of categories2
 */
router.get("/", getCategories2);




export default router;