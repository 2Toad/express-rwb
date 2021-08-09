import { BaseController } from "./controller-base";
import { ControllerPath } from "./controller-path";
import validate from "./example.validation";

export class ExampleController extends BaseController {
  constructor(express) {
    super();

    this.root = "example";
    this.paths = [
      new ControllerPath(this.echo, "echo", "post", [], validate.echo),
      new ControllerPath(this.requireAdminRole, "auth/test", "get", ["admin"]),
    ];

    this.addExpressPaths(express);
  }

  async echo(req, res) {
    const { input } = req.body;
    res.send(input);
  }

  async requireAdminRole() {
    // This will never be hit because user doesn't have admin role
  }
}
