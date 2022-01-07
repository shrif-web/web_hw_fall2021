import Note from "../models/Note.js"
import crypto from 'crypto'

async function deleteNote(Text, Userid){
    const hash = crypto.createHash('sha256');
    const data = hash.update(Text, 'utf-8');
    const text_hash= data.digest('base64');
    await Note.destroy(
        {where:{
            hash:text_hash,
             userId:Userid
            }
        });
}

export default deleteNote;