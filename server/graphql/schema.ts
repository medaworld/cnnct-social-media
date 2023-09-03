import { buildSchema } from 'graphql/utilities/';

export default buildSchema(`
    type Image {
        url: String
        id: String
    }

    type Post {
        _id: ID
        content: String!
        image: Image
        creator: User!
        createdAt: String!
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        posts: [Post!]!
        image: Image
    }

    type AuthData {
        _id: ID!
        token: String!
    }

    type PostData {
        posts: [Post!]!
        totalPosts: Int!
    }

    type UserData {
        _id: ID!
        username: String!
        email: String!
        image: Image
    }

    type UserPostData {
        user: User!
        posts: [Post!]!
        totalPosts: Int!
    }

    input UserInputData {
        email: String!
        username: String!
        password: String!
    }

    input ImageInput {
        url: String!
        id: String!
    }
    
    input PostInputData {
        content: String!
        image: ImageInput
    }

    type RootQuery {
        login(username: String!, password: String!): AuthData!
        posts(skip: Int!, limit: Int!): PostData!
        user: UserData!
        userPosts(username: String!, skip: Int!, limit: Int!): UserPostData!
    }

    type RootMutation {
        createUser(userInput: UserInputData): AuthData!
        createPost(postInput: PostInputData): Post!
        deletePost(postId: String!): Post!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
