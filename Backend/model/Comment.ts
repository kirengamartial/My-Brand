import mongoose, {Schema, Document} from 'mongoose'

export interface Comment extends Document {
    blog_id: string,
    name: string,
    comment: string
}

const commentSchema = new Schema({
    blog_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
         required: true
    },
    comment: {
        type: String,
        required: true
    }
})
const Comment = mongoose.model<Comment>('comment', commentSchema)

export default Comment