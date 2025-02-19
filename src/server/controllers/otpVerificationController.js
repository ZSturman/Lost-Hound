import { FIREBASE_DB, FIREBASE_AUTH } from '../config/firebase.js'
import speakeasy from 'speakeasy'
import nodemailer from 'nodemailer'

import {
    getFirestore,
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    setDoc, 
    query, 
    where
  } from 'firebase/firestore';

const auth = FIREBASE_AUTH
const db = FIREBASE_DB

const otpRefs = collection(db, 'otps')
const timeToOtpExpiry = 5


/**
 * Sends the verificaiton email to the user 
 * 
 * The base32 secret is stored in firestore for later verification
 * 
 * @param {*} userEmail -- the users' email to send the OTP to 
 */
const sendEmail = async (req, res) => {
    const { userEmail } = req.body

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, 
            auth: {
                user: process.env.GOOGLE_EMAIL,
                pass: process.env.GOOGLE_APP_PASSWORD,
            }
        })
        
        await transporter.verify()

        const {token, secret, expiryTime} = await generateOTP()
        await storeOTP(userEmail, secret, expiryTime)

        const emailText = await createEmailText(token)

        transporter.sendMail({
            from: {
                name: 'Lost and Hound',
                address: process.env.GOOGLE_EMAIL
            },
            to: userEmail,
            subject: "OTP for Email Verification",
            html: emailText,
        })

        console.log(`Email sent to ${userEmail}`)
        res.status(200).send("Email with OTP sent sucessfully")
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }
}

/**
 * Creates the text to be sent 
 * @returns the html text to be sent to the users' email
 */
const createEmailText = async(token) => {
    const text = `Your OTP for Lost and Hound is <strong>${token}</strong>. Please enter this on the verification screen to complete your account setup.`
    return text
}

/**
 * Generate OTP and the time the OTP expires
 */
const generateOTP = async () => {
    const secret = speakeasy.generateSecret({length: 20})
    const token = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32',
    })
    const expiryTime = Date.now() + timeToOtpExpiry * 60 * 1000
    return {token, secret, expiryTime}
}


/**
 * Stores the secret to firestore in the "otps" collection
 * 
 * (1) If email is not present in collection, add a document
 * 
 * (2) If present, replaces current data (secret, expiryTime, isVerified)
 * 
 * @param {*} userEmail 
 * @param {*} secret -- in base32, to be used for verification
 * @param {*} expiryTime -- time when the secret (and token) expire
 */
const storeOTP = async (userEmail, secret, expiryTime) => {
    checkInputType(userEmail, secret.base32, expiryTime)

    const q = query(otpRefs, where('userEmail', '==', userEmail))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
        await addDoc(otpRefs, {
            userEmail: userEmail,
            secret: secret.base32,
            expiryTime: expiryTime,
            isVerified: false
        })
    } else {
        const docRef = querySnapshot.docs[0].ref
        await updateDoc(docRef, {
            secret: secret.base32,
            expiryTime: expiryTime,
            isVerified: false,
        })
    }
}

/**
 * Verifies the input given before modifying the collection in firestore
 * @param {*} userEmail 
 * @param {*} secret 
 * @param {*} expiryTime 
 */
const checkInputType = (userEmail, secret, expiryTime) => {
    if (typeof userEmail != 'string') {
        throw new Error('Invalid email')
    } 

    if (typeof secret != 'string') {
        throw new Error('Invalid secret')
    }

    if (typeof expiryTime != 'number') {
        throw new Error('Invalid expiry time')
    }
}



/**
 * Verifies the OTP 
 * 
 * 1. Retrieve secret (in base 32) from database using user email 
 * 
 * 2. Verify if the OTP entered is accurate 
 * 
 *    a) no record in database
 *    b) expiry time has passed 
 *    c) token does not match OTP entered
 *    d) token has been verified before
 */
const verifyOTP = async(req, res) => {
    const { enteredOTP, userEmail } = req.body

    try {
        const q = query(otpRefs, where('userEmail', '==', userEmail))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
            res.status(404).send('No Existing OTP')
            return
        } 
        
        const docData = querySnapshot.docs[0].data()
        const docRef = querySnapshot.docs[0].ref
        
        const currentTime = Date.now()
        
        if (currentTime > docData.expiryTime) {
            console.log("OTP has expired")
            res.status(400).send('OTP Expired')
            return 
        } 
        
        if (docData.isVerified == true) {
            console.log("OTP has previously been verified")
            res.status(400).send('OTP Previously Verified')
            return
        }

        var isVerified = speakeasy.totp.verify({
            secret: docData.secret,
            encoding: 'base32',
            token: enteredOTP,
            window: 6
        })   


        if (isVerified) {
            console.log("OTP verified: ", isVerified)
            await updateDoc(docRef, {
                isVerified: true
            })
            console.log("OTP Verified")
            res.status(200).send('OTP Verified')
        } else {
            console.log("OTP does not match (is incorrect)")
            res.status(400).send('OTP Incorrect')
        }

    } catch (error) {
        console.log(error.message)
        res.status(400).send("Verification Error")
    }
    
}


export default { sendEmail, verifyOTP, checkInputType }

