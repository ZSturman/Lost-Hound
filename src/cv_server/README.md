# CV Server Side (Node.js)

## Introduction
This is the CV server for Lost and Hound. It is built using native TensorFlow execution in backend JavaScript applications running under the Node.js runtime. The server provides image recognition services to match features of lost pets against all the spotted pets in Firebase.

## Prerequisites
Before you begin, ensure you have met the following requirements:
* Node.js: Version 14.x or higher. Download Node.js
* npm: Comes installed with Node.js.
* Git: To clone the repository. Download Git
* Firebase: Ensure the database is set up and running.

You can check if Node.js and npm are installed by running:
```bash
node -v
npm -v
```
## Installation
1. Clone the repository:
```
git clone https://github.com/feit-comp90082/PF-RedBack.git

cd PF-Redback
```

2. Install dependencies: \
After navigating to the project directory, run:
```bash
npm install
```
This will install all the dependencies listed in package.json.

## Environment Setup
1. Create a .env file: \
Create a .env file in the root directory of the project and add the required environment variables. For Example:

> **Note:** The `HOST_URL` here should be the same as `CV_HOST_URL` in the client/PFRedback's .env file.

```makefile
PORT=***
HOST=***
HOST_URL=***

## Firebase Config 
EXPO_FIREBASE_API_KEY=***
EXPO_FIREBASE_AUTH_DOMAIN=***
EXPO_FIREBASE_PROJECT_ID=***
EXPO_FIREBASE_STORAGE_BUCKET=***
EXPO_FIREBASE_MESSAGING_SENDER_ID=***
EXPO_FIREBASE_APP_ID=***
EXPO_FIREBASE_MEASUREMENT_ID=***

# Google Config - Email
GOOGLE_EMAIL=***
GOOGLE_APP_PASSWORD=***
GOOGLE_API_KEY=***
```

## Running the Server
1. Start the server: \
To start the server in development mode with automatic restarts (using nodemon):

```bash
npm run dev
```
Alternatively, to run the server in production mode:

```bash
npm start
```
The server should now be running on the port specified in the .env file (e.g., http://localhost:4001 make sure that the port number is not the same as another server).

2. Access the API: \
Open your browser or use a tool like Postman or curl to make requests to the API. Example:

```bash
GET http://localhost:4001/cv/start/
```

## Directory Structure
```bash
├── src
│   ├── cv_server           # Main server code
│   │   ├── config          # Configuration files
│   │   ├── controllers     # Route controllers
│   │   ├── model           # CV model & Firebase connection
│   │   ├── routes          # API routes
│   ├── .env                # Environment variables
│   ├── package.json        # Dependencies and scripts
│   └── README.md           # CV Server documentation
└── README.md               # Whole Project documentation
```

## Common Issues
1. Port Already in Use: If you see an error that the port is already in use, try changing the PORT in your .env file or kill the process using the port:

```bash
kill $(lsof -t -i:4001)
```

2. Firebase Connection Error: Ensure all of the configs in Firebase in .env file is correct. You can also check the logs for detailed error messages.

3. Missing Environment Variables: Make sure your .env file contains all the required variables, that no port is in use, and that none of the variables are missing or incorrectly spelled.