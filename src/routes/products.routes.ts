import express from "express"
import controller from "../controllers/products.controller"

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: products
 *     description: Operations for products
 */

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - products
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: list of products
 */
router.get("/", controller.getAll)

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     tags:
 *       - products
 *     summary: Get a single product by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a product object
 *       404:
 *         description: not found
 */
router.get("/:id", controller.getById)

/**
 * @openapi
 * /api/products:
 *   post:
 *     tags:
 *       - products
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: created
 */
router.post("/", controller.create)

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     tags:
 *       - products
 *     summary: Update a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: updated
 *       404:
 *         description: not found
 */
router.put("/:id", controller.update)

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     tags:
 *       - products
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: deleted
 *       404:
 *         description: not found
 */
router.delete("/:id", controller.remove)

export default router
