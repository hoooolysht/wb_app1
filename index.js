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

app.post('./auth/login', async  (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})
        
        if(!user) {
            return res.status(404).json({//лучше не писать почему не прошёл авторизацию, чтобы не дали возможность злоумышленнику пробить базу
                message: 'User dont found('
        })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPass) {
            return res.status(404).json({
                message: 'Invalid login/password'
        })

        }

        const token = jwt.sign({
            _id : user._id,
        }, 
        'secret123',
        {
            expiresIn:'30d'
        }
        )

        const {passwordHash, ...userData} = user._doc

        res.json ({
            ...userData,
            token,
        })

    } catch (err) {
        
        res.status(500).json({
            message: 'Cannot auth  the user'
        });
        console.error(err);
    }
})

app.post( '/auth/register', registerValidation, async (req, res)=>{
    try {  
    const errors = validationResult(req);
     if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
     }

     const password = req.body.password
     const salt = await bcrypt.genSalt(10)
     const hash = await bcrypt.hash(password, salt) // распротранённый и рабочий варик шифрования пароля

     const doc = new UserModel({
        email: req.body.email,
        passwordHsh: hash,
        fullName: req.body.fullname,
        avatarUrl: req.body.avatarUrl,

     })
  
        const user = await doc.save();


        const token = jwt.sign({
            _id : user._id,
        }, 
        'secret123',
        {
            expiresIn:'30d'
        }
        )

        const {passwordHsh, ...userData} = user._doc // убрал инфу о пароле при регистрации

        res.json(
            {...userData,
            token}
            );// ответ от сервака всегда 1!!!

      } catch (err) {
        res.status(500).json({ // ещё ответ! но если трай не сработал!
            message: 'Dont work!' 
        });
        console.error(err)
      }  
})

app.get('/data', async (req, res) =>{
    try{
        const data = await UserModel.find({})
        res.json(data)
    } catch(err){
        res.status(500).json({
            message: "Error loading data",
        })
        console.error(err)
    }
})


app.listen(4444, (err) => {
    if(err) {
        return console.error(err)
    }
    console.log("Server is running at http://localhost:4444")
})

