import { Dispatch } from 'redux';
import { toast } from 'react-toastify';
import { UserState, userActions } from './user-slice';
import { getAuthToken } from '../utils/authUtils';

export const loginUser = (username: string, password: string) => {
  return async (dispatch: Dispatch) => {
    const graphqlQuery = {
      query: `
         {
          login(username:"${username}",  password:"${password}") {
            token
            _id
          }
        }
      `,
    };

    try {
      const response = await fetch('http://localhost:8080/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphqlQuery),
      });

      // API
      //     const response = await fetch('http://localhost:8080/user/login', {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify({ username, password }),
      //     });

      const data = await response.json();

      if (data.errors && data.errors.length > 0) {
        toast.error(data.errors[0].message);
        return;
      }

      const { token } = data.data.login;
      if (token) {
        localStorage.setItem('authToken', token);
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);
        localStorage.setItem('expiration', expiration.toISOString());
        toast.success('Login Successful');

        window.location.href = '/';
        return true;
      } else {
        toast.error('Login Failed');
        console.error(data.errors.message);
      }
    } catch (error) {
      toast.error('Login Failed');
      console.error('Error logging in:', error);
    }
  };
};

export const registerUser = (formData: {
  username: string;
  email: string;
  password: string;
}) => {
  return async (dispatch: Dispatch) => {
    const graphqlQuery = {
      query: `
      mutation {
        createUser(userInput: {username:"${formData.username}", email:"${formData.email}", password:"${formData.password}"}) {
          _id
        }
      }
    `,
    };

    try {
      const response = await fetch('http://localhost:8080/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphqlQuery),
      });

      // API
      // const response = await fetch('http://localhost:8080/user/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      const data = await response.json();

      if (data.errors && data.errors.length > 0) {
        toast.error(data.errors[0].message);
        return;
      }

      const { token } = data.data.createUser;
      if (token) {
        localStorage.setItem('authToken', token);
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);
        localStorage.setItem('expiration', expiration.toISOString());
        toast.success('Registration Successful');

        window.location.href = '/';
        return true;
      } else {
        toast.error('Registration Failed');
        console.error(data.errors.message);
      }
    } catch (error) {
      toast.error('Registration Failed');
      console.error('Error registering user:', error);
    }
  };
};

export const logoutUser = () => {
  return (dispatch: Dispatch) => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('expiration');
    dispatch(userActions.clearUser());
    toast.success('Logged out successfully');
    window.location.href = '/';
  };
};

export const fetchUser = () => {
  return async (dispatch: Dispatch) => {
    const graphqlQuery = {
      query: `
        {
          user {
            username
            email
            image {
              url
            }
          }
        }
      `,
    };

    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:8080/graphql', {
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
        console.error(data.errors[0].message);
        return;
      }

      dispatch(userActions.setUser(data.data.user));
      return data.data.user;
    } catch (error) {
      toast.error('Error fetching user data');
      console.error('Error fetching user:', error);
    }
  };
};

export const fetchUserPosts = (
  username: string,
  page: number,
  POSTS_PER_PAGE: number
) => {
  return async (
    dispatch: Dispatch,
    getState: () => { userState: UserState }
  ) => {
    const graphqlQuery = {
      query: `
        {
          userPosts(username: "${username}", skip: ${
        (page - 1) * POSTS_PER_PAGE
      }, limit: ${POSTS_PER_PAGE}) {
            user {
              _id
              username
              email
              image {
                url
                id
              }
            }
            posts {
              _id
              content
              image {
                url
                id
              }
              creator {
                _id
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

    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:8080/graphql', {
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
        console.error(data.errors[0].message);
        return;
      }

      const currentState = getState();

      if (
        data.data.userPosts.user.username === currentState.userState.username
      ) {
        dispatch(userActions.setUserPosts(data.data.userPosts));
      }
      return data.data.userPosts;
    } catch (error) {
      toast.error('Error fetching user posts data');
      console.error('Error fetching user posts:', error);
    }
  };
};

export const addUserImage = (formImage: FormData | undefined) => {
  return async (dispatch: Dispatch) => {
    const toastId = toast.loading('Saving image...');
    const token = getAuthToken();

    const imageResponse = await fetch(
      'http://localhost:8080/upload-user-image',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        body: formImage,
      }
    );

    const imageData = await imageResponse.json();

    const graphqlQuery = {
      query: `
                  mutation {
                      addUserImage(userImage: {url:"${imageData.filePath}", id: "${imageData.publicId}"}) {
                          image {
                            url
                          }                    
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

    const updatedImage = data.data.addUserImage.image;
    dispatch(userActions.setUserImage({ image: updatedImage }));
    toast.update(toastId, {
      render: 'Image upload successful',
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

export const fetchUserProfile = (username: string) => {
  return async (dispatch: Dispatch) => {
    const graphqlQuery = {
      query: `
        {
          userProfile(username: "${username}") {
            username
            email
            image {
              url
            }
          }
        }
      `,
    };

    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:8080/graphql', {
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
        console.error(data.errors[0].message);
        return;
      }

      return data.data.user;
    } catch (error) {
      toast.error('Error fetching user data');
      console.error('Error fetching user:', error);
    }
  };
};
