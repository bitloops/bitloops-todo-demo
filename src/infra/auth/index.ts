// import FirebaseAuthProvider from './firebase';
// import MockAuthProvider from './mock';

export type UserData = {
  id: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  userUniqueId: string; // email or phone number
  photoURL?: string;
  idToken: string;
  refreshToken: string;
};

export interface IAuthProvider {
  clearAuthentication: () => void;
  onAuthStateChanged: (callback: (user?: UserData) => void) => any;
  sendSignInLinkToEmail: (email: string) => void;
  signInWithGoogle: () => void;
  sendPhoneVerificationCode: (phoneNumber: string) => Promise<any>;
  verifyPhoneCode: (code: string) => Promise<any>;
  getFreshToken: () => Promise<string>;
}

export interface IMockAuthProvider extends IAuthProvider {
  fakeOnAuthStateChanged: (user: UserData) => void;
}
