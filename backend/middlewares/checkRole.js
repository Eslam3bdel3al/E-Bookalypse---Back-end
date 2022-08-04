module.exports.mustRootAdmin = (req,res,next) => {
    if(req.role == "rootAdmin"){
        next()
    }else{
        let error = new Error("Not Authorized");
        error.status = 403;
        throw error;
    }
}


module.exports.mustAdmin = (req,res,next) => {
    if(req.role == "admin" || req.role == "rootAdmin"){
        next()
    }else{
        let error = new Error("Not Authorized");
        error.status = 403;
        throw error;
    }
}

module.exports.mustUser = (req,res,next) => {
    if(req.role == "regUser"){                                 //&& req.id == req.params.userId
        next()
    }else {
        let error = new Error("Not Authorized");
        error.status = 403;
        throw error;
    }
}

module.exports.userORAdmin = (req,res,next) => {
    if(req.role == "admin" || req.role == "rootAdmin"){
        next()
    }else if(req.role == "regUser"){                     //&& req.id == req.params.userId
        next()
    }else {
        let error = new Error("Not Authorized");
        error.status = 403;
        throw error;
    }
}