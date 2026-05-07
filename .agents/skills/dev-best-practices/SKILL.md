---
name: dev-best-practices
description: Software development best practices for clean code, SOLID principles, clean architecture, code review, design patterns, security, and maintainability. Use when the user asks to review code quality, apply design principles, refactor, or improve code maintainability and testability.
---

# Software Development Best Practices Skill

## When to Use This Skill

Activate when the user:
- Asks to review or improve code quality
- Wants to apply SOLID, DRY, KISS, or YAGNI principles
- Asks about design patterns or architectural patterns
- Wants guidance on clean architecture or layered architecture
- Needs advice on naming, code organization, or project structure
- Asks about security, input validation, or error handling

---

## Core Principles

### SOLID
| Principle | Rule |
|---|---|
| **S** — Single Responsibility | A class/module has one reason to change |
| **O** — Open/Closed | Open for extension, closed for modification |
| **L** — Liskov Substitution | Subtypes must be substitutable for their base types |
| **I** — Interface Segregation | Many small interfaces > one large interface |
| **D** — Dependency Inversion | Depend on abstractions, not concretions |

### DRY — Don't Repeat Yourself
- Extract repeated logic into shared methods, services, or base classes.
- Duplication in tests is acceptable to improve readability, but business logic must not be duplicated.

### KISS — Keep It Simple
- Prefer simple, obvious code over clever code.
- If a comment is needed to explain _what_ the code does, the code is too complex — refactor it.

### YAGNI — You Aren't Gonna Need It
- Do not build features or abstractions that are not required today.
- Avoid over-engineering; implement what is asked, then extend when needed.

---

## Clean Architecture Layers

```
┌────────────────────────────────────────────┐
│              Presentation Layer            │  ← Controllers, APIs, UI
├────────────────────────────────────────────┤
│             Application Layer              │  ← Use Cases, Commands, Queries
├────────────────────────────────────────────┤
│               Domain Layer                 │  ← Entities, Value Objects, Rules
├────────────────────────────────────────────┤
│            Infrastructure Layer            │  ← DB, External APIs, File System
└────────────────────────────────────────────┘
```

**Rules:**
- Dependencies only point **inward**. Domain has no dependencies on outer layers.
- Application layer depends on Domain only.
- Infrastructure depends on Application interfaces, not the other way around.

---

## Naming Conventions

- **Classes**: `PascalCase`, noun or noun phrase — `OrderService`, `CustomerRepository`
- **Methods**: `PascalCase`, verb or verb phrase — `GetOrderById`, `ProcessPayment`
- **Variables/fields**: `camelCase` — `orderId`, `_logger`
- **Constants**: `UPPER_SNAKE_CASE` or `PascalCase const` — `MaxRetryCount`
- **Interfaces**: Prefix with `I` — `IOrderRepository`
- **Booleans**: Use positive names — `isActive`, `hasPermission` (avoid negatives like `isNotDeleted`)
- **Avoid abbreviations**: `customerId` not `custId`; `quantity` not `qty`

---

## Code Organization

### Method Length
- Methods should do **one thing**. If you need to scroll to read a method, it is too long.
- Target 10-20 lines per method. Extract sub-operations into private methods with descriptive names.

### Class Cohesion
- A class should have high cohesion: all members work toward a single purpose.
- If a class has more than ~300 lines, evaluate whether it should be split.

### Comments
- Prefer **self-documenting code** over comments.
- Comments should explain **why**, not **what**. The code explains what; comments explain the reasoning behind a non-obvious decision.
- Remove commented-out code — use version control instead.

```csharp
// BAD: comment explains what the code does (obvious)
// Add the tax to the subtotal
total = subtotal + tax;

// GOOD: comment explains why (non-obvious business rule)
// Per tax regulation 2024-03, VAT is applied before the loyalty discount
total = (subtotal + tax) * (1 - loyaltyDiscount);
```

---

## Design Patterns

### Common Patterns and When to Use

| Pattern | Use When |
|---|---|
| **Repository** | Abstract data access; keep domain logic free of DB concerns |
| **Unit of Work** | Coordinate multiple repository operations in one transaction |
| **Factory / Factory Method** | Object creation is complex or requires polymorphism |
| **Strategy** | Behavior needs to vary at runtime (e.g., different payment processors) |
| **Observer / Event** | Decoupled side effects (e.g., send email after order created) |
| **Decorator** | Add behavior without modifying the class (e.g., caching, retry) |
| **CQRS** | Separate read and write models for scalability or complexity |
| **Mediator** | Decouple in-process commands/queries from their handlers |
| **Options** | Typed configuration settings injected via DI |

---

## Error Handling

- **Don't use exceptions for flow control.** Exceptions are for unexpected, unrecoverable situations.
- **Use a Result pattern** for expected failure cases (not found, validation error, business rule violation).
- **Always log exceptions** before suppressing them.
- Provide **meaningful error messages** to callers — include what failed and (when safe) why.

```csharp
// Result pattern example
public sealed record Result<T>
{
    public T? Value { get; init; }
    public string? Error { get; init; }
    public bool IsSuccess => Error is null;

    public static Result<T> Success(T value) => new() { Value = value };
    public static Result<T> Failure(string error) => new() { Error = error };
}
```

---

## Security Best Practices

- **Validate all inputs** at the boundary of the system (API layer). Never trust external input.
- **Parameterize all queries** — never concatenate user input into SQL strings.
- **Never log sensitive data** (passwords, tokens, credit card numbers, PII).
- **Use HTTPS everywhere** — enforce it in production middleware.
- **Principle of least privilege** — services and database users should only have the permissions they need.
- **Secrets management** — never hardcode secrets. Use environment variables, Azure Key Vault, AWS Secrets Manager, or similar.
- **Dependency scanning** — run `dotnet list package --vulnerable` regularly or in CI.
- **Rate limiting** — protect public endpoints from abuse.

---

## Code Review Checklist

Before submitting or reviewing a PR, verify:

- [ ] Does the code do what the requirement says?
- [ ] Are all public methods tested?
- [ ] Is there any duplicated logic that should be extracted?
- [ ] Are error cases handled and logged?
- [ ] Are there any secrets or sensitive data in the code?
- [ ] Is the naming clear and consistent with the rest of the codebase?
- [ ] Are async methods using `CancellationToken`?
- [ ] Are all dependencies injected (no `new` for services)?
- [ ] Are there any obvious performance issues (N+1 queries, blocking I/O)?
- [ ] Does the PR introduce new tech debt? Is it tracked?

---

## Refactoring

Apply these refactors to improve code quality without changing behavior:

1. **Extract Method** — long method → multiple focused methods
2. **Introduce Parameter Object** — many parameters → a single DTO/record
3. **Replace Magic Number/String with Named Constant**
4. **Replace Conditional with Polymorphism** — complex `if/switch` → strategy or inheritance
5. **Move Method** — method uses data from another class more than its own → move it there
6. **Replace Primitive Obsession** — use Value Objects instead of raw `string`/`int` for domain concepts

---

## Git and CI Practices

- **Small, atomic commits** — one logical change per commit.
- **Descriptive commit messages** — use the imperative: "Add order validation" not "Added order validation".
- **Feature branches** — never commit directly to `main`/`master`.
- **CI must pass before merge** — build, lint, and tests must be green.
- **No commented-out code in PRs** — remove it or track the work as a task.
