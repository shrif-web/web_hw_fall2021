import  User from "../models/User.js"

async function createUser(Username, Password){
    await User.create({username:Username , password:Password});   
}

export default createUser;
