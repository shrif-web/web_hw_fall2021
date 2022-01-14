import Note from "../models/Note.js"
import User from "../models/User.js"
import sequelize from "../utils/database.js"

async function deleteNote(id, Username) {
    const t = await sequelize.transaction();
    try {
        if (Username == "admin") {
            const note = await Note.findAll(
                {
                    order: [['createdAt', 'ASC']],
                    limit: 1,
                    offset: id,
                }, { transaction: t });
            if (note[0] === null) {
                await t.rollback();
                return false;
            }
            console.log ( note[0])
            await Note.destroy(
                {
                    where: {
                        createdAt: note[0].createdAt,
                        updatedAt: note[0].updatedAt,
                        text: note[0].text
                    }
                }
                , { transaction: t })
        } else {

            const user = await User.findOne({ where: { username: Username } },
                { transaction: t });

            const note = await Note.findAll(
                {
                    where: {
                        userId: user.id
                    },
                    order: [['createdAt', 'ASC']],
                    limit: 1,
                    offset: id,
                }, { transaction: t });
            if (user === null || note[0] === null) {
                await t.rollback();
                return false;
            }

            await Note.destroy(
                {
                    where: {
                        createdAt: note[0].createdAt,
                        updatedAt: note[0].updatedAt,
                        userId: user.id
                    }
                }
                , { transaction: t })

        }
        await t.commit();
        return true;
    } catch {
        await t.rollback();
        return false;
    }
}

export default deleteNote;