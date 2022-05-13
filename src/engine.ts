import Context from './context';
import ClosureRegistry from './closure/closure-registry';

export default class Engine {
  closures: ClosureRegistry;

  private readonly services: Object;

  constructor() {
    this.services = {};
    this.closures = new ClosureRegistry(this);
  }

  add(definition: any, options: any) {
    const closureOrClosures = this.closures.parse(definition);

    // if I get an array, then I assume that it is an array of definitions, and add each of them
    if (Array.isArray(closureOrClosures)) {
      closureOrClosures.forEach(clos => this.closures.add(clos.name, clos, options));
    } else {
      // non-array case
      this.closures.add(closureOrClosures.name, closureOrClosures, options);
    }
  }

  reset() {
    this.closures = new ClosureRegistry(this);
  }

  process(closure: any, fact: any) {
    if (typeof closure === 'string') {
      closure = this.closures.get(closure);
    }

    const context = new Context(this);
    try {
      return Promise.resolve(closure.process(fact, context)).then(fact => {
        context.fact = fact;
        return context;
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
