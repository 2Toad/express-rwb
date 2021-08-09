export class ControllerPath {
  constructor(handler, path, verb, roles = [], validator = null) {
    this.handler = handler;
    this.path = path;
    this.verb = verb;
    this.roles = roles;
    this.validator = validator;
  }
}
