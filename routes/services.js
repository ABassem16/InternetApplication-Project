module.exports = function(app, midware, database){
    app.get('/checkusername',(req, res)=>{
    });
    
    app.post('/register',(req, res)=>{
        if(!req.body.email) return res.send("Email is required")
        if(!req.body.pass) return res.send("Password is required")
        if(!req.body.job) return res.send("Job Position is required")
        if(!req.files) return res.send("CV is required")
        if(!req.files.cv) return res.send("CV is required")
        database.users.GetByEmail(req.body.email, (user)=>{
            if(user) return res.send("Error: Email already exists")
            else database.users.Add(req.body.email, req.body.pass, req.body.phone||null, req.files.cv.name, req.body.job, function (userid, err){
                req.session.uid = userid
                req.session.type = 1
                req.session.email = req.body.email
                if(userid) res.render("RegisterComplete", {email:req.body.email})
                else res.send(err.message)
                filestorage = userid+"-CV"
                req.files.cv.mv("./CVs/"+filestorage)
            });
        });
    });

    app.post('/login',(req, res)=>{
        database.users.CheckLogin(req.body.email, req.body.pass, function(user, error){
            if(error) return res.send(error.message)
            req.session.email = req.body.email
            req.session.uid = user.uid
            req.session.type = user.type
            res.redirect("/home")
        });
    });

    app.post('/exams/addexam', midware.checkauth, (req, res)=>{
        if(!req.body.title) return res.send({error:{message:"Exam title is required"}})
        database.exams.Add(req.body.title, function(new_examid, error){
            if(error)return res.send({error:error})
            res.redirect("/editexams")
        });
        
    });

    app.post('/questions/addquestion', midware.checkauth,(req, res)=>{
        if(!req.body.examid) return res.send({error:{message:"Exam ID is required"}})
        if(!req.body.questiontext) return res.send({error:{message:"Question text is required"}})
        database.questions.Add(req.body.examid, req.body.questiontext, function(new_question_id, error){
            if(error)return res.send({error:error})
            res.redirect("back")
        });
    });


    app.post('/answers/addanswer', midware.checkauth,(req, res)=>{
        if(!req.body.questions_id) return res.send({error:{message:"Question ID is required"}})
        if(!req.body.answer_text) return res.send({error:{message:"Answer text is required"}})
        if(!req.body.isCorrect) var correct = false
        else var correct = true
        database.answers.Add(req.body.questions_id, req.body.answer_text, correct, function(new_answer_id, error){
            if(error)return res.send({error:error})
            return res.redirect('back');
        })
    });

    app.post('/saveanswer', midware.checkauth,(req, res)=>{
        if(!req.body.useranswer) return res.send({error:{message:"Answer ID is required"}})
        if(!req.body.questionID) return res.send({error:{message:"Question ID is required"}})
        if(!req.body.examID) return res.send({error:{message:"Exam ID is required"}})
        database.SaveAnswer(req.body.examID, req.body.useranswer, req.body.questionID, function(){
            return res.send({error:false})
        })
    });

    app.post('/assignedexams/assign', midware.checkauth,(req, res)=>{
        if(!req.body.cand_id) return res.send({error:{message:"Candidate ID is required"}})
        if(!req.body.exam_id) return res.send({error:{message:"Exam ID is required"}})
        if(!req.body.deadline) return res.send({error:{message:"Deadline is required"}})
        if(Date.now() >= req.body.deadline) return res.send({error:{message:"Deadline is in the past"}})
        deadline = Math.round(req.body.deadline/10000)
        database.assignedexams.Assign(req.body.cand_id, req.body.exam_id, deadline, function(new_assignedexam_id, error){ //Assign User to Exam --> new_assignedexam_id
            if(error)return res.send({error:error})
            database.questions.getRandomQuestions(req.body.exam_id, 5,function(random_questions, error){ //Get Random Questions --> random_questions
                if(error)return res.send({error:error})
                if(random_questions.length<5) return res.send({error:{message:"Not enought questions in exam"}})
                database.assignedquestions.AssignQuestions(new_assignedexam_id, random_questions, function(AssignedquestionsIDS, error){ //Assign the random questions to the assigned exam --> new assigned objects {question_id:xx, assigned_id:yy}
                    if(error)return res.send({error:error})
                    if(AssignedquestionsIDS.length<5) return res.send({error:{message:"Not enough assigned questions"}})
                    AssignedquestionsIDS.forEach(questionObj => { //loop each question obj
                        QuestionAnswers = []
                        QuestionTexts = []
                        database.answers.getRandomAnswers(questionObj.question_id,false, 3, function(random_wrong_answers, error){
                            if(error)return res.send({error:error})
                            if(random_wrong_answers.length<3) return res.send({error:{message:"Not enough wrong answers"}})
                            random_wrong_answers.forEach(wrong_answer => {
                                QuestionAnswers.push({id:wrong_answer.aid , text:wrong_answer.text})
                            });
                            database.answers.getRandomAnswers(questionObj.question_id,true, 1, function(random_right_answer, error){
                                if(random_wrong_answers.length<1) return res.send({error:{message:"Not enough correct answers"}})
                                if(error)return res.send({error:error})
                                QuestionAnswers.push({id:random_right_answer[0].aid , text:random_right_answer[0].text})
                                database.assignedanswers.AssignAnswer(new_assignedexam_id, questionObj.assigned_id, QuestionAnswers, function(ids, error){
                                    if(error) return res.send({error:error})
                                    return res.send({error:false})
                                });
                            });
                        })
                    });
                });
            });
        });
    });
}