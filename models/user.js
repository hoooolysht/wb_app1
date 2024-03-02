import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        require: true,
    }, 
    email: {
        type: String,
        require: true,
        unique: true,
    }, 
    // password: {
    //     type: String,
    //     required: true,
    // },
    password: String,
    avatarUrl: String,
}, {
    timestamps: true, //обяснение что дата создания и редактиврования сущности должны остановиться
})

export default mongoose.model('User', userSchema)