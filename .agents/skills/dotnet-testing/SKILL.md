---
name: dotnet-testing
description: Expert guidance for testing in C# and .NET. Use when the user wants to write unit tests, integration tests, or end-to-end tests with xUnit, NUnit, MSTest, FluentAssertions, Moq, NSubstitute, or Playwright for .NET. Covers TDD, test structure, mocking, WebApplicationFactory, test data builders, and best practices for .NET test projects.
---

# .NET Testing Skill

## When to Use This Skill

Activate when the user:
- Wants to write unit, integration, or end-to-end tests in C#
- Asks about xUnit, NUnit, MSTest, FluentAssertions, Moq, or NSubstitute
- Wants to test ASP.NET Core APIs with `WebApplicationFactory`
- Asks about TDD, test structure, or test organization
- Needs Playwright for browser/E2E testing in .NET
- Asks about test coverage, test doubles, or mocking strategies

---

## Recommended Test Stack

| Purpose | Package |
|---|---|
| Test framework | `xunit` (preferred) |
| Assertions | `FluentAssertions` |
| Mocking | `NSubstitute` (preferred) or `Moq` |
| API integration tests | `Microsoft.AspNetCore.Mvc.Testing` |
| Test data | `Bogus` (fake data) / Builder pattern |
| Browser/E2E tests | `Microsoft.Playwright` |
| Database (in-memory) | `Microsoft.EntityFrameworkCore.InMemory` |
| Database (real, isolated) | `Testcontainers.MsSql` / `Testcontainers.PostgreSql` |

---

## Project Setup

### NuGet Packages

```bash
# Unit/Integration test project
dotnet add package xunit
dotnet add package xunit.runner.visualstudio
dotnet add package Microsoft.NET.Test.Sdk
dotnet add package FluentAssertions
dotnet add package NSubstitute
dotnet add package Microsoft.AspNetCore.Mvc.Testing
dotnet add package Bogus

# Playwright E2E test project
dotnet add package Microsoft.Playwright
dotnet add package Microsoft.Playwright.NUnit  # or .xunit
```

### Test Project `.csproj`

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <IsPackable>false</IsPackable>
    <IsTestProject>true</IsTestProject>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="xunit" Version="2.*" />
    <PackageReference Include="xunit.runner.visualstudio" Version="2.*">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers</IncludeAssets>
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.*" />
    <PackageReference Include="FluentAssertions" Version="6.*" />
    <PackageReference Include="NSubstitute" Version="5.*" />
    <PackageReference Include="Microsoft.AspNetCore.Mvc.Testing" Version="8.*" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\..\src\MyApp.Api\MyApp.Api.csproj" />
  </ItemGroup>
</Project>
```

---

## Unit Tests

### Structure: Arrange / Act / Assert

```csharp
public class OrderServiceTests
{
    private readonly IOrderRepository _repository;
    private readonly OrderService _sut; // System Under Test

    public OrderServiceTests()
    {
        _repository = Substitute.For<IOrderRepository>();
        _sut = new OrderService(_repository);
    }

    [Fact]
    public async Task GetOrderAsync_WhenOrderExists_ReturnsOrder()
    {
        // Arrange
        var orderId = Guid.NewGuid();
        var expected = new Order { Id = orderId };
        _repository.FindAsync(orderId, Arg.Any<CancellationToken>()).Returns(expected);

        // Act
        var result = await _sut.GetOrderAsync(orderId, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(orderId);
    }

    [Fact]
    public async Task GetOrderAsync_WhenOrderNotFound_ReturnsNull()
    {
        // Arrange
        _repository.FindAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>()).Returns((Order?)null);

        // Act
        var result = await _sut.GetOrderAsync(Guid.NewGuid(), CancellationToken.None);

        // Assert
        result.Should().BeNull();
    }
}
```

### Parameterized Tests with `[Theory]`

```csharp
[Theory]
[InlineData(0)]
[InlineData(-1)]
[InlineData(-100)]
public void AddItem_WithInvalidQuantity_ThrowsArgumentException(int quantity)
{
    var order = new Order(Guid.NewGuid());
    var action = () => order.AddItem(product, quantity);
    action.Should().Throw<ArgumentOutOfRangeException>();
}
```

---

## Mocking with NSubstitute

```csharp
// Create substitute
var repo = Substitute.For<IOrderRepository>();

// Setup return value
repo.FindAsync(orderId, Arg.Any<CancellationToken>()).Returns(order);

// Setup exception
repo.FindAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>())
    .Throws(new TimeoutException());

// Verify call was made
await repo.Received(1).FindAsync(orderId, Arg.Any<CancellationToken>());

// Verify call was NOT made
await repo.DidNotReceive().SaveAsync(Arg.Any<Order>(), Arg.Any<CancellationToken>());
```

---

## Integration Tests with WebApplicationFactory

### Custom Factory

```csharp
public class ApiFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Replace real DB with in-memory for tests
            var descriptor = services.SingleOrDefault(d =>
                d.ServiceType == typeof(DbContextOptions<AppDbContext>));
            if (descriptor != null) services.Remove(descriptor);

            services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase("TestDb"));
        });
    }
}
```

### Integration Test Class

```csharp
public class OrdersApiTests : IClassFixture<ApiFactory>
{
    private readonly HttpClient _client;

