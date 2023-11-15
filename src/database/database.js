const Sequelize = require('sequelize');

const sequelize = new Sequelize('bkk6bxjvhjyvlzzddnak', 'uttqjavexpdobbpxn8gv', '9B96BWTCEIMh33KchvxOrJRBtzIs8v', {
  host: 'bkk6bxjvhjyvlzzddnak-postgresql.services.clever-cloud.com', // Puedes cambiarlo según tu configuración
  dialect: 'postgres',
  port:50013 // Puedes cambiarlo si estás usando otro motor de base de datos
});

module.exports = sequelize;