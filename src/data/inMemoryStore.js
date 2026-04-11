const store = new Map();

const createUserBucket = () => ({
  goals: [],
  habits: [],
  visionItems: [],
  dreams: [],
});

export const getUserKey = (req) => String(req?.user?.id ?? req?.user?.email ?? 'anonymous');

export const getUserBucket = (userKey) => {
  if (!store.has(userKey)) {
    store.set(userKey, createUserBucket());
  }

  return store.get(userKey);
};

export const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
