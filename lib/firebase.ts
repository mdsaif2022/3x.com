// Firebase configuration - using dynamic imports to avoid undici issues
let app: any = null;
let db: any = null;
let auth: any = null;

// Initialize Firebase only when needed (server-side)
export const initializeFirebase = async () => {
  if (typeof window === 'undefined' && !app) {
    try {
      const { initializeApp } = await import('firebase/app');
      const { getFirestore } = await import('firebase/firestore');
      const { getAuth } = await import('firebase/auth');

      const firebaseConfig = {
        apiKey: "your-api-key",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "123456789",
        appId: "your-app-id"
      };

      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
    } catch (error) {
      console.warn('Firebase initialization failed, using demo data:', error);
    }
  }
  return { app, db, auth };
};

// Export initialized instances
export { db, auth };
export default app;
