export const isValidKey = (key: string) => {
  // TODO: Add better validation
  // const regex = new RegExp("^[a-zA-Z]{2}-[a-zA-Z0-9]{24}$");
  // return regex.test(key);
  return key.trim() !== "";
};
