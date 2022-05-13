import Closure from './closure';
import Context from '../context';
import { nowOrThen, raise } from '../utils';

/**
 * This is a closure composite that will reduce the fact execution through
 * a list of component closures. The result of each closure execution will
 * be used as fact for the next closure.
 *
 * @type {ClosureReducer}
 */
export default class ClosureReducer extends Closure {
  private closures: Closure[];

  reduceStrategies = {
    and: (prev, next) => prev && next,
    or: (prev, next) => prev || next,
    // This strategy requires the previous fact, while the others require the original to process conditions
    last: (_, next) => next,
  };

  constructor(name: string, closures: Closure[], options: object) {
    super(name, options);
    this.closures =
      closures || raise(`Cannot build closure reducer [${name}] without closure chain`);
  }

  process(fact: object, context: Context) {
    return this.reduce(0, fact, context);
  }

  reduce(index: number, fact: object, context: Context) {
    if (this.closures.length <= index) {
      return fact;
    }

    return nowOrThen(this.closures[index].process(fact, context), newFact => {
      if (this.options.matchOnce && context.currentRuleFlowActivated) {
        return newFact;
      }
      if (this.options.strategy && this.options.strategy !== 'last') {
        const reduceStrategy = this.reduceStrategies[this.options.strategy];
        return this.closures.length <= index + 1
          ? newFact
          : reduceStrategy(newFact, this.reduce(index + 1, fact, context));
      }
      return this.reduceStrategies.last(newFact, this.reduce(index + 1, newFact, context));
    });
  }
}
