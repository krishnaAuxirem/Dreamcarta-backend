import { getFirebaseAuth } from "../config/firebase.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is not configured");
  }
  return "dreamcarta-local-dev-jwt-secret";
};

const extractBearerToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    if (token) {
      return token;
    }
  }

  // Allow body idToken for firebase-login calls from clients that don't send Authorization header.
  if (typeof req.body?.idToken === "string" && req.body.idToken.trim()) {
    return req.body.idToken.trim();
  }

  return null;
};

const mapFirebaseAuthError = (error) => {
  const code = error?.code || "";
  if (code === "auth/id-token-expired") {
    return "Firebase token expired ❌";
  }
  if (code === "auth/argument-error") {
    return "Invalid Firebase token format ❌";
  }
  if (code === "auth/invalid-id-token") {
    return "Invalid Firebase token ❌";
  }
  return "Unauthorized ❌";
};

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const idToken = extractBearerToken(req);
    if (!idToken) {
      return res.status(401).json({ message: "No token provided ❌" });
    }

    const auth = getFirebaseAuth();
    const decoded = await auth.verifyIdToken(idToken);
    req.firebaseUser = decoded;

    next();
  } catch (error) {
    if (error.message === "Firebase project id is not configured") {
      return res.status(500).json({ message: "Firebase project id not configured ❌" });
    }
    return res.status(401).json({ message: mapFirebaseAuthError(error) });
  }
};

const firebaseAuthMiddleware = async (req, res, next) => {
  try {
    const token = extractBearerToken(req);
    if (!token) {
      return res.status(401).json({ message: "No token provided ❌" });
    }

    // Prefer Firebase token verification for migrated clients.
    try {
      const auth = getFirebaseAuth();
      const decoded = await auth.verifyIdToken(token);
      req.firebaseUser = decoded;

      const user = await User.findOne({ where: { firebaseUid: decoded.uid } });
      if (!user) {
        return res.status(401).json({
          message: "User not onboarded. Call /api/auth/firebase-login first ❌",
        });
      }

      req.user = {
        id: user.id,
        email: user.email,
        firebaseUid: user.firebaseUid,
        role: user.role,
        isActive: user.isActive,
      };

      return next();
    } catch (firebaseError) {
      // Backward compatibility: accept existing JWT login tokens.
      const decodedJwt = jwt.verify(token, getJwtSecret());
      if (decodedJwt?.id) {
        const dbUser = await User.findByPk(decodedJwt.id);
        if (!dbUser) {
          return res.status(401).json({ message: "User not found ❌" });
        }

        req.user = {
          ...decodedJwt,
          role: dbUser.role,
          isActive: dbUser.isActive,
        };
      } else {
        req.user = decodedJwt;
      }
      return next();
    }
  } catch (error) {
    if (error.message === "Firebase project id is not configured") {
      return res.status(500).json({ message: "Firebase project id not configured ❌" });
    }
    return res.status(401).json({ message: mapFirebaseAuthError(error) });
  }
};

export default firebaseAuthMiddleware;
