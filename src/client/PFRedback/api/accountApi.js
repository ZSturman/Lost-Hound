import React from "react";
import { router } from "expo-router";
const accountEndpoint = "/api/account/";

const getCurrentAccount = async () => {
    try {
        const hostURL = process.env.HOST_URL;
        const url = `${hostURL}${accountEndpoint}`;
        console.log(url);

        const response = await fetch(url);

        console.log("Response: ", response);
        if (response.ok) {
            const data = await response.json();

            console.log("Response status: ", response.status);
            console.log("account api: ", data);
            return data;
        } 

        
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
};

const logoutAccount = async () => {
    try {
        const hostURL = process.env.HOST_URL;
        const url = `${hostURL}${accountEndpoint}logout`;

        const settings = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };

        console.log(url);

        const response = await fetch(url, settings);

        console.log("Response: ", response);
        router.replace("/login");
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
};

const deleteAccount = async() => {
    const hostURL = process.env.HOST_URL;
    const url = `${hostURL}/api/account/`;

    const response = await fetch(url, {
        method: "DELETE"});

    console.log(response.text())
}

const getAccountById = async(userId) => {
    try {

        const hostURL = process.env.HOST_URL;
        const url = `${hostURL}${accountEndpoint}${userId}`;
        console.log(url)
    
        const response = await fetch(url);
    
        if (response.ok) {
            const data = await response.json();
    
            console.log("Response status: ", response.status);
            console.log("Other user account api: ", data);
            return data;
        } 
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

export { getCurrentAccount, logoutAccount, deleteAccount, getAccountById };
