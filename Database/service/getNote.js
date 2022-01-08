import User from "../models/User.js"
import Note from "../models/Note.js"
import crypto from 'crypto'
import sequelize from "../utils/database.js"    
import e from "express";

async function getNote(Username, Start, End){
    
    const t = await sequelize.transaction();

    try{
        const user = await User.findOne({ where: {username:Username} },
            {transaction: t});
        
        if (user === null){
            await t.commit();
            return null;
        } else {
            console.log(user.id)
            const notes = await Note.findAll({ where: {userId:user.id} }
                , {transaction: t});
            await t.commit();
            let text = []
            for (const element in notes)
            {
                if (element >= Start && element <= End ){
                    text.push(notes[element].text)
                }
            }
       
            return text;
        }

    } catch{
        await t.rollback();
        return null;
    }
}

export default getNote;