# Express REST API and WebSocket Boilerplate

Opinionated boilerplate for a Node.js REST API and WebSocket server app

## Features

- ES Modules (ECMAScript)
- No transpilers
- Automatic REST API routing

### Tech Stack

- REST: [Express](https://expressjs.com)
- WebSockets: [ws](https://github.com/websockets/ws)
- Security: [helmet](https://helmetjs.github.io/) / [cors](https://github.com/expressjs/cors)
- HTTP Compression: [gzip](https://github.com/expressjs/compression)
- Database: [Knex](https://knexjs.org/)
- Logging: [winston](https://github.com/winstonjs/winston) ([Slack integration](winston-slack-webhook-transport))
- Config: [dotenv](https://github.com/motdotla/dotenv)
- Linting: [ESLint](https://eslint.org/) ([Airbnb](https://www.npmjs.com/package/eslint-config-airbnb-base))
- Formatting: [Prettier](https://prettier.io/) / [EditorConfig](https://editorconfig.org/)
- Testing: [Jest](https://jestjs.io/)
- Git Hooks: [husky](https://github.com/typicode/husky) / [lint-staged](https://github.com/okonet/lint-staged)

## Getting Started

### Prerequisites

- Node ([v14.17.4](https://nodejs.org))
- NPM (v7.20.3)
- Docker (optional | [v20+](https://www.docker.com/get-started))

### Source Code

1. Clone the repo
2. Set Git Hooks permissions: `sudo chmod -R +x .husky`
3. Complete steps in: Appendix > Local Development > [Setup](#setup)
4. Install dependencies: `npm i`
5. Create config: `cp docs/example-config .env`
6. Change your .env config file values (see Appendix > [Config](#config))

### Development

1. Use required Node.js: `nvm use`
2. Start app in watch mode: `npm run dev`
   - REST API available at: http://localhost:3000
   - WebSockets available at: ws://localhost:3000 (see Appendix > Local Development > [Tools](#tools))

>When file changes are detected, the app will automatically rebuild/restart

#### Linting

- Check ESLint rules: `npm run lint`
- Fix ESLint errors: `npm run lint:fix`
- Check code formatting: `npm run prettier`
- Fix Prettier formatting errors: `npm run prettier:fix`

#### Testing

- One and done: `npm test`
- To run with watch: `npm run test:watch`
- Coverage report: `npm run test:coverage`

#### Debugging

> Note: Requires [Visual Studio Code](https://code.visualstudio.com/)

1. Launch VS debugger: <kbd>F5</kbd>
2. Switch to Debug Console: <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>Y</kbd>

## Docker

### Development
If you prefer to develop from within Docker instead of natively. This is not recommended, due to the performance hit, but it can be useful in a pinch

```bash
npm run docker:dev
```

### Tests
Run all the tests from within Docker

```bash
npm run docker:test
```

### Production
When running the app in a production environment, within Docker

```bash
npm run docker:prod
```

## Appendix

### Config
The docs/example-config file contains all the config options used by this app:

#### Server
| Environment Variable | Type | Description |
|---|---|---|
| SERVER_PORT | number | The port the HTTP server listens on |
| SERVER_HEARTBEAT_INTERVAL | number | The number of milliseconds a WebSocket waits before sending another new ping to the client and checking for a pong from the client |
| SERVER_HEARTBEAT_THRESHOLD | number | The number of times a client can miss sending a pong to the WebSocket before it is disconnected |

#### Logging
| Environment Variable | Type | Description |
|---|---|---|
| LOGGER_SLACK_WEBHOOK | string | Webhook URL for logging to Slack (see Appendix > Logging > [Slack](#slack)) |
| LOGGER_SLACK_LEVEL | string | The level of error to log to Slack |

#### Database
| Environment Variable | Type | Description |
|---|---|---|
| DB_TYPE | string | The type of database. For a list of values, see: Appendix > [Database](#database) |
| DB_HOST | string | The address of the database server (e.g., localhost) |
| DB_PORT | number | The port of the database server |
| DB_NAME | string | The name of the database |
| DB_USERNAME | string | The username for connecting to the database |
| DB_PASSWORD | string | The password for connecting to the database |
| DB_POOL_MIN | number | Minimum number of connections in the pool |
| DB_POOL_MAX | number | Maximum number of connections in the pool |
| DB_LOGGING | boolean | When true, database logging is turned on |

### Local Development

#### Setup

1. Install nvm: https://github.com/nvm-sh/nvm
2. Install the Node.js version required by this app: `nvm install`
   1. NVM will determine the required Node version using the .nvmrc file
   2. NVM will install the required Node version if it isn't installed
   3. NVM will set your current Node version to the one required
3. Upgrade NPM: `npm i -g npm@7.20.3`

#### Git Hooks

- pre-commit: running `git commit` will trigger `npm run lint:staged` which will lint all files currently staged in Git. If linting fails, the commit will be cancelled
- post-commit: running `git commit` will trigger `git status` after the commit completes

#### Tools

##### REST API

For testing REST API endpoints:

1. Download [Postman](https://www.postman.com)
2. Import the docs/example.postman.json collection

This collection includes requests for the example controller.

##### WebSockets

For testing WebSockets, use [wscat](https://github.com/websockets/wscat)

1. Install: `npm i -g wscat`
2. Connect: `wscat -c "ws://localhost:3000"`
3. Enter any message you'd like to send to the WebSocket and press Enter

### Logging
When you want to log something in the app, import utils/logger. This uses Winston under the hood, so take a look at [Winston's documentation](https://github.com/winstonjs/winston) if you want an in depth look at all the params you can pass to the logger.

Typical usage:

```javascript
logger.debug("Only logged in local");
logger.info("Logged in all environments");
logger.warn("Logged in all environments");
logger.error("Logged in all environments");
```

>HTTP requests are automatically logged via [morgan](https://github.com/expressjs/morgan)

#### Slack
The logger is configured to log to the console in every environment. It's also ready to log to Slack in addition to the console, if desired. To enable this functionality:

1. Add a webhook to Slack: https://api.slack.com/messaging/webhooks
2. Set the `LOGGER_SLACK_WEBHOOK` environment variable to the resulting URL
3. Set the `LOGGER_SLACK_LEVEL` environment variable to the desired error level you want logged to Slack (e.g., `info`)

### REST API

#### Adding a new REST endpoint

1. Copy controllers/example.js and controllers/example.validation.js, renaming "example" to whatever your new endpoint will be (.e.g, "account")
2. Within account.example.js:
   1. Rename the class from `ExampleController` to `AccountController`
   2. Within the `constructor` change: `this.root = "example"` to `"this.root = "account"`. This value sets the endpoint in your API call (e.g., `http://localhost:3000/account`)
   3. Within the `constructor`, modify `this.paths` adding whatever endpoints you want to add the new "account" endpoint (e.g., `http://localhost:3000/account/myNewEndpoint`)
3. Add your new account.js controller as an export to controllers/index.js. This will allow Express to automatically pick up your new controller and add all your endpoints to the HTTP server

#### Authorization

Within each controller, for each endpoint, you can specify an array of required roles. When a user attempts to access an endpoint, their roles are verified before granting access. If the array is empty for an endpoint, that particular endpoint is open to the public. See controllers/example.js for examples

### WebSockets

#### Hearbeat

Used to keep the connection between the WebSocket server and client alive, and to kill hanging connections: a client connection that is no longer responsive, but has not been disconnected. Each connection has its own heartbeat. The heartbeat starts immediately after a client successfully connects to the server:

1. Every *n* seconds (SERVER_HEARTBEAT_INTERVAL) the server sends a "ping" to the client, and increments the ping count
2. When the client receives a "ping" it must immediately responds with a "pong"
3. When the server receives a "pong" from the client it resets the ping count
4. If the ping count ever reaches *n* threshold (SERVER_HEARTBEAT_THRESHOLD), the number of missed pings allowed, the connection is terminated

The amount of time a client has to respond before being disconnected is INTERVAL * THRESHOLD. Example: if INTERVAL = 15 and THRESHOLD = 2, then the client has 30 seconds to respond before their WebSocket is closed

### Database

By default, this boilerplate comes configured to use SQLite (in memory) because it doesn't require any separate setup out of the box -- great for demoing this apps functionality. To configure this app to use a databse other than SQLite:

- Change the DB_TYPE in .env to a [supported database](https://knexjs.org/)
- Configure other database environment variables (e.g., DB_HOST, DB_PORT) in your .env
- Remove SQLite from this app's dependencies: `npm uninstall sqlite3`
