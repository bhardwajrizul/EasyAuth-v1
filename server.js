// Requiring modules
require('dotenv').config();

// Core Modeules
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');
const querystring = require('querystring');


// NPM modules
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Cookies = require('cookies')
const mongoose = require('mongoose');
const axios = require('axios');

// UTILITY Modules
const rateLimit = require('./modules/rateLimit');

// Custom Modules
const userModel = require('./db');
const replaceTemplate = require('./modules/replaceTemplate');
const { decode } = require('punycode');
const { prependOnceListener } = require('process');
const { reset } = require('nodemon');



// Establishing DB Connection
main().then(() => {
  console.log("DB Connection Successful!")
}).catch(err => console.log("DB ERROR : ", err));

async function main() {
  await mongoose.connect(process.env.DB_MONGOOSE);
}

// host and port of our local server
const host = '0.0.0.0';
const port = process.env.PORT || 3000;

// REGEX EMAIL
const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const nameRegex = /^[A-Za-z]+((\s)?((\'|\-|\.)?([A-Za-z])+))*$/;

// Global Variables
let alert = '';
const maxUsers = 15;
const maxRequests = 300;
const maxResetLimit = 3;
const validFor = 5 * 60 * 1000;
const oneMinute = 60 * 1000;
const handleRateLimit = rateLimit(maxRequests, 60 * 1000); // 300 requests per minute



// creating a http server that handles a request and sends 
// back a response in a callback
const server = http.createServer(async (req, res) => {
  // console.log("{URL:::", req.url, " ------ ", "METHOD:::", req.method, "}\n");
})

server.on('request', async (req, res) => {
  handleRateLimit(req, res, () => {

    /// HANDLING GET REQUESTS
    if (req.method == 'GET') {
      // if request is made at the root '/' route 
      if (req.url === '/') {
        // Create a suitable index.html file path NOTE*(index.html must always be in the root directory of static (public) folder)
        const HTML = path.join(__dirname, '/public/index.html');
        // create a Read Stream and pipe the response to it
        const HTMLStream = fs.createReadStream(HTML, 'utf-8');
        // This will wait until we know the readable stream is actually valid before piping
        HTMLStream.on('open', () => {
          // This just pipes the read stream to the response object (which goes to the client)
          HTMLStream.pipe(res);
          // set the type of response to be css
          res.writeHead(200, { 'Content-Type': 'text/html' });
        })

        // This catches any errors that happen while creating the readable stream (usually invalid names)
        HTMLStream.on('error', (err) => {
          // set the response to type to be text
          res.writeHead(404, { 'Content-Type': 'text/html' });
          // Send a suitable response
          res.end();
        });
      }

      // if request is made for a css file 
      // (this req is made by our HTML files in the <link rel="stylesheets" href="..path"> section of HTML)
      else if (req.url.match('\.css$')) {
        // create a suitable css file path according to the request made from the html file
        const css = path.join(__dirname, 'public', req.url);
        // create a Read Stream and pipe the response to it
        const cssStream = fs.createReadStream(css, 'utf-8');

        // This will wait until we know the readable stream is actually valid before piping
        cssStream.on('open', () => {
          // This just pipes the read stream to the response object (which goes to the client)
          cssStream.pipe(res);
          // set the type of response to be css
          res.writeHead(200, { 'Content-Type': 'text/css' });
        })

        // This catches any errors that happen while creating the readable stream (usually invalid names)
        cssStream.on('error', (err) => {
          // set the response to type to be text
          res.writeHead(404, { 'Content-Type': 'text/html' });
          // Send a suitable response
          res.end();
        });

      }

      // if request is made for a js file 
      // (this req is made by our HTML files in the <script src="..path"> section of HTML)
      else if (req.url.match('\.js$')) {
        // create a suitable js file path according to the request made from the html file
        const js = path.join(__dirname, 'public', req.url);
        // Opens the file (located in the path specified by js) as a readable stream
        const jsStream = fs.createReadStream(js, 'utf-8');

        // This will wait until we know the readable stream is actually valid before piping
        jsStream.on('open', () => {
          // This just pipes the read stream to the response object (which goes to the client)
          jsStream.pipe(res);
          // set the response to type to be js
          res.writeHead(200, { 'Content-Type': 'text/javascript' });
        })
        // This catches any errors that happen while creating the readable stream (usually invalid names)
        jsStream.on('error', (err) => {
          // set the response to type to be text
          res.writeHead(404, { 'Content-Type': 'text/html' });
          // Send a suitable response
          res.end();
        });

      }

      // if request is made for a png file 
      // (this req is made by our HTML files in the <object data="..path/*.png"> section of HTML)
      else if (req.url.match('\.png$')) {
        // create a suitable png file path according to the request made from the html file
        const png = path.join(__dirname, 'public', req.url);
        // Opens the file (located in the path specified by png) as a readable stream
        const pngStream = fs.createReadStream(png);

        // This will wait until we know the readable stream is actually valid before piping
        pngStream.on('open', () => {
          // This just pipes the read stream to the response object (which goes to the client)
          pngStream.pipe(res);
          // set the response to type to be png
          res.writeHead(200, { 'Content-Type': 'image/png' });
        })
        // This catches any errors that happen while creating the readable stream (usually invalid names)
        pngStream.on('error', (err) => {
          // set the response to type to be text
          res.writeHead(404, { 'Content-Type': 'text/html' });
          // Send a suitable response
          res.end();
        });

      }

      // If signup button is clicked
      // an AJAX GET req is sent to /signup route
      else if (req.url === '/signup') {
        fs.readFile(path.join(__dirname, './public/html/components/signup_1.html'), (err, data) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' })
            res.end('404 Bad Gateway');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(data);
          }
        })
      }


      else if (req.url == '/signupConfirm') {
        let dataValid = {
          confirm: false,
          data: ''
        };
        if (getLengthAlert(alert) == 0) {
          fs.readFile(path.join(__dirname, './public/html/components/signup_2.html'), (err, data) => {
            if (err) {
              dataValid.confirm = true;
              dataValid.data = '404 Bad Gateway';
              res.writeHead(404, { 'Content-Type': 'text/html' });
              res.end(JSON.stringify(dataValid));
            } else {
              dataValid.confirm = true;
              dataValid.data = data.toString();
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(JSON.stringify(dataValid));
            }
          })
        }
        else if (getLengthAlert(alert) > 0) {
          // THERE IS ALERT PRESENT
          dataValid.confirm = false;
          dataValid.data = alert;
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(JSON.stringify(dataValid));
        }

      }

      else if (req.url === '/getLoginForm') {
        fs.readFile(path.join(__dirname, './public/html/components/login.html'), (err, data) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' })
            res.end('404 Bad Gateway');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(data);
          }
        })
      }

      else if (req.url === '/login') {

        let dataValid = {
          token: false,
          confirm: false,
          data: ''
        }

        let cookies = new Cookies(req, res, { keys: [process.env.COOKIE_KEYS] });
        let token = cookies.get(process.env.COOKIE_NAME);

        if (!token) {
          dataValid.token = false;
          dataValid.data = 'Login Please';

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(JSON.stringify(dataValid));
        } else {
          dataValid.token = true;
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(JSON.stringify(dataValid));
        }





      }

      else if (req.url === '/logout') {
        let cookies = new Cookies(req, res, { keys: [process.env.COOKIE_KEYS] });
        cookies.set(process.env.COOKIE_NAME, '', { sameSite: 'lax', overwrite: true });
        res.end();
      }

      else if (req.url == '/homepage') {
        let dataValid = {
          confirm: false,
          data: ''
        }

        // THERE IS AN ALERT PRESENT
        if (getLengthAlert(alert) > 0) {
          dataValid.confirm = false;
          dataValid.data = alert;
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(JSON.stringify(dataValid));
        }
        // THERE IS NO ALERT
        else if (getLengthAlert(alert) == 0) {

          let cookies = new Cookies(req, res, { keys: [process.env.COOKIE_KEYS] });
          let token = cookies.get(process.env.COOKIE_NAME);

          if (token) {
            jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
              if (!err) {
                let email = decoded.userEmail;
                userModel.find({ email }, (err, docs) => {
                  if (!err && docs.length > 0) {
                    let user = docs[0];
                    fs.readFile(path.join(__dirname, './public/html/layouts/home_temp.html'), (err, data) => {
                      if (err) {
                        alert += '<p>404 Not Found!</p>';
                        dataValid.confirm = false;
                        dataValid.data = alert;
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(JSON.stringify(dataValid));
                      } else {
                        let userHTML = replaceTemplate(data.toString(), {
                          userEmail: user.email,
                          userName: user.name
                        });
                        dataValid = true;
                        dataValid.data = userHTML;
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(userHTML);
                      }
                    })
                  }
                })
              }
              else if (err) {
                alert += '<p>Unexpected Error!</p>';
                dataValid.confirm = false;
                dataValid.data = alert;
                res.end(JSON.stringify(dataValid));
              }
            });

          } else {
            dataValid.confirm = false;
            dataValid.data = '';
            res.writeHead(301, { 'Content-type': 'text/html', 'Location': '/' });
            res.end();
          }
        }

      }

      else if (req.url == '/getForgotForm') {

        fs.readFile(path.join(__dirname, './public/html/components/forgot.html'), (err, data) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('404 Bad Gateway');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
          }
        })
      }

      else if (req.url == '/getResetToken') {
        let dataValid = {
          confirm: false,
          data: ''
        }

        if (getLengthAlert(alert) > 0) {
          // THERE IS ALERT PRESENT
          dataValid.confirm = false;
          dataValid.data = alert;

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(JSON.stringify(dataValid));
        }
        else if (getLengthAlert(alert) == 0) {
          // THERE IS NO ALERT
          const expiryDate = Date.now() + validFor;
          const currentTime = Date.now();
          const timeDifference = expiryDate - currentTime;
          const minutes = Math.ceil(timeDifference / oneMinute);

          // console.log(minutes);

          let successAlert = '';
          successAlert += '<p><strong class="u-fs-s u-color-danger">&#x2705;</strong>If your account exists then check your email for further instructions</p>';
          successAlert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong> Make Sure to check your spam folder if you don\'t see the email</p>';
          successAlert += `<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong> URL is valid for ${minutes} minutes!</p>`;

          dataValid.confirm = true;
          dataValid.data = successAlert;
          // console.log(dataValid);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(JSON.stringify(dataValid));
        }
        else {
          dataValid.confirm = false;
          dataValid.data = '';
          res.writeHead(301, { 'Content-type': 'text/html', 'Location': '/' });
          res.end();
        }
      }

      else if (req.url.startsWith('/resetPassword')) {


        const resetHTML = path.join(__dirname, '/public/html/pages/reset_password.html');
        fs.readFile(resetHTML, 'utf-8', (err, data) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('404 Bad Gateway');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
          }
        })
      }

      else if (req.url == '/checkResetUrl') {
        let dataValid = {
          confirm: false,
          data: ''
        }
        if (getLengthAlert(alert) > 0) {
          // THERE IS ALERT PRESENT
          dataValid.confirm = false;
          dataValid.data = alert;
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(JSON.stringify(dataValid));
        } 
        else if (getLengthAlert(alert) == 0) {
          fs.readFile(path.join(__dirname, './public/html/components/reset.html'), (err, dataHTML) => {
            if (err) {
              // send a response for invalid request
              dataValid.confirm = false;
              dataValid.data = '404 Bad Gateway'; 
              res.writeHead(404, { "Content-Type": 'text/html' });
              res.end(JSON.stringify(dataValid));
            }
            else {
              dataValid.confirm = true;
              dataValid.data = dataHTML.toString();
              // send a response for invalid request
              res.writeHead(200, { "Content-Type": 'text/html' });
              res.end(JSON.stringify(dataValid));
            }
          })
        }
      }

      else if (req.url == '/resetComplete') {
        let dataValid = { 
          confirm: false,
          data: ''
        }
        if (getLengthAlert(alert) > 0) {
          dataValid.confirm = false;
          dataValid.data = alert;
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(JSON.stringify(dataValid));
        }
        else if (getLengthAlert(alert) == 0) {
          dataValid.confirm = true;
          dataValid.data = 'Password Reset Successful!';
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(JSON.stringify(dataValid));
        }
      }

      /// for unhandeled route  send a suitable response
      else {
        // set the response to type to be text
        res.writeHead(404, { "Content-Type": "text/html" });
        // end the respose with text
        res.end("404 \n Invalid request");
      }
    }


    /// HANDLING POST REQUESTS
    else if (req.method === 'POST') {

      if (req.url == '/signupConfirm') {


        alert = '';
        let data = '';

        req.on('data', (chunk) => {
          data += chunk;
        });
        req.on('end', async () => {
          let dataJSON = JSON.parse(data);

          let email = dataJSON.email.trim().toLowerCase();
          let pass = dataJSON.pass;
          let passConfirm = dataJSON.passConfirm;

          let emailExists = await userModel.find({ email: email });
          if (emailExists.length) {
            alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong> Email Address already exists! </p>';
            alert += '<p>&nbsp;&nbsp;<strong>Please Log In</strong></p>'
            res.end();
          }
          else {

            if (email == '' || !email.match(emailRegex)) {
              alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong> Enter Proper Email Address </p>';
            }
            if (pass == '' || pass.length < 8 || pass.length > 15) {
              alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong> Password length must be between 8 & 15 characters</p>';
            }
            else if (passConfirm == '' || passConfirm !== pass) {
              alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong> Passwords don\'t match</p>';
            }
            res.end();
          }

        })
      }

      else if (req.url == '/signupComplete') {

        alert = '';
        let data = '';
        req.on('data', (chunk) => {
          data += chunk;
        });
        req.on('end', async () => {
          const count = await userModel.countDocuments({});
          // console.log(count);
          if (count < maxUsers) {
            let dataJSON = JSON.parse(data);
            if (!dataJSON.name) {
              alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong> Enter your name </p>'
              res.end();
            } else {
              alert = '';
              let email = dataJSON.email.trim().toLowerCase();
              let password = dataJSON.pass;
              let passwordConfirm = dataJSON.passConfirm;
              let name = dataJSON.name.trim();


              if (name == '' || !name.match(nameRegex)) {
                alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong> Enter a proper name! </p>'
                res.end();
              } else {
                // CREATE A HASHED PASSWORD
                password = await bcrypt.hash(password, 10);
                passwordConfirm = '';

                // CREATE JWT AND STORE IT AS HTTP-COOKIE
                jwt.sign({ userEmail: email }, process.env.JWT_SECRET, { expiresIn: 60 * 1000 }, async (err, token) => {
                  if (err) {
                    res.end();
                  } else {
                    let cookies = new Cookies(req, res, { keys: [process.env.COOKIE_KEYS] });
                    cookies.set(process.env.COOKIE_NAME, token, { maxAge: 60 * 1000, sameSite: 'lax', overwrite: true });
                    await userModel.create({ email, name, password, passwordConfirm });
                    res.end();
                  }
                });
              }
            }
          }
          else {
            alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong> New Accounts not allowed to register anymore! \nContact Admin for support</p>'
            // console.log(alert);
            res.end();
          }
        })
      }

      else if (req.url == '/loginData') {
        alert = '';
        let data = '';
        req.on('data', (chunk) => {
          data += chunk;
        })
        req.on('end', () => {

          let dataJSON = JSON.parse(data);
          let email = dataJSON.emailInput.trim().toLowerCase();
          let password = dataJSON.passInput;

          if (email == '') {
            alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong> Enter an email address!</p>';
            res.end();
          }

          else if (!email.match(emailRegex)) {
            alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong> Enter a proper email address!</p>';
            res.end();
          }

          else {
            userModel.find({ email }, async (err, docs) => {
              if (!err && docs.length > 0) {
                let user = docs[0];
                let compare = await bcrypt.compare(password, user.password);

                if (compare) {
                  jwt.sign({ userEmail: email }, process.env.JWT_SECRET, { expiresIn: 60 * 1000 }, (err, token) => {
                    if (err) {
                      alert += '<p>Unexpected error happened</p>';
                      alert += '<p>Please contact the admin</p>';
                      res.end();
                    } else {
                      let cookies = new Cookies(req, res, { keys: [process.env.COOKIE_KEYS] });
                      cookies.set(process.env.COOKIE_NAME, token, { maxAge: 60 * 1000, sameSite: 'lax', overwrite: true });
                      res.end();
                    }
                  });
                }

                else if (!compare) {
                  alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong> Incorrect Email address or password!</p>';
                  alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong> You can reset your password</p>';
                  res.end();
                }


              }
              else {
                alert += '<p> <strong class="u-fs-s u-color-danger"><strong class="u-fs-s u-color-danger">&#x26A0;</strong></strong> Sorry we could not find your account </p>';
                alert += '<p> <strong class="u-fs-s u-color-danger">&#x26A0;</strong> <strong> Try signing up </strong></p>';
                res.end();
              }
            })
          }
        })
      }

      else if (req.url == '/resetConfirm') {
        let data = '';
        alert = '';
        req.on('data', (chunk) => {
          data += chunk;
        })
        req.on('end', () => {
          let dataJSON = JSON.parse(data);
          let email = dataJSON.emailInput.trim().toLowerCase();
          if (email == '') {
            alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong> Enter an email address!</p>';
            res.end();
          }
          else if (!email.match(emailRegex)) {
            alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong> Enter a proper email address!</p>';
            res.end();
          }
          else {
            // Check if email exists in DB and timesPassUpdated is less than 3
            userModel.find({ email }, async (err, docs) => {
              if (err || docs.length == 0) {
                alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong>No account associated Email address not found!</p>';
                res.end();
              }
              else if (docs.length > 0) {
                // if timesPassUpdated is greater than 3 then don't allow user to reset password and send an alert to contact admin
                if (docs[0].timesPassUpdated >= maxResetLimit) {
                  alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong> You have exceeded the maximum number of password reset attempts!</p>';
                  alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong> Please contact the admin for further assistance</p>';
                  res.end();
                }
                // SEND EMAIL
                else {
                  let timesPassUpdated = docs[0].timesPassUpdated + 1;
                  // generate a random string (reset token) and store it in the user's database record
                  let token = crypto.randomBytes(Math.ceil(16)).toString('hex').slice(0, 16);
                  // reset token expiry time to 5 minutes
                  let resetTokenExpiry = Date.now() + validFor;
                  userModel.updateOne({ email }, { resetPass: token, resetPassExpires: resetTokenExpiry, timesPassUpdated: timesPassUpdated }, (err, docs) => {
                    if (err) {
                      console.log("MONGO ERROR: ", err);
                      alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong>Unexpected Error!</p>';
                      res.end();
                    }
                    else {
                      // send an email to the user with the reset token
                      const apiKey = process.env.API_KEY;
                      const senderEmail = process.env.SENDER_EMAIL;
                      const receiverEmail = email;
                      const subject = 'Reset your EasyAuth account Password';
                      const link = `http://${req.headers.host}/resetPassword?token=${token}&email=${email}`;
                      const body = `To reset your EasyAuth Account Password, click or navigate to the link: ${link}\nIf you did not mean to change your password, you can ignore this email.`;

                      // SEND EMAIL BY MAKING A POST REQUEST TO ELASTIC EMAIL API
                      const baseUrl = process.env.BASE_URL;
                      const url = `${baseUrl}?apikey=${apiKey}&subject=${encodeURIComponent(subject)}&to=${encodeURIComponent(receiverEmail)}&from=${encodeURIComponent(senderEmail)}&body=${encodeURIComponent(body)}`;

                      axios.post(url, {}, {
                        headers: {
                          'Content-Type': 'application/json'
                        }
                      })
                        .then(response => {
                          if (response.status === 200) {
                            // EMAIL SENT SUCCESSFULLY
                            res.end();
                          }
                        })
                        .catch(err => {
                          // EMAIL NOT SENT
                          console.log("EMAIL NOT SENT: ", err);
                          alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong>Unexpected Error!</p>';
                          res.end();
                        });

                    }
                  })
                }
              }
            })
          }
        })
      }

      else if (req.url == '/checkResetUrl') {
        let data = '';
        alert = '';
        req.on('data', (chunk) => {
          data += chunk;
        })
        req.on('end', () => {
          const urlString = data;
          const parsedUrl = new url.URL(urlString, `${req.headers.host}`);

          const token = parsedUrl.searchParams.get('token');
          const email = parsedUrl.searchParams.get('email');
          // console.log(token, email)
          if (!token || !email) {
            // send a response for invalid request
            alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong>Invalid Request!</p>';
            res.end();
          }
          else if (email && token) {
            userModel.find({ email }, (err, docs) => {
              if (err || docs.length == 0) {
                // send a response for invalid request
                alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong>Invalid Request!</p>';
                res.end();
              }
              else if (docs.length > 0) {
                let user = docs[0];
                if (user.resetPass == token) {
                  if (user.resetPassExpires > Date.now()) {
                    // VALID RESET URL
                    res.end();
                  }
                  // else token expired
                  else {
                    // send a response for invalid request
                    alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong>Token Expired!</p>';
                    res.end();
                  }
                }
                // Token is invalid or tampered
                else {
                  alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong>Invalid Request!</p>';
                  res.end();
                }
              }
            })
          }
        })
      }

      else if (req.url == '/resetComplete') {
        let data = '';
        alert = '';
        req.on('data', (chunk) => {
          data += chunk;
        })



        req.on('end', () => {
          let dataJSON = JSON.parse(data);
          let password = dataJSON.pass;
          let passwordConfirm = dataJSON.passConfirm;
          const urlString = dataJSON.url;
          const parsedUrl = new url.URL(urlString, `${req.headers.host}`);

          const token = parsedUrl.searchParams.get('token');
          const email = parsedUrl.searchParams.get('email');
          if (!password) {
            alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong>Enter a password!</p>';
            res.end();
          }
          else if (!passwordConfirm) {
            alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong>Confirm your password!</p>';
            res.end();
          }
          else if (password !== passwordConfirm) {
            alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong>Passwords don\'t match!</p>';
            res.end();
          }
          else if (!token || !email) {
            alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong>Invalid Request!</p>';
            res.end();
          }
          else if (email && token) {
            userModel.find({ email }, async (err, docs) => {
              if (err || docs.length == 0) {
                // send a response for invalid request
                alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong>Invalid Request!</p>';
                res.end();
              }
              else if (docs.length > 0) {
                let user = docs[0];
                if (user.resetPass == token) {
                  if (user.resetPassExpires > Date.now()) {
                    // VALID RESET URL
                    password = await bcrypt.hash(password, 10);
                    passwordConfirm = '';
                    resetPass = '';
                    resetPassExpires = '';
                    userModel.updateOne({ email }, { password, passwordConfirm, resetPass, resetPassExpires }, (err, docs) => {
                      if (err) {
                        alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong>Unexpected Error!</p>';
                        res.end();
                      }
                      else if (docs) {
                        res.end();
                      }
                    })
                  }
                  // else token expired
                  else {
                    // send a response for invalid request
                    alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong>Token Expired!</p>';
                    res.end();
                  }
                }
                // Token is invalid or tampered
                else {
                  alert += '<p><strong class="u-fs-s u-color-danger">&#x26A0;</strong>Invalid Request!</p>';
                  res.end();
                }
              }
            })
          }



        })
      }
      ///
    }


    /// HANDLING UNKNOWN REQUESTS (PUT POST PATCH)
    else {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end("Unsupported Request");
    }

  });
});

// Make the server listen on a specific port
server.listen({
  host,
  port,
  exclusive: true
}, () => {
  console.log(`Server Started at http://${host}:${port}`)
});


function getLengthAlert(alert) {
  return alert.length;
}
