import addHooks from './helpers/add-hooks';

/*
  a decorator to attach standard log behaviour to action
  bypass: when logger instance is not available in context
  augment: parse action name and added to action meta to be chained in sub-actions
  after: log success event, with options to include param and result
  error: log error event, with option to parse error
 */
const eventLog = ({ logParam, logResult, errorParser = e => e } = {}) =>
  addHooks({
    bypassHook: (p, m, c) => !c.logger,
    storeHook: (p, meta, c, action) => {
      const { name } = action;
      const event = meta.event ? `${meta.event}.${name}` : name;
      return { event };
    },
    actionHook: (p, meta, c, a, { event }) => a(p, { ...meta, event }, c),
    afterHook: (result, param, meta, { logger }, a, { event }) => {
      const log = {
        ...meta,
        event,
        ...(logParam ? { param } : {}),
        ...(logResult ? { result } : {}),
      };
      logger.info(log, event);
    },
    errorHook: (e, p, meta, { logger }, a, { event }) => {
      logger.error({ ...meta, event, error: errorParser(e) }, e.message);
    },
  });

export default eventLog;
