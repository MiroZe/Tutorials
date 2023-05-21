const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = '5253jkgbhjg3ff'

async function register(username, password) {
    const existingUsername = await User.findOne({username}).collation({locale:'en', strength:2}) 
    if(existingUsername) {
        throw new Error('Username is already taken')
    }
    const hashedPassword = await bcrypt.hash(password, 9)
    const user = await User.create( {
        username,
        hashedPassword
    })

    
    return createSession(user)

}


async function login(username, password) {

    const existing = await User.findOne({username}).collation({locale:'en', strength:2})
    if(!existing) {
        throw new Error('Username do not exist or password is incorrect')
    }
    const hasMatch = await bcrypt.compare(password, existing.hashedPassword)
    if(!hasMatch) {
        throw new Error('Username do not exist or password is incorrect')

    }
    return token = createSession(existing)

}


function createSession({_id, username}) {
    const payload = {
        _id,
        username
    }
    return token = jwt.sign(payload,JWT_SECRET)
}

function verifyToken(token) {
    return jwt.verify(token,JWT_SECRET)
}

module.exports = {
    register,
    login,
    verifyToken
}