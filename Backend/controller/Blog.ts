import {Request, Response, NextFunction} from "express";
import Blog from '../model/Blog.js'
import cloudinary from '../src/cloudinary.js'
import upload from '../src/multer.js'



// blogs


/**
 * @swagger
 * /blog:
 *   get:
 *     summary: Retrieve all blogs
 *     description: Retrieve all blogs from the database.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: A list of blogs retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       '400':
 *         description: Bad request. Error occurred while retrieving blogs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the blog.
 *         title:
 *           type: string
 *           description: Title of the blog.
 *         description:
 *           type: string
 *           description: Description or content of the blog.
 *         photo:
 *           type: string
 *           description: URL of the blog photo.
 *       required:
 *         - title
 *         - description
 *         - photo
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: jwt
 *       description: JWT token to authenticate the user.
 */


export const getAllBlog = async(req: Request, res: Response) => {
    try {
      const blogs = await Blog.find()
      res.status(200).json(blogs)
    } catch (error) {
      res.status(400).json({error})
    }
  }




  /**
 * @swagger
 * /api/blog/{id}:
 *   get:
 *     summary: Retrieve a blog by ID
 *     description: Retrieve a single blog entry from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog to retrieve.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Blog retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       '400':
 *         description: Bad request. Error occurred while retrieving the blog.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *
 *     components:
 *       schemas:
 *         Blog:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: Unique identifier for the blog.
 *             title:
 *               type: string
 *               description: Title of the blog.
 *             description:
 *               type: string
 *               description: Description or content of the blog.
 *             photo:
 *               type: string
 *               description: URL of the blog photo.
 *           required:
 *             - title
 *             - description
 *             - photo
 *       cookieAuth:
 *         type: apiKey
 *         in: cookie
 *         name: jwt
 *         description: JWT token to authenticate the user.
 */



  export const getSingleBlog = async(req: Request, res: Response) => {
    try {
      const { id } = req.params
      const blog = await Blog.findById(id)
      res.status(200).json(blog)
    } catch (error) {
      res.status(400).json(error)
    }
  }

  export const createBlog = async (req: Request, res: Response) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ err });
      }
  
      if (req.file === undefined) {
        return res.status(400).json({ err: 'Please select an image' });
      }
  
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "My_brand"
        });
        
        const { title, description } = req.body;
  
        const blog = new Blog({
          photo: {
            public_id: result.public_id,
            secure_url: result.secure_url
          },
          title,
          description
        });
  
        await blog.save();
  
        return res.status(200).json({
          message: 'Created a blog successfully',
          id: blog._id,
          photo: blog.photo.secure_url
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
      }
    });
  }

  export const editBlog = async (req: Request, res: Response) => {
    upload(req, res, async (err) => {
      if (err) {
        res.status(400).json({ err });
      } else {
        try {
          const { id } = req.params;
          const { title, description } = req.body;
  
          const blog = await Blog.findById(id);
          if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
          }
  
          let result;
          if (req.file) {
            result = await cloudinary.uploader.upload(req.file.path, {
              folder: "My_brand"
            });
          } else {
            result = {
              secure_url: blog.photo.secure_url,
              public_id: blog.photo.public_id
            };
          }
  
          blog.photo.secure_url = result.secure_url;
          blog.photo.public_id = result.public_id;
          blog.title = title || blog.title;
          blog.description = description ?? blog.description;
  
          await blog.save();
          res.status(200).json(blog);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server Error' });
        }
      }
    });
  }


  /**
 * @swagger
 * /blog/{id}:
 *   delete:
 *     summary: Delete a blog by ID
 *     description: Delete an existing blog entry from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog to delete.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '204':
 *         description: Blog deleted successfully.
 *       '404':
 *         description: Blog not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating blog not found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating server error.
 *
 *     components:
 *       securitySchemes:
 *         cookieAuth:
 *           type: apiKey
 *           in: cookie
 *           name: jwt
 *           description: JWT token to authenticate the user.
 */


  export const deleteBlog =  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedBlog = await Blog.findByIdAndDelete(id);
      if (!deletedBlog) {
        res.status(404).json({ message: 'blog not found' });
      } else {
        res.status(204).send();
      }
     
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }