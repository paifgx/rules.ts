import ClosureReducer from './closure-reducer';
import { nowOrThen } from '../utils';

export default class RuleFlow extends ClosureReducer {
  process(fact, context) {
    context.initiateFlow();
    return nowOrThen(super.process(fact, context), fact => {
      context.endFlow();
      return fact;
    });
  }
}
