export const passwordHasher = async (
  password: string
): Promise<{ saltHex: string; hashedPassword: string }> => {
  //Generate salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  //Convert the salt and password into ArrayBuffers
  const passwordBuffer = new TextEncoder().encode(password);

  //Concatenate the salt and password
  const saltedPasswordBuffer = new Uint8Array([...salt, ...passwordBuffer]);

  //Hash the salted password using SHA-256
  const hashedBuffer = await crypto.subtle.digest(
    "SHA-256",
    saltedPasswordBuffer
  );

  //Convert the salt ans hashed password to hex strings
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const hashedPassword = Array.from(new Uint8Array(hashedBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return {
    saltHex,
    hashedPassword,
  };
};

export const passwordChecker = async (
  providedPassword: string,
  storedPassword: string
): Promise<boolean> => {
  // Extract the salt and hashed password from the stored password
  const [saltHex, storedHashedPassword] = storedPassword.split(":");

  // Convert the salt from hex to a Uint8Array
  const salt = new Uint8Array(
    saltHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  // Convert the provided password into an ArrayBuffer
  const passwordBuffer = new TextEncoder().encode(providedPassword);

  // Concatenate the salt and the provided password
  const saltedPasswordBuffer = new Uint8Array([...salt, ...passwordBuffer]);

  // Hash the salted password using SHA-256
  const hashedBuffer = await crypto.subtle.digest(
    "SHA-256",
    saltedPasswordBuffer
  );

  // Convert the hashed buffer to a hex string
  const hashedPassword = Array.from(new Uint8Array(hashedBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (hashedPassword !== storedHashedPassword) {
    return false;
  }

  return true;
};
