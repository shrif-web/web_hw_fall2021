import Note from "../models/Note.js"
import crypto from 'crypto'

async function updateNote(Text, Userid, NewText){
    const hash = crypto.createHash('sha256');
    const data = hash.update(Text, 'utf-8');
    const text_hash= data.digest('base64');

    const new_hash = crypto.createHash('sha256');
    const newdata = new_hash.update(NewText, 'utf-8');
    const new_text_hash= newdata.digest('base64');

    const note = await User.findOne({ where: {hash:text_hash , userId:Userid} });
    if (user === null){
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
                userId:Userid
            }
        });
        return true;
    }
}

export default updateNote;