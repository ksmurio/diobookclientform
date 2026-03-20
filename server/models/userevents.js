import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const userevents = sequelize.define('userevents', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    start: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    end: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    details: {
        type: DataTypes.STRING(2000),
        allowNull: true,
    },
    linkedId: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    invoiced: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
    },
    RoomId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'rooms',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    TypeeventId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'typeevents',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    telemovel: {
        type: DataTypes.STRING(36)
    }
}, {
    tableName: 'userevents',
    timestamps: true,
});

export default userevents;