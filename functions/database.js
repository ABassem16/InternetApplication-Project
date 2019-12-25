const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Ahmed1998',
  database : 'online_testing_project'
});
connection.connect(err =>{
    if(err) console.log("[Database]: "+err.message)
    else console.log("[Database]: Connected.")
});

module.exports = function(){
    module.users = {
        CheckLogin: function(email, password, callback=function(){}){
            connection.query(`SELECT uid, type FROM users WHERE email = "${email}" AND password = "${password}"`, function (error, results, fields) {
                if (error) console.log(error.message);
                callback(results[0])
            });
        },
        Add: function(email, password, phone=null, cvname, job, callback=function(){}){
            connection.query(`INSERT INTO users (email, password, phone_Number, type, approved, cvname, position) VALUES ("${email}", "${password}", "${phone}", 1, 0, "${cvname}", ${job})`, function (error, results, fields) {
                if (error) callback(false, error)
                else callback(results.insertId, error)
            });
        },
        Delete: function(userID){
        },
        isVerified: function(userID, callback=function(){}){
            connection.query(`SELECT approved FROM users WHERE uid = ${userID}`, function (error, results, fields) {
                if (error){
                    console.log(error.message);
                    callback(0, error)
                }
                console.log(results[0])
                return callback(results[0].approved, error)
            });
        },
        Verify: function(userID, aproval, callback=function(){}){
            connection.query(`UPDATE users SET approved = ${aproval} WHERE uid = ${userID}`, function (error, results, fields) {
                if (error) console.log(error.message);
                else callback(true)
            });
        },
        Get: function(userID, callback=function(){}){
            connection.query(`SELECT * FROM users WHERE uid = ${userID}`, function (error, results, fields) {
                if (error) console.log(error.message);
                callback(results[0]);
            });
        },
        GetUnApproved: function(callback=function(){}){
            connection.query(`SELECT * FROM users WHERE approved = 0`, function (error, results, fields) {
                if (error) console.log(error.message);
                callback(results);
            });
        },
        GetByEmail: function(email, callback=function(){}){
            connection.query(`SELECT * FROM users WHERE email = "${email}"`, function (error, results, fields) {
                if(error) console.log(error)
                callback(results[0])
            });
        }
    }
    module.exams = {
        Add: function (title, callback=function(){}){
            connection.query(`INSERT INTO exams (title) VALUES ("${title}")`, function (error, results, fields) {
                if(error) callback(false, error)
                else callback(results.insertId, error)
            });
        },
        GetAll: function (callback=function(){}){
            const query = `SELECT * FROM exams`
            connection.query(query,function (error, results, fields) {
                if(error) callback(false, error)
                callback(results, error)
            });
        },
        Get: function (examid, callback=function(){}){
            const query = `SELECT * FROM exams WHERE examid = ${examid} LIMIT 1`
            connection.query(query,function (error, results, fields) {
                if(error) callback(false, error)
                callback(results[0], error)
            });
        },
    }
    module.questions = {
        Add: function (examid, text, callback=function(){}){
            connection.query(`INSERT INTO questions (text, examid) VALUES ("${text}", ${examid})`, function (error, results, fields) {
                if(error) callback(false, error)
                else callback(results.insertId, error)
            });
        },
        getAllQuestions: function(examid, callback=function(){}){
            const query = `SELECT * FROM questions WHERE examid = ${examid}`
            connection.query(query, function (error, results, fields) {
                if(error) callback(false, error)
                else callback(results, error)
            });
        },
        Get: function(question_id, callback=function(){}){
            const query = `SELECT * FROM questions WHERE qid = ${question_id} LIMIT 1`
            connection.query(query, function (error, results, fields) {
                if(error) callback(false, error)
                else callback(results[0], error)
            });
        },
        getRandomQuestions: function(examid, number, callback=function(){}){
            const query = `SELECT * FROM questions WHERE examid = ${examid} ORDER BY RAND() LIMIT ${number}`
            connection.query(query, function (error, results, fields) {
                if(error) callback(false, error)
                else callback(results, error)
            });
        }
    }
    module.answers = {
        Add: function(questionid, text, isCorrect=true, callback=function(){}){
            const query = `INSERT INTO answers (text, questionid, correct) VALUES ("${text}", ${questionid}, ${isCorrect}) `
            connection.query(query, function (error, results, fields) {
                if(error) callback(false, error)
                else callback(results.insertId, error)
            });
        },
        getAllAnswers: function(questionid, callback=function(){}){
            const query = `SELECT * FROM answers WHERE questionid = ${questionid}`
            connection.query(query, function (error, results, fields) {
                if(error) callback(false, error)
                else callback(results, error)
            });
        },
        getRandomAnswers: function(questionid,isCorrect=true, number, callback=function(){}){
            const query = `SELECT * FROM answers WHERE questionid = ${questionid} AND correct = ${isCorrect} ORDER BY RAND() LIMIT ${number}`
            connection.query(query, function (error, results, fields) {
                if(error) callback(false, error)
                else callback(results, error)
            });
        },
        isCorrect: function(questionid, callback=function(){}){
            const query = `SELECT correct FROM answers WHERE questionid = ${questionid}`
            connection.query(query, function (error, results, fields) {
                if(error) return callback(false, error)
                if(results.length<1) return callback(false, {message:"Answer not found in database!"})
                if(results[0].correct)callback(true, error)
                else callback(false,error)
            });
        },
        getText: function(questions, callback=function(){}){
            const query = `SELECT text FROM answers WHERE questionid = ${questionid}`
            connection.query(query, function (error, results, fields) {
                if(error) return callback(false, error)
                if(results.length<1){
                    return callback(false, {message:"Answer not found in database!"})
                }
                
            });
        }
    }
    module.assignedexams = {
        Assign: function(cand_id, exam_id, deadline, callback=function(){}){
            const query = `INSERT INTO assignedexams (cand_id, exam_id, deadline) VALUES (${cand_id}, ${exam_id}, ${deadline})`
            connection.query(query, function (error, results, fields) {
                if(error) callback(false, error)
                else callback(results.insertId, error)
            });
        },
        getData: function(ca_exam_id, callback=function(){}){
            const query = `SELECT * FROM assignedexams WHERE ca_exam_id = ${ca_exam_id} LIMIT 1`
            connection.query(query, function (error, results, fields) {
                if(error) callback(false, error)
                else callback(results, error)
            });
        },
        Submit: function(ca_exam_id, score, callback=function(){}){
            const query = `UPDATE assignedexams SET score = ${score}, completed = ${true} WHERE ca_exam_id = ${ca_exam_id}`
            connection.query(query, function (error, results, fields) {
                if(error) callback(false, error)
                else callback(results, error)
            });
        }
    }
    module.assignedquestions = {
        AssignQuestions: function(assigned_exam_id, questions, callback=function(){}){
            var questionsIDS = []
            var AssignedquestionsIDS = []
            questions.forEach(question => {
                const query = `INSERT INTO assignedquestions (assigned_exam_id, question_id, saved) VALUES (${assigned_exam_id}, ${question.qid}, ${false})`
                connection.query(query, function (error, results, fields) {
                    if(error) return callback(false, error)
                    AssignedquestionsIDS.push({question_id:question.qid, assigned_id:question.qid})
                    if(AssignedquestionsIDS.length == questions.length) callback(AssignedquestionsIDS, false)
                });
            });
        },
        GetQuestionsObjects: function(assigned_exam_id, callback=function(){}){
            const query = `SELECT * FROM assignedquestions WHERE assigned_exam_id = ${assigned_exam_id}`
            connection.query(query, function (error, results, fields) {
                if(error) return callback(false, error)
                if(results.length < 5) return callback(false, {message:"Not enough assigned questions"})
                Questions = []; //array of QuestionObject's
                results.forEach(assigend_ques=>{
                    module.questions.Get(assigend_ques.question_id, function(questionData, error){
                        if(error) return callback(false, error)
                        QuesitonObject = {
                            QuestionID: questionData.qid,
                            QuestionText: questionData.text,
                            Answers: []
                        };
                        module.assignedanswers.GetAssignedExamAnswers(assigned_exam_id, questionData.qid, function(answers, error){
                            if(error) return callback(false, error)
                            QuesitonObject.Answers = answers;
                            Questions.push(QuesitonObject)
                            if(Questions.length == results.length) callback(Questions, false);
                        });
                    });
                    
                });
            });
        },
        Evaluate: function(assigned_exam_id, callback=function(){}){
            var Evaluation = {
                Skipped: 0,
                Right: 0,
                Wrong: 0
            };
            const query = `SELECT * FROM assignedquestions WHERE assigned_exam_id = ${assigned_exam_id}`
            connection.query(query, function (error, results, fields) {
                if(error) return callback(false, error)
                var count = 0
                results.forEach(assigned_question => {
                    module.questions.isCorrect(assigned_question.user_answer_id, function(correct, err){
                        if(err) return callback(false, error)
                        if(!assigned_question.saved) Evaluation.Skipped++
                        else if(correct)Evaluation.Right++
                        else Evaluation.Wrong++
                        count++
                        if(count==results.length) callback(Evaluation, false)
                    });
                });
            });
        },
        SaveAnswer: function(examid, useranswer, quesionid, callback=function(){}){
            const query = `UPDATE assignedquestions SET saved = 1`
            connection.query(query, function (error, results, fields) {
                callback(error)
            });
        }
    }
    module.assignedanswers = {
        AssignAnswer: function(assigned_exam_id, assigned_question_id, answers, callback=function(){}){
            var ids = []
            answers.forEach(answer => {
                const query = `INSERT INTO assignedanswers (assigned_exam_id, assigned_question_id, answer_id, text) VALUES (${assigned_exam_id}, ${assigned_question_id}, ${answer.id}, "${answer.text}")`
                connection.query(query, function (error, results, fields) {
                    if(error) return callback(false, error)
                    ids.push(results.insertId)
                    if(ids.length == answers.length) callback(ids, false)
                });
            });
        },
        GetAssignedExamAnswers: function(assigned_exam_id, assigned_question_id, callback=function(){}){
            const query = `SELECT * FROM assignedanswers WHERE assigned_exam_id = ${assigned_exam_id} AND assigned_question_id = ${assigned_question_id}`
            connection.query(query, function (error, result, fields) {
                if(error) return callback(false, error)
                callback(result, false)
            });
        }
    }
    module.positions = {
        Add: function (title, callback=function(){}){
            connection.query(`INSERT INTO positions (text) VALUES ("${title}")`, function (error, results, fields) {
                if(error) callback(false, error)
                else callback(results.insertId, error)
            });
        },
        GetAll: function(callback=function(){}){
            const query = `SELECT * FROM positions`
            connection.query(query, function (error, results, fields) {
                if(error) callback(false, error)
                else callback(results, error)
            });
        },
        Get: function(pos_id, callback=function(){}){
            const query = `SELECT * FROM positions WHERE pos_id = ${pos_id}`
            connection.query(query, function (error, results, fields) {
                if(error) callback(false, error)
                else callback(results, error)
            });
        }
    }
    return module;
}