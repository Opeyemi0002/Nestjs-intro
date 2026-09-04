# NestJS testing: a step-by-step study note

Prepared for your current NestJS 11 + Jest project.

Read this in three sittings: sections 1–5 for the ideas, 6–10 for the example, and 11–14 for practice and the move to e2e. You do not need to memorize every line.

## 1. What is a test?

Imagine building a toy car. After changing a wheel, you check whether the car still rolls.

A software test does something similar. It runs a small experiment and checks the answer. You write the experiment once; the computer can repeat it.

Example in plain English:

- Given an email that already exists,
- when someone tries to register,
- the service should reject the request with a conflict error.

A test has an expected answer. Without a check, a function call is just an experiment, not useful proof of correctness.

An **assertion** is that check: “I expect the actual answer to equal this answer.”

A **regression** is an old feature breaking after a new change. Tests can help catch regressions.

## 2. Know who does what

Think of your application as a small shop:

| Code | Shop example | Responsibility in your project |
| --- | --- | --- |
| Controller | Receptionist | Receives input and hands it to the appropriate service method. |
| Service | Worker | Makes decisions: whether a user exists, whether a password matches, and what to do next. |
| Repository | Filing cabinet assistant | Reads and saves database records. |

Your current controller methods call these service methods:

| Controller method | Service method |
| --- | --- |
| `registerUser(body)` | `register(body)` |
| `logInUser(body)` | `signIn(body)` |
| `refreshToken(body)` | `refreshAccessToken(body)` |

The names are not identical. In a controller test, call the controller method on the left.

## 3. What are we testing: one part or the whole journey?

A **unit test** checks a small piece in isolation. In our examples, the unit is one real class and its immediate helpers are replaced with controlled fakes.

- Service unit test: real `AuthService`; fake user, hashing, and token services.
- Controller unit test: real `AuthController`; fake `AuthService`.

An **integration test** checks how selected real pieces work together—for example, a service using a repository against a test database.

An **HTTP e2e test** exercises an application through HTTP. In our planned auth tests, the real controller, auth logic, and test database will work together. Email delivery can be replaced so tests do not send real messages.

If we send HTTP requests but mock the entire auth service, we test the HTTP layer, not the full registration journey. Test names are less important than being clear about what is real and what is fake.

## 4. Three questions before writing any unit test

1. What is the real class under test?
2. Which helpers will I replace?
3. What behavior would make this test pass or fail?

For a controller example:

1. Real class: `AuthController`.
2. Replaced helper: `AuthService`.
3. Expected behavior: the controller passes the body to `register()` once and returns the service's answer.

We do not mock the controller itself. Otherwise, we would be checking the pretend answer we supplied.

## 5. Arrange, Act, Assert

This is a simple writing order:

- **Arrange:** prepare the input and decide how the mocks behave.
- **Act:** call the real method once.
- **Assert:** check the returned result, error, or important calls.

Think: “Set the table, serve the meal, check the meal.”

Keep each test about one scenario. Several related assertions can belong to that one scenario.

For example, successful registration can check both the result and that the hashed password was passed to user creation. Those checks describe the same operation.

## 6. The Jest words you need first

| Word | Simple meaning |
| --- | --- |
| `describe()` | A named box containing related tests. |
| `it()` or `test()` | One experiment. They are aliases in Jest. |
| `beforeEach()` | Prepare a clean starting point before each test. |
| `afterEach()` | Clean up after each test. |
| `beforeAll()` | Set up once for the group. |
| `afterAll()` | Clean up once after the group. |
| `expect()` | Start checking an answer. |

A `describe` callback registers tests and must not be `async`. A test callback can be `async` when it needs to wait.

Your project already provides Jest globals. Do not import `it` from `node:test`: that belongs to a different runner. If using explicit imports, they must come from `@jest/globals`.

A fresh mock object inside `beforeEach` prevents an earlier test's calls or configured answers from leaking into the next test.

## 7. What is a mock?

A mock is a pretend helper with answers you control. It can also keep a record of how it was called.

```ts
const register = jest.fn();
```

An unconfigured `jest.fn()` returns `undefined`. These methods give it behavior:

```ts
register.mockReturnValue('done');       // Immediate value.
register.mockResolvedValue('done');     // Promise succeeds with a value.
register.mockRejectedValue(new Error('failed')); // Promise rejects.
```

Use the form that matches the real helper's contract. Your auth methods are asynchronous, so the examples use resolved/rejected values. These APIs are described in the [Jest mock-function reference](https://jestjs.io/docs/mock-function-api).

Important distinction:

- A mock cannot prove that the real database or hash function works.
- It lets us check how our real class behaves when a helper succeeds or fails.

A `jest.spyOn(object, 'method')` observes an existing method. It calls the original implementation unless you replace its behavior; it is not automatically a harmless fake.

## 8. Promises, await, resolves, and rejects

Imagine ordering food and receiving a receipt. The receipt is not the food; it represents an answer you will receive later.

A Promise represents eventual completion. An `async` function returns a Promise.

For a successful operation, use either pattern:

```ts
const result = await controller.registerUser(body);
expect(result).toBe(serviceResult);
```

