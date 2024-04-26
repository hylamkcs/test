const SignInForm = (function() {
    // This function initializes the UI
    const initialize = function() {
        // Populate the avatar selection
        // Avatar.populate($("#register-avatar"));
        
        // Hide it
        $(".button").hide();
        $("#exit-button").hide();
        $("#signin-overlay").hide();

        // Submit event for the signin form
        $("#signin-form").on("submit", (e) => {
            // Do not submit the form
            e.preventDefault();

            // Get the input fields
            const username = $("#signin-username").val().trim();
            const password = $("#signin-password").val().trim();

            // Send a signin request
            Authentication.signin(username, password,
                () => {
                    hide();
                    StartPage.show();

                    Socket.connect();
                },
                (error) => { $("#signin-message").text(error); }
            );
        });

        // Submit event for the register form
        $("#register-form").on("submit", (e) => {
            // Do not submit the form
            e.preventDefault();

            // Get the input fields
            const username = $("#register-username").val().trim();
            const name     = $("#register-name").val().trim();
            const password = $("#register-password").val().trim();
            const confirmPassword = $("#register-confirm").val().trim();

            // Password and confirmation does not match
            if (password != confirmPassword) {
                $("#register-message").text("Passwords do not match.");
                return;
            }

            // Send a register request
            Registration.register(username, name, password,
                () => {
                    $("#register-form").get(0).reset();
                    $("#register-message").text("You can sign in now.");
                },
                (error) => { $("#register-message").text(error); }
            );
        });
    };

    // This function shows the form
    const show = function() {
        $("#signin-overlay").fadeIn(500);
    };

    // This function hides the form
    const hide = function() {
        $("#signin-form").get(0).reset();
        $("#signin-message").text("");
        $("#register-message").text("");
        $("#signin-overlay").fadeOut(500);
        $(".button").show();
        $("#exit-button").show();
    };

    return { initialize, show, hide };
})();

const StartPage = (function() {
    // This function initializes the UI
    const initialize = function() {
        // Hide it
        $("startpage-overlay").hide();

        // Click event for the signout button
        $("#exit-button").on("click", () => {
            // Send a signout request
            Authentication.signout(
                () => {
                    Socket.disconnect();

                    hide();
                    SignInForm.show();
                }
            );
        });

        $("#single-player").on("click", () => {
            hide();
            GameBoard.show();
        });
        $("#double-player").on("click", () => {
            Socket.pairing(Authentication.getUser());
            
        });
    };

    const pairup = function(user, onSuccess, onError){
        fetch("pair")
    }

    // This function shows the form with the user
    const show = function(user) {
        $("#startpage-overlay").show();
    };

    // This function hides the form
    const hide = function() {
        $(".button").hide();
        $("#exit-button").hide();
    };

    // This function updates the user panel
    // const update = function(user) {
    //     if (user) {
    //         $("#user-panel .user-avatar").html(Avatar.getCode(user.avatar));
    //         $("#user-panel .user-name").text(user.name);
    //     }
    //     else {
    //         $("#user-panel .user-avatar").html("");
    //         $("#user-panel .user-name").text("");
    //     }
    // };

    return { initialize, show, hide };
})();

const GameBoard = (function() {
    const initialize = function() {
        $("#gameboard").hide();

        $(function() {
            /* Get the canvas and 2D context */
            const cv = $("canvas").get(0);
            const context = cv.getContext("2d");

            const totalGameTime = 180;   // Total game time in seconds
            const itemMaxAge = 3000;     // The maximum age of the gems in milliseconds
            let gameStartTime = 0;

            const gameArea = BoundingBox(context, 60, 0, 600, 800);

            // function doFrame(now)
            // Updating the sprite

            $(document).on("keydown", function(event) {


                /* TODO */
                /* Handle the key down */
                // if (event.keyCode == 32) {
                //     player.speedUp();
                // }
                switch (event.keyCode){
                    case 37:
                        player.move(1);
                        break;
                    case 38:
                        player.move(2);
                        break;
                    case 39:
                        player.move(3);
                        break;
                    case 40:
                        player.move(4);
                        break;
                }

            });
            
            /* Handle the keyup of arrow keys and spacebar */
            $(document).on("keyup", function(event) {


                /* TODO */
                /* Handle the key up */
                if (event.keyCode == 32) {
                    player.slowDown();
                }
                switch (event.keyCode){
                    case 37:
                        player.stop(1);
                        break;
                    case 38:
                        player.stop(2);
                        break;
                    case 39:
                        player.stop(3);
                        break;
                    case 40:
                        player.stop(4);
                        break;
                }

            });
            
            /* Start the game */
            requestAnimationFrame(doFrame);
        })
    };

    const show = (function(){
    })
    return { initialize };
})
// const OnlineUsersPanel = (function() {
//     // This function initializes the UI
//     const initialize = function() {};

