
const {gql} = require ('apollo-server-express');
const taskTypeDef = require ('./taskTypeDef');
const userTypeDef = require ('./userTypeDef');


//placeholder typedefs (root schema types) to extend for stitching / modularizing 
// query & Mutation schema types in other files
const typeDefs = gql`
scalar Date
type Query {  
     
    _ : String
    
} 
type Mutation {   
    
    _ : String
} 
type Subscription {    
    _ : String
} 

`
module.exports = [
    taskTypeDef,
    userTypeDef,
    typeDefs
];

