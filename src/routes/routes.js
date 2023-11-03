const express = require('express');
const router = express.Router();
let productos = require('../database/index.js')

router.get('/api/productos', (req, res) => {
  res.send(productos);
});

router.post('/api/pay', (req, res) => {
  const ids = req.body;
  const productosCopy = productos.map((p) =>({ ...p }));
  ids.forEach((id) => {
    const product = productosCopy.find(p => p.id === id);
    if(product.stock > 0){
      product.stock--;
    }
    else{
      throw "sin stock";
    }
    
  });
  productos = productosCopy;
  res.send(productos);
});






module.exports = router;