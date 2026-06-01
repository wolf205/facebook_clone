import sequelize from "../config/database.js";
import { logger } from "../utils/logger.js";

export const connectToMySQL = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Successfully connected to MySQL database.");
  } catch (error) {
    logger.error("Failed to connect to MySQL database.", {
      error: error.message,
    });
  }
};

export const initializeMySQL = async () => {
  try {
    await sequelize.sync({ alter: true });
    logger.info("MySQL database synchronized successfully.");
  } catch (error) {
    logger.error("Failed to synchronize MySQL database.", {
      error: error.message,
    });
  }
};
