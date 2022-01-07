import Note from "../models/Note.js"
import crypto from 'crypto'

async function createNote(Text, Userid){

    const hash = crypto.createHash('sha256');
    const data = hash.update(Text, 'utf-8');
    const text_hash= data.digest('base64');

    await Note.create({text:Text ,userId:Userid, hash:text_hash});
}

export default createNote;