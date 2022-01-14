import Sequelize from 'sequelize';
import dotenv from 'dotenv'
dotenv.config();

// connection string
const sequelize = new Sequelize('postgres://admin:admin@' + process.env.PG_Path + '/admin')
try {
    sequelize.authenticate({
    }).then(() =>
        sequelize.sync()
    )
}
catch (err) {
    console.log("could not connect to the data base!")
    console.log(err)
}

export default sequelize;
