// password mongo 8cjH0VkQmbICAjKu
import express from 'express'
import mongoose from 'mongoose'
import { registerValidation } from './validations/auth.js'
import checkAuth from './middleware/checkAuth.js'
import * as userControllers from './controllers/userControllers.js' // вытаскиваем все метоты из файла (это как перечислять их через запятую, но быстрее)

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

app.post('/auth/login', userControllers.login)
app.post( '/auth/register', registerValidation, userControllers.register)
app.get('/auth/my_data', checkAuth, userControllers.myData)

app.listen(4444, (err) => {
    if(err) {
        return console.error(err)
    }
    console.log("Server is running at http://localhost:4444")
})

