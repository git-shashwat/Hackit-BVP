const express = require('express')
const auth = require('../middleware/auth')
const Add = require('../models/add')
const router = new express.Router()

router.post('/adds', auth, async (req, res) => {
    const add = new Add ({
        ...req.body,
        owner: req.user._id,
        room: Math.floor(Math.random() * Math.floor(1000))
    })
    try {
        await add.save()
        res.status(201).send(add)
    } catch (e) {   
        res.status(500).send(e)
    }
})

router.get('/adds', auth, async (req, res) => {
    try{
        await req.user.populate('adds').execPopulate()
        res.send(req.user.adds)
    } catch (e) {
        res.status(404).send()
    }
})

router.get('/adds/:id', auth, async (req, res) => {
    try {
        const add = await Add.findOne({ _id: req.params.id, owner: req.user._id })
        res.send(add)
    } catch (e) {
        res.status(404).send()
    }
})

router.patch('/adds/:id', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['category', 'title', 'description']
        const isValidUpdate = updates.every(update => allowedUpdates.includes(update))

        if (!isValidUpdate) {
            return res.status(400).send()
        }

        const add = await Add.findOne({ _id: req.params.id, owner: req.user._id })

        if (!add) {
            return res.status(404).send()
        }
        updates.forEach(update => add[update] = req.body[update])
        await add.save()
        res.send(add)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/adds/:id', auth, async (req, res) => {
    try {
        const add = await Add.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!add) {
            return res.status.send()
        }

        res.send(add)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router