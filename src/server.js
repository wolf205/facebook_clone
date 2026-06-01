import app from "./app.js";
import { connectToMySQL, initializeMySQL } from "./shared/database/mysql.js";
import { env } from "./shared/config/env.js";
import { logger } from "./shared/utils/logger.js";

const startServer = async () => {
  try {
    await connectToMySQL();
    await initializeMySQL();

    app.listen(env.PORT, () => {
      logger.info(
        `Server is running on port ${env.PORT} in ${env.NODE_ENV} mode.`,
      );
    });
  } catch (error) {
    logger.error("Error starting server:", error);
  }
};

startServer();
