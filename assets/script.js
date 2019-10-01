
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

      //initialize test guesses
      let player1Guess = "rock";
      let player2Guess = "paper";

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

