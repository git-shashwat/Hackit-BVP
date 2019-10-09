const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, 'qwertyuiop')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token' : token })
    
        if (!user) {
           return res.status(404).send({ 'Error' : "User Logged Out" })
        }
    
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Authorization Error!' })
    }
}

module.exports = auth