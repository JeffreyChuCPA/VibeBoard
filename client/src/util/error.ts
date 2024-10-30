export const getErrorMessage = (errorCode: string) => {
  const errorMessages = {
    "auth/user-not-found": "No user found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/email-already-in-use": "This email is already in use. Please try another one.",
    "auth/invalid-email": "The email address is not valid.",
    "auth/weak-password": "The password is too weak. Please choose a stronger one.",
    // Add more Firebase error codes and messages here as needed
    default: "An error occurred. Please try again later.",
  }

  return errorMessages[errorCode] || errorMessages.default
} 