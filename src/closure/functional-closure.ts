import Closure from './closure';
import Context from '../context';

/**
 * A simple closure that's implemented through a function that is defined
 * in beforehand.
 *
 * @type {FunctionalClosure}
 */
export default class FunctionalClosure extends Closure {
  private fn: Function;

  /**
   * @param  {String}   name       the name of the closure
   * @param  {Function} fn         a function providing an implementation
   *                               for this closure.
   * @param  {Object}   options
   */
  constructor(name: string, fn?: Function, options?: object) {
    super(name, options);
    if (typeof fn !== 'function') {
      throw new TypeError(`Implementation for provided closure '${name}' is not a function`);
    }
    this.fn = fn;
  }

  /**
   * Evaluates the block against a fact promise
   * @param {Object} fact 						a fact
   * @param {Context} context					an execution context.
   *
   * @return {Object|Promise} a promise that will be resolved to some result
   */
  process(fact: object, context: Context) {
    return this.fn.call(this, fact, context);
  }
}
