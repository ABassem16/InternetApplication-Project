var express = require('express');
var session = require('express-session')
var ejs = require('ejs');
var bodyParser = require('body-parser');
var path = require('path');
var fileUpload = require('express-fileupload');

var app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({ secret: 'MyDarkSecrets', cookie: { maxAge: 60000*100 }, resave: false, saveUninitialized: false}))
app.use(fileUpload());

const functions = require("./functions")();
const midware = require("./middleware")();
require("./routes/pages")(app, midware, functions.database);
require("./routes/services")(app, midware, functions.database);

app.listen(8008,function(){ console.log("Listening on port 8008")})


/*
functions.database.positions.Add("JOB 1")
functions.database.positions.Add("JOB 2")
functions.database.positions.Add("JOB 3")
functions.database.positions.Add("JOB 4")
functions.database.positions.Add("JOB 5")
*/

//functions.database.users.Add("myemail@myhost.com", "myfckingsecretpassword", "01122334452", "mycv.pdf")

/*
functions.database.exams.Add("IQ Exam", function(new_examid){
    functions.database.questions.Add(new_examid, "What is the root(25)-1 ?", function(new_question_id, error){
        if(error)return console.log(error)
        functions.database.answers.Add(new_question_id, "4", true, function(aid, err){
            if(err)return console.log(err)
        })
        functions.database.answers.Add(new_question_id, "-6", true)
        functions.database.answers.Add(new_question_id, "2", false)
        functions.database.answers.Add(new_question_id, "-2", false)
        functions.database.answers.Add(new_question_id, "5", false)
        functions.database.answers.Add(new_question_id, "-5", false)
    });
});
*/