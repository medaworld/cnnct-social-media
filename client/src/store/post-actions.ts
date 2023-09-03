import { Dispatch } from 'redux';
import { postActions } from './post-slice';

export const fetchPosts = (page: number, POSTS_PER_PAGE: number) => {
  return async (dispatch: Dispatch) => {
    const fetchData = async () => {
      const graphqlQuery = {
        query: `
                    {
                        posts(skip: ${
                          (page - 1) * POSTS_PER_PAGE
                        }, limit: ${POSTS_PER_PAGE}) {
                            posts {
                                _id
                                content
                                imageUrl
                                creator {
                                    username
                                }
                                createdAt
                            }
                            totalPosts
                        }
                    }
                `,
      };
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8080/graphql', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphqlQuery),
      });
      if (!response.ok) {
        throw new Error('Could not fetch posts!');
      }
      const data = await response.json();

      return data;
    };

    try {
      const data = await fetchData();
      const { posts } = data.data;

      const currentSkip = (page - 1) * POSTS_PER_PAGE;
      const hasMore = !(
        posts.posts.length < POSTS_PER_PAGE ||
        posts.totalPosts <= currentSkip + posts.posts.length
      );

      dispatch(
        postActions.replacePosts({
          posts: posts.posts,
          totalPosts: posts.totalPosts,
          hasMore: hasMore,
        })
      );
    } catch (error) {
      console.log('Fetching posts failed: ' + error);
    }
  };
};

export const addPost = (content: string, formImage: FormData | undefined) => {
  return async (dispatch: Dispatch) => {
    const token = localStorage.getItem('authToken');
    let imageUrl = null;

    if (formImage) {
      const imageResponse = await fetch('http://localhost:8080/upload-image', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        body: formImage,
      });

      const imageData = await imageResponse.json();
      imageUrl = `"${imageData.filePath}"`;
    }

    const graphqlQuery = {
      query: `
                  mutation {
                      createPost(postInput: {content:"${content}", imageUrl:${imageUrl}}) {
                          _id
                          content
                          imageUrl
                          creator {
                            username
                          }
                          createdAt
                        }
                    }
                    `,
    };

    const response = await fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    });

    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    dispatch(postActions.addPost(data.data.createPost));
    return true;
  };
};
