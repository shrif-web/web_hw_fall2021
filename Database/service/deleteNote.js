import Note from "../models/Note.js"
import User from "../models/User.js"
import crypto from 'crypto'
import sequelize from "../utils/database.js" 

async function deleteNote(Text, Username){
    const t = await sequelize.transaction();
    const hash = crypto.createHash('sha256');
    const data = hash.update(Text, 'utf-8');
    const text_hash= data.digest('base64');
    try{
        const user = await User.findOne({ 
            where:
            {username:Username} },
            {transaction: t});

        await Note.destroy(
            {where:{
                hash:text_hash,
                userId:user.id
                }
            } , {transaction:t});

        await t.commit();
        return true;
    }catch{
        await t.rollback();
        return false;
    }
}

export default deleteNote;