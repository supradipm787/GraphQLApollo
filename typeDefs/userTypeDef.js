const {gql} = require ('apollo-server-express');

//export typeDefs 
module.exports = gql `
extend type Query {      

    user : User
} 
input signupInput {
    name: String!
    email: String!
    password: String!
}

input loginInput {    
    email: String!
    password: String!
}

extend type Mutation {
    signup (input: signupInput): User
    login (input: loginInput) : Token
}

type Token{
    token : String! 
}

type User{
    id : ID!
    name: String!
    email: String!
    tasks: [Task!] 
    createdAt: Date!
    updatedAt: Date!
} 

extend type Subscription{
    userCreated : User
}

`;