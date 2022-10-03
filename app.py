from boggle import Boggle, boggle_instance
from flask import Flask, request, render_template, redirect, flash, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.debug = True 
app.config['SECRET_KEY'] = 'secrettttkeyyy'
toolbar = DebugToolbarExtension(app)


boggle_game = Boggle()

@app.route("/") ## the home route where the board is going to be set up
def home():
    board = boggle_instance.make_board() ## using our instance "boggle_instance" and calling method make_board to create the board
    session["board"] = board #adding that to the session with the session key "board"
    session["numplay"] = 0 #initialise the session of "numplay" as 0 (this is the one to be incremented everytime a user finishes a game)
    num_of_plays = session.get("numplay")
    # score= session.get("score",0)
    # highscore = session.get("highscore", 0)
    print("board sesssionnnn", session["board"], num_of_plays, "SESHHH")
    return render_template("home.html", board = board, num_of_plays = num_of_plays)

@app.route("/checkword") ## here we are checking the word (this is the route but this is being handled byt axios in the statis.js file so it wont refresh the page)
def checkword():
    word = request.args["guess"] # getting the value of the guess input (which is the word the user put in)
    board = session["board"] #getting the board from the session since we need this to pass into our .check_valid_word method
    wordresult = boggle_instance.check_valid_word(board, word) #this will return "ok" "not-on-board" or "not-word" per boggle.py class
    # print("wrod result", wordresult, "word", word, "Board", board)
    return jsonify({"result": wordresult}) # returning it as json format setting the key as "result" so we can grab it later in the js file

@app.route("/postgame", methods=["POST"])
def postgame():
    # num_of_plays = session.get("plays", 0)+1
    # score= session.get("score",0)
    print(request.get_json(), "The stored JSON from the axios POST req")
    axiosJSON =request.get_json() # we are getting the dict of the the stored JSON from the axios POST req
    # num_of_plays = axiosJSON["numOfPlays"] # we are getting the number of plays from the JSON 
    session["numplay"] = axiosJSON["numOfPlays"] # the numplay in session should be the same as the numofplays in the JSON that the axios post request is sending
    score=axiosJSON["score"]
    num_of_plays = session["numplay"] 
    allscores = axiosJSON["allscores"]
    highestScore = max(allscores)
    # session["numplay"] = session.get("numplay")+1 ## adding 1 everytime a game is complete
    print("------", num_of_plays, "????????", score , "SCORRRREEE???",session.get("numplay"), "SESSSSHHHH" , allscores, "SCORSS ALL", highestScore, "HIGHESTT")
    return jsonify({"totalNumofPlays": num_of_plays, "score": score, "highest": highestScore})
    