    public OrdersApiTests(ApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetOrder_WhenExists_Returns200()
    {
        // Arrange
        var orderId = Guid.NewGuid();
        // seed order via API or direct DB access...

        // Act
        var response = await _client.GetAsync($"/orders/{orderId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var order = await response.Content.ReadFromJsonAsync<OrderDto>();
        order!.Id.Should().Be(orderId);
    }

    [Fact]
    public async Task CreateOrder_WithValidRequest_Returns201()
    {
        // Arrange
        var request = new CreateOrderRequest(CustomerId: Guid.NewGuid(), Items: []);

        // Act
        var response = await _client.PostAsJsonAsync("/orders", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }
}
```

---

## Test Data Builders

Avoid repetitive object construction; use the Builder pattern:

```csharp
public class OrderBuilder
{
    private Guid _customerId = Guid.NewGuid();
    private List<OrderItem> _items = [];
    private OrderStatus _status = OrderStatus.Pending;

    public OrderBuilder WithCustomer(Guid customerId)
    {
        _customerId = customerId;
        return this;
    }

    public OrderBuilder WithItem(Product product, int quantity = 1)
    {
        _items.Add(new OrderItem(product, quantity));
        return this;
    }

    public OrderBuilder WithStatus(OrderStatus status)
    {
        _status = status;
        return this;
    }

    public Order Build() => new Order(_customerId) { Status = _status };
}

// Usage in tests
var order = new OrderBuilder()
    .WithCustomer(customerId)
    .WithItem(product, quantity: 2)
    .Build();
```

---

## Fake Data with Bogus

```csharp
var faker = new Faker<CreateOrderRequest>()
    .RuleFor(r => r.CustomerId, f => f.Random.Guid())
    .RuleFor(r => r.Items, f => f.Make(3, () => new OrderItemDto(
        ProductId: f.Random.Guid(),
        Quantity: f.Random.Int(1, 10)
    )));

var request = faker.Generate();
```

---

## Playwright for .NET (Browser / E2E)

### Install browsers after adding the NuGet package

```bash
# After adding Microsoft.Playwright NuGet:
dotnet build
pwsh bin/Debug/net8.0/playwright.ps1 install chromium
```

### Basic Playwright Test (NUnit)

```csharp
[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class LoginTests : PageTest
{
    [Test]
    public async Task Login_WithValidCredentials_RedirectsToDashboard()
    {
        await Page.GotoAsync("https://localhost:5001/login");

        await Page.FillAsync("#username", "admin@test.com");
        await Page.FillAsync("#password", "Password123!");
        await Page.ClickAsync("button[type=submit]");

        await Expect(Page).ToHaveURLAsync("**/dashboard");
    }
}
```

### Configuration (`playwright.config.json`)

```json
{
  "use": {
    "baseURL": "https://localhost:5001",
    "browserName": "chromium",
    "headless": true,
    "screenshot": "only-on-failure",
    "trace": "retain-on-failure"
  }
}
```

### Page Object Model (recommended)

```csharp
public class LoginPage(IPage page)
{
    public async Task GotoAsync() => await page.GotoAsync("/login");
    public async Task FillUsernameAsync(string value) => await page.FillAsync("#username", value);
    public async Task FillPasswordAsync(string value) => await page.FillAsync("#password", value);
    public async Task SubmitAsync() => await page.ClickAsync("button[type=submit]");

    public async Task LoginAsync(string username, string password)
    {
        await GotoAsync();
        await FillUsernameAsync(username);
        await FillPasswordAsync(password);
        await SubmitAsync();
    }
}
```

---

## Test Organization

```
tests/
├── MyApp.UnitTests/
│   ├── Domain/
│   │   └── OrderTests.cs
│   └── Application/
│       └── OrderServiceTests.cs
├── MyApp.IntegrationTests/
│   ├── ApiFactory.cs
│   └── Orders/
│       └── OrdersApiTests.cs
└── MyApp.E2ETests/
    ├── Pages/
    │   └── LoginPage.cs
    └── Tests/
        └── LoginTests.cs
```

---

## Best Practices

- **Test behavior, not implementation** — test through the public interface.
- **One assertion concept per test** — but multiple related `.Should()` calls are fine.
- **Fast, isolated, repeatable** — unit tests should run in milliseconds.
- **No shared mutable state** — each test class creates its own fixtures.
- **Meaningful test names**: `MethodName_Scenario_ExpectedBehavior` or natural language with `[Fact(DisplayName="...")]`.
- **Don't test framework code** — don't test `EF Core`, `ASP.NET Core` internals; test your logic.
- **Use `IClassFixture<T>`** for expensive setup (e.g., `ApiFactory`) shared across tests in one class.
- **Never use `Thread.Sleep`** in async tests — use `await Task.Delay` or Playwright's built-in waits.
