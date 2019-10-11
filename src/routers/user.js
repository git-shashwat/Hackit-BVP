const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const Coin = require('../models/coin')
const bodyParser = require('body-parser')
const Add = require('../models/add')
const router = new express.Router()
router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())

router.get('/', async (req, res) => {
    try {
        const adds = await Add.find({})
        if (!adds) {
            return res.render({message:'No adds Available'})
        }
        res.render('index', { adds: adds })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        const token = await user.generateAuthToken()

        const coin = new Coin({ owner: user._id })
        await coin.save()
        
        await user.populate('adds').execPopulate()
        res.render('profile', { user })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        await user.populate('adds').execPopulate()
        res.render('profile', { user })
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth,async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e){
        res.status(500).send(e)
    }
})

router.get('/users/me', auth, (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email', 'password', 'year', 'branch', 'name']
    const isValid = updates.every(update => allowedUpdates.includes(update))

    if (!isValid) {
        return res.status(401).send('Invalid Updates')
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }

})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router