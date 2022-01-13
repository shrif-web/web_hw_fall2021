import User from "../models/User.js"
import Note from "../models/Note.js"
import sequelize from "../utils/database.js"

async function createNote(Text, Username) {

    const t = await sequelize.transaction();
    try {

        const user = await User.findOne({ where: { username: Username } },
            { transaction: t });

        if (user === null) {
            await t.rollback();
            return false;
        } else {

            await Note.create({ text: Text, userId: user.id }
                , { transaction: t });
            await t.commit();
            return true;
        }

    } catch {
        await t.rollback();
    }
}

export default createNote;