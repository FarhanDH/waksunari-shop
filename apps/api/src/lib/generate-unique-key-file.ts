export const generateUniqueKeyFile = async (key: string, username: string) => {
  const uniqueKey = `${username}-${Date.now()}-${key}`;
  return uniqueKey;
};
