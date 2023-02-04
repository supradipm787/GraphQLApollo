
const {GraphQLDateTime} = require ('graphql-iso-date');

const userResolver = require ('./userResolver');
const taskResolver = require ('./taskResolver');

const customgraphQlDateTimeResolver = {
    Date:GraphQLDateTime
}

module.exports = [
userResolver,
taskResolver,
customgraphQlDateTimeResolver

];