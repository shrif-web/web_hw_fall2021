import crypto from 'crypto'
import User from "../models/User.js"
import sequelize from "../utils/database.js"

async function loginUser(Username, Password) {
    const t = await sequelize.transaction();
    try {
        const hash = crypto.createHash('sha256');
        const data = hash.update(Password, 'utf-8');
        const Password_hash = data.digest('base64');

        const user = await User.findOne({ where: { username: Username, password: Password_hash } }
            , { transaction: t });
        if (user === null) {
            await t.commit();
            return false;
        }
        else {
            await t.commit();
            return true;
        }
    } catch {
        await t.rollback();
    }
}

export default loginUser;
