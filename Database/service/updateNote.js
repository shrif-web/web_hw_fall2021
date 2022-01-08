import Note from "../models/Note.js"
import User from "../models/User.js"
import crypto from 'crypto'
import sequelize from "../utils/database.js" 

async function updateNote(Text, Username, NewText){
    const t = await sequelize.transaction();

    const hash = crypto.createHash('sha256');
    const data = hash.update(Text, 'utf-8');
    const text_hash= data.digest('base64');

    const new_hash = crypto.createHash('sha256');
    const newdata = new_hash.update(NewText, 'utf-8');
    const new_text_hash= newdata.digest('base64');
    try{
        const user = await User.findOne({ where: {username:Username} },
            {transaction: t});

        const note = await Note.findOne({ where: {hash:text_hash , userId:user.id}} 
            , {transaction:t});

        if (user === null || note === null){
            await t.commit();
            return false;
        }
        else {
            await Note.update(
                {
                    text: NewText,
                    hash:new_text_hash
                },
                {where:{
                    hash:text_hash,
                    userId:user.id
                }
            } , {transaction:t} );
            await t.commit()
            return true;
        }
    } catch {
        await t.rollback();
    }

}

export default updateNote;