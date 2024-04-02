import mongoose, { Schema, Document} from 'mongoose'
// import { isEmail } from 'validator';

export interface Message extends Document {
    name: string,
    email: string,
    question: string,
    description: string
}

const messageSchema = new Schema({
    name: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true, 
        lowercase: true,
        // validate: isEmail
    },
    question: {
        type: String,
        required: true, 
    },
    description: {
        type: String,
        required: true, 
    }, 

})


const Message = mongoose.model<Message>('message', messageSchema)

export default Message