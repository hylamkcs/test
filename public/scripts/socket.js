const Socket = (function() {
    // This stores the current Socket.IO socket
    let socket = null;

    // This function gets the socket from the module
    const getSocket = function() {
        return socket;
    };

    // This function connects the server and initializes the socket
    const connect = function() {
        socket = io();

        // Wait for the socket to connect successfully
        socket.on("connect", () => {
            // Get the online user list
            socket.emit("get users");

            // Get the chatroom messages
            // socket.emit("get messages");
        });

        // // Set up the users event
        // socket.on("users", (onlineUsers) => {
        //     onlineUsers = JSON.parse(onlineUsers);

        //     // Show the online users
        //     OnlineUsersPanel.update(onlineUsers);
        // });

        // Set up the add user event
        socket.on("add user", (user) => {
            user = JSON.parse(user);
        });

        // // Set up the remove user event
        // socket.on("remove user", (user) => {
        //     user = JSON.parse(user);

        //     // Remove the online user
        //     OnlineUsersPanel.removeUser(user);
        // });

        // // Set up the messages event
        // socket.on("messages", (chatroom) => {
        //     chatroom = JSON.parse(chatroom);

        //     // Show the chatroom messages
        //     ChatPanel.update(chatroom);
        // });

        // // Set up the add message event
        // socket.on("add message", (message) => {
        //     message = JSON.parse(message);

        //     // Add the message to the chatroom
        //     ChatPanel.addMessage(message);
        // });
        // socket.on("show user", (user) => {
        //     if (user === null){
        //         ChatPanel.showTyping("");
        //     }
        //     else if (Authentication.getUser().username !== user.username){
        //         const {name} = user;
        //         ChatPanel.showTyping(name);
        //     }
        // })
    };

    // This function disconnects the socket from the server
    const disconnect = function() {
        socket.disconnect();
        socket = null;
    };

    const pairing = function(user) {
        if (socket && socket.connected){
            socket.emit("pair up", user);
        }
    }

    // This function sends a post message event to the server
    const postMessage = function(content) {
        if (socket && socket.connected) {
            socket.emit("post message", content);
        }
    };

    const getTypingUser = function(user) {
        socket.emit("typing user", user);
    }

    return { getSocket, connect, disconnect, pairing, postMessage, getTypingUser };
})();
