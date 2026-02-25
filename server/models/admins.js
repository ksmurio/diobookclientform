import {sequelize} from '../config/db.js';
import {DataTypes} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const admins = sequelize.define('admins',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING(100),
    },
    senha:{
        type: DataTypes.STRING(255),
        allowNull:false,
    },
},{
    tableName: 'admins',
    timestamps:false,
    snake_case: false,
});

export default admins;