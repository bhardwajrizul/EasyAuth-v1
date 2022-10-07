// Requiring modules
require('dotenv').config();

// Core Modeules
const http = require('http');
const fs = require('fs');
const path = require('path');

// NPM modules
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Cookies = require('cookies')
const mongoose = require('mongoose');

// UTILITY Modules

// Custom Modules
const userModel = require('./db');
const replaceTemplate = require('./modules/replaceTemplate');
const { decode } = require('punycode');
const { prependOnceListener } = require('process');



// Establishing DB Connection
main().then(() => {
  console.log("DB Connection Successful!")
}).catch(err => console.log("DB ERROR : ", err));

async function main() {
  await mongoose.connect(process.env.DB_MONGOOSE); 
}

// host and port of our local server
const host = '127.0.0.1';
const port = process.env.PORT || 3000;

// REGEX EMAIL
const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const nameRegex =  /^[A-Za-z]+((\s)?((\'|\-|\.)?([A-Za-z])+))*$/;

// Global Variables
let alert = '';




// creating a http server that handles a request and sends 
// back a response in a callback
const server = http.createServer(async (req, res) => {
  // console.log("{URL:::", req.url, " ------ ", "METHOD:::", req.method, "}\n");


/// HANDLING GET REQUESTS
  if (req.method == 'GET') {
    // if request is made at the root '/' route 
    if(req.url === '/') {
      // Create a suitable index.html file path NOTE*(index.html must always be in the root directory of static (public) folder)
      const HTML = path.join(__dirname, '/public/index.html');
      // create a Read Stream and pipe the response to it
      const HTMLStream = fs.createReadStream(HTML, 'utf-8');
      // This will wait until we know the readable stream is actually valid before piping
      HTMLStream.on('open', () => {
        // This just pipes the read stream to the response object (which goes to the client)
        HTMLStream.pipe(res);
        // set the type of response to be css
        res.writeHead(200, {'Content-Type' : 'text/html'});
      })

      // This catches any errors that happen while creating the readable stream (usually invalid names)
      HTMLStream.on('error', (err) => {
        // set the response to type to be text
        res.writeHead(404, {'Content-Type' : 'text/html'});
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
        res.writeHead(200, {'Content-Type' : 'text/css'});
      })

      // This catches any errors that happen while creating the readable stream (usually invalid names)
      cssStream.on('error', (err) => {
        // set the response to type to be text
        res.writeHead(404, {'Content-Type' : 'text/html'});
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
        res.writeHead(200, {'Content-Type' : 'text/javascript'});
      })
      // This catches any errors that happen while creating the readable stream (usually invalid names)
      jsStream.on('error', (err) => {
        // set the response to type to be text
        res.writeHead(404, {'Content-Type' : 'text/html'});
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
        res.writeHead(200, {'Content-Type' : 'image/png'});
      })
      // This catches any errors that happen while creating the readable stream (usually invalid names)
      pngStream.on('error', (err) => {
        // set the response to type to be text
        res.writeHead(404, {'Content-Type' : 'text/html'});
        // Send a suitable response
        res.end();
      });

    }

    // If signup button is clicked
    // an AJAX GET req is sent to /signup route
    else if (req.url === '/signup') {
      fs.readFile(path.join(__dirname, './public/html/components/signup_1.html'), (err, data) => {
          if(err) {
            res.writeHead(404, {'Content-Type' : 'text/html'})
            res.end('404 Bad Gateway');
          } else {
            res.writeHead(200, {'Content-Type' : 'text/html'})
            res.end(data);
          }
      })   
    }


    else if (req.url == '/signupConfirm') {
      let dataValid = {
        confirm:false,
        data:''
      };
      if(getLengthAlert(alert) == 0) {
        fs.readFile(path.join(__dirname, './public/html/components/signup_2.html'), (err, data) => {
          if(err) {
            dataValid.confirm = true;
            dataValid.data = '404 Bad Gateway';
            res.writeHead(404, {'Content-Type' : 'text/html'});
            res.end(JSON.stringify(dataValid));
          } else {
            dataValid.confirm = true;
            dataValid.data = data.toString();
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.end(JSON.stringify(dataValid));
          }
        })   
      }
      else if (getLengthAlert(alert) > 0) {
        // THERE IS ALERT PRESENT
        dataValid.confirm = false;
        dataValid.data = alert;
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(JSON.stringify(dataValid));
      }

    }

    else if (req.url ==='/getLoginForm') {
      fs.readFile(path.join(__dirname, './public/html/components/login.html'), (err, data) => {
        if(err) {
          res.writeHead(404, {'Content-Type' : 'text/html'})
          res.end('404 Bad Gateway');
        } else {
          res.writeHead(200, {'Content-Type' : 'text/html'})
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

        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(JSON.stringify(dataValid));
      } else {
        dataValid.token = true;
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(JSON.stringify(dataValid));
      }





    }

    else if (req.url === '/logout') {
      let cookies = new Cookies(req, res, { keys: [process.env.COOKIE_KEYS] });
      cookies.set(process.env.COOKIE_NAME, '', {sameSite: 'lax' ,overwrite: true});
      res.end();
    }

    else if (req.url == '/homepage') {
      let dataValid = {
        confirm: false,
        data: ''
      }

      // THERE IS AN ALERT PRESENT
      if(getLengthAlert(alert) > 0) {
        dataValid.confirm = false;
        dataValid.data = alert;
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(JSON.stringify(dataValid));
      } 
      // THERE IS NO ALERT
      else if (getLengthAlert(alert) == 0) {

        let cookies = new Cookies(req, res, { keys: [process.env.COOKIE_KEYS] });
        let token = cookies.get(process.env.COOKIE_NAME);

        if (token) {
          jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (!err) { 
              let email = decoded.userEmail;
              userModel.find({email}, (err, docs) => {
                if (!err && docs.length > 0) {
                  let user = docs[0];
                  fs.readFile(path.join(__dirname, './public/html/layouts/home_temp.html'), (err, data) => {
                    if(err) {
                      alert += '<p>404 Not Found!</p>';
                      dataValid.confirm = false;
                      dataValid.data = alert;
                      res.writeHead(404, {'Content-Type' : 'text/html'});
                      res.end(JSON.stringify(dataValid));
                    } else {
                      let userHTML = replaceTemplate(data.toString(), {
                        userEmail : user.email,
                        userName : user.name
                      });
                      dataValid = true;
                      dataValid.data = userHTML;
                      res.writeHead(200, {'Content-Type' : 'text/html'});
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
          res.writeHead(301, {'Content-type' : 'text/html', 'Location' : '/'});
          res.end(); 
        }
      }

    }

    else if (req.url == '/forgot') {
      res.writeHead(404, {"Content-Type": "text/html"});
      res.end("This service is not functional yet. Please Navigate back!")
    }

    /// for unhandeled route  send a suitable response
    else{
    // set the response to type to be text
    res.writeHead(404, {"Content-Type": "text/html"});
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
        
        let emailExists = await userModel.find({email: email}); 
        if (emailExists.length) {
          alert += '<p>&bull; Email Address already exists! </p>';
          alert += '<p>&nbsp;&nbsp;<strong>Please Log In</strong></p>'
          res.end();
        }
        else {

          if (email == '' || !email.match(emailRegex)) {
            alert += '<p>&bull; Enter Proper Email Address </p>';
          } 
          if (pass == '' || pass.length < 8 || pass.length > 15) {
            alert += '<p>&#x2022; Password length must be between 8 & 15 characters</p>';
          }
          else if (passConfirm == '' || passConfirm !== pass ) {
            alert += "<p>&#x2022; Passwords don't match</p>";
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
        let dataJSON = JSON.parse(data);
        if (!dataJSON.name) {
          alert += '<p>&bull; Enter your name </p>'
          res.end();
        } else {
          alert = '';
          let email = dataJSON.email.trim().toLowerCase();
          let password = dataJSON.pass;
          let passwordConfirm = dataJSON.passConfirm;
          let name = dataJSON.name.trim();
          
          
          if (name == '' || !name.match(nameRegex)) {
            alert += '<p>&bull; Enter a proper name! </p>'
            res.end();
          } else {
            // CREATE A HASHED PASSWORD
            password = await bcrypt.hash(password, 10);
            passwordConfirm = '';

            // CREATE JWT AND STORE IT AS HTTP-COOKIE
            jwt.sign({userEmail: email}, process.env.JWT_SECRET, {expiresIn: 60 * 1000},async (err, token) => {
              if (err) {
                res.end();
              } else {
                let cookies = new Cookies(req, res, { keys: [process.env.COOKIE_KEYS] });
                cookies.set(process.env.COOKIE_NAME, token, {maxAge: 60 * 1000, sameSite: 'lax', overwrite: true});
                await userModel.create({email, name, password, passwordConfirm});
                res.end();
              }
            });
            

          }

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
          alert += '<p>&bull; Enter an email address!</p>';
          res.end();
        }

        else if (!email.match(emailRegex)) {
          alert += '<p>&bull; Enter a proper email address!</p>';
          res.end();
        }

        else {
          userModel.find({email},async (err, docs) => {
            if(!err && docs.length > 0) {
              let user = docs[0];
              let compare = await bcrypt.compare(password, user.password);
              
              if (compare) {
                  jwt.sign({userEmail: email}, process.env.JWT_SECRET, {expiresIn: 60 * 1000}, (err, token) => {
                  if (err) {
                    alert += '<p>Unexpected error happened</p>';
                    alert += '<p>Please contact the admin</p>';
                    res.end();
                  } else {
                    let cookies = new Cookies(req, res, { keys: [process.env.COOKIE_KEYS] });
                    cookies.set(process.env.COOKIE_NAME, token, {maxAge: 60 * 1000, sameSite: 'lax', overwrite: true});
                    res.end();
                  }
                });
              }

              else if (!compare) {
                alert += '<p>&bull; Incorrect Email address or password!</p>';
                alert += '<p>&bull; You can reset your password</p>';
                res.end();
              }


            } 
            else {
              alert += '<p>&bull; Sorry we could not find your account </p>';
              alert += '<p>&bull; <strong> Try signing up </strong></p>';
              res.end();
            } 
          })
        }
      })
    }

    
    ///

  }

  
/// HANDLING UNKNOWN REQUESTS (PUT POST PATCH)
  else {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end("Unsupported Request");
  }

})

// Make the server listen on a specific port
server.listen({
    host,
    port,
    exclusive: true
  },() => {
    console.log(`Server Started at http://${host}:${port}`)
});


function getLengthAlert(alert) {
  return alert.length;
}
