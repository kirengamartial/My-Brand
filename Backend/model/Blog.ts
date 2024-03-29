import mongoose, {Schema, Document} from 'mongoose'

interface Blog extends Document {
    photo: string,
    title: string,
    description: string
}

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
})

const Blog = mongoose.model<Blog>('blog', blogSchema)

export default Blog