import mongoose, { Schema } from 'mongoose';
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
});
const Comment = mongoose.model('comment', commentSchema);
export default Comment;
//# sourceMappingURL=Comment.js.map