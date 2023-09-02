export function validateUserInput(userInput: any) {
  if (
    !userInput.email ||
    !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(userInput.email)
  ) {
    throw new Error('Please enter a valid email.');
  }

  if (!userInput.password || userInput.password.length < 3) {
    throw new Error('Password should be at least 3 characters long.');
  }

  if (!userInput.username || userInput.username.trim() === '') {
    throw new Error('Username should not be empty.');
  }
}