//     // This function updates the online users panel
//     const update = function(onlineUsers) {
//         const onlineUsersArea = $("#online-users-area");

//         // Clear the online users area
//         onlineUsersArea.empty();

// 		// Get the current user
//         const currentUser = Authentication.getUser();

//         // Add the user one-by-one
//         for (const username in onlineUsers) {
//             if (username != currentUser.username) {
//                 onlineUsersArea.append(
//                     $("<div id='username-" + username + "'></div>")
//                         .append(UI.getUserDisplay(onlineUsers[username]))
//                 );
//             }
//         }
//     };

//     // This function adds a user in the panel
// 	const addUser = function(user) {
//         const onlineUsersArea = $("#online-users-area");
		
// 		// Find the user
// 		const userDiv = onlineUsersArea.find("#username-" + user.username);
		
// 		// Add the user
// 		if (userDiv.length == 0) {
// 			onlineUsersArea.append(
// 				$("<div id='username-" + user.username + "'></div>")
// 					.append(UI.getUserDisplay(user))
// 			);
// 		}
// 	};

//     // This function removes a user from the panel
// 	const removeUser = function(user) {
//         const onlineUsersArea = $("#online-users-area");
		
// 		// Find the user
// 		const userDiv = onlineUsersArea.find("#username-" + user.username);
		
// 		// Remove the user
// 		if (userDiv.length > 0) userDiv.remove();
// 	};

//     return { initialize, update, addUser, removeUser };
// })();

// const ChatPanel = (function() {
// 	// This stores the chat area
//     let chatArea = null;

//     // This function initializes the UI
//     const initialize = function() {
// 		// Set up the chat area
// 		chatArea = $("#chat-area");
//         let typing;
//         $("#chat-input-form").on('keydown', () => {
//             clearTimeout(typing);
//             Socket.getTypingUser(Authentication.getUser());
//             typing = setTimeout(() => {
//                 Socket.getTypingUser(null);
//             }, 3000);
//         })
//         // Submit event for the input form
//         $("#chat-input-form").on("submit", (e) => {
//             // Do not submit the form
//             e.preventDefault();

//             // Get the message content
//             const content = $("#chat-input").val().trim();

//             // Post it
//             Socket.postMessage(content);

// 			// Clear the message
//             $("#chat-input").val("");
//         });
//  	};

//     // This function updates the chatroom area
//     const update = function(chatroom) {
//         // Clear the online users area
//         chatArea.empty();

//         // Add the chat message one-by-one
//         for (const message of chatroom) {
// 			addMessage(message);
//         }
//     };

//     // This function adds a new message at the end of the chatroom
//     const addMessage = function(message) {
// 		const datetime = new Date(message.datetime);
// 		const datetimeString = datetime.toLocaleDateString() + " " +
// 							   datetime.toLocaleTimeString();

// 		chatArea.append(
// 			$("<div class='chat-message-panel row'></div>")
// 				.append(UI.getUserDisplay(message.user))
// 				.append($("<div class='chat-message col'></div>")
// 					.append($("<div class='chat-date'>" + datetimeString + "</div>"))
// 					.append($("<div class='chat-content'>" + message.content + "</div>"))
// 				)
// 		);
// 		chatArea.scrollTop(chatArea[0].scrollHeight);
//     };

//     const showTyping = (function(name) {
//         if (name !== ""){
//             $("#typing-process").text(name + " is typing...");
//         } else{
//             $("#typing-process").text("");
//         }
//     })

//     return { initialize, update, addMessage, showTyping };
// })();

const UI = (function() {
    // This function gets the user display
    const getUserDisplay = function(user) {
        return $("<div class='field-content row shadow'></div>")
            .append($("<span class='user-avatar'>" +
			        Avatar.getCode(user.avatar) + "</span>"))
            .append($("<span class='user-name'>" + user.name + "</span>"));
    };

    // The components of the UI are put here
    const components = [SignInForm, StartPage];

    // This function initializes the UI
    const initialize = function() {
        // Initialize the components
        for (const component of components) {
            component.initialize();
        }
    };

    return { getUserDisplay, initialize };
})();
