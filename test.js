const bcrypt = require('bcrypt')


const password = async (password)=>{
    const hashedPass = await bcrypt.hash(password,10);
    console.log(hashedPass)
}

password("jagman123");


