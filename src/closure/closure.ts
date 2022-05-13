import Context from '../context';
import Engine from '../engine';
import BoundClosure from './bound-closure';

export default abstract class Closure {
  protected readonly name: String;
  protected readonly options: Object;

  protected constructor(name: String, options?: Object) {
    this.name = name;
    this.options = options || {};
  }

  get named() {
    return !!this.name;
  }

  /**
   * Evaluates the closure against a certain fact
   *
   * @param {Object} fact                a fact
   * @param {Context} context            an execution context.
   * @param {Object} context.parameters the execution parameters, if any
   * @param {Engine} context.engine      the rules engine
   *
   * @return {Object|Promise} the result or a promise of such result
   */
  process(fact: Object, context: Context): Object | Promise<Object> {
    throw new Error('This is an abstract closure, how did you get to instantiate this?');
  }

  /**
   * Binds this closure to a set of parameters. This will return a new Closure than
   * when invoked it will ALWAYS pass the given parameters as a fields inside the
   * context.parameters object.
   *
   * @param {String} name - the name, if specified, of the resulting bounded closure
   * @param {Object} parameters - the parameters to bound to the closure
   * @param {Engine} engine - the rules engine instance
   */
  bind(name: String, parameters: Object, engine: Engine) {
    // const missing = (this.options.required || []).find(required => parameters[required] === undefined)
    // if (missing) {
    // 	throw new Error(`Cannot instantiate provided closure '${this.name}'. Parameter ${missing} is unbounded`);
    // }

    // No need to perform any binding, there is nothing to bind
    if (!Object.keys(parameters).length) {
      return this;
    }

    // Replaces parameters that are set as closureParamters with actual closures!
    // TODO: do we really need this? can we do it differently? I hate expanding the options list
    if (this.options.closureParameters) {
      this.options.closureParameters.forEach(parameter => {
        parameters[parameter] = engine.closures.parseOrValue(parameters[parameter]);
      });
    }

    return new BoundClosure(name, this, parameters);
  }
}
