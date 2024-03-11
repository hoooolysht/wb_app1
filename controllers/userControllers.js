import jwt from  'jsonwebtoken'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import UserModel from '../models/user.js'


export const register = async (req, res)=>{
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
}

export const login = async  (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})
        
        if(!user) {
            return res.status(404).json({//лучше не писать почему не прошёл авторизацию, чтобы не дали возможность злоумышленнику пробить базу
                message: 'User dont found(',
        })
        }



        // return console.log(user._doc); // проверка отправленных данных через консоль
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHsh)
        
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

        const {passwordHsh, ...userData} = user._doc

        res.json ({
            ...userData,
            token,
        })

    } catch (err) {
        
        res.status(500).json({
            message: 'Cannot auth the user'
        });
        console.error(err);
    }
}

export const myData = async (req, res) =>{
    try{
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                massage: 'User dont found(',
            })
        }

        const {passwordHsh, ...userData} = user._doc

        res.json(userData)
        
    } catch(err){
        res.status(500).json({
            message: "Error loading data",
        })
        console.error(err)
    }
}