import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const typeevents = sequelize.define('typeevents', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    reference: {
        type: DataTypes.STRING(255), 
        defaultValue: 0,
    },
    externalID: {
        type: DataTypes.STRING(255), 
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING(255),
    },
    article_description_erp: {
        type: DataTypes.STRING(255),
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
    },
    in_event: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
    },
    invoice: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
    },
    automatically_create_covenant_client: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
    },
    type_covenant: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    client_one_time_event:{
        type: DataTypes.TINYINT,
        defaultValue:0,
    },
    duration:{
        type: DataTypes.TIME,
        allowNull: true,
    },
    employee_billing_typeevent:{
        type: DataTypes.TINYINT,
        defaultValue: 1,
    },
       createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'typeevents',
    timestamps: true,
    underscored: false, // Não converte para snake_case
});

export default typeevents;
