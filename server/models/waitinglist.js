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
    nomeCliente: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    emailCliente: {
        type: DataTypes.STRING(255),
    },
    contribuinteCliente: {
        type: DataTypes.STRING(255),
    },
    moradaCliente: {
        type: DataTypes.STRING(255),
    },
    especialidade: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'typeevents',
            key: 'id',
        },
    },
    seguro: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'typeevents',
            key: 'id',
        },
    },
    dataMarcacao: {
        type: DataTypes.DATE,
    },
    horaMarcacao: {
        type: DataTypes.STRING(5),
        allowNull: true,
    },
}, {
    tableName: 'waitinglists',
    timestamps: true,
    underscored: false,
});

export default waitinglists;