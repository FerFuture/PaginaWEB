const express = require('express');
const router = express.Router();
const sequelize = require('../database/database.js'); // Importa la conexión a la base de datos

// Obtener todos los productos desde la tabla existente
router.get('/api/productos', async (req, res) => {
  try {
    const products = await sequelize.query('SELECT * FROM productos', {
      type: sequelize.QueryTypes.SELECT,
    });
    res.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

router.post('/api/pay', async (req, res) => {
  const ids = req.body;

  try {
    // Inicia una transacción
    const t = await sequelize.transaction();

    try {
      const productsFromDB = await sequelize.query('SELECT * FROM productos', {
        type: sequelize.QueryTypes.SELECT,
        transaction: t, // Asocia la transacción a esta consulta
      });

      for (const id of ids) {
        const productFromDB = productsFromDB.find(p => p.id === id);

        if (productFromDB && productFromDB.stock > 0) {
          // Realiza la actualización de stock en la base de datos
          await sequelize.query('UPDATE productos SET stock = stock - 1 WHERE id = :id AND stock > 0', {
            replacements: { id },
            type: sequelize.QueryTypes.UPDATE,
            transaction: t, // Asocia la transacción a esta consulta
          });
        } else {
          throw "sin stock";
        }
      }

      // Si todo está bien, realiza la confirmación de la transacción
      await t.commit();

      res.send("Pago procesado exitosamente");
    } catch (error) {
      // Si hay algún error, realiza el rollback de la transacción
      await t.rollback();
      throw error; // Lanza el error para que sea manejado en el catch externo
    }
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
})

router.get('/api/productos/categoria/:categoryName', async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    const decodedCategoryName = decodeURIComponent(categoryName);

    const products = await sequelize.query(
      `SELECT * FROM productos WHERE category_id = (
        SELECT id FROM categories WHERE name = $1
      )`, {
        bind: [decodedCategoryName],
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});








module.exports = router;