import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  // User,
  signInWithPopup,
  sendSignInLinkToEmail,
  GoogleAuthProvider,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';

import system from '../../system';
import { IAuthProvider, UserData } from '..';
import firebaseConfig from '../../../config';

const COUNTRY_CODE = '+30';

// interface FirebaseUser extends User {
//   accessToken?: string;
// }

class FirebaseAuthProvider implements IAuthProvider {
  private app;
  private auth;

  constructor() {
    console.log('Initializing firebase app');
    this.app = initializeApp(firebaseConfig);
    console.log('Initialized firebase app');

    this.auth = getAuth(this.app);
    this.auth.languageCode = system.getSystemLanguage();
  }
  onAuthStateChanged(callback: (userData?: UserData) => any) {
    const mapper = async (data: any) => {
      const idToken = await data?.getIdToken();
      const dtoUserData: UserData = {
        id: data?.uid,
        displayName: data?.displayName,
        userUniqueId: data?.email || data?.phoneNumber,
        email: data?.email,
        phoneNumber: data?.phoneNumber,
        photoURL: data?.photoURL,
        idToken,
        refreshToken: data?.refreshToken,
      };
      if (dtoUserData.userUniqueId) callback(dtoUserData);
      else {
        callback(undefined);
      }
    };
    return onAuthStateChanged(this.auth, mapper);
  }

  clearAuthentication() {
    signOut(this.auth).then(() => console.log('User signed out!'));
  }

  signInWithGoogle() {
    signInWithPopup(this.auth, new GoogleAuthProvider()).then().catch();
    // TODO add error handling when e.g. auth/unauthorized-domain
  }

  sendSignInLinkToEmail(email: string) {
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: `https://${window.location.hostname}/`,
      // This must be true.
      handleCodeInApp: true,
      // dynamicLinkDomain: window.location.hostname
    };
    sendSignInLinkToEmail(this.auth, email, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        localStorage.setItem('emailForSignIn', email);
      })
      .catch((error) => {
        // const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage);
      });
  }

  sendPhoneVerificationCode(phoneNumber: string): Promise<ConfirmationResult> {
    // @ts-ignore
    const appVerifier = window.recaptchaVerifier;
    return signInWithPhoneNumber(this.auth, `${COUNTRY_CODE}${phoneNumber}`, appVerifier);
    // .then(res => {
    //   console.log('sent code', res);
    //   // setChecking(false);
    //   // SMS sent. Prompt user to type the code from the message, then sign the
    //   // user in with confirmationResult.confirm(code).
    //   // setSendPhone(true);
    //   // setStatus(phoneStatuses.NEUTRAL);
    //   // console.log('setSendPhone');
    // }).catch(err => {
    //   console.error('signInWithPhoneNumber error', err);
    // });
  }

  verifyPhoneCode(code: string): Promise<any> {
    console.log('verifying code', code);
    // @ts-ignore
    return (window.confirmationResult as ConfirmationResult)
      .confirm(code)
      .then((result: any) => {
        // User signed in successfully.
        const user = result.user;
        console.log('result', result);
        console.log('user', user);
        return user;
        // ...
      })
      .catch((error: Error) => {
        console.error(error);
        // User couldn't sign in (bad verification code?)
        return error;
      });
  }

  async getFreshToken(): Promise<string> {
    if (!this.auth) {
      throw new Error('Auth is not initialized');
    }
    if (!this.auth.currentUser) {
      throw new Error('User is not signed in');
    }
    return this.auth.currentUser.getIdToken(/* forceRefresh */ true);
  }
}

export default FirebaseAuthProvider;
