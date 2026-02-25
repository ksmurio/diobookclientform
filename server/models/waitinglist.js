import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const waitinglists = sequelize.define('waitinglists', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    observations: {
        type: DataTypes.STRING(255), 
        allowNull: true,
    },
    discontinued: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
    typeeventId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'typeevents',
            key: 'id',
        },
    },
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'clients',
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    planId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'plans',
            key: 'id',
        },
    },
    nomeCliente:{
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    emailCliente:{
        type: DataTypes.STRING(255),
    },
    contribuinteCliente:{
        type: DataTypes.STRING(255),
    },
    moradaCliente: {
        type: DataTypes.STRING(255),
    },
    dataMarcacao:{
        type: DataTypes.DATE,
    },
    seguro:{
        type: DataTypes.BOOLEAN,
    }
}, {
    tableName: 'waitinglists',
    timestamps: true,
    underscored: false, // Não converte para snake_case
});

export default waitinglists;
