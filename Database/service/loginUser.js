import  User from "../models/User.js"

async function loginUser(Username, Password){
    const user = await User.findOne({ where: {username:Username , password:Password} });
    if (user === null){
        return false;
    }
    else {
        return true;
    }
}

export default loginUser;
