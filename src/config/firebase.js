import admin from "firebase-admin";

const hasPlaceholderValue = (value) => {
  if (!value) {
    return true;
  }
  return value.includes("your_") || value.includes("YOUR_");
};

const initializeFirebase = () => {
  if (admin.apps.length) {
    return;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson && !hasPlaceholderValue(serviceAccountJson)) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (
    hasPlaceholderValue(projectId) ||
    hasPlaceholderValue(clientEmail) ||
    hasPlaceholderValue(privateKey)
  ) {
    throw new Error("Firebase credentials are not configured");
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
};

export const getFirebaseAuth = () => {
  initializeFirebase();
  return admin.auth();
};

export default admin;
