import {sequelize} from '../config/db.js';
import {DataTypes} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const adminsettings = sequelize.define('adminsettings',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_admin: {
        type: DataTypes.INTEGER,
        allowNull:false,
        references:{
            model: 'admins',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    username: {
        type: DataTypes.STRING(100),
    },
    senha:{
        type: DataTypes.STRING(255),
        allowNull:false,
    },
    mostrar_link_instagram: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
    },
    link_instagram:{
        type: DataTypes.STRING(255),
    }
},{
    tableName: 'adminsettings',
    timestamps:false,
    snake_case: false,
});

export default adminsettings;