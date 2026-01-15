# News Aggregator API

Lightweight Express API for fetching and managing news and user preferences. This README explains project structure, how to run the server, how to run tests, and current known issues with tests plus recommended fixes.

## Project structure

- `app.js` - Express application (exports the app for testing).
- `index.js` - Entrypoint that connects to MongoDB and starts the server.
- `controllers/` - Request handlers for auth, home, and news.
- `models/` - Mongoose models for `User` and `News`.
- `routes/` - Express routes mounted by `app.js`.
- `test/` - Tap tests (integration-style using `supertest`).

## Requirements

- Node.js 18+ (the project contains a pretest check that requires Node 18)
- npm (comes with Node)
- MongoDB (for running the server or tests against a real test DB) or an in-memory MongoDB alternative when running tests.

## Environment variables

The repository uses a `.env` file. Important keys used in the project/tests:

- `PORT` - HTTP port when running the server (default in repo: 9095)
- `DB_URL` - MongoDB connection string used by `index.js` when starting the app
- `MONGO_URL_TEST` - (optional) MongoDB connection string intended for tests (the test file attempts to connect to this)
- `JWT_SECRET` - Secret used to sign JWTs
- `NEWS_API_KEY`, `NEWS_CATCHER_API_KEY`, `GNEWS_API_KEY`, `NEWS_DATA_API_KEY` - external news API keys used by `NewsController` (not required if you stub/short-circuit network calls in tests)

Be careful not to commit production secrets to version control.

## Quick start - run the server

Install dependencies:

```bash
npm install
```

Start (development):

```bash
npm start
```

The server listens on `http://localhost:${process.env.PORT || 9095}` when `index.js` is used.

Note: tests import `app.js` directly and do not run `index.js`, so starting `index.js` is not required for tests.

## Running tests

Tests use `tap` and `supertest`. The test script in `package.json` is configured as:

```json
"test": "tap test/*.js --disable-coverage"
```

To run tests with the test environment variable (recommended):

```bash
NODE_ENV=test npm test
```

Important test configuration notes (current repository state):

- The test file `test/server.test.js` uses `mongoose.connect(process.env.MONGO_URL_TEST)` in `tap.before`. This means you must provide a `MONGO_URL_TEST` environment variable that points to a running MongoDB instance for the tests to complete.

- Alternatively, you can run the tests against an in-memory MongoDB instance (recommended). I can help set this up using `mongodb-memory-server` for reliable test runs without an external DB.

## Known test issues and why they happen

When running the test suite you may see the tests hang and ultimately be killed (SIGKILL). Root causes found during debugging:

1) Mongoose operations block when no connection is open
   - `controllers/AuthController.register` awaits `UserModel.findOne(...)` and `newUser.save()`.
   - If tests import only `app.js` (which exports an Express app) and do not run `index.js` (which connects to MongoDB), Mongoose never has an open connection and buffers operations. Those awaited operations do not resolve, causing tests to hang.
   - The test file attempts to call `mongoose.connect(process.env.MONGO_URL_TEST)` in `tap.before`, but this requires `MONGO_URL_TEST` to be set and reachable.

2) External network calls in `controllers/NewsController.js`
   - `getNews` performs `axios.get` to multiple external APIs. If present in tests, these calls can slow or fail the test run.

3) `tap.teardown` in tests calls `process.exit(0)` which forcefully exits. This is ok for cleanup but masks other teardown concerns; the main blocker is (1).

## Recommended fixes (choose one)

A) Quick minimal fix (fastest)
- Modify `models/UserModel.js` to export a small in-memory model when `process.env.NODE_ENV === 'test'`. This provides `findOne`, `findById`, and instance `save()` methods used by controllers and avoids needing a DB for tests.
- Pros: Very quick, low-risk, fast tests.
- Cons: Not a full Mongoose integration; may miss some DB-specific behavior.

B) Proper test setup (recommended for parity)
- Add `mongodb-memory-server` as a dev dependency and connect Mongoose to an in-memory MongoDB server during tests (either via a test setup script or inside `tap.before`). This preserves Mongoose behavior while avoiding a real MongoDB service.
- Pros: Closer to real environment, stable.
- Cons: Slightly more setup but still straightforward.

C) Integration + network stubs
- In addition to (A) or (B) above, stub external `axios` calls in `NewsController` during tests (use `nock`, `sinon`, or a jest mock) or make `getNews` return static data when `NODE_ENV === 'test'`.
- This prevents slow or flaky tests due to network calls.

I can implement option A or B for you. Which would you like me to do? I can implement a minimal in-memory `UserModel` quickly and re-run the tests to reveal the next failures.

## Troubleshooting checklist

- If tests hang: ensure `MONGO_URL_TEST` is set or use an in-memory DB as described above.
- If news tests fail/timeout: stub requests or set valid API keys in the environment (not recommended for CI).
- Ensure Node >= 18 is used.
