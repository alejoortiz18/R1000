---
name: dotnet-csharp
description: Expert guidance for C# and .NET Core development. Use when the user asks to build, review, or improve C# code, .NET Core APIs, class libraries, console apps, background services, or any .NET-related task. Covers language features, project structure, async/await, dependency injection, configuration, logging, and testing in .NET.
---

# C# and .NET Core Development Skill

## When to Use This Skill

Activate when the user:
- Writes or asks for C# code or .NET Core projects
- Needs help with .NET APIs, services, libraries, or console apps
- Asks about async/await, LINQ, generics, records, or modern C# features
- Needs configuration, logging, DI container setup, or middleware
- Wants to build a .NET minimal API, controller-based API, or background worker

---

## Project Setup

### Preferred Project Structure

```
MyApp/
├── src/
│   ├── MyApp.Api/              # ASP.NET Core Web API
│   ├── MyApp.Application/      # Use cases / application logic (CQRS, handlers)
│   ├── MyApp.Domain/           # Domain entities, value objects, interfaces
│   └── MyApp.Infrastructure/   # EF Core, external services, repositories
├── tests/
│   ├── MyApp.UnitTests/
│   └── MyApp.IntegrationTests/
└── MyApp.sln
```

### Target Framework

- Always target the **latest LTS** unless the user specifies otherwise.
- Use `net8.0` or `net9.0` (check current LTS at time of implementation).
- Add `<Nullable>enable</Nullable>` and `<ImplicitUsings>enable</ImplicitUsings>` in all `*.csproj` files.

```xml
<PropertyGroup>
  <TargetFramework>net8.0</TargetFramework>
  <Nullable>enable</Nullable>
  <ImplicitUsings>enable</ImplicitUsings>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
</PropertyGroup>
```

---

## Language Best Practices

### Nullability
- Enable nullable reference types globally.
- Use `?` only when null is a valid value.
- Prefer guard clauses or `ArgumentNullException.ThrowIfNull()` at method entry points.

```csharp
// Correct
public string ProcessOrder(Order order)
{
    ArgumentNullException.ThrowIfNull(order);
    // ...
}
```

### Records vs Classes
- Use **records** for immutable value-like objects (DTOs, value objects, events).
- Use **classes** for mutable entities and services.

```csharp
// DTO - use record
public record CreateOrderRequest(Guid CustomerId, List<OrderItem> Items);

// Domain entity - use class
public class Order { /* mutable state */ }
```

### Pattern Matching
- Prefer pattern matching over `is`/`as` casts and type checks.

```csharp
// Prefer this
if (result is Success<Order> success)
    return success.Value;

// Over this
if (result is Success<Order>)
    return ((Success<Order>)result).Value;
```

### LINQ
- Use method syntax for multi-step queries; query syntax for simple joins.
- Avoid `ToList()` in the middle of a query chain — defer materialization.
- Never use `.Result` or `.Wait()` on `Task` inside a LINQ query.

### async/await
- All I/O bound code must be `async` all the way up.
- Never block with `.Result` or `.GetAwaiter().GetResult()` — causes deadlocks.
- Use `CancellationToken` parameters in every async public method.
- Use `ConfigureAwait(false)` in library code; not needed in ASP.NET Core.

```csharp
public async Task<Order> GetOrderAsync(Guid id, CancellationToken ct)
{
    return await _repository.FindAsync(id, ct);
}
```

---

## ASP.NET Core

### Minimal APIs (preferred for new services)
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.MapGet("/orders/{id}", async (Guid id, IOrderService svc, CancellationToken ct) =>
{
    var order = await svc.GetAsync(id, ct);
    return order is null ? Results.NotFound() : Results.Ok(order);
});

app.Run();
```

### Dependency Injection
- Register services by lifetime: `AddSingleton`, `AddScoped`, `AddTransient`.
- Always inject via **constructor injection** — avoid service locator.
- Use interfaces for all injectable services.

```csharp
// Register
builder.Services.AddScoped<IOrderService, OrderService>();

// Inject
public class OrderController(IOrderService orderService) : ControllerBase { }
```

### Configuration
- Use `IOptions<T>` pattern for typed configuration.
- Never read from `IConfiguration` directly in services — bind to a POCO.

```csharp
// appsettings.json
{
  "PaymentGateway": { "BaseUrl": "https://api.pay.io", "ApiKey": "" }
}

// Settings class
public class PaymentGatewaySettings
{
    public string BaseUrl { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
}

// Registration
builder.Services.Configure<PaymentGatewaySettings>(
    builder.Configuration.GetSection("PaymentGateway"));
```

### Logging
- Inject `ILogger<T>` — never use static loggers.
- Use structured logging with message templates (not string interpolation).

```csharp
// Correct
_logger.LogInformation("Order {OrderId} created for customer {CustomerId}", order.Id, order.CustomerId);

// Wrong - loses structured data
_logger.LogInformation($"Order {order.Id} created");
```

---

## Error Handling

- Use a **global exception handler middleware** in ASP.NET Core — never let unhandled exceptions bubble to the client.
- Return `ProblemDetails` (RFC 7807) for all API errors.

```csharp
app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await context.Response.WriteAsJsonAsync(new ProblemDetails
        {
            Status = 500,
            Title = "An unexpected error occurred."
        });
    });
});
```

- Use a **Result<T>** pattern for expected domain errors instead of throwing exceptions for flow control.

---

## Testing

- Use **xUnit** as the default test framework.
- Use **FluentAssertions** for readable assertions.
- Use **Moq** or **NSubstitute** for mocking.
- Aim for integration tests over unit tests for I/O-bound code.

```csharp
[Fact]
public async Task GetOrder_WhenExists_ReturnsOrder()
{
    // Arrange
    var orderId = Guid.NewGuid();
    _mockRepo.Setup(r => r.FindAsync(orderId, It.IsAny<CancellationToken>()))
             .ReturnsAsync(new Order { Id = orderId });

    // Act
    var result = await _sut.GetOrderAsync(orderId, CancellationToken.None);

    // Assert
    result.Should().NotBeNull();
    result!.Id.Should().Be(orderId);
}
```

---

## Tooling

| Purpose | Tool |
|---|---|
| HTTP testing | `Microsoft.AspNetCore.Mvc.Testing` (WebApplicationFactory) |
| Mocking | NSubstitute (preferred) or Moq |
| Assertions | FluentAssertions |
| API docs | Swashbuckle (Swagger) or Scalar |
| Health checks | `Microsoft.Extensions.Diagnostics.HealthChecks` |
| Background jobs | Hangfire or .NET `IHostedService` |

---

## Common Pitfalls to Avoid

- **Sync over async**: Never `.Result` or `.Wait()` on Tasks.
- **Fat controllers**: Move business logic to services/handlers.
- **Service locator**: Don't use `IServiceProvider` directly in business code.
- **Swallowing exceptions**: Always log before catching and suppressing.
- **Magic strings**: Use `nameof()` or `const` for repeated strings.
- **Mutable static state**: Avoid; it causes thread-safety issues and test interference.
