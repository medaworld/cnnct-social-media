import { Dispatch } from 'redux';
import { postActions } from './post-slice';
import { toast } from 'react-toastify';
import { userActions } from './user-slice';
import { getAuthToken } from '../utils/authUtils';

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
                                image {
                                  url
                                }
                                creator {
                                    username
                                    image {
                                      url
                                    }
                                }
                                createdAt
                            }
                            totalPosts
                        }
                    }
                `,
      };
      const token = getAuthToken();
      const response = await fetch(`${process.env.REACT_APP_API}/graphql`, {
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
        postActions.updatePosts({
          posts: posts.posts,
          totalPosts: posts.totalPosts,
          hasMore: hasMore,
        })
      );
    } catch (error) {
      console.log('Fetching posts failed: ' + error);
      throw error;
    }
  };
};

export const addPost = (content: string, formImage: FormData | undefined) => {
  return async (dispatch: Dispatch) => {
    const toastId = toast.loading('Posting...');
    const token = getAuthToken();
    let image = '';

    if (formImage) {
      const imageResponse = await fetch(
        `${process.env.REACT_APP_API}/upload-image`,
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + token,
          },
          body: formImage,
        }
      );

      const imageData = await imageResponse.json();
      image = `, image: {url: "${imageData.filePath}", id: "${imageData.publicId}"}`;
    }

    const graphqlQuery = {
      query: `
                  mutation {
                      createPost(postInput: {content:"${content}"${image}}) {
                          _id
                          content
                          image {
                            url                        
                          }
                          creator {
                            username
                          }
                          createdAt
                        }
                    }
                    `,
    };

    const response = await fetch(`${process.env.REACT_APP_API}/graphql`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    });

    const data = await response.json();

    if (data.errors && data.errors.length > 0) {
      toast.update(toastId, {
        render: data.errors[0].message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        closeButton: true,
      });

      return;
    }

    dispatch(postActions.addPost(data.data.createPost));
    dispatch(userActions.addPost(data.data.createPost));
    toast.update(toastId, {
      render: 'Post successful',
      type: 'success',
      isLoading: false,
      autoClose: 3000,
      closeOnClick: true,
      closeButton: true,
    });
    toast.dismiss();
    return true;
  };
};

export const deletePost = (postId: string) => {
  return async (dispatch: Dispatch) => {
    const graphqlQuery = {
      query: `
        mutation {
          deletePost(postId: "${postId}") {
            _id
          }
        }
      `,
    };

    const token = getAuthToken();
    const response = await fetch(`${process.env.REACT_APP_API}/graphql`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    });

    const data = await response.json();

    if (data.errors && data.errors.length > 0) {
      toast.error(data.errors[0].message);
      return;
    }

    dispatch(postActions.deletePost(postId));
    dispatch(userActions.deletePost(postId));
    return true;
  };
};
