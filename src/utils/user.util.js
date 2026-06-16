const bcrypt = require('bcrypt')
const path = require('path')

function generateHashPassword(password)
{
    const salt = 10;
    const hashPassword = bcrypt.hashSync( password , salt);

    return hashPassword;
}

function compareHashPassword(password,hashPassword)
{
    const salt = 10;

    const isMatch = bcrypt.compareSync( password , hashPassword );

    return isMatch;
}

function validateEmail(email)
{
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    return regex.test(email)
}

function validatePassword(password)
{
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
    
    return regex.test( password );
}

function validateMobile(number)
{
    const regex = /^(?:\+91|0)?[6-9]\d{9}$/

    return regex.test( number );
}

function generateAvatarFileName(originalname)
{
    const extn = path.extname(originalname);

    const name = originalname.substring( 0 , originalname.lastIndexOf('.') );

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

    const filename = `${name}-${uniqueSuffix}${extn}`

    return filename;
}

module.exports = {
    generateHashPassword,
    compareHashPassword,
    validateEmail,
    validatePassword,
    validateMobile,
    generateAvatarFileName
}