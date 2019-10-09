const express = require('express')
const auth = require('../middleware/auth')
const Coin = require('../models/coin')
const router = new express.Router()

router.get('/wallet', auth, async (req, res) => {
    try {
        const coin = await Coin.findOne({ owner: req.user._id })
        res.send({ coin })
    } catch (e){
        res.status(500).send(e)
    }
})

module.exports = router