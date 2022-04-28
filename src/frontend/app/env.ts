/*
 * This program was written by Tim Sullivan
 */

// Application will fail if environment variables are not set

export const checkEnvironment = () => {
  if (!process.env.PORT) {
    const errMsg = 'PORT environment variable is not defined';
    console.error(errMsg);
    throw new Error(errMsg);
  }

  if (!process.env.SMALLAPP_SESSION_SECRET) {
    const errMsg = 'SMALLAPP_SESSION_SECRET environment variable is not defined';
    console.error(errMsg);
    throw new Error(errMsg);
  }

  if (!process.env.SMALLAPP_API_ADDR) {
    const errMsg = 'SMALLAPP_API_ADDR environment variable is not defined';
    console.error(errMsg);
    throw new Error(errMsg);
  }
};
