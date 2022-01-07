import Sequelize from 'sequelize';

// connection string
const sequelize = new Sequelize('postgres://admin:admin@localhost:5432/admin') 
try{
    sequelize.authenticate({
    }).then(()=>
    sequelize.sync()
    )
}
catch(err){
    console.log("could not connect to the data base!")
    console.log(err)
}

export default sequelize;
