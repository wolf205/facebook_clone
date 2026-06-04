import app from "./app.js";
import { connectToMySQL, initializeMySQL } from "./shared/database/mysql.js";
import { setupAssociations } from "./shared/database/associations.js";
import { env } from "./shared/config/env.js";
import { logger } from "./shared/utils/logger.js";
import User from "./modules/users/user.model.js";
import Session from "./modules/auth/session.model.js";

const startServer = async () => {
  try {
    await connectToMySQL();
    await setupAssociations();
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
