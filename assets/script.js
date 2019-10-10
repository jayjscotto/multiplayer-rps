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
let turn = 1;

//winner
let winner = "";

//database listener for any changes in users
//see submit event listener for more context
let gameState = false;
database.ref("/game/gameState").set(gameState);

database.ref("/game").child("guessState").remove();
database.ref("/game").child("reset").remove();
database.ref("/game").child("winner").remove();



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

//add player to game
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
            ties: 0,
            guess: ""
        }
        //add player to the database
        database.ref().child("/users/player1").set(player1);
        $("#player-notify").text(`You are Player One.`);
        //remove when disconnected
        database.ref("/users/player1").onDisconnect().remove();

    } else if ((player1) && (player2 === null)) {
        displayName = $("#playerNameInput").val();

        //set player2 object
        player2 = {
            name: displayName,
            wins: 0,
            losses: 0,
            ties: 0,
            guess: ""
        }

        //add player to database
        database.ref().child("/users/player2").set(player2);
        $("#player-notify").text(`You are Player Two.`);

        //when player2 added and player1 is connected, gameState turns to true and guessState is false
        gameState = true;
        database.ref("/game/gameState").set(gameState);
        
        //remove when disconnected
        database.ref("/users/player2").onDisconnect().remove();
    }
    
    $("#playerNameInput").empty();
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
                            database.ref("/game/guessState/player1").set(true);
                            gameTurn++
                            database.ref("game/turn/").set(gameTurn);
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
                            database.ref("/game/guessState/player2").set(true);

                        }
                    }
                })
            }
        }})
    } else {
        console.log('gamestate is false');
    }
})

/////////////////////////////////////////////////////////////////////
//////////////////*/*/* LOGIC EVAL */*/*////////////////////////////
///////////////////////////////////////////////////////////////////

function evaluateGame () {
    console.log(`Player1Guess: ${player1.guess} // Player2Guess: ${player2.guess}`)
    if ((player1.guess === "Rock" && player2.guess === "Scissors") || 
        (player1.guess === "Paper" && player2.guess === "Rock") ||
        (player1.guess === "Scissors" && player2.guess === "Paper")) {
            $("#results").text(`Player One Wins!`);
            //player 1 wins
            player1.wins++;
            player2.losses++;
            database.ref("/users/player1/wins").set(player1.wins);
            database.ref("/users/player2/losses").set(player2.losses);
            database.ref("/game/winner").set("player1");
        } else if (player1.guess === player2.guess) {
            $("#results").text(`Tie Game!`);
            //tie game
            player1.ties++;
            player2.ties++;
            database.ref("/users/player1/ties").set(player1.ties);
            database.ref("/users/player2/ties").set(player2.ties);
            database.ref("/game/winner").set("tie");
        } else {
                $("#results").text(`Player 2 Wins!`);
                //player 2 wins
                player1.losses++;
                player2.wins++;
                database.ref("/users/player1/losses").set(player1.losses++);
                database.ref("/users/player2/wins").set(player2.wins++);
                database.ref("/game/winner").set("player2");
        }
    
}


database.ref("/game/guessState").on("value", function(snapshot) {
    if ((snapshot.child("player1").exists()) && (snapshot.child("player2").exists())) {
        evaluateGame();
        database.ref("/game/gameState").set(false);
    }
    
});


database.ref("/game/winner").on("value", function(snapshot) {
    //display results
    if (database.ref("/game/guessState").child("player2").exists() && database.ref("/game/guessState").child("player1").exists()) {
    $("#turn").empty();
    $("#player1-choice").text(`Player One Choice: ${player1.guess}`);
    $("#player2-choice").text(`Player Two Choice: ${player2.guess}`);

    if (snapshot.val() === "player1") {
        $("#results").text("Player One Wins!");
    } else if (snapshot.val() === "player2") {
        $("#results").text("Player 2 Wins!");
    } else {
        $("#results").text("It's a Tie!");
    }

    $("#player-notify").text("Click Reset below to play a new game!");

    gameState = false;
    database.ref("/game/gameState").set(gameState);
    }
})  



$("#reset").on("click", function() {
    if (player1 && player2) {
        if (displayName === player1.name) {
            database.ref("/game/reset/player1").set(true);
        }
        if (displayName === player1.name) {
            database.ref("/game/reset/player2").set(true);
        }
    } else {
        console.log('missing player!')
    }
})

database.ref("/game/reset").on("value", function(snapshot) {
    if (snapshot.child("player1").exists() && !snapshot.child("player2").exists()) {
        $("#player-notify").text("Player One Wants to play a new game! Waiting on Player Two...")
    }
    if (snapshot.child("player2").exists() && !snapshot.child("player1").exists()) {
        $("#player-notify").text("Player Two Wants to play a new game! Waiting on Player One...")
    }

    if ((snapshot.child("player1").exists()) && snapshot.child("player2").exists()) {
        $("#player-notify").text("Starting a new game! Get ready...")
        resetGame();
    }

})

function resetGame() {
    //empty the proper text areas
    $("#player1-choice").text(`HELLO RESET`);
    $("#player2-choice").text(`HELLO RESET`);
    $("#results").text(`HELLO RESET`);

    database.ref("/game/reset").child("player1").remove();
    database.ref("/game/reset").child("player2").remove();

    //set the guesses to null
    database.ref("/users/player1").child("guess").remove();
    database.ref("/users/player2").child("guess").remove();

    //set back to player1's turn
    database.ref("/game/turn").set(0);
    database.ref("/game").child("guessState").remove();
    database.ref("/game").child("reset").remove();
    database.ref("/game").child("winner").remove();


}

