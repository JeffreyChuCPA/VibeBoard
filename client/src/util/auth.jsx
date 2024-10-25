import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  createContext,
} from 'react';
// import queryString from "query-string";
// import supabase from "./supabase";
import { useUser, updateUser } from './db';
import PageLoader from '../components/PageLoader';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updatePassword,
  updateEmail,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth';
import { auth } from '../util/firebase'


// Create a `useAuth` hook and `AuthProvider` that enables
// any component to subscribe to auth and re-render when it changes.
const authContext = createContext(undefined);
export const useAuth = () => useContext(authContext);
// This should wrap the app in `src/pages/_app.jsx`
export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook that creates the `auth` object and handles state
// This is called from `AuthProvider` above (extracted out for readability)
function useAuthProvider() {
  // Store auth user in state
  // `user` will be an object, `null` (loading) or `false` (logged out)
  const [user, setUser] = useState(null);
  console.log(user);

  // Handle response from auth functions (`signup`, `signin`, and `signinWithProvider`)
  //!whats the point of this
  const handleAuth = async (user) => {

    // Update user in state
    setUser(user);
    return user;
  };

  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await handleAuth(userCredential.user);
    } catch (error) {
      handleError(error);
    }
    // return supabase.auth
    //   .signUp({ email, password })
    //   .then(handleError)
    //   .then(handleAuth);
  };

  const signin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await handleAuth(userCredential.user);
    } catch (error) {
      handleError(error);
    }
    // return supabase.auth
    //   .signInWithPassword({ email, password })
    //   .then(handleError)
    //   .then(handleAuth);
  };

  const signinWithProvider = async (name) => {

    let provider;

    switch (name) {
      case 'google':
        provider = new GoogleAuthProvider();
        break;
      case 'github':
        provider = new GithubAuthProvider();
        break;
      default:
        throw new Error(`Provider ${name} is not supported`);
    }

    try {
      await signInWithPopup(auth, provider);

      window.location.href = `${window.location.origin}/dashboard`;
    } catch (error) {
      console.log('Error signing in with provider', error.message);
      handleError(error);
    }

    return new Promise(() => null);

    // return (
    //   supabase.auth
    //     .signInWithOAuth({
    //       provider: name,
    //       options: {
    //         redirectTo: `${window.location.origin}/dashboard`,
    //       },
    //     })
    //     .then(handleError)
    //     // Because `signInWithOAuth` resolves immediately we need to add this so that
    //     // it never resolves (component will display loading indicator indefinitely).
    //     // Once social signin is completed the page will redirect to value of `redirectTo`.
    //     .then(() => {
    //       return new Promise(() => null);
    //     })
    // );
  };

  // const signinWithMagicLink = (email) => {
  //   return supabase.auth
  //     .signInWithOtp({
  //       email,
  //       options: {
  //         emailRedirectTo: `${window.location.origin}/dashboard`,
  //       },
  //     })
  //     .then(handleError);
  // };

  const signout = async () => {
    signOut(auth)
      .catch((error) => {
        handleAuth(error);
      });
    // return supabase.auth.signOut().then(handleError);
  };

  const sendPasswordResetEmailFunction = async (email) => {
    return sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/auth/changepass`,
    })
      .then(handleError)
      .catch((error) => {
        handleError(error);
      });
    // return supabase.auth
    //   .resetPasswordForEmail(email, {
    //     redirectTo: `${window.location.origin}/auth/changepass`,
    //   })
    //   .then(handleError);
  };

  const confirmPasswordResetFunction = async (oobCode, password) => {
    try {
      await confirmPasswordReset(auth, oobCode, password);
      console.log(`Password reset successful`);
    } catch (error) {
      handleError(error);
    }
    // return supabase.auth.updateUser({ password }).then(handleError);
  };

  const updatePasswordFunction = async (password) => {
    const user = auth.currentUser;

    try {
      await updatePassword(user, password);
      console.log('Password updated successfully');
    } catch (error) {
      handleError(error);
    }
    // return supabase.auth.updateUser({ password }).then(handleError);
  };

  // Update auth user and persist data to database
  // Call this function instead of multiple auth/db update functions
  const updateProfile = async (data) => {
    const { email, ...other } = data;
    const user = auth.currentUser;

    try {
      if (email && email !== user.email) {
        await updateEmail(user, email);
        throw new Error(
          'To complete this process click the confirmation links sent to your new and old email addresses',
        );
      }

      // Persist all other data to the database
      if (Object.keys(other).length > 0) {
        await updateUser(user.uid, other);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getFirebaseIdToken = async () => {
    const currentUser = auth.currentUser

    if (currentUser) {
      const token = await currentUser.getIdToken()
      return token
    } else {
      throw new Error("User is not authenticated");
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        
        setUser(currentUser);
      } else {
        setUser(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    signup,
    signin,
    signinWithProvider,
    signout,
    sendPasswordResetEmailFunction,
    confirmPasswordResetFunction,
    updatePasswordFunction,
    updateProfile,
    getFirebaseIdToken
  };
}

// A Higher Order Component for requiring authentication
export const requireAuth = (Component) => {
  return function RequireAuthHOC(props) {
    // Get authenticated user
    const auth = useAuth();
    // const auth = { user: true };
    const navigate = useNavigate();

    useEffect(() => {
      // Redirect if not signed in
      if (auth.user === false) {
        navigate('/auth/signin', { replace: true });
      }
    }, [auth, navigate]);

    // Show loading indicator
    // We're either loading (user is `null`) or about to redirect from above `useEffect` (user is `false`)
    if (!auth.user) {
      return <PageLoader />;
    }

    // Render component now that we have user
    return <Component {...props} />;
  };
};

// Throw error from auth response, so it can be caught and displayed by UI
function handleError(error) {
  if (error) throw error;
  return error;
}
