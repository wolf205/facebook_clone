import "dotenv/config";

const requiredEnvVars = [
  "PORT",
  "DB_NAME",
  "DB_USER",
  "DB_HOST",
  "JWT_SECRET",
  "NODE_ENV",
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} is required but not set.`);
  }
});

export const env = {
  PORT: process.env.PORT || 5000,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET,
};
