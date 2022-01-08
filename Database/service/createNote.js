import User from "../models/User.js"
import Note from "../models/Note.js"
import crypto from 'crypto'
import sequelize from "../utils/database.js"    

async function createNote(Text, Username){

    const hash = crypto.createHash('sha256');
    const data = hash.update(Text, 'utf-8');
    const text_hash= data.digest('base64');
    
    const t = await sequelize.transaction();

    try{

        const user = await User.findOne({ where: {username:Username} },
            {transaction: t});
        
        if (user === null){
            await t.commit();
            return false;
        }else {
            console.log(user.id)
            await Note.create({text:Text ,userId:user.id, hash:text_hash}
                , {transaction: t});
            await t.commit();
            return true;
        }

    } catch{
        await t.rollback();
    }
}

export default createNote;