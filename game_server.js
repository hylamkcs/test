const express = require("express");
haha
const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

// Create the Express app
const app = express();

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

// Use the session middleware to maintain sessions
const chatSession = session({
    secret: "game",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 300000 }
});
app.use(chatSession);

// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}

// Handle the /register endpoint
app.post("/register", (req, res) => {
    // Get the JSON data from the body
    const { username, name, password } = req.body;

    //
    // D. Reading the users.json file
    //
    const users = JSON.parse(fs.readFileSync("data/users.json"));
    //
    // E. Checking for the user data correctness
    //
    if (username === "" || name === "" || password === ""){
        res.json({status: "error", error: "Please fill in all the blanks!"});
    } else if (!containWordCharsOnly(username)){
        res.json({status: "error", error: "Username can only contains underscore, letters or numbers."});
    } else if (username in users){
        res.json({status: "error", error: "Username has already been used."});
    } else {
        const hash = bcrypt.hashSync(password, 10);
        users[username] = {
            name: name,
            password: hash
        }
        fs.writeFileSync("data/users.json",JSON.stringify(users, null, 2) )
        res.json({status: "success"})
    }
    //
    // G. Adding the new user account
    //

    //
    // H. Saving the users.json file
    //

    //
    // I. Sending a success response to the browser
    //

    // Delete when appropriate
    // res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
    // Get the JSON data from the body
    const { username, password } = req.body;

    //
    // D. Reading the users.json file
    //
    const users = JSON.parse(fs.readFileSync("data/users.json"));
    //
    // E. Checking for username/password
    //
    if (!(username in users)){
        res.json({status: "error", error: "Invalid username."});
    } else if (!bcrypt.compareSync(password,users[username].password)){
        res.json({status: "error", error: "Incorrect password."})
    } else {

        const {avatar, name} = users[username];
        req.session.user = {username, avatar, name};
        res.json({status: "success", user: {username,avatar,name}});
    }
    //
    // G. Sending a success response with the user account
    //
 
    // Delete when appropriate
    // res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {

    //
    // B. Getting req.session.user
    //

    //
    // D. Sending a success response with the user account
    //
    if (req.session.user){
        res.json({status: "success", user: req.session.user});
    } else {

        res.json({status: "error", error: "No user signed in"});
    }
    // Delete when appropriate
    // res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /signout endpoint
app.get("/signout", (req, res) => {

    //
    // Deleting req.session.user
    //
    delete req.session.user;
    //
    // Sending a success response
    //
    res.json({status: "success"});
    // Delete when appropriate
    // res.json({ status: "error", error: "This endpoint is not yet implemented." });
});


//
// ***** Please insert your Lab 6 code here *****
//
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app)
const io = new Server(httpServer);

const onlineUsers = {}

io.use((socket, next) => {
    chatSession(socket.request, {}, next);
})

io.on("connection", (socket) => {
    if (socket.request.session.user){
        const {username, name} = socket.request.session.user;
        const status = "online";
        onlineUsers[username] = {name, status}; 
        // io.emit("add user", JSON.stringify(socket.request.session.user));
        console.log(onlineUsers);
    }
    
    socket.on("disconnect", () => {
        const {username} = socket.request.session.user;
        delete onlineUsers[username];
        // io.emit("remove user", JSON.stringify(socket.request.session.user));
        console.log(onlineUsers);
    })

    socket.on("get users", () => {
        socket.emit("users", JSON.stringify(onlineUsers));
    })

    socket.on("pair up", (user) => {
        io.emit("invitation", user);
    })
    // socket.on("get messages", () => {
    //     const chatroom = fs.readFileSync("data/chatroom.json", "utf-8");
    //     socket.emit("messages", chatroom);
    // })

    // socket.on("post message", (content) => {
    //     const user = socket.request.session.user;
    //     const datetime = new Date();
    //     const chatroom = JSON.parse(fs.readFileSync("data/chatroom.json"));
    //     chatroom.push({user, datetime, content});
    //     fs.writeFileSync("data/chatroom.json", JSON.stringify(chatroom, null, 2));
    //     // console.log(JSON.stringify({user, datetime, content}));
    //     io.emit("add message", JSON.stringify({user, datetime, content}));
    // })

    // socket.on("typing user", (user) => {
    //     io.emit("show user", user);
    // })
})



// Use a web server to listen at port 8000
httpServer.listen(8000, () => {
    console.log("The chat server has started...");
});
