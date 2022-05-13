import Closure from './closure';
import { nowOrThen, raise } from '../utils';

export default class Rule extends Closure {
  private condition: any;
  private action: any;

  constructor(name: string, condition, action) {
    super(name);
    this.condition = condition || raise(`Cannot build rule [${name}] without condition closure`);
    this.action = action || raise(`Cannot build rule [${name}] without action closure`);
  }

  /**
   * Executes the actions associated with this rule over certain fact
   * @param {Object} fact 	   				a fact
   * @param {Context} context 				an execution context
   * @param {Context} context.engine	the rules engine
   *
   * @return {Object|Promise} a promise that will be resolved to some result (typically
   *                   such result will be used as next's rule fact)
   */
  process(fact, context) {
    return nowOrThen(this.evaluateCondition(fact, context), matches => {
      if (matches) {
        context.ruleFired(this);
        return this.action.process(fact, context);
      }
      return fact;
    });
  }

  /**
   * Evaluates a condition
   * @param  {Promise} fact 	a fact
   * @param  {Context} engine	an execution context
   *
   * @return {Promise}				a Promise that will be resolved to a truthy/falsey
   */
  evaluateCondition(fact, context) {
    return this.condition.process(fact, context);
  }
}
