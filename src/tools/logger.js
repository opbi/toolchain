import pino from 'pino';

const devOrTestConfig = {
  prettyPrint: {
    colorize: true,
    translateTime: 'SYS:HH:MM:ss',
    ignore: 'pid,hostname',
    errorLikeObjectKeys: ['error'],
  },
};

const prodConfig = {
  timestamp: false,
  base: null,
  messageKey: 'message',
  useLevelLabels: true,
};

const devOrTestEnv = ['development', 'test'].includes(process.env.NODE_ENV);

export const config = {
  level: process.env.LOG_LEVEL || 'info',
  ...(devOrTestEnv ? devOrTestConfig : prodConfig),
};

const logger = pino(config);

export default logger;

// CONDITION: when the system needs to process sensitive data
// TODO: use pino-noir
// OUTCOME: mask sensitive data

// CONDITION: when adding flag system
// TODO: use pino-arborsculpture
// OUTCOME: control log level at runtime

// CONDITION: when creating debuggable lib modules
// TODO: config pino-debug
// OUTCOME: lib modules have their own debugger namespaces
