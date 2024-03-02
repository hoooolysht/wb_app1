import { body } from "express-validator";

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body("password", 'Пароль должен превышать 5 символов').isLength({ min: 5 }), 
    body('fullName', 'Недопустимая длинна имени').isLength({ min:2 }),
    body('avatarUrl', 'Неверная ссылка на изображение').optional().isURL(),
]

