const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BorrowLog = sequelize.define('BorrowLog', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    bookId: { type: DataTypes.INTEGER, allowNull: false },
    borrowDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    latitude: { type: DataTypes.FLOAT, allowNull: false }, // Simpan koordinat latitude
    longitude: { type: DataTypes.FLOAT, allowNull: false } // Simpan koordinat longitude
}, { timestamps: false });

module.exports = BorrowLog;