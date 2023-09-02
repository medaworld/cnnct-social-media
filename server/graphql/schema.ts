import { buildSchema } from 'graphql/utilities/';

export default buildSchema(`
    type Post {
        _id: ID!
        content: String!
        imageUrl: String
        creator: User!
        createdAt: String!
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        posts: [Post!]!
    }

    type AuthData {
        _id: ID!
        token: String!
    }

    type PostData {
        posts: [Post!]!
        totalPosts: Int!
    }

    input UserInputData {
        email: String!
        username: String!
        password: String!
    }

    input PostInputData {
        content: String!
        imageUrl: String
    }

    type RootQuery {
        login(username: String!, password: String!): AuthData!
        posts(skip: Int!, limit: Int!): PostData!
    }

    type RootMutation {
        createUser(userInput: UserInputData): AuthData!
        createPost(postInput: PostInputData): Post!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
