const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Gerenciamento de produtos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Produto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: Produto Exemplo
 *         preco:
 *           type: number
 *           format: float
 *           example: 19.99
 *         categoryId:
 *           type: integer
 *           example: 2
 */

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Retorna todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos com hypermedia
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 */
router.get('/product', productController.getProduct);

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Retorna um produto específico
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 */
router.get('/product/:id', productController.getProductById);

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - preco
 *               - categoryId
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Novo Produto
 *               preco:
 *                 type: number
 *                 format: float
 *                 example: 29.99
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 */
router.post('/product', productController.createProduct);

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - preco
 *               - categoryId
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Produto Atualizado
 *               preco:
 *                 type: number
 *                 format: float
 *                 example: 39.99
 *               categoryId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 */
router.put('/product/:id', productController.UpdateProduct);

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Deleta um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto a ser deletado
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso
 */
router.delete('/product/:id', productController.DeleteProduct);

module.exports = router;
