import mongoose, { Schema } from 'mongoose';
const blogSchema = new Schema({
    photo: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});
const Blog = mongoose.model('blog', blogSchema);
export default Blog;
//# sourceMappingURL=Blog.js.map