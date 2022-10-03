console.log("Let's get boggle started!");

$wordinput = $("[name='guess']")
$goBtn = $("#goBtn")
$msgArea = $("#msg")
$scoreArea = $("#score")
$minTimer = $(".mins")
$secTimer = $(".secs")
$startBtn =$("#startBtn")
$gameboard = $(".gameboard")
$guessform= $(".guessform")
$numofplays =$("#numofplays")
$highscore = $("#highscore")
$newgame = $("#newgame")

let scoreCounter = 0;
let allScores = [];
let successfulWord = false;
let numOfPlays = 0;

$gameboard.hide()
$guessform.hide()

async function handleSubmitWord(evt){ // this is a function to handle the submit
    evt.preventDefault(); // first we prevent default and not refresh the page 
    let result = await axios.get("/checkword", {params: {guess :$wordinput.val()}}) // then we are sending a get request to check the server to see if the word is valid and the parameters we are putting in are the guess and the value of the word be inputted 
    // console.log(result, "result.date", result.data.result); // consoling the result to see what we get
    
    if (result.data.result === "not-word"){ // if the result returns "not-word" we are displaying that the word is not a word on the front end
        successfulWord = false
        $($msgArea).text(` ${$wordinput.val()} is not a word`)
        $wordinput.val("")
    }

    if (result.data.result === "not-on-board"){
        successfulWord = false
        $($msgArea).text(` ${$wordinput.val()} is not on the board`)
        $wordinput.val("")
    }

    if (result.data.result === "ok"){
        successfulWord = true
        score() // calling the function score() if the word is a success to initiate the counter and tally score
        $($msgArea).text(`SUCCESS! Added "${$wordinput.val()}"!`)
        $wordinput.val("")
    }
    
    
}

$goBtn.on("click", handleSubmitWord) // we run the handleSubmitWord fucntion when we click on the go button

function score(){  // this function is to count the score of the word if it is a success (only will be called if the word is a success)
    if (successfulWord === true){ // if successfulWord is true 
        for (letter of $wordinput.val()){ // we are iterating over each letter of that word
            // console.log(letter)
            scoreCounter ++ // and adding to the counter
        } 
        // console.log(scoreCounter)
        return $($scoreArea).text(` Score: ${scoreCounter.toString()}`) // we return the total score in the scoreArea which is a p in the html
    }
}


let intSeconds = 59
let interval = null;

$startBtn.on("click", function(){
    displayGame();
    $startBtn.hide();
        if (!interval){
        interval = setInterval(timerCountdown, 1000)
        return interval
    }   
}
    ) // when the start button is clicked it initiates a function that runs the timerCountdown function every second

function timerCountdown(){
    $minTimer.text("00") // first we are setting the minute display to 00 as it is going to display "59" in the seconds display after 1 second when setInterval is called on click
    $secTimer.text("59") 


    if (intSeconds <= 0){ // if the seconds timer reaches 0 we stop the time and show times up
        
        $gameboard.hide() // when the timer is up and reaches 0 we want to hide the gameboard, guessfrom and msg area to disable further guesses
        $guessform.hide()
        $msgArea.hide()
        $secTimer.text("00 Times up!")

        if (interval){
            clearInterval(interval);
            interval = null
            return endGame()
        }
        
    }

    if (intSeconds < 10){ //if the seconds timer is in the single digits (aka less than 10) then we are displaying a 0 before it just for visual purposes
        $secTimer.text(`0${intSeconds.toString()}`)
    }
    else
    $secTimer.text(`${intSeconds.toString()}`) // the seconds timer is the one we are changing so that is going to be displayed
    intSeconds--;
    console.log(intSeconds) 
}



function displayGame(){
    $gameboard.show()
    $guessform.show()
}


async function endGame(){
    numOfPlays++
    allScores.push(scoreCounter)
    let result = await axios({
        method : 'POST',
        url: "/postgame", 
        data: {
            numOfPlays : numOfPlays, 
            score : scoreCounter,
            allscores : allScores
        }
    }) // sending a post request to the server when the game ends the number of games played and highscore
    $numofplays.text(result.data.totalNumofPlays)
    $highscore.text(result.data.highest)
    console.log(result)
    console.log("highestscorr", result.data.highest, "scorr", result.data.score, "totalnummmplaysz", result.data.totalNumofPlays)

    return result
}


async function restartGame(){
scoreCounter = 0;
successfulWord = false;
numOfPlays = 0;

intSeconds = 59
interval = null;

$($newgame).html("");
// $("body").html("");
$msgArea.show();
let result = await axios.get("/") // then we are sending a get request to check the server to see if the word is valid and the parameters we are putting in are the guess and the value of the word be inputted 
$($newgame).append(result.data)
console.log(result, $newgame)

$goBtn.on("click", handleSubmitWord);

// $gameboard.hide()
// $guessform.hide()


$startBtn.on("click", function(){
    console.log("clicked start")
    displayGame();
    $startBtn.hide();
        if (!interval){
        interval = setInterval(timerCountdown, 1000)
        return interval
    }   
})

}