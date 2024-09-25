//Hypertext Transfer Protocol module
const http = require('http');
// Cross-Origin Resource Sharing module
const cors = require('cors');
// File sharing module
const fs = require('fs');
//read line module
const readline = require('readline');
//createServer(p1, p2) is a mutator method that returns an instance of the Server class which takes 2 paremeters 
const server = http.createServer((request, response) => {
    // Enable CORS for all routes
    cors()(request, response, () => {
        if(request.url === "/api") {
            //test 2, storing data sent from requester
            if(request.method === 'POST') {
                const data = request.body;
                let userData = '';
                //async function
                request.on('data', function(chunk) {
                    userData += chunk.toString();
                });
                request.on('end', () => {
                    const user = JSON.parse(userData);
                    //store data in file with the purpose of making history 
                    fs.appendFile('history.txt', user.name + '\n' + user.message + '\n' + user.postId + '\n' + user.postDate + '\n\n', (err) => {
                       if(err) throw err;
                    });
                    // Send back post-request data to requester
                    response.write(JSON.stringify({a_message: 'data sent successfully:', data: user}));
                    response.end();
                })
            } else if (request.method === "GET") {
                fs.appendFile('visits.txt', request.headers.referer + " " + request.socket.remoteAddress + '\n', (err) => {
                    if(err) throw err;
                });
                //test 1, sending data to requester
                response.write(JSON.stringify({messageType: 'Freakstagram Chat Beta', value: 1}));
                response.end();
            }
        } else if (request.url === "/") {
            response.write("<h1> Docs </h1>");
            response.end();
        }
        //get response endpoint.
        if(request.url === "/api/history") {
            //make a file that stores all of the data from every post request and send it back to the requester
            //send the entire history as an array of objects (usernames and message)
            class Comment {
                constructor(uName, uMessage, uId, uDate) {
                    this.name = uName;
                    this.message = uMessage;
                    this.Id = uId;
                    this.date = uDate;
                }
                static printToFile(array) {
                    fs.appendFile('lines.json',"\n"+  JSON.stringify(array, null, 2), (err) => {
                        if(err) throw err;
                    })
                }
            }
            let comments = [];
            fs.readFile('history.txt', 'utf8', (err, data) => {
                if(err) throw err;
                //where I get the data, u(n) = 5n, m(n) = 5n + 1, I(n) = 4n + 2
                const lines = data.split('\n');
                const lastLine = lines.length-2;
                let usernames = [];
                let messages = [];
                let postIds = [];
                let dates = [];
                
                for(let i = 0; i < lastLine;i++) {
                    if(i%5 == 0) {
                        //console.log("user (" + g + "): " + lines[i]);
                        usernames.push(lines[i]);
                    } else if(i%5 == 1) {
                        //console.log("message (" + g + "): " + lines[i]);
                        messages.push(lines[i]);
                    } else if (i%5 == 2) {
                        postIds.push(lines[i]);
                    } else if (i%5 == 3) {
                        dates.push(lines[i]);
                    }
                }
                //object array that will be sent to requester
                for(let i = 0; i < usernames.length; i++) {
                    let userInstance = new Comment(usernames[i], messages[i], postIds[i], dates[i]);
                    comments.push(userInstance);
                }
                response.write(JSON.stringify(comments));
                //console.count(`sent to ${request.headers.referer}`);
                response.end();
            })
            
        } else if (request.url === "/api/history/last") {
            class Comment {
                constructor(uName, uMessage, uId, uDate) {
                    this.name = uName;
                    this.message = uMessage;
                    this.Id = uId;
                    this.date = uDate;
                }
                static printToFile(array) {
                    fs.appendFile('lines.json',"\n"+  JSON.stringify(array, null, 2), (err) => {
                        if(err) throw err;
                    })
                }
            }
            let comments = [];
            fs.readFile('history.txt', 'utf8', (err, data) => {
                if(err) throw err;
                //where I get the data, u(n) = 5n, m(n) = 5n + 1, I(n) = 4n + 2
                const lines = data.split('\n');
                const lastLine = lines.length-2;
                let usernames = [];
                let messages = [];
                let postIds = [];
                let dates = [];
                
                for(let i = 0; i < lastLine;i++) {
                    if(i%5 == 0) {
                        //console.log("user (" + g + "): " + lines[i]);
                        usernames.push(lines[i]);
                    } else if(i%5 == 1) {
                        //console.log("message (" + g + "): " + lines[i]);
                        messages.push(lines[i]);
                    } else if (i%5 == 2) {
                        postIds.push(lines[i]);
                    } else if (i%5 == 3) {
                        dates.push(lines[i]);
                        
                    }
                }
                //object array that will be sent to requester
                for(let i = 0; i < usernames.length; i++) {
                    let userInstance = new Comment(usernames[i], messages[i], postIds[i], dates[i]);
                    comments.push(userInstance);
                }
                if(comments.length >= 1) {
                    response.write(JSON.stringify([comments[comments.length-2], comments[comments.length-1]]));
                } else {
                    response.write(JSON.stringify([comments[comments.length-1]]));
                }
                //console.count(`sent to ${request.headers.referer}`);
                response.end();
            })
            
        }
    });
});
 
server.listen(3000);
console.log("listening on port 3000...");
