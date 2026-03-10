import {sequelize} from '../config/db.js';
import {DataTypes} from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const adminsettings = sequelize.define('adminsettings', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_admin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'admins',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    mostrar_link_instagram: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
    },
    link_instagram: {
        type: DataTypes.STRING(255),
    },
    mostrar_link_facebook: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
    },
    link_facebook: {
        type: DataTypes.STRING(255),
    },
    naotrabalhasabados: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
    },
    naotrabalhadomingos: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
    },
    naotrabalhasegundas: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
    },
    naotrabalhatercas: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
    },
    naotrabalhaQuartas: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
    },
    naotrabalhaQuintas: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
    },
    naotrabalhasextas: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
    },
}, {
    tableName: 'adminsettings',
    timestamps: false,
    snake_case: false,
});

export default adminsettings;