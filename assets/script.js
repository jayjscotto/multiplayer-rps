//Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBk8mcXbN5KHIqTWSw0MRq2O0O00xz2cGQ",
    authDomain: "jayscotto-rps.firebaseapp.com",
    databaseURL: "https://jayscotto-rps.firebaseio.com",
    projectId: "jayscotto-rps",
    storageBucket: "jayscotto-rps.appspot.com",
    messagingSenderId: "469565671801",
    appId: "1:469565671801:web:cb3f7b83713c70ebc4c7a8",
    measurementId: "G-ETDD223TX4"
    };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

//determines if there is a player1 and player 2
let player1 = null;
let player2 = null;

//corresponds to player1 and player2 name submitted
let name1 = "";
let name2 = "";

//lets the user know what name they entered
let displayName = "";

//turn #
let turn = 1

//display Waiting for Player # if absence of player...
// if (!player1 && !player2) {
//     $("#player1display").text(`Waiting for Player One to join game...`);
//     $("#player2display").text(`Waiting for Player Two to join game...`);
// } else if (player1 && !player2) {
//     $("#player2display").text(`Waiting for Player Two...`);
// }
//database listener for any changes in users
//see submit event listener for more context
let gameState = false;
database.ref("/game/gameState").set(gameState);

database.ref("/users/").on("value", function(snapshot) {
    if (snapshot.child("player1").exists()) {
        console.log('Player 1 is in the game');

        //write player1 data to the database 
        player1 = snapshot.val().player1;
        name1 = player1.name;

        //Add text to the player one's section of UI
        $("#player1display").text(`Player One: ${name1}`);

    }
    else {
        console.log(`No Player 1`);
        $("#player1display").text(`Waiting for Player One to join game...`);
        gameState = false;
    }

    if (snapshot.child("player2").exists()) {
        console.log('Player 2 is in the game');

        //write player2 data to the database
        player2 = snapshot.val().player2;
        name2  = player2.name;

        //add text to the player two's section of UI
        $("#player2display").text(`Player Two: ${name2}`);
        gameState = true;
        database.ref("/game").child("gameState").set(gameState);
    } else {
        console.log(`No Player 2`);
        $("#player2display").text(`Waiting for Player Two to join game...`);
        gameState = false;
    }
}, function(errorObject) {
    console.log(`Error: ${errorObject}`)
});


///////////////////////////////////////////////////////////////////////
/////////////// */*/* ADDING PLAYERS  */*/* ///////////////////////////
//////////////////////////////////////////////////////////////////////

//event listener for submit button
//take input value
//if player1 does not exist
        //add player1 object
        //playerName = input value
        //add player to the database
            //database.ref().child("/users/player1").set(player1)
        //when user disconnects, remove them from the db
            //database.ref("/users/player1").onDisconnect().remove()
//else if player2 is null and player1 is not null
    //add player 2 object
        //playerName = input value
        //add player to the database
            //database.ref().child("/users/player1").set(player1)
        //when user disconnects, remove them from the db
            //database.ref("/users/player1").onDisconnect().remove()

$("#submitName").on("click", function() {
    event.preventDefault();

    //conditional statements to add player1 and player2 to the database
    if (player1 === null) {
        displayName = $("#playerNameInput").val();
        //set player1 object
        player1 = {
            name: displayName,
            wins: 0,
            losses: 0,
            guess: ""
        }
        //add player to the database
        database.ref().child("/users/player1").set(player1);
        //remove when disconnected
        database.ref("/users/player1").onDisconnect().remove();

    } else if ((player1) && (player2 === null)) {
        displayName = $("#playerNameInput").val();

        //set player2 object
        player2 = {
            name: displayName,
            wins: 0,
            losses: 0,
            guess: ""
        }

        //add player to database
        database.ref().child("/users/player2").set(player2);

        gameState = true;
        database.ref("/game/gameState").set(gameState);

        //remove when disconnected
        database.ref("/users/player2").onDisconnect().remove();
    }
})

////////////////////////////////////////////////////////////////////
///////////////*/*/* MONITOR PLAYER CHOICES */*/*///////////////////
////////////////////////////////////////////////////////////////////


database.ref("/game/gameState").on("value", function(snapshot) {
    if (snapshot.val() === true) {
        //set the turn number
        let gameTurn = turn;
        database.ref("/game/turn").set(gameTurn);
        //check if turn is 1

        //check for turn value
        database.ref("game/turn/").on("value", function(snapshot) {
            if (player1 && player2) {
            if (snapshot.val() === 1) {
                //turn text in html
                $("#turn").text(`Player One's Turn...`).attr("class", "text-center");
                console.log(`player1 turn`);
                //event listener for player one's button
                $(".player1choices").on("click", function() {
                    //prevent
                    event.preventDefault();
    
                    //conditional to update and write player 1's choice
                    if ((player1 && player2) && snapshot.val() === 1) {
                        if (displayName === player1.name) {
                            let guess = $(this).text();
                            console.log(`Player1 Choice ${guess}`);
                            database.ref("/users/player1/guess").set(guess);
                        
                            database.ref("game/turn/").set(2);
                        }
                    }
                })
            }

            //check for turn 2
            if (snapshot.val() === 2) {
                //turn text in html
                $("#turn").text(`Player Two's Turn...`).attr("class", "text-center  ");
                //event listener for player one's button
                $(".player2choices").on("click", function() {
                    //prevent
                    event.preventDefault();
                    //conditional to update and write player 2's choice
                    if (player1 && player2) {
                        if (displayName === player2.name) {
                            let guess = $(this).text();
                            console.log(`Player2 Choice ${guess}`);
                            database.ref("/users/player2/guess").set(guess);
                            //hoist logic function
                            evaluateGame();
                        }
                    }
                })
            }
        }})
    } else {
        console.log('gamestate is broken');
    }
})

/////////////////////////////////////////////////////////////////////
//////////////////*/*/* LOGIC EVAL */*/*////////////////////////////
///////////////////////////////////////////////////////////////////

function evaluateGame () {
    if ((player1.guess === "Rock" && player2.guess === "Scissors") || 
        (player1.guess === "Paper" && player2.guess === "Rock") ||
        (player1.guess === "Scissors" && player2.guess === "Paper")) {
            //player 1 wins
            console.log(`Player One Wins`);
            console.log(`Player Two Loses`)
        } else if (player1.guess === player2.guess) {
            //tie game
            console.log(`Tie game!`);
        } else {
            console.log(`Player One Loses`);
            console.log(`Player Two Wins`);
        }
}


////db structure
    //game object
        //active game-boolean
        //turn
    //users
        //player1
            //name
            //wins
            //losses
            //guess ---> dynamically added
        //player2
            //name
            //wins
            //losses
            //guess ---> dynamically added
    
        
//conditional choice logic runs on whether guess child of player1 and player2 exist