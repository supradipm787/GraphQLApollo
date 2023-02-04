
const {skip} = require ('graphql-resolvers'); 
const Task = require ('../../database/models/task');

module.exports.isAuthenticated = (_,__, {email}) => {
    if(!email){
        throw new Error ('Access Denied no email , please sign up');
    }
    return skip;
}
module.exports.isTaskOwner = async (_, {id}, {loggedinUserId}) => {

    try{
        const task = await Task.findById(id);
        console.log ('TaskId in Middleware:', id);
        console.log ('loggedinUserId in Middleware:', loggedinUserId);
        if (!task){
            throw new Error ('Task not Found');
        }else if (task.User.toString()!== loggedinUserId) {
            throw new Error ('Not the Task Owner');
        }
    return skip;
    }catch (error){
        console.log (error);
        throw error;
    }
    
}