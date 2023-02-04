const express = require ('express');
const {ApolloServer, gql} = require ('apollo-server-express');
const cors = require ('cors');
const dotenv = require ('dotenv');
const Dataloader = require ('dataloader');

/*set up the apollo-express-server instance -> app */
//set the configuration env variable
dotenv.config();
const app = express();
app.use (express.json())
//set the cross origin for multiple domains
app.use (cors());
//set the port for apollo-express-server
const PORT = process.env.PORT || 3000;


//call the typeDefs (taskTypeDef, userTypeDef) from typeDef module
const typeDefs = require ('./typeDefs');

//call the resolvers (taskResolver.js and userResolver.js) from resolvers module
const resolvers = require ('./resolvers');

//call the loaders
const loaders = require ('./loaders'); 

//creating connection with MongoDB
const {connection} = require ('./database/util');

//calling verifyUser function from Context
const {verifyUser} = require ('./helper/context');

//calling connection
connection ();

/* set up the new Apollo server instance for GraphQL*/
const apolloServer = new ApolloServer ({
    typeDefs,
    resolvers,
    context : async ({req, connection}) => {
          //console.log ('Inside Context');
        const contextObj = {};
        if (req){
            await verifyUser (req) 
            contextObj.email = req.email;
            contextObj.loggedinUserId = req.loggedinUserId; 
        }
        contextObj.loaders = {
            User : new Dataloader (keys => loaders.user.batchUsers(keys))
        }
        /*return {                     
           // email : req.email,
            // loggedinUserId : req.loggedinUserId,
            loaders : {
                User : new Dataloader (keys => loaders.user.batchUsers(keys))
            }
        }*/
        return contextObj;
    },
    formatError : (error) => {
        // console.log (error);
        return {
            message : error.message
        };
    }
});  

//await apolloServer.start();
//set up the middleware with express app and graphql path
apolloServer.applyMiddleware ({app, path:'/graphql'}); 


//set the route path and handler from Rest Express APIs
app.use('/', (req, res, next) => {
    res.send ({Message:"Hello Supradip"});
});

const httpServer = app.listen (PORT, ()=>{
    console.log(`Server listening on PORT: ${PORT}`);
    console.log (`GraphQl Endpoint : ${apolloServer.graphqlPath}`);
    });

    apolloServer.installSubscriptionHandlers (httpServer); 





