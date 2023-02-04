const {gql} = require ('apollo-server-express');

//export typedefs 
module.exports = gql `
extend type Query {   
    tasks (cursor : String, limit : Int) : TaskFeed!
    task (id : ID!) : Task
    
} 
type TaskFeed {
    taskFeed : [Task!]
    pageInfo : PageInfo!
}
type PageInfo {
    nextPageCursor : String 
    hasNextPage : Boolean
}

input addTaskInput {
    name : String!
    completed: Boolean!     
    
}
input updateTaskInput {
    name : String
    completed: Boolean     
    
}

extend type Mutation{
    addTask (input : addTaskInput!) : Task
    updateTask (id : ID!, input : updateTaskInput!) : Task
    deleteTask (id : ID!):Task
}

type Task{
    id : ID!
    name : String!
    completed : Boolean!    
    user: User!
}

`;