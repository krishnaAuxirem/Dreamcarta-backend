import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ALLOWED_ROLES = ["user", "mentor", "admin"];

const normalizeRole = (roleValue, fallback = "user") => {
  const normalized = String(roleValue || "").trim().toLowerCase();
  return ALLOWED_ROLES.includes(normalized) ? normalized : fallback;
};

const sanitizeUser = (userInstance) => {
  const user = userInstance?.toJSON ? userInstance.toJSON() : userInstance;
  if (!user) {
    return user;
  }
  delete user.password;
  return user;
};

// ✅ REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password required ❌" });
    }

    const requestedRole = normalizeRole(role, "user");
    console.log("Register role:", role, "=>", requestedRole);

    // check existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: requestedRole,
      isActive: true,
    });

    res.status(201).json({
      message: "User registered successfully ✅",
      user: sanitizeUser(user),
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error ❌" });
  }
};

// ✅ LOGIN
export const loginUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Missing request body ❌" });
    }
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required ❌" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "This account was created with Google/Firebase login. Use social login instead ❌",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials ❌" });
    }

    const dbRole = normalizeRole(user.role, "user");

    if (role) {
      const requestedRole = normalizeRole(role, "invalid");
      console.log("Login role:", role, "=>", requestedRole);
      console.log("DB role:", user.role, "=>", dbRole);
      if (requestedRole === "invalid") {
        return res.status(400).json({ message: "Invalid login role ❌" });
      }

      if (dbRole !== requestedRole) {
        return res.status(403).json({
          message: `Login as ${dbRole} only ❌`,
        });
      }
    }

    if (user.isActive === false) {
      return res.status(403).json({ message: "Account is inactive ❌" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: dbRole },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful ✅",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: dbRole,
        isActive: user.isActive,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error ❌" });
  }
};

// ✅ FIREBASE LOGIN/UPSERT
export const firebaseLogin = async (req, res) => {
  try {
    const { uid, email, name, picture } = req.firebaseUser;
    if (!uid || !email) {
      return res.status(400).json({ message: "Invalid Firebase token payload ❌" });
    }

    // 1) Prefer existing user by Firebase UID.
    let user = await User.findOne({ where: { firebaseUid: uid } });

    // 2) If not found, try to link by email to avoid duplicate-email crashes.
    if (!user) {
      user = await User.findOne({ where: { email } });
      if (user) {
        if (user.firebaseUid && user.firebaseUid !== uid) {
          return res.status(409).json({
            message: "This email is already linked to another Firebase account ❌",
          });
        }

        user.firebaseUid = uid;
        user.name = name || user.name;
        user.profilePic = picture || user.profilePic;
        await user.save();
      }
    }

    // 3) Create a new user only when neither UID nor email exists.
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        name: name || email.split("@")[0],
        profilePic: picture || null,
        role: 'user',
        isActive: true,
      });
    }

    // Keep profile info fresh on each login.
    user.email = email || user.email;
    user.name = name || user.name;
    user.profilePic = picture || user.profilePic;
    user.role = normalizeRole(user.role, 'user');
    if (typeof user.isActive !== 'boolean') {
      user.isActive = true;
    }
    await user.save();

    if (user.isActive === false) {
      return res.status(403).json({ message: "Account is inactive ❌" });
    }

    // Keep response shape same as normal login for frontend compatibility.
    const token = jwt.sign(
      { id: user.id, email: user.email, firebaseUid: user.firebaseUid, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Firebase login successful ✅",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.log("Firebase login error:", error);
    res.status(500).json({ message: "Firebase login failed ❌" });
  }
};