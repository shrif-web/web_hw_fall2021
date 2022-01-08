import  User from "../models/User.js"
import sequelize from "../utils/database.js" 

async function loginUser(Username, Password){
    const t = await sequelize.transaction();
    try{

        const user = await User.findOne({ where: {username:Username , password:Password}}
            , { transaction:t });
        if (user === null){
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
