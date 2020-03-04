/*
  a decorator to attach standard log behaviour to action
  bypass: when logger instance is not available in context
  augment: parse action name and added to action meta to be chained in sub-actions
  after: log success event, with options to include param and result
  error: log error event, with option to parse error
 */
// note: it is simpler to implement this without addHooks helper
const eventLog = ({
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
    // e.stack can be parsed via errorParse
    logger.error(
      { ...meta, event, error: errorParse ? errorParse(e) : e },
      e.message,
    );

    throw e;
  }
};

export default eventLog;
