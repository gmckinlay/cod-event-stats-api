# CoD Event Stats API

## Getting started

1. Clone this repository and open it

```bash
$ git clone https://github.com/gmckinlay/cod-event-stats-api.git
$ cd cod-event-stats-api
```
2. Copy .env.template to .env and set a valid CoD API username and password in the file. The .env file is included in the .gitignore and should never be commited.

3. Install dependencies

```bash
$ yarn
```

4. Launch the dev mode

```bash
$ yarn dev
```

## Scripts

- `yarn dev`. Runs the project in dev mode, will restart with every code change.
- `yarn build`. Compiles the project to the `./dist` folder.
- `yarn typecheck`. Checks the typings of the project. Gets executed before trying to create a new commit but can be run manually.
- `yarn start`. Runs the compiled stats api, remember to run `yarn build` before lauching the app.
- `yarn lint`. Runs ESLint, append `--fix` to resolve issues.
