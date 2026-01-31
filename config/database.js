const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('remed_paw', 'root', '', { // Pastikan password kosong jika pakai XAMPP standar
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = sequelize;