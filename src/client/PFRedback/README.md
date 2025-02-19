# Client Side (React Native Expo App)
## Introduction
This is the mobile frontend for the Lost and Hound built with React Native using the Expo framework. The app provides a cross-platform experience for both iOS and Android, utilising native device features while maintaining a single codebase.

## Prerequisites
Before running the app, ensure you have the following tools installed:

* Node.js: Version 14.x or higher. [Download Node.js](https://nodejs.org/)
* npm (or yarn): Comes with Node.js
* Expo CLI: [Installation Guide](https://docs.expo.dev/)
* Git: [Download Git](https://git-scm.com/downloads)
* Expo Go app on your mobile device (iOS or Android)

To verify you have Node.js and npm installed, run:

```bash
node -v
npm -v
```

## Installation
1. Clone the repository:

```bash
git clone https://github.com/feit-comp90082/PF-RedBack.git

cd PF-RedBack
```
2. Install dependencies: \
Install the required packages for the project by running:

```bash
npm install
```
or if using yarn:

```bash
yarn install
```
## Environment Setup
1. Create a .env file: Add your environment variables for the project by creating a .env file at the root of the project directory. For example:


> **Note:** The `HOST` part of the `CV_HOST_URL` will be the same as `HOST_URL`, but the `PORT` should be different. 
>
> E.g. http://localhost:4000 for `HOST_URL` and http://localhost:4001 for `CV_HOST_URL`


```makefile
PRODUCT_NAME=Lost&Hound
HOST_URL=***
CV_HOST_URL=***

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



2. Configure API and other services: \
If your app interacts with an API or third-party services, ensure the .env file is correctly set up to include URLs and API keys.

## Running the App
1. Start the Expo Development Server:  \
Run the following command to start the Expo development server:

```bash
npx expo start -c
```

This will start a local development server and open the Expo Developer Tools in your browser.

2. Run the app on your mobile device:

Install the Expo Go app on your device (iOS or Android).
Scan the QR code displayed in your terminal or browser to load the app on your device.

Alternatively, you can use an emulator:

* iOS: Requires a Mac with Xcode installed.
* Android: Requires an Android emulator via Android Studio.

3. Run the app on a simulator/emulator:

To open on an iOS simulator:
```bash
npx expo start --ios
```
To open on an Android emulator:
```bash
npx expo start --android
```

## Building the App
1. Create a Production Build: To generate a build for iOS or Android, use the following Expo command:

```bash
npx expo build:android
npx expo build:ios
```

2. Publishing the App: After building the app, you can publish it on the app stores or through Expo's hosting service by running:

```bash
npx expo publish
```

## Testing
1. Unit Tests \
If you are using Jest for unit testing, run the following command:

```bash
npm test
```

This will run all the unit tests located in the `tests` directory.


## Directory Structure
```bash
├── assets                  # Images, fonts, and other static assets
├── components              # Reusable React components
├── navigation              # Navigation setup (e.g., React Navigation)
├── screens                 # App screens (e.g., Home, Login, etc.)
├── services                # API and other external services
├── store                   # State management (e.g., Redux, Context API)
├── .env                    # Environment variables
├── App.js                  # Main entry point of the application
├── package.json            # Project dependencies and scripts
├── app.json                # Expo configuration
└── README.md               # Project documentation
```
```bash
├── src
│   ├── client/PFRedback/    # Main client code
│   │   ├── api/             # API and other external services
│   │   │   ├── js
│   │   ├── app/             # App Pages and Screens
│   │   │   ├── jsx 
│   │   ├── assets/          # Images, fonts, and other static assets
│   │   │   ├── js png, jpg, jpeg, js
│   │   ├── components/      # Reusable React components
│   │   │   ├── js js, jsx 
│   │   ├── config/          # Configuration files
│   │   │   ├── js
│   │   ├── constants/       # All constant values
│   │   │   ├── js
│   │   ├── .env             # Environment variables
│   │   ├── package.json     # Dependencies and scripts
│   │   ├── jest.config.js   # Jest testing configuration
│   │   └── README.md        # Client documentation
└── README.md                # Whole Project documentation
```

## Common Issues
1. Metro Bundler Slow or Stuck: If the Metro bundler is running slowly, clear the cache and restart:

```bash
npx expo start --clear
```

2. Issues with Android Emulator: If you're having trouble running the app on an Android emulator, ensure that Android Studio is properly configured with an AVD. Check your emulator settings and ensure it's running.

3. API Not Working: Ensure the HOST_URL in your .env file is set correctly, and your backend server is up and running.

4. Expo Go App Not Connecting: If the Expo Go app isn’t connecting to the server, check your network connection or try restarting the Expo CLI with:

```bash
npx expo start --tunnel
```