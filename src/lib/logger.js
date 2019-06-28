import pino from 'pino';

export const config = {
  level: process.env.LOG_LEVEL || 'info',
  ...(['development', 'test'].includes(process.env.NODE_ENV)
    ? {
        prettyPrint: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
          errorLikeObjectKeys: ['error'],
        },
      }
    : {}),
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
