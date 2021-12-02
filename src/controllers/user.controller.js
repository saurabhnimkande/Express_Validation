const express = require('express');

const router= express.Router();

const User = require('../models/user.model');

const { body, validationResult } = require('express-validator');

router.get("",async (req, res) => {
    try {
       // console.log(body("first_name"))
        const users= await User.find().lean().exec();
        res.status(200).send(users);
    } catch (err) {
        res.status(500).json({message: err.message,status:"Failed"});
    }
})

router.post("",
    body("first_name").isLength({min:1,max:20}).withMessage("Please enter first name"),
    body("last_name").isLength({min:1,max:20}).withMessage("Please enter last name"),
    body("email").isEmail().withMessage("invalid email address"),
    body("pincode").custom((value) => {
        const verify= /^[1-9][0-9]{5}$/.test(+value);
        if(!verify) {
            throw new Error("invalid pincode please enter a vaild one.")
        }
        return true;
    }),
    body("age").custom((value) => {
        if(!(value>0 && value<=100)) {
            throw new Error("invalid age please enter a vaild age")
        }
        return true;
    }),
    body("gender").custom((value) => {
        if(!(value=="Male" || value=="Female" || value=="Others")) {
            throw new Error("Invalid Gender")
        }
        return true;
    }),
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let newErrors = errors.array().map(({ msg, param, location }) => {
            return {
              [param]: msg,
            };
          });
          return res.status(400).json({ errors: newErrors });
    }
    try {
        const user = await User.create(req.body);
        res.status(201).send(user);
    } catch (err) {
        res.status(500).json({message: err.message,status:"Failed"});
    }
});

router.delete("/:id",async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(201).send(user);
    } catch (err) {
        res.status(500).json({message: err.message,status:"Failed"});
    }
})

module.exports= router;


