const simpleLog = ({
  includeParam,
  includeResult,
  errorParse,
} = {}) => action => async (param, meta = {}, context = {}) => {
  const { logger } = context;
  if (!logger) return action(param, meta, context);

  const { name } = action;
  const event = meta.event ? `${meta.event}.${name}` : name;

  try {
    const result = await action(param, { ...meta, event }, context);

    const log = {
      ...meta,
      event,
      ...(includeParam ? { param } : {}),
      ...(includeResult ? { result } : {}),
    };
    logger.info(log, event);

    return result;
  } catch (e) {
    // TODO: option to include error stacks
    logger.error(
      { ...meta, event, error: errorParse ? errorParse(e) : e },
      e.message,
    );

    throw e;
  }
};

export default simpleLog;
