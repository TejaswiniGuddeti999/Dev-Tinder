const adminAuth = (req,res,next) =>{
    console.log("Admin auth is being checked");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if (!isAdminAuthorized) {
        res.status(401).send("unauthorized request")
    }
    else {
        next();
    }
}; 

const userAuth = (req,res,next) => {
    console.log("User auth is being checked");
    const token ="xyzj";
    const isUserAuthorized = token === "xyz";
    if (!isUserAuthorized) {
        res.status(401).send("unauthorized request")
    }
    else {
        next();
    }
}
export {adminAuth, userAuth};