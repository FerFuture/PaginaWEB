const express = require('express');
const router = express.Router();
const productos = require('../database/index.js')

router.get('/api/productos', (req, res) => {
  res.send(productos);
});

router.post('/api/pay', (req, res) => {
  res.send(productos);
});


module.exports = router;