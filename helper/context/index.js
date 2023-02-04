const jwt = require ('jsonwebtoken');
const User  = require ('../../database/models/user');

module.exports.verifyUser = async (req) => { 
    try{
        //console.log (req.headers);
        req.email = null;
        req.loggedinUserId = null;
        const bearerHeaderToken = req.headers.authorization;
        if (bearerHeaderToken){
            const token = bearerHeaderToken.split (':')[1];
            console.log ('Authorization Token : ' , token);
            const payload = jwt.verify (token, process.env.JWT_SECRET_KEY);
            req.email = payload.email;
            console.log ('Context Email', req.email); 
            const user = await User.findOne ({email : payload.email});
            if(user){
                req.loggedinUserId = user.id;
            }
            

            
        }

    } catch (error){
        console.log (error);
        throw error;
        
    }

}