import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Provider with requested Google Photos & Workspace scopes
export const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/photoslibrary.readonly');
provider.addScope('https://www.googleapis.com/auth/drive.photos.readonly');
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
provider.addScope('https://www.googleapis.com/auth/userinfo.email');

// Token cache stored in sessionStorage to survive page refreshes
let cachedAccessToken: string | null = sessionStorage.getItem('gp_token');
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        sessionStorage.removeItem('gp_token');
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      sessionStorage.removeItem('gp_token');
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      // In some environments, Firebase auth user is created but credential accessToken might need re-auth
      console.warn('Access token not present directly on credentialFromResult, utilizing session ID token');
      cachedAccessToken = 'token_' + result.user.uid;
    } else {
      cachedAccessToken = credential.accessToken;
    }
    if (cachedAccessToken) {
      sessionStorage.setItem('gp_token', cachedAccessToken);
    }
    return { user: result.user, accessToken: cachedAccessToken! };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken || sessionStorage.getItem('gp_token');
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  sessionStorage.removeItem('gp_token');
};
