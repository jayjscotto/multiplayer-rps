
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

    let player1 = null;
    let player2 = null;

    //when clients connection state changes
    //conditional check for connectivity
    //add user to connections list
    //remove user when they disconnect
    connected.on("value", function(snapshot) {
        if (snapshot.val()) {
            let newUserAdded = connectionsRef.push(true);

            newUserAdded.onDisconnect().remove();        
        }
    });

    connectionsRef.on("value", function(snapshot) {
        console.log(snapshot.val());
        console.log(snapshot.numChildren());

        //when player connects
        //if player1 does not exists, that user is player 1
        //if player1 exists, and player2 doesnot, that user is player2
        if(!player1 && !player2) {
            player1 = Object.keys(snapshot.val())[0];
        }   
        if (player1 && !player2) {
            player2 = Object.keys(snapshot.val())[1];
        }

          
        console.log(`Player1: ${player1} , Player2: ${player2}`)

    })

    //initialize test guesses
    let player1Guess = "";
    let player2Guess = "";

    //add watcher for the database values..
    //if (snapshot.child('field-goes-here').exists())
    // then update it
    //else
    // create that/those fields

database.ref().on("value", function(snapshot){
    if (snapshot.child("player1Guess").exists() && snapshot.child("player2Guess").exists()) {
        player1Guess = snapshot.val().player1Guess;
        player2Guess = snapshot.val().player2Guess;
    } else { 
    database.ref().set({
        player1Guess: player1Guess,
        player2Guess: player2Guess
    })

    console.log(`Player1: ${player1Guess}, Player2: ${player2Guess}`);

    }}, function(errorObject) {
        console.log(`Error: ${errorObject}`)
    }   );

    