import Engine from './engine';

export default class Context {
  private readonly engine: Engine;
  private readonly parameters: Object;
  private readonly rulesFired: Array<any>;

  private _currentRuleFlowActivated: boolean;

  constructor(
    engine: Engine,
    parameters?: object,
    rulesFired?: any[],
    currentRuleFlowActivated?: boolean,
  ) {
    this.engine = engine;
    this.parameters = parameters || {};
    this.rulesFired = rulesFired || [];
    this._currentRuleFlowActivated = !!currentRuleFlowActivated;
  }

  initiateFlow(ruleFlow: any) {
    this._currentRuleFlowActivated = false;
  }

  endFlow() {
    this._currentRuleFlowActivated = true;
  }

  get currentRuleFlowActivated() {
    return this._currentRuleFlowActivated;
  }

  ruleFired(rule: any) {
    this.rulesFired.push(rule);
    this._currentRuleFlowActivated = true;
  }

  /**
   * Creates a new context bound to the new set of parameters
   */
  bindParameters(newParameters: object) {
    const parameters = Object.assign({}, this.parameters, newParameters);
    return new Context(this.engine, parameters, this.rulesFired, this._currentRuleFlowActivated);
  }
}
