import { DataTypes, Model } from 'sequelize'

import sequelize from "../utils/database.js"

class Note extends Model {}
Note.init({
  // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        default: sequelize.fn('uuid_generate_v4')
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    hash: {
        type: DataTypes.STRING,
        allowNull: false
    }


}, { sequelize, modelName: 'notes' });


export default Note;