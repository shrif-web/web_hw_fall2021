import  User from "../models/User.js"
import sequelize from "../utils/database.js"  

async function createUser(Username, Password){
    const t = await sequelize.transaction();
    try{
        const user = await User.findOne({ where: {username:Username , password:Password} }
            , {transaction:t});
        if (user === null){
            await User.create({username:Username , password:Password}
                , { transaction:t });
            await t.commit();   
            return true;
        }
        else {
            await t.commit(); 
            return false;
        }
    } catch{
        await t.rollback();
    }
}

export default createUser;
