const express = require('express');
const router = express.Router();

const { createBlog, getBlogs, getSingleBlogByApplicant, postCommentHandler, fetchAllCommentsHandler, postLikeHandler, fetchAllLikesHandler } = require('../controllers/blogController');



router.post('/', createBlog);
router.get('/', getBlogs);
router.get('/:blogId', getSingleBlogByApplicant);

router.get('/:blogId/comments', fetchAllCommentsHandler);
router.post('/:blogId/comment', postCommentHandler);

router.get('/:blogId/likes', fetchAllLikesHandler);
router.post('/:blogId/like', postLikeHandler);



module.exports = router;