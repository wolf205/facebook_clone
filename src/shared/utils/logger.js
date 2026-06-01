export const logger = {
  info: (message, meta = {}) => {
    console.log({
      level: "info",
      timestamp: new Date().toISOString(),
      message,
      ...meta,
    });
  },

  error: (message, meta = {}) => {
    console.error({
      level: "error",
      timestamp: new Date().toISOString(),
      message,
      ...meta,
    });
  },
};
