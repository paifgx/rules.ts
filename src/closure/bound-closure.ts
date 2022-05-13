import Closure from './closure';
import Context from '../context';

export default class BoundClosure extends Closure {
  private readonly parameters: Object;
  private closure: Closure;

  constructor(name: String, closure: Closure, parameters?: Object) {
    super(name);
    this.closure = closure;
    this.parameters = parameters || {};
  }

  process(fact: Object, context: Context) {
    const newContext = context.bindParameters(this.parameters);
    return this.closure.process(fact, newContext);
  }
}
