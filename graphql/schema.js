const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        id: Int
        name: String
        email: String
        age: Int
    }

    type Post {
        id: Int
        title: String
        content: String
        user_id: Int
        created_at: String
    }

    type Query {
        users: [User]
        user(id: Int): User
        posts: [Post]
        post(id: Int): Post
    }

    type Mutation {
        createPost(title: String!, content: String!, user_id: Int!): Post
    }
`;

module.exports = typeDefs;