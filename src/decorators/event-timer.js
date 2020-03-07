import addHooks from './helpers/add-hooks';

/**
 * @typedef {import('./types')} StorageHook
 */

/**
 * A decorator to timing action execution time in both success/error cases
  and send metrics using the client attached in context.
 *
 * @param {object} options - Config.
 * @param {StorageHook} options.parseLabel - Function use to include labels that are not directly presented in meta.
 */
const eventTimer = ({ parseLabel = () => {} } = {}) =>
  addHooks({
    bypassHook: (p, m, { metrics }) => !metrics,
    storageHook: (p, m, c, action) => {
      const { metrics } = c;
      const timer = metrics.find({ action, type: 'timer' });
      const stopTimer = timer.start({ ...m, ...parseLabel(p, m, c) });
      return { stopTimer };
    },
    afterHook: (r, p, m, c, a, { stopTimer }) => {
      stopTimer();
    },
    errorHook: (e, p, m, c, a, { stopTimer }) => {
      stopTimer();
    },
  });

export default eventTimer;
