import User from "../models/User.js"
import Note from "../models/Note.js"
import crypto from 'crypto'

async function createNote(Text, Username){

    const hash = crypto.createHash('sha256');
    const data = hash.update(Text, 'utf-8');
    const text_hash= data.digest('base64');
    
    const user = await User.findOne({ where: {username:Username} });
    if (user === null){
        return false;
    }else {
        console.log(user.id)
        await Note.create({text:Text ,userId:user.id, hash:text_hash});
        return true;
    }
}

export default createNote;