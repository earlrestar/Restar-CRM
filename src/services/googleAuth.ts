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

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Basic non-sensitive scopes: NEVER blocked by Google Verification
export const BASIC_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

// Advanced Workspace scopes: used for live Gmail API and Calendar API
export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/calendar.events',
];

// Basic Google Sign-In Provider (Standard, open to all Google accounts)
export const getBasicGoogleProvider = () => {
  const provider = new GoogleAuthProvider();
  BASIC_SCOPES.forEach((scope) => provider.addScope(scope));
  provider.setCustomParameters({ prompt: 'select_account' });
  return provider;
};

// Workspace Google Provider (Requires Google Cloud project test-user or verification)
export const getWorkspaceGoogleProvider = () => {
  const provider = new GoogleAuthProvider();
  BASIC_SCOPES.forEach((scope) => provider.addScope(scope));
  WORKSPACE_SCOPES.forEach((scope) => provider.addScope(scope));
  provider.setCustomParameters({ prompt: 'consent select_account' });
  return provider;
};

// Memory-only access token storage
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthSuccess) onAuthSuccess(user, null);
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export interface AuthDiagnosticError {
  message: string;
  isUnauthorizedDomain?: boolean;
  isUnverifiedApp?: boolean;
  isPopupClosed?: boolean;
  hostname?: string;
  projectId?: string;
}

/**
 * Standard Google Sign-In:
 * Uses basic non-sensitive scopes so any Gmail / Google account can log in immediately
 * without encountering the "Access blocked: has not completed Google verification" error.
 */
export const googleSignIn = async (
  requestWorkspaceScopes: boolean = false
): Promise<{ user: User; accessToken: string | null; hasWorkspaceScopes: boolean }> => {
  try {
    isSigningIn = true;
    const provider = requestWorkspaceScopes ? getWorkspaceGoogleProvider() : getBasicGoogleProvider();
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken || null;
    if (token) {
      cachedAccessToken = token;
    }
    return {
      user: result.user,
      accessToken: token,
      hasWorkspaceScopes: requestWorkspaceScopes,
    };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown-domain';
    const projectId = firebaseConfig.projectId || 'gen-lang-client-0450981798';

    if (error.code === 'auth/unauthorized-domain') {
      const err: AuthDiagnosticError = {
        message: `The domain "${currentHostname}" is not yet authorized in Firebase Authentication.`,
        isUnauthorizedDomain: true,
        hostname: currentHostname,
        projectId,
      };
      throw err;
    }

    if (
      error.message?.includes('verification process') ||
      error.message?.includes('unverified') ||
      error.message?.includes('Access blocked') ||
      error.code === 'auth/operation-not-allowed'
    ) {
      const err: AuthDiagnosticError = {
        message: 'Google requires verification for restricted Gmail/Calendar scopes, or test-user registration in Google Cloud Console.',
        isUnverifiedApp: true,
        projectId,
      };
      throw err;
    }

    if (error.code === 'auth/popup-closed-by-user') {
      const err: AuthDiagnosticError = {
        message: 'Sign-in window was closed before completing authentication.',
        isPopupClosed: true,
      };
      throw err;
    }

    const err: AuthDiagnosticError = {
      message: error.message || 'Unable to connect to Google Account.',
    };
    throw err;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setAccessTokenInMemory = (token: string | null) => {
  cachedAccessToken = token;
};

export const logoutGoogle = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Sign out error:', err);
  } finally {
    cachedAccessToken = null;
  }
};
