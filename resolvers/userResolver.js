//library inport for hashing/encrypting password
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const {combineResolvers } = require ('graphql-resolvers'); 

/*const {users, tasks} = require ('../constants');*/

//importing models from Mongoose Schema
const User = require ('../database/models/user');  
const Task = require ('../database/models/task'); 
//importing middleware
const {isAuthenticated} = require ('../resolvers/middleware');  
//importing PubSub from subscription 
const PubSub = require ('../subscription');
const {userEvents} = require ('../subscription/events');




module.exports = {
    Query : {          
        user: combineResolvers (isAuthenticated, async (_,{id}, {email}) => {
            try{
                console.log ('Email Check : ', email);
                const user = await User.findOne ({email});
                if (!user){
                    throw new Error ('User not found'); 
                }
                return user; 
            }catch (error){
                console.log ('Error', error);
                throw error;
            }
         
        })
     },
     
     // tasks: is the field level resolver inside custom user object      
     User :{
         tasks : async ({id}) => {
             try{
                const tasks = await Task.find ({user : id})
                return tasks;
                //return tasks.filter (task => task.id === id) 
             }catch (error){
                 console.log(error);
                 throw new Error ('Inside tasks resolver error');
             }
             
            
            },   
         
     },    
     Mutation : {
        signup : async (_, {input}) => {
            try{
               console.log("In SignUp1");               
               const user = await User.findOne ({email : input.email});
               if (user){                    
                    throw new Error ('User already exists');
               }
               console.log("In SignUp3");
               const hashPassword = await bcrypt.hash(input.password, 12);
               const NewUser = new User ({...input, password: hashPassword });
               const result = await NewUser.save ();
               PubSub.publish (userEvents.USER_CREATED, {
                   userCreated : result
               });
               return result;
            }catch (error){
                console.log (error);
                throw error;
            }

        },
        
        login : async (_, {input}) => { 
            try{
                console.log ("In Login1");
            const user = await User.findOne ({email : input.email});
               if (!user){                    
                    throw new Error ('User does not exist');
               }
               
               const isPasswordValid = await bcrypt.compare (input.password, user.password);
               if (!isPasswordValid){
                   throw new Error ("Password incorrect");
               }
               const secretkey = process.env.JWT_SECRET_KEY ;
               const token = jwt.sign ({email : user.email}, secretkey, {expiresIn : "25 days" });
               return {token}

            }catch (error){
                console.log (error);
                throw error;
            }

        }        
        
     },

     Subscription : {
        userCreated : {
            subscribe : () => PubSub.asyncIterator(userEvents.USER_CREATED)        
        }
    }    

 }