# Server Side (Node.js)

## Introduction
This is the backend server for the Lost and Hound. It is built using Node.js and Express.js to provide RESTful APIs for the frontend and other services. The server is responsible for managing user data, authentication, and interaction with the database.

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
Create a .env file in the root directory of the project and add the required environment variables. Example:

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
The server should now be running on the port specified in the .env file (e.g., http://localhost:4000).

2. Access the API: \
Open your browser or use a tool like Postman or curl to make requests to the API. Example:

```bash
GET http://localhost:3000/api/account/
```

## Testing
Unit Tests
To run unit tests, execute the following command:

```bash
npm test
```

This will run all tests located in the tests/unit directory using Jest.

<!-- To be added in Sprint 3 -->
<!-- End-to-End Tests
For end-to-end tests (if applicable), ensure the server is running, then run:

```bash
npm run e2e
``` -->

## Directory Structure
```bash
├── src
│   ├── server              # Main server code
│   │   ├── config          # Configuration files
│   │   ├── controllers     # Route controllers
│   │   ├── models          # Collection Models
│   │   ├── routes          # API routes
│   │   ├── tests           # Unit tests
│   │   └── utils           # Utility functions
│   ├── .env                # Environment variables
│   ├── package.json        # Dependencies and scripts
│   ├── jest.config.js      # Jest testing configuration
│   └── README.md           # Server documentation
└── README.md               # Whole Project documentation
```

## Common Issues
1. Port Already in Use: If you see an error that the port is already in use, try changing the PORT in your .env file or kill the process using the port:

```bash
kill $(lsof -t -i:4000)
```

2. Firebase Connection Error: Ensure all of the configs in Firebase in .env file is correct. You can also check the logs for detailed error messages.

3. Missing Environment Variables: Make sure your .env file contains all the required variables, and none of them are missing or incorrectly spelled.