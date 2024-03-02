// password mongo 8cjH0VkQmbICAjKu

import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'

import { registerValidation } from './validations/auth.js'
import UserModel from './models/user.js'


mongoose
    .connect('mongodb+srv://novrsec:8cjH0VkQmbICAjKu@cluster0.spwz01d.mongodb.net/analytic?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('DB Connected')
        })
    .catch((err)=>{
        console.error("Error in DB Connection", err)
    });

const app = express()

app.use(express.json()) // for parsing application/json

app.post( '/auth/register', registerValidation, async (req, res)=>{
    const errors = validationResult(req);
     if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
     }

     const password = req.body.password
     const salt = await bcrypt.genSalt(10)
     const passwordHash = await bcrypt.hash(password, salt) // распротранённый и рабочий варик шифрования пароля

     const doc = new UserModel({
        email: req.body.email,
        passwordHash,
        fullName: req.body.fullname,
        avatarUrl: req.body.avatarUrl,

     })

    //  const user = await doc.save()
    try {
        const user = await doc.save();
        res.json(user);
      } catch (err) {
        res.status(500).json({ message: 'Database error' });
      }  
      console.log({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        password: req.body.password,
      });
})



app.listen(4444, (err) => {
    if(err) {
        return console.error(err)
    }
    console.log("Server is running at http://localhost:4444")
})

