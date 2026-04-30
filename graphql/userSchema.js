const { gql } = require('apollo-server-express');

const userTypeDefs = gql`
    type User {
        id: Int
        name: String
        email: String
        age: Int
    }

    extend type Query {
        users: [User]
        user(id: Int): User
    }

    extend type Mutation {
        createUser(name: String!, email: String!, password: String!): User
        updateUser(id: Int!, name: String, age: Int): User
        deleteUser(id: Int!): String
    }
`;

module.exports = userTypeDefs;