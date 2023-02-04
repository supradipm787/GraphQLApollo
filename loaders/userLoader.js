const User = require ('../database/models/user');

module.exports.batchUsers = async (userIds) =>{
    console.log ('keys ====', userIds);
    const users = await User.find ({_id : {$in : userIds }});
    
   // let keys2 = userIds.map (userId => users.find (user => User.id === userId));
    // console.log ('keys2 ===', keys2);
    // console.log ('UserId  ====', userId);   
     // return users; 
    
    return userIds.map (userId => users.find (User => User.id === userId)); 


}