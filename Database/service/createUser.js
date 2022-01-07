import  User from "../models/User.js"

async function createUser(Username, Password){
    const user = await User.findOne({ where: {username:Username , password:Password} });
    if (user === null){
        await User.create({username:Username , password:Password});   
        return true;
    }
    else {
        return false;
    }
}

export default createUser;
