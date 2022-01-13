import Note from "../models/Note.js"
import User from "../models/User.js"
import sequelize from "../utils/database.js"

async function updateNote(id, username, newtext) {
    const t = await sequelize.transaction();

    try {
        if (username == "admin") {
            const note = await Note.findAll(
                {
                    order: [['createdAt', 'DESC']],
                    limit: 1,
                    offset: id,
                }, { transaction: t });
            if (note[0] === null) {
                return false;
            }

            await Note.update(
                {
                    text: newtext,
                },
                {
                    where: {
                        createdAt: note[0].createdAt,
                        updatedAt: note[0].updatedAt,
                    }

                },
                { transaction: t });
            await t.commit()
            return true;
        }
        else {
            const user = await User.findOne({ where: { username: username } },
                { transaction: t });
            console.log("user id = ",user.id)

            if (user === null) {
                await t.commit();
                return false;
            }

            else {
                const note = await Note.findAll(
                    {
                        where: {
                            userId: user.id
                        },
                        order: [['createdAt', 'DESC']],
                        limit: 1,
                        offset: id,
                    }, { transaction: t });
                if (user === null || note[0] === null) {
                    return false;
                }
                console.log("id = ", id)
                console.log("note id = ",note[0].id)
                await Note.update(
                    {
                        text: newtext,
                    },
                    {
                        where: {
                            createdAt: note[0].createdAt,
                            updatedAt: note[0].updatedAt,
                            userId: user.id
                        }

                    },
                    { transaction: t });
                await t.commit()
                return true;
            }
        }

    } catch {
        await t.rollback();
    }

}

export default updateNote;