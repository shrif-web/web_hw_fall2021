import Sequelize from 'sequelize';
import dotenv from 'dotenv'
dotenv.config();

// connection string
const sequelize = new Sequelize('postgres://admin:admin@' + process.env.PG_Path + '/admin')

let is_connected = false;

async function connect_db(){
    try {       
        await sequelize.authenticate()
        await sequelize.sync()
        is_connected = true;
    }
    catch (err) {
    }
}

async function try_to_connect(){
    while(!is_connected){   
        try{
            await connect_db();
        }
        catch{
        }
        finally{
            sleep(30000);
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
try_to_connect()
  
export default sequelize;
