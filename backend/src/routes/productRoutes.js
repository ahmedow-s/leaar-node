const express = require('express');
const router = express.Router();
const productController = require('../products/products');

// GET /products - получить все продукты
router.get('/', async (req, res) => {
  try {
    const products = await productController.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /products/:id - получить продукт по ID
router.get('/:id', async (req, res) => {
  try {
    const product = await productController.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /products - создать новый продукт
router.post('/', async (req, res) => {
  try {
    const product = await productController.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /products/:id - обновить продукт
router.put('/:id', async (req, res) => {
  try {
    const product = await productController.updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /products/:id - удалить продукт
router.delete('/:id', async (req, res) => {
  try {
    const product = await productController.deleteProduct(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
