const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY!,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID!,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL!,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.REACT_APP_FIREBASE_APP_ID!,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const SERVER_URL = process.env.REACT_APP_ERMIS_GATEWAY_HOST_URL;

export default firebaseConfig;
