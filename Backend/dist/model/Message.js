import mongoose, { Schema } from 'mongoose';
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
});
const Message = mongoose.model('message', messageSchema);
export default Message;
//# sourceMappingURL=Message.js.map