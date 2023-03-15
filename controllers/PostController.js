import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
    try {

        const posts = await PostModel.find().populate("user").exec();

        res.json(posts)
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Posts were not found",
        })
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        
        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc:{ viewsCount: 1 },
            },
            {
                returnDocument: "after",
            },
            )
            .then(doc => {

                if(!doc) {
                    return res.status(404).json({
                        message: "Can't get a post",
                    });
                }

                res.json(doc);
            })
        
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Post was not found",
        })
    }
};

export const remove = async (req, res) => {

    try {
        const postId = req.params.id;
        
        PostModel.findOneAndDelete(
            {
                _id: postId,
            },
        )
        .then(doc => {
            
            if(!doc) {
                return res.status(404).json({
                    message: "Post was not found",
                });
            }

                res.json({
                    success: true,
                });
            })
        
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Posts were not found",
        })
    }
};

export const update = async (req, res) => {

    try {
        const postId = req.params.id;
        
        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
                user: req.userId,
            },
        )
        
        res.json({
            success: true, 
        })
        
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Can`t update post",
        })
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel ({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        })

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Failed to create post",
        })
    }
}