
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
    //connections directory in firebase db
    const connectionsRef = database.ref("/connections");
    let connected = database.ref(".info/connected");

    //determines if there is a player1 and player 2
    let player1 = null;
    let player2 = null;
    
    //corresponds to player1 and player2 name submitted
    let name1 = "";
    let name2 = "";

    //lets the user know what name they entered
    let displayName = "";

    //guesses
    let player1Guess = "";
    let player2Guess = "";

    //game state
    let activeGame = "";
    let turn = 1;
    //database listener for any changes in users
    //see submit event listener for more context
    database.ref("/game/users/").on("value", function(snapshot) {
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
        }

        if (snapshot.child("player2").exists()) {
            console.log('Player 2 is in the game');

            //write player2 data to the database
            player2 = snapshot.val().player2;
            name2  = player2.name;

            //add text to the player two's section of UI
            $("#player2display").text(`Player Two: ${name2}`);

        } else {
            console.log(`No Player 2`);
            $("#player2display").text(`Waiting for Player Two to join game...`);
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
            losses: 0
        }
        //add player to the database
        database.ref().child("/game/users/player1").set(player1);
        //remove when disconnected
        database.ref("/game/users/player1").onDisconnect().remove();

    } else if ((player1) && (player2 === null)) {
        displayName = $("#playerNameInput").val();

        //set player2 object
        player2 = {
            name: displayName,
            wins: 0,
            losses: 0
        }

        //add player to database
        database.ref().child("/game/users/player2").set(player2);

        //remove when disconnected
        database.ref("/game/users/player2").onDisconnect().remove();
    }
})


        
////////////////////////////////////////////////////////////////////
///////////////*/*/* MONITOR PLAYER CHOICES */*/*///////////////////
////////////////////////////////////////////////////////////////////

//player1 buttons event listener (selected by class)
    //if both player1 and player2 are in the game
        //if displayName is equal to player1's name property
            //log the choice
            // write player1 choice in the database
                //database.ref("/users/player1/guess").set(choice)

//player2 buttons event listener (selected by class)
    //if both player1 and player2 are in the game
        //if displayName is equal to player1's name property
            //log the choice
            // write player2 choice in the database
                //database.ref("/users/player2/guess").set(choice)


$(".player1choices").on("click", function() {
    event.preventDefault();
    if (player1 && player2) {
        if (displayName === player1.name) {
            let choice = $(this).text();
            console.log(`Player1 Choice ${choice}`);
        }
    }
})

$(".player2choices").on("click", function() {
    event.preventDefault();

    if (player1 && player2) {
        if (displayName === player2.name) {
            let choice = $(this).text();
            console.log(`Player2 Choice ${choice}`);
        }
    }
})


//if player1 and player2 guess exist, 
    //evaluate the winner and loser

/////////////////////////////////////////////////////////////////////
//////////////////*/*/* LOGIC EVAL */*/*////////////////////////////
///////////////////////////////////////////////////////////////////

database.ref("/game/users/player1/guesses").on("value", function(snapshot){
    if (snapshot.child("player1Guess").exists() && snapshot.child("player2Guess").exists()) {
        player1Guess = snapshot.val().player1Guess;
        player2Guess = snapshot.val().player2Guess;
    } else { 
    database.ref().set({
        player1Guess: player1Guess,
        player2Guess: player2Guess
    })

    console.log(`Player1: ${player1Guess}, Player2: ${player2Guess}`);

    }});



////db structure
    //game object
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
        //active game-boolean
        
//conditional choice logic runs on whether guess child of player1 and player2 exist