import mongoose, { Schema, Document} from 'mongoose'
// import { isEmail } from 'validator';
import bcrypt from 'bcrypt'

export interface User extends Document {
    username: string,
    email: string,
    password: string,
    isAdmin: boolean
}

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        // validate: [isEmail, 'enter a valid email']
    }, 
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})


const user = mongoose.model<User>('user', userSchema)

export default user