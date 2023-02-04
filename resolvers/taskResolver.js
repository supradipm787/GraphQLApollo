
//const {users, tasks} = require ('../constants');
const uuid = require ('uuid');
const User = require ('../database/models/user');
const Task = require ('../database/models/task');
const {isAuthenticated, isTaskOwner} = require ('./middleware');
const {combineResolvers} = require ('graphql-resolvers'); 
const { stringToBase64 , baseToString64 } = require ('../helper');

module.exports = {
    Query : {
        
        tasks: combineResolvers ( isAuthenticated, async (_,{cursor, limit = 5}, {loggedinUserId}) => {             
            try{
                const query = {user : loggedinUserId };
                if (cursor){
                    query ['_id'] = {
                        //'$lt' is less than symbol denoted in String
                        '$lt' : baseToString64 (cursor)
                    }
                }
                console.log('Loggedin User ID: ', loggedinUserId);
                //const tasks = await Task.find ({User : loggedinUserId}).sort({_id : -1}).skip (skip).limit (limit);
                let tasks = await Task.find (query).sort({_id : -1}).limit (limit + 1);
                length = 0;
                if (tasks){
                    length = tasks.length ;
                }
                console.log('Total tasks for the user: ', length);
                const hasNextPage = length > limit;
                if (tasks){
                    tasks = hasNextPage ? tasks.slice (0,-1) : tasks;
                }

                return {
                    taskFeed : tasks, 
                    pageInfo : {
                        nextPageCursor : hasNextPage ?  stringToBase64( tasks [tasks.length - 1].id ) : null,
                        hasNextPage
                    }
                };
            }catch (error){
                console.log (error); 
                throw error;
            }      
        
        }),

        task:combineResolvers ( isAuthenticated, isTaskOwner, async (_,{id}) => 
            {
                //return tasks.find (task => task.id === id )
                try{
                    console.log ('In task Resolver');
                    const task = await Task.findById (id);
                    return task;     
                }catch (error){
                    console.log (error);
                    return error;
                }
                
            }),
        
     },
     // user: is the field level resolver inside Task object -> To resolve the custom user object present inside  custom task object
     Task:{
        // user : ({id}) => {return users.find (user => user.id === id) 
         
        user : async (parent, _, {loaders}) => {
            //console.log ('Inside user Field level resolver1'); 
            // const user = await User.findById (parent.User);
            const user = await loaders.User.load (parent.User.toString());
           // console.log ('User Inside user task resolver2');  
            return user;  
        }
          
     },     
    
     Mutation : {
        addTask : combineResolvers ( isAuthenticated, async (_, {input}, {email}) => {
            try{
                console.log ('Email Check1', email);
                const user = await User.findOne ({email});
                //const task  = {...input,  id : uuid.v4 ()};
                const task = new Task ({...input,  User : user.id}); 
                const result = await task.save();
                //tasks.push (task);
                user.tasks.push (result.id);  
                await user.save ();
                return result;
            }catch (error){
                console.log (error);
                throw error;
            }
           
        }),
        updateTask: combineResolvers ( isAuthenticated, isTaskOwner, async (_, {id, input}) =>{
            try{
                console.log ('In updateTask Resolver');
                //{new:true} return the updated task at first go 
                const task = Task.findByIdAndUpdate(id, {...input}, {new: true});

                return task;
            }catch(error){
                console.error (error);
                throw error;
            }
           
        }),
        deleteTask:combineResolvers ( isAuthenticated, isTaskOwner, async (_, {id}, {loggedinUserId}) =>{
            try{
                const task = await Task.findByIdAndDelete(id);
                await User.updateOne ({_id:loggedinUserId}, {$pull : {tasks : task.id}})
                return task;
            }catch(error){
                console.log(error);
                throw error;
            }
        })

     }

}