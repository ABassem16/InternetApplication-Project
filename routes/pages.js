const USER_GUEST = 0
const USER_CANDIDATE = 1
const USER_HR = 2

module.exports = function(app, midware, database){
    app.get('/',(req, res)=>{
        res.render("index")
    });

    app.get('/register',(req, res)=>{
        if(req.session.uid) return res.redirect("/home")
        database.positions.GetAll(function(jobs, error){
            if(error) return res.send(error.message)
            res.render("RegisterPage", {jobs: jobs})
        });
    });

    app.get('/login',(req, res)=>{
        if(req.session.uid) return res.redirect("/home")
        else res.render("LoginPage")
    });

    app.get('/logout',(req, res)=>{
        req.session.email = null
        req.session.uid = null
        req.session.type = null
        res.redirect("/")
    });

    app.get('/home', midware.checkauth, (req, res)=>{
        switch(req.session.type){
            case USER_CANDIDATE:
                res.render("Home_Candidate")
                break;
            case USER_HR:
                res.render("Home_HR")
                break;
        }
    });

    app.get('/viewapplications', midware.checkauth, (req, res)=>{
        database.users.GetUnApproved(function(users, error){
            if(error)return res.send(error.message)
            res.render("ViewAllApplications", {users: users})
        })
        
    });

    app.get('/viewresults', midware.checkauth, (req, res)=>{
        res.render("ViewCompleteExams")
    });

    app.get('/editexams', midware.checkauth, (req, res)=>{
        database.exams.GetAll(function(exams, error){
            if(error)return res.send(error.message)
            res.render("EditAllExamsPage", {exams:exams})
        })
        
    });
    app.get('/editexam', (req, res)=>{
        if(!req.query) return res.send("exam id is required")
        if(!req.query.id) return res.send("exam id is required")
        database.exams.Get(req.query.id, function(exam, error){
            if(error)return res.send(error.message)
            if(!exam)return res.send("Exam not found!")
            database.questions.getAllQuestions(req.query.id, function(questions, error){
                if(error)return res.send(error.message)
                QuestionsAnswers = {}
                if(questions.length == 0){
                    return res.render("EditExamPage", {
                        examid: req.query.id,
                        title: exam.title,
                        questions: [],
                        answers: {}
                    });
                }
                questions.forEach(question => {
                    database.answers.getAllAnswers(question.qid, function(answers, error){
                        if(error)return res.send(error.message)
                        QuestionsAnswers["Q"+question.qid] = answers;
                        if(Object.keys(QuestionsAnswers).length == questions.length){
                            res.render("EditExamPage", {
                                examid: req.query.id,
                                title: exam.title,
                                questions: questions,
                                answers: QuestionsAnswers
                            });
                        }
                    })
                });
            })
        })
    });

    app.get('/viewapplication', midware.checkauth, (req, res)=>{
        if(!req.query) return res.send("application id is required")
        if(!req.query.id) return res.send("application id is required")
        database.users.Get(req.query.id, function(userObj, error){
            if(error)res.send(error.message)
            database.positions.Get(userObj.position, function(jobresult, error){
                if(error)res.send(error.message)
                job_text = jobresult[0].text || "NONE"
                database.exams.GetAll(function(exams){
                    res.render("ViewApplication", {
                        email: userObj.email,
                        job: job_text,
                        phone: userObj.phone_Number || null,
                        exams: exams
                    });
                });
                
            })
        });
    });
    
    app.get('/takeexam', midware.checkauth, (req, res)=>{
        if(!req.query) return res.send("exam id is required")
        if(!req.query.id) return res.send("exam id is required")
        database.assignedexams.getData(req.query.id, function(results, error){
            if(error) return res.send(error);
            if(results.length < 1) return res.send("Invalid exam");
            exam = results[0]
            if(exam.cand_id != req.session.uid) return res.send("You dont have access to take this exam");
            database.assignedquestions.GetQuestionsObjects(req.query.id, callback=function(Questions, error){
                if(error) return res.send(error)
                res.render("ExamPage", {
                    questions: Questions,
                    examid: req.query.id
                });
            });
        });
    });
}