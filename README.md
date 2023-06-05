# EASYAUTH
## _Authentcation and Authorization_

  *Webiste live at https://easyauth.onrender.com/*
  
[![Website easyauth.onrender.com](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://easyauth.onrender.com/)  [![Open Source? Yes!](https://badgen.net/badge/Open%20Source%20%3F/Yes%21/blue?icon=github)](https://github.com/Naereen/badges/)

> **Easyauth provides modern Login and Signup features that can further be entended for various services such as** 

- 📃TODO Lists
- 🤳Social Media Login
-  👩‍💻User Authentication for a website 
-  📨 NewsLetters
- and many more 😉

***
## Features

+ [x]  Signup and create your own account! 
+ [x]  Login to your account! 
+ [x]  Each login session lasts for 60 seconds
+ [x]  Reset your password &nbsp; ![New!](https://img.shields.io/badge/New%20!%20-red)
+ [x]  Reset URL is valid up to 5 minutes! &nbsp; ![New!](https://img.shields.io/badge/New%20!%20-red)
+ [x]  Responsive for  Mobiles, Laptops and PC
+ [x]  Rate Limiting based upon incoming request's IP address  &nbsp; ![New!](https://img.shields.io/badge/New%20!%20-red)

***

## Tech

**Backend**
![https://nodejs.org/en/](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)  ![Mongoose](https://mongoosejs.com/docs/images/mongoose5_62x30_transparent.png)
**Database**
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) 
**Front End**
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)  ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)


Easyauth's server is built using [Node](https://nodejs.org/en/) and uses core node modules such as `node:http`, `url`, `fs` etc to handle incoming *requests* from the frontend.
No external library such as like Express is used for the backend implementation. 

[MongoDB](https://www.mongodb.com/) is used as the primary Databse along with [Mongoose](https://mongoosejs.com/) API which provides object modeling for [Node](https://nodejs.org/en/).

Frontend is entirely built using HTML, CSS and vanilla Javascript for everything, from state management, animations and logs 😉 This is made possible by using a combination of `XML` and `fetch` *requests* for updating the HTML when user interacts with the webiste.

***
## Screenshots 

**Landing Page**
[![home.jpg](https://i.postimg.cc/43Z132h2/home.jpg)](https://postimg.cc/4YLcL5Pp)

**Sign Up Error Log**
[![easyauth-signup-log.png](https://i.postimg.cc/k522WDsY/easyauth-signup-log.png)](https://postimg.cc/WDPpvNQ0)

**Reset Email Sent Log**
[![easyauth-email-log-jpg.png](https://i.postimg.cc/g2W9v7KC/easyauth-email-log-jpg.png)](https://postimg.cc/mt8648Jj)

**Reset Page** (Accessed via email)
[![easyauth-reset.jpg](https://i.postimg.cc/1XKmkNsH/easyauth-reset.jpg)](https://postimg.cc/0Kb1mj6M)

***

## Installation (Win🪟)

Easyauth requires [Node.js](https://nodejs.org/) v10+ to run.

**STEP 1** Clone the project using git.

```sh
git clone https://github.com/bhardwajrizul/EasyAuth-v1.git
cd EasyAuth-v1
```
**STEP 2** Install the dependencies and devDependencies.

```sh
npm install
```
**STEP 3** Create a `.env` file
```sh
touch .env
```
edit `.env` using the `sample_env.txt` provied with this project


**STEP 4.1** Run the server (*Development Mode*)
```sh
npm start
```


**STEP 4.2** Run the server (*Production Mode*)

```sh 
npm install --production
# npm run build # Optional: Use only if you modified the SASS
NODE_ENV=production node server.js
```

* Server is hosted at [http://127.0.0.1:3000](http://127.0.0.1:3000) (can be changed in `server.js`) 
* CSS can be changed in `styles.css`r by modifying the SASS files

***

## Development
Want to contribute? Great!

Pull requests are welcome.
For major changes, please open an issue first to discuss what you would like to change.
***
## Note ⚠️
>  **Important Notice** : Read before using the application

>This is a personal project which I started with the intent of learning how authentication and authorization works. 
This by no means provides complete authentication or authorization and such services should never be implemented on your own. The application has many buys and unresolved issues! 

***
## License

Copyright notice: [Opensource Project](https://opensource.org/osd). Not necessary but credits would be nice!
***
