import { posix } from "path";
import httpStatus from "http-status";

import logger from "../utils/logger";

export class BaseController {
  /**
   * Add all paths from this controller to the Express server
   * @param {*} express the Express server
   */
  addExpressPaths(express) {
    this.paths.forEach((x) => {
      const path = posix.join("/", this.root, x.path);

      express[x.verb](path, this.roleCheck(x.roles), this.validate(x.validator), x.handler);

      logger.debug(`${x.verb.toUpperCase()} ${path} [${x.roles.join(",")}]`);
    });
  }

  /**
   * Check to see if the current user has the specified roles for a request
   * @param {string[]} roles the required roles
   * @returns HTTP Status Code 403 if the user does not have the required role
   */
  roleCheck(roles) {
    return (req, res, next) => {
      if (!roles.length) {
        return next();
      }

      if (!req.user || !roles.some((x) => req.user.roles.includes(x))) {
        return res.status(httpStatus.FORBIDDEN).send(httpStatus[httpStatus.FORBIDDEN]);
      }

      next();
    };
  }

  /**
   * Validate the current request using the specified validator
   * @param {*} validator the validator to use
   * @returns HTTP Status Code 400 if validation fails
   */
  validate(validator) {
    return (req, res, next) => {
      if (!validator) {
        return next();
      }

      const errors = validator(req);
      if (errors.length) {
        return res.status(httpStatus.BAD_REQUEST).send(errors);
      }

      next();
    };
  }
}
