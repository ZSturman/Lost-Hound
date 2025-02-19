import React from "react";
import { router } from "expo-router";
import { Alert } from "react-native";

const postsEndpoint = "/api/posts/";

const getAllPosts = async (type) => {
    try {
        const hostURL = process.env.HOST_URL;
        const url = `${hostURL}${postsEndpoint}${type}/all`;
        console.log(url);

        const response = await fetch(url);
        const data = await response.json();

        console.log("Response status: ", response.status);

        return data;
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
};

const getUserPosts = async (type, uid) => {
    try {
        const hostURL = process.env.HOST_URL;
        const url = `${hostURL}${postsEndpoint}${type}/${uid}`;
        console.log(url);

        const response = await fetch(url);
        const data = await response.json();

        console.log("Response status: ", response.status);

        data.forEach(element => {
            element['type'] = type
        });

        return data;
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
};

const getPostByID = async (type, postid) => {
    try {
        const hostURL = process.env.HOST_URL
        const url = `${hostURL}${postsEndpoint}${type}/post/${postid}`
        console.log(url)

        const response = await fetch(url);
        const data = await response.json();

        console.log("id Response status: ", response.status);
        console.log("id api url: ", url)

        return data;
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
};

const deletePostByID = async (type, postid) => {
    try {
        const hostURL = process.env.HOST_URL
        const url = `${hostURL}${postsEndpoint}${type}/delete/${postid}`
        
        console.log(url)
        await fetch(url, {method:'DELETE'}).then(response => console.log(response));

        return ;
    } catch (error) {
        console.error("Error delete post: ", error);
    }
}

export { getAllPosts, getUserPosts, getPostByID, deletePostByID}
