module.exports = function(){
    var module = {};
    module.checkauth = function(req, res, next){
        if(!req.session.uid) return res.redirect("/login")
        if(!req.session.email) return res.redirect("/login")
        if(!req.session.type) return res.redirect("/login")
        next()
    }
    return module;
}

