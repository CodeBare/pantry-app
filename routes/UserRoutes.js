const express = require('express')
const router = express.Router()
const User = require('../models/UserModel')
const Pantry = require('../models/PantryModel')
const PantryIngredients = require('../models/PantryIngredientsModel')
const ObjectId = require('mongoose').Types.ObjectId
const UserValidator = require('../utils/UserValidator')

// Check for a valid user on the route...
router.use(async (req, res, next) => {
    try {
        const validUser = await UserValidator(req, req.params.userID)
        if(validUser)
            next()
        else
            res.status(200).send(`Unauthorized user`)
    } catch(err) {
        res.status(200).send(`Error: ${err.message}`)
    }
})

// GET user information based on id
router.get('/:userID', async (req, res) => {
    try {
        // Get the user details and send those onto the client.
        const user = await User.findOne({_id: ObjectId(req.params.userID)})
        if(user) {
            res.status(200).json(user.toJSON())
        } else {
            res.status(200).send(`Invalid user`)
        }
    } catch(err) {
        res.status(200).send(`Error: ${err.message}`)
    }
})

router.put('/:userID', async (req, res) => {
    try {
        User.findByIdAndUpdate(ObjectId(req.params.userID), req.body,
            {}, (err, user) => {
                if(err) {
                    res.send(200).send(`Error: ${err.message}`)
                } else {
                    res.send(200).json(user.toJSON())
                }
            })
    } catch(err) {
        res.status(200).send(`Error: ${err.message}`)
    }
})

router.delete('/:userID', async (req, res) => {
    try {
        // Deleting a user account requires trimming out the
        // PantryIngredient, Pantry, then User
        const pantries = await Pantry.find({ userID: ObjectId(req.params.userID) })
        for(const p of pantries) {
            const ingredients = await PantryIngredients.find({ pantryID: p._id })
            for(const i of ingredients) {
                PantryIngredients.findOneAndDelete({ _id: i._id })
            }
            Pantry.findOneAndDelete({ _id: p._id })
        }
        User.findOneAndDelete({_id: ObjectId(req.params.userID)})
        res.status(200).send(`User deleted`)
    } catch(err) {
        res.status(200).send(`Error: ${err.message}`)
    }
})

module.exports = router