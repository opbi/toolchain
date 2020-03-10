// @ts-check

/**
 *  exists to make the type file a valid module for tsc
 *
 * @private
 */
export default undefined;

/**
 * @typedef {undefined | null | boolean | bigint | number | string | object | Array | Date } NotFunction
 * @private
 */

/**
 * Param - the arg houses the parameters for the action function logic.
 * It is the first arg in the standard action function signature,
 * and passed to hook functions through standard hook definitions.
 *
 * @typedef {Object.<string, NotFunction>} Param
 *
 * @example
 *   `eventLogger` decorator has option to use afterHook to log Param object
 */

/**
 * Meta - the arg houses the metadata attached to the action function to record where and how it is called.
 * It is the second arg in the standard of action function signature,
 * and passed to hook functions through standard hook definitions.
 *
 * Meta vs Context: meta contains strictly what would be put into the log/metrics.
 *
 * @typedef {Object<string, NotFunction>} Meta
 *
 * @example
 *   `eventLogger` decorator has storeHook parsing the name of the action,
 *   pass it into actionHook to be included in the Meta to call action,
 *   and use afterbook to log all information in the Meta object
 */

/**
 * Context - the rag houses functional instances attached to the action function to make calls outside the function.
 * It is the thrid arg in the standard action function signature,
 * and passed to hook functions through standard hook definitions.
 *
 * @typedef {Object.<string, Array|object|Function>} Context
 *
 * @example
 *   logger, metrics, database client can be attached to the context and being used by errorHooks,
 *   so that errorHooks are not bundled with the clients
 */

/**
 * Action - the decorated action function itself.
 * It is accessible in the hook definition to make decorators
 * to call the action function recursively or modify its args/behaviour.
 *
 * @typedef {Function} Action
 * @param {Param} param
 * @param {Meta} [meta]
 * @param {Context} [context]
 * @returns {any}
 *
 * @example
 *   `errorRetry` decorator calls Action with updated Meta under valid conditions
 *   to mute the first error thrown from the action function
 *
 *   `eventLogger` decorator parse Action.name in storeHook and automatically attachs it to the log
 */

/**
 * Store - the arg stores temprorary variables to be used by different hooks.
 * It is produced in the storeHook and then passed as the last arg of beforeHook, actionHook, afterHook, errorHook.
 *
 *@typedef {Object.<string, any>} Store
 *
 * @example
 *   `eventLogger` decorator parse Action.name to `event` and put it in the store,
 *   which is later accessed in afterHook to be logged when action call succeeds
 */

/**
 * BypassHook definition.
 *
 * @typedef {Function} BypassHook
 * @param {Param} [param]
 * @param {Meta} [meta]
 * @param {Context} [context]
 * @returns {boolean} - If the condition is met to bypass the decorator.
 *
 * @example
 *   `eventLogger` will bypass if logger instance is not presented in the context
 */

/**
 * BypassHookMethod.
 *
 * @typedef {Function} BypassHookMethod
 * @param {Param} [param]
 * @param {Meta} [meta]
 * @param {Context} [context]
 * @returns {any}
 */

/**
 * StoreHook definition.
 *
 * @typedef {Function} StoreHook
 * @param {Param} [param]
 * @param {Meta} [meta]
 * @param {Context} [context]
 * @param {Action} [action]
 * @returns {object} - The values/instances put in temporary store to be accessed by other hooks.
 */

/**
 * StorageHookMethod.
 *
 * @template T
 * @typedef {Function} StorageHookMethod<T>
 * @param {Param} [param]
 * @param {Meta} [meta]
 * @param {Context} [context]
 * @param {Action} [action]
 * @returns {T}
 */

/**
 * BeforeHook definition.
 *
 * @typedef {Function} BeforeHook
 * @param {Param} [param]
 * @param {Meta} [meta]
 * @param {Context} [context]
 * @param {Action} [action]
 * @param {Store} [store]
 *
 * @example
 *   BeforeHook can be used to do param validation
 */

/**
 * ActionHook definition.
 *
 * @typedef {Function} ActionHook
 * @param {Param} [param]
 * @param {Meta} [meta]
 * @param {Context} [context]
 * @param {Action} [action]
 * @param {Store} [store]
 * @returns {Function} The augumented action with updated args. It shouldn't affect the expected result.
 */

/**
 * AfterHook definition.
 *
 * @typedef {Function} AfterHook
 * @param {any} [result]
 * @param {Param} [param]
 * @param {Meta} [meta]
 * @param {Context} [context]
 * @param {Action} [action]
 * @param {Store} [store]
 */

/**
 * AfterHookMethod.
 *
 * @typedef {Function} AfterHookMethod
 * @param {any} [result]
 * @param {Param} [param]
 * @param {Meta} [meta]
 * @param {Context} [context]
 * @param {Action} [action]
 */

/**
 * ErrorHook definition.
 *
 * @typedef {Function} ErrorHook
 * @param {Error|object} [error]
 * @param {Param} [param]
 * @param {Meta} [meta]
 * @param {Context} [context]
 * @param {Action} [action]
 * @param {Store} [store]
 * @returns {void|undefined|any} If anything other than void/undefined is returned, it would be returned as the reuslt of the decorated action.
 */

/**
 * ErrorHookMethod.
 *
 * @template T
 * @typedef {Function} ErrorHookMethod<T>
 * @param {Error|object} [error]
 * @param {Param} [param]
 * @param {Meta} [meta]
 * @param {Context} [context]
 * @param {Action} [action]
 * @returns {T}
 */

/**
 * Decorator definition.
 *
 * @typedef {Function} Decorator
 * @param {Action} action
 * @returns {Action}
 */
