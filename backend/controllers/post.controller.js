import User from "../models/user.model.js";
import {v2 as cloudinary} from 'cloudinary';
import Post from "../models/post.model.js";

export const createPost = async (req,res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;

        const userId = req.user._id.toString();

        const user = await User.findById(userId)
        if(!user) return res.status(404).json({
            message: "User not found"
        })

        if(!text && !img){
            return res.status(400).json({error: "Post must have text or image" })
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url; // save the image url in the database
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        })

        await newPost.save();

        res.status(201).json(newPost)

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
        console.log("Error in createPost Controller ", error);
    }
}

export const deletePost = async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(400).json({error: "Post not found"})
        }

        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error: "You are not authorized to delete this post"})
        }

        if(post.img){
            const imageId = post.img.split("/").pop().split(".")[0]; // [0] is the image id
            await cloudinary.uploader.destroy(imageId)
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({message: "Post deleted successfully"})
    } catch (error) {
        console.log("Error in the deletePost Controller ", error);
        res.status(500).json({error: error.message})
    }
}

export const commentOnPost = async (req,res) => {
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        
        if(!text){
            return res.status(400).json({
                error: "Text field is required"
            })
        }

        const post = await Post.findById(postId)
        if(!post){
            return res.status(400).json({error: "Post not found"})
        }
        
        const comment = {user: userId, text}
        
        post.comments.push(comment)
        await post.save();

        res.status(200).json(post)

    } catch (error) {
        console.log("Error in commentOnPost controller", error.message);
        res.status(500).json({error: error.message})
    }
}