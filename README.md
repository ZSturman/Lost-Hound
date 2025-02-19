# Lost & Hound - a Pet Finder Mobile Application

### App Link: <a href="https://appstoreconnect.apple.com/teams/88ed8354-418c-4d0b-a56c-e36019522304/apps/6702022401/testflight/ios">Test Flight App</a>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-lost--hound">About Lost & Hound</a>
      <ul>
        <li><a href="#project-team-members">Project Team Members</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#repository-directory-structure">Repository Directory Structure</a></li>
    <li><a href="#changelog">Changelog</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installations">Installations</a></li>
        <li><a href="#clone-the-repository">Clone the Repository</a></li>
        <li><a href="#prerequisites">Prerequisites</a></li>
      </ul>
    </li>
    
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About Lost & Hound
Lost & Hound is a mobile application designed to help reunite lost pets with their owners. As a community-driven platform, users will be able to use Lost & Hound to report sightings of lost pets and stray animals. By digitising what has traditionally been an offline activity, Lost & Hound aims to address said limitations to enhance the efficiency and increase the chances of pet recovery.


### Built With
This project will be utilising these following technologies:

* [![React Native][React.js]][React-url]
* [![Node.js][Node.js]][Node-url]
* [![Expo][Expo.dev]][Expo-url]
* [![Android][Android]][Android-url]
* [![Xcode][Xcode]][Xcode-url]
* [![Jest][Jest]][Jest-url]
* [![Postman][Postman]][Postman-url]
* [![Firebase][Firebase]][Firebase-url]
* [![Heroku][Heroku]][Heroku-url]

*The location services in this app are only available in Australia for now.*

<p align="right">(<a href="#lost--hound---a-pet-finder-mobile-application">back to top</a>)</p>

## Repository Directory Structure
For client and server parts, more details are added in their respective README files. 

Client Side: /src/client/PFRedback/README.md

Server Side: /src/server/README.md

Computer Vision (CV) Server Side: src/cv_server/README.md

### General Workflow
```
pf-redback
├── .github               # All GitHub customised settings
├── docs/                 # Documentation files 
│   ├── sprint1/          # Sprint 1 Documentation
|   |   ├── pdf
│   ├── sprint2/          # Sprint 2 Documentation
|   |   ├── pdf
│   ├── sprint3/          # Sprint 3 Documentation
|   |   ├── pdf
├── src/                  # Source code folder
│   ├── client/           # Client side folder
|   |   ├── js, jsx       # Refer to README file (Client)
│   ├── resources/        # Resources folder
|   |   ├── images
│   ├── server/           # Server side folder
|   |   ├── js            # Refer to README file (Server)
│   ├── cv_server/        # Computer Vision Server side folder
|   |   ├── js            # Refer to README file (CV Server)
├── .gitignore            # Extensions to exclude in git
└── README.md             # Markdown of the Github repository
```
<p align="right">(<a href="#lost--hound---a-pet-finder-mobile-application">back to top</a>)</p>

## Changelog
All notable changes to this project is documented in this section. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). All Changelogs can be seen in `CHANGELOG.md`.

<p align="right">(<a href="#lost--hound---a-pet-finder-mobile-application">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started
To run the project, the following steps needs to be done to get started:

### Installations
Set up the applications needed in order to work on the project

#### Software:
1. Node.js
- Version: v16.x
- Installation: Download and install Node.js from the official website.
- Verify installation by running:
```bash
node -v
npm -v
```
2. React Native
- Version: Latest stable version
- Installation: Install React Native CLI globally:
```bash
npm install -g react-native-cli
```
- Verify installation by running:
```bash
react-native --version
```
3. Expo
- Version: Latest version
- Installation: Install Expo CLI globally:
```bash
npm install -g expo-cli
```
- Verify installation by running:
```bash
expo --version
```
### Development Tools:
- Download [Visual Studio Code](https://code.visualstudio.com/)
- Setup the [Firebase](https://firebase.google.com/) project
- Setup the [Heroku](https://www.heroku.com/)


#### Testing:
- Download [Postman](https://www.postman.com/downloads/)
- Install Jest
    - Version: Latest stable version
    - Installation: Install Jest as a development dependency:
    ```bash
    npm install --save-dev jest
    ```
    - Verify installation by running:
    ```bash
    jest --version
    ```




### Clone the repository
To start, you need to clone the project to your local machine:
  ```sh
  git clone https://github.com/feit-comp90082/PF-RedBack
  ```

### Prerequisites

#### To run the application (Frontend)
1. Open Visual Studio Code
2. Open Terminal in VS Code
3. Install NPM packages
```sh
  npm install
  ```
4. Run the application via local machine
```sh
  npx expo start -c
  ```

#### To run the application (Backend)
1. Open Visual Studio Code
2. Open Terminal in VS Code (another terminal)
3. Install NPM packages
```sh
  npm install
  ```
4. Run the application via local machine
```sh
  npm start
  ```

You're ready to code!

#### Run Tests (Frontend / Backend)
1. Open Visual Studio Code
2. Open Terminal in VS Code (another terminal)
3. Install NPM packages
```sh
  npm install
  ```
4. Run the test in the application
```sh
  npm test
  ```

<p align="right">(<a href="#lost--hound---a-pet-finder-mobile-application">back to top</a>)</p>




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[React.js]: https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Node.js]: https://img.shields.io/badge/Node.js-grey?style=for-the-badge&logo=javascript&logoColor=5FA04E
[Node-url]: https://nodejs.org/en
[Expo.dev]: https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white
[Expo-url]: https://expo.dev/
[Android]: https://img.shields.io/badge/Android%20Studio-808080?style=for-the-badge&logo=android&logoColor=3DDC84
[Android-url]: https://developer.android.com/studio
[Xcode]: https://img.shields.io/badge/xCode-DFFF00?style=for-the-badge&logo=xcode&logoColor=147EFB
[Xcode-url]: https://developer.apple.com/xcode/
[Jest]: https://img.shields.io/badge/Jest-FFFFFF?style=for-the-badge&logo=jest&logoColor=C21325
[Jest-url]: https://jestjs.io/
[Postman]: https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=FFFFFF
[Postman-url]: https://www.postman.com/
[Firebase]: https://img.shields.io/badge/Firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white
[Firebase-url]: https://firebase.google.com/
[Heroku]: https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white
[Heroku-url]: https://www.heroku.com/