```ts
await expect(controller.registerUser(body)).resolves.toBe(serviceResult);
```

For a failure:

```ts
await expect(controller.registerUser(body)).rejects.toThrow(
  ConflictException,
);
```

Do not write this:

```ts
await expect(controller.registerUser(body)).toEqual(serviceResult);
```

That passes a Promise into the ordinary equality matcher. Putting `await` before the assertion does not magically unwrap its inner argument. Use `.resolves`, or await the method before calling `expect`. Always await or return asynchronous assertions so the test does not finish too early. See [Jest's async-testing guide](https://jestjs.io/docs/asynchronous).

A rejected Promise does not mean the test should fail: when rejection is the expected behavior, `.rejects` checks it.

## 9. Choose the correct assertion

- `toBe('done')`: compare a primitive value; for objects it checks the same object reference.
- `toEqual({ id: 1 })`: compare an object's contents.
- `toThrow(ConflictException)`: check the exception class.
- `toThrow('User exists')`: check that the exception message contains that text.
- `toHaveBeenCalledWith(body)`: check the arguments passed to a mock.
- `toHaveBeenCalledTimes(1)`: check the number of calls.
- `not.toHaveBeenCalled()`: check that execution stopped before a later operation.

A string such as `'Conflict'` is not an exception-class check. That was the reason one of your earlier assertions failed. See [Jest's matcher reference](https://jestjs.io/docs/expect).

Use all important arguments. Your real password comparison receives both the entered password and the stored hash, not just one of them.

## 10. Controller unit testing: the complete example

The separate example file is:

`test/examples/auth-controller.example.ts`

It is deliberately named `.example.ts`, not `.spec.ts`. It is outside normal unit/e2e discovery and inside the directory excluded from your production build. Your existing tests are unchanged.

Here is the complete example:

```ts
import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/providers/auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

// Learning example only: the .example.ts name keeps this out of normal Jest runs.
describe('AuthController: learning example', () => {
  let controller: AuthController;
  let moduleRef: TestingModule;

  // These are the controller's helpers, not the real AuthService implementation.
  let authServiceMock: {
    register: jest.Mock;
    signIn: jest.Mock;
    refreshAccessToken: jest.Mock;
  };

  beforeEach(async () => {
    // A fresh set of mocks gives every test a clean starting point.
    authServiceMock = {
      register: jest.fn(),
      signIn: jest.fn(),
      refreshAccessToken: jest.fn(),
    };

    moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        // Whenever AuthController asks for AuthService, supply our mock object.
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('registerUser', () => {
    it('passes the body to the service once and returns its result', async () => {
      // ARRANGE: choose the input and the service's pretend answer.
      const body: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };
      const serviceResult = 'registered successfully';
      authServiceMock.register.mockResolvedValue(serviceResult);

      // ACT: call the REAL controller method, not the mock directly.
      const result = await controller.registerUser(body);

      // ASSERT: check the hand-off and what the caller receives.
      expect(authServiceMock.register).toHaveBeenCalledTimes(1);
      expect(authServiceMock.register).toHaveBeenCalledWith(body);
      expect(result).toBe(serviceResult);
    });

    it('passes a service error back to the caller without replacing it', async () => {
      // ARRANGE: the service will reject instead of returning a result.
      const body: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };
      const error = new ConflictException('User exists, please sign in');
      authServiceMock.register.mockRejectedValue(error);

      // ACT + ASSERT: wait for the rejection and check the same error object.
      await expect(controller.registerUser(body)).rejects.toBe(error);

      expect(authServiceMock.register).toHaveBeenCalledTimes(1);
      expect(authServiceMock.register).toHaveBeenCalledWith(body);
    });
  });
});
```

### Understanding the setup one piece at a time

**`controllers: [AuthController]`**

Build the real controller. This is the class we want to investigate.

**`provide: AuthService`**

This is the dependency token—the label the controller uses to ask Nest for its helper.

**`useValue: authServiceMock`**

Supply this object instead of constructing the real service. We do not connect to the database, compare passwords, generate JWTs, or send email.

**`compile()`**

Ask Nest to assemble this small testing module. This operation is asynchronous.

**`moduleRef.get(AuthController)`**

Retrieve the controller Nest assembled.

**Why are UserService and HashService missing?**

Those are dependencies of the real `AuthService`. We are not constructing it here. The controller's only direct constructor dependency is `AuthService`, and our mock supplies that dependency.

Using Nest's testing module does not mean you must import `AppModule`. The small module is intentional. Nest documents this dependency-injection testing approach in its [testing guide](https://docs.nestjs.com/fundamentals/testing).

### What the success example proves

The experiment is not “can the fake service return a string?”

It is “when I call the real controller, does it ask the correct helper, pass the correct body once, and return the answer?”

It would catch mistakes such as:

- Calling `signIn()` instead of `register()`.
- Passing only the email when the service needs the whole body.
- Forgetting to return the result.

It does not prove that an account was saved. No database operation occurred.

### What the error example proves

The real controller has no error-handling branch of its own. It awaits the service and lets a rejection reach its caller.

`rejects.toBe(error)` checks the exact same error object, proving the controller did not replace or swallow it. Checking the exception class with `rejects.toThrow(ConflictException)` is a less strict alternative.

We mock a service error here; we do not recreate the duplicate-user lookup inside the controller test. You already tested that decision in the service tests.

### A caution about fake answers

Keep mock answers realistic. Your registration path currently returns the string `'registered successfully'`, so that is the example answer.

A mock can return almost anything if its typing is loose. A test passing with an invented response shape does not prove the real service returns that shape. Later, we can strengthen the mock types.

## 11. What a direct controller unit test does NOT prove

Calling `controller.registerUser(body)` is an ordinary method call. It is not an HTTP request.

It does not exercise:

- Whether `POST /auth/register` is routed to this method.
- Whether a validation pipe rejects an invalid email.
- Whether guards allow or deny the request.
- Whether interceptors wrap the response.
- Whether an exception filter creates the expected JSON response.
- Whether the HTTP status is correct.

The decorators remain attached to the class, but this method call does not run the Nest HTTP pipeline.

A `CreateUserDto` TypeScript annotation also does not run validation by itself. Runtime DTO validation requires a validation mechanism such as Nest's `ValidationPipe`. See the [Nest validation guide](https://docs.nestjs.com/techniques/validation).

A `ConflictException` rejected in this unit test is an error object. Verifying that an HTTP client receives status 409 is a separate HTTP test.

By default, Nest responds to successful POST handlers with 201 unless changed, for example with `@HttpCode()`. Check the actual controller before assuming a login response is 200. See [Nest controller response behavior](https://docs.nestjs.com/controllers).

## 12. Expected errors versus unexpected errors

Your service distinguishes two groups:

1. Known HTTP exceptions, such as `ConflictException`: keep them.
2. Other errors, such as a plain database `Error`: convert them to `InternalServerErrorException`.

That is the service's responsibility. The controller should not repeat that logic just to make tests longer.

For your sign-in dependency-failure tests, remember:

- Lookup fails: nothing after the lookup should run.
- Comparison fails: lookup must succeed first; token generation should not run.
- Token generation fails: lookup and comparison must succeed first.

Use a plain `Error` when you want to exercise the service's unexpected-error conversion. Rejecting an existing HTTP exception exercises its “keep the known exception” branch instead.

You do not need to test every imaginable error message. Choose representative failures and important behavior.

## 13. Your practice after reading

Do not rewrite the service tests inside the controller tests.

### Exercise A: login controller

Implement two controller tests yourself:

1. `logInUser(body)` calls the mocked `signIn(body)` once and returns the service result.
2. If the mocked `signIn()` rejects, the controller propagates the same error.

You do not need to mock password comparison here. The entire auth service is already replaced.

A separate application issue remains: your real sign-in method currently spreads the user into its return value, including its password field. Do not treat a passing delegation test as evidence that this response is safe. We should address the response contract before writing e2e assertions for login.

### Exercise B: refresh controller

Apply the same idea to `refreshToken(body)`:

- Which service method must be called?
- What exact DTO must be passed?
- What result should be returned?
- What happens if the service rejects?

Explain your answer in plain English before writing the code. Then translate that sentence into Arrange, Act, Assert.

### How to run the supplied learning example

From the project root in PowerShell:

```powershell
.\node_modules\.bin\jest.cmd --runInBand --runTestsByPath test/examples/auth-controller.example.ts --testRegex 'auth-controller\.example\.ts$'
```

The custom pattern explicitly opts this learning file into that run.

When you implement your own controller spec under `src/auth/auth.controller.spec.ts`, use:

```powershell
npm test -- auth.controller.spec.ts --runInBand
```

Ordinary unit tests:

```powershell
npm test -- --runInBand
```

## 14. What we will learn next: e2e

Controller unit tests check a hand-off. Our auth e2e tests will check the request journey.

Before running database-writing e2e tests, we will:

1. Use a dedicated test database, never your development or production data.
2. Confirm the environment is actually set to test; merely having an environment file is not enough.
3. Replace email delivery so no real messages are sent.
4. Configure the test app with the same relevant pipes, filters, and interceptors as the real app. Creating a test app does not execute `main.ts` automatically.
5. Initialize the app, send requests with Supertest, and close it afterward.
6. Reset only the verified test data so tests do not depend on execution order.

Our first request-based scenarios will be:

- A valid registration succeeds and saves the expected safe data.
- An invalid body is rejected by validation.
- A duplicate email is rejected.

We will check HTTP status, response body, and relevant database effects—not just “the server answered.”

For now, read the example, then try the login controller exercise. Bring it back for review before moving to e2e.

## Quick memory card

- Keep the class under test real.
- Replace its direct helpers with mocks.
- Arrange, Act, Assert.
- `describe` is synchronous; individual tests can be asynchronous.
- Async success: await the result or use `.resolves`.
- Async failure: use `.rejects`.
- Error class and error message are different checks.
- Test behavior, not the fake by itself.
- A direct controller call does not test HTTP validation or routing.
- Passing tests support the behaviors you checked; they are not proof that the whole application is correct.
