import mongoose, {Schema, Document} from 'mongoose'

interface Blog extends Document {
    photo: {
        public_id: string,
        secure_url: string
    },
    title: string,
    description: string
}

const blogSchema = new Schema({
    photo: {
       public_id: {
        type: String
       },
       secure_url: {
        type: String
       }
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