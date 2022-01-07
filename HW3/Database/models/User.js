import { DataTypes, Model } from 'sequelize'

import sequelize from "../utils/database.js"
import Note from './Note.js'

class User extends Model {}
User.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    default: sequelize.fn('uuid_generate_v4')
},
username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
},
password: {
    type: DataTypes.STRING,
    allowNull: false
}
}, { sequelize, modelName: 'users' });

User.Notes = User.hasMany(Note);

export default User;