import express from "express";
import bodyParser from "body-parser";
import { posts, spotted } from "../fakedb.js";

import {
    getLostPosts,
    getUserLostPosts,
    getSpottedPosts,
    getFilteredPosts,
    getUserSpottedPosts,
    getLostPostByID,
    getSpottedPostByID,
    editPost,
    deletePost,
    updatePostStatus
} from "../controllers/postController.js";

const router = express.Router();

/**
 * @swagger
 * /api/posts/lost/all:
 *   get:
 *     summary: Retrieve all lost posts.
 *     description: Fetches all lost pet posts from the database, along with the date and time when the pet was last seen.
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: A list of all lost posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   postID:
 *                     type: string
 *                   lastSeenDatetime:
 *                     type: string
 *                   dateLastSeenString:
 *                     type: string
 *                   timeLastSeenString:
 *                     type: string
 *                   species:
 *                     type: string
 *                   color:
 *                     type: string
 *                   location:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                       lng:
 *                         type: number
 *       500:
 *         description: Error retrieving lost posts.
 */
router.get("/lost/all", getLostPosts);

/**
 * @swagger
 *  /api/posts/spotted/all:
 *   get:
 *     summary: Retrieve all spotted posts.
 *     description: Fetches all spotted pet posts from the database, along with the date and time when the pet was last seen.
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: A list of all spotted posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   postID:
 *                     type: string
 *                   lastSeenDatetime:
 *                     type: string
 *                   dateLastSeenString:
 *                     type: string
 *                   timeLastSeenString:
 *                     type: string
 *                   species:
 *                     type: string
 *                   color:
 *                     type: string
 *                   location:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                       lng:
 *                         type: number
 *       500:
 *         description: Error retrieving spotted posts.
 */
router.get("/spotted/all", getSpottedPosts);

/**
 * @swagger
 * /api/posts/lost/{id}:
 *   get:
 *     summary: Retrieve lost posts by user ID.
 *     description: Fetches all lost posts created by a specific user based on the user ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user ID to filter posts by.
 *         schema:
 *           type: string
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: A list of lost posts by the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   postID:
 *                     type: string
 *                   lastSeenDatetime:
 *                     type: string
 *                   species:
 *                     type: string
 *                   color:
 *                     type: string
 *                   location:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                       lng:
 *                         type: number
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error retrieving lost posts by user ID.
 */
router.get("/lost/:id", getUserLostPosts);

/**
 * @swagger
 * /api/posts/spotted/{id}:
 *   get:
 *     summary: Retrieve spotted posts by user ID.
 *     description: Fetches all spotted posts created by a specific user based on the user ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user ID to filter posts by.
 *         schema:
 *           type: string
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: A list of spotted posts by the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   postID:
 *                     type: string
 *                   lastSeenDatetime:
 *                     type: string
 *                   species:
 *                     type: string
 *                   color:
 *                     type: string
 *                   location:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                       lng:
 *                         type: number
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error retrieving spotted posts by user ID.
 */
router.get("/spotted/:id", getUserSpottedPosts);

/**
 * @swagger
 * /api/posts/lost/post/{postid}:
 *   get:
 *     summary: Retrieve a lost post by post ID.
 *     description: Fetches the details of a specific lost post based on the post ID.
 *     parameters:
 *       - in: path
 *         name: postid
 *         required: true
 *         description: The post ID of the lost post.
 *         schema:
 *           type: string
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: The details of the lost post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 postID:
 *                   type: string
 *                 lastSeenDatetime:
 *                   type: string
 *                 species:
 *                   type: string
 *                 color:
 *                   type: string
 *                 location:
 *                   type: object
 *                   properties:
 *                     lat:
 *                       type: number
 *                     lng:
 *                       type: number
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Error retrieving lost post by ID.
 */
router.get("/lost/post/:postid", getLostPostByID);

/**
 * @swagger
 * /api/posts/spotted/post/{postid}:
 *   get:
 *     summary: Retrieve a spotted post by post ID.
 *     description: Fetches the details of a specific spotted post based on the post ID.
 *     parameters:
 *       - in: path
 *         name: postid
 *         required: true
 *         description: The post ID of the spotted post.
 *         schema:
 *           type: string
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: The details of the spotted post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 postID:
 *                   type: string
 *                 lastSeenDatetime:
 *                   type: string
 *                 species:
 *                   type: string
 *                 color:
 *                   type: string
 *                 location:
 *                   type: object
 *                   properties:
 *                     lat:
 *                       type: number
 *                     lng:
 *                       type: number
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Error retrieving spotted post by ID.
 */
router.get("/spotted/post/:postid", getSpottedPostByID);

/**
 * @swagger
 * /api/posts/filter:
 *   post:
 *     summary: Retrieve filtered posts.
 *     description: Filters posts based on user-defined criteria, including species, size, color, and location range, and sorts the results accordingly.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               selectedOptions:
 *                 type: object
 *                 properties:
 *                   speciesOption:
 *                     type: string
 *                   sizeOption:
 *                     type: string
 *                   colourOptions:
 *                     type: array
 *                     items:
 *                       type: string
 *                   sortOption:
 *                     type: string
 *                   range:
 *                     type: number
 *               isLostFeed:
 *                 type: string
 *                 description: Indicates if the filter applies to lost posts ('true') or spotted posts ('false').
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: A list of filtered posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Error applying filters to posts.
 */
router.post("/filter", getFilteredPosts);

/**
 * @swagger
 * /api/posts/{post type}/edit/{id}:
 *   post:
 *     summary: Edit specified post
 *     description: 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The post ID to edit posts by.
 *         schema:
 *           type: string
 *       - in: path
 *         name: type
 *         required: true
 *         description: The type of post to set collection to search in
 *         schema:
 *           type: string
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: Successfully edited post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 postID:
 *                   type: string
 *                 lastSeenDatetime:
 *                   type: string
 *                 species:
 *                   type: string
 *                 color:
 *                   type: string
 *                 location:
 *                   type: object
 *                   properties:
 *                     lat:
 *                       type: number
 *                     lng:
 *                       type: number
 *       400:
 *         description: 
 */
router.put("/:type/edit/:postid", editPost);

router.delete("/:type/delete/:postid", deletePost);

router.patch("/:type/update_status/:postid", updatePostStatus);

export default router;
