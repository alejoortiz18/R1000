---
name: efcore
description: Expert guidance for Entity Framework Core. Use when the user asks about EF Core setup, DbContext, migrations, querying, relationships, performance, concurrency, or repository patterns with EF Core.
---

# Entity Framework Core Skill

## When to Use This Skill

Activate when the user:
- Sets up or configures EF Core in a .NET project
- Designs `DbContext`, entities, or relationships
- Writes LINQ queries against EF Core
- Creates or manages migrations
- Asks about EF Core performance (N+1, eager/lazy loading, indexes)
- Asks about repositories, Unit of Work, or raw SQL with EF Core
- Needs help with seeding, concurrency, or transactions

---

## Setup

### Installation
```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer     # SQL Server
dotnet add package Microsoft.EntityFrameworkCore.Design        # CLI tooling
dotnet add package Microsoft.EntityFrameworkCore.Tools         # migrations
```

### DbContext Registration
```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
```

`appsettings.json`:
```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Database=MyDb;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

---

## DbContext Design

```csharp
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Customer> Customers => Set<Customer>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Apply all IEntityTypeConfiguration<T> classes in this assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
```

### Separation of Concerns: Entity Type Configurations
Keep entity configuration out of `OnModelCreating` by using `IEntityTypeConfiguration<T>`:

```csharp
public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");
        builder.HasKey(o => o.Id);
        builder.Property(o => o.Status).HasConversion<string>().IsRequired();
        builder.HasIndex(o => o.CustomerId);

        builder.HasMany(o => o.Items)
               .WithOne(i => i.Order)
               .HasForeignKey(i => i.OrderId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
```

---

## Entity Design

### Encapsulate State
- Use **private setters** to protect invariants.
- Do not expose `List<T>` publicly — use `IReadOnlyCollection<T>`.

```csharp
public class Order
{
    private readonly List<OrderItem> _items = [];

    public Guid Id { get; private set; }
    public Guid CustomerId { get; private set; }
    public OrderStatus Status { get; private set; }
    public IReadOnlyCollection<OrderItem> Items => _items.AsReadOnly();

    // EF Core needs a parameterless constructor (can be private/protected)
    private Order() { }

    public Order(Guid customerId)
    {
        Id = Guid.NewGuid();
        CustomerId = customerId;
        Status = OrderStatus.Pending;
    }

    public void AddItem(Product product, int quantity)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(quantity);
        _items.Add(new OrderItem(Id, product.Id, quantity, product.Price));
    }
}
```

### Value Objects
- Map value objects with `OwnsOne` or `OwnsMany`.

```csharp
public record Address(string Street, string City, string PostalCode);

// Configuration
builder.OwnsOne(c => c.Address, a =>
{
    a.Property(x => x.Street).HasColumnName("Street");
    a.Property(x => x.City).HasColumnName("City");
    a.Property(x => x.PostalCode).HasColumnName("PostalCode");
});
```

---

## Migrations

```bash
# Add a migration
dotnet ef migrations add InitialCreate --project src/MyApp.Infrastructure --startup-project src/MyApp.Api

# Apply to database
dotnet ef database update --project src/MyApp.Infrastructure --startup-project src/MyApp.Api

# Generate SQL script (for production deployments)
dotnet ef migrations script --idempotent -o migrations.sql
```

### Production Migrations
- **Never call `Database.Migrate()` at startup in production** for high-availability services — it can cause downtime.
- Prefer applying migrations as a deployment step using idempotent SQL scripts.
- For development/testing environments, `Database.EnsureCreated()` or `Migrate()` on startup is acceptable.

---

## Querying Best Practices

### Avoid N+1 Queries
Use `Include`/`ThenInclude` to eager load related data in a single query.

```csharp
// BAD — triggers one query per order to load items (N+1)
var orders = await context.Orders.ToListAsync();
foreach (var order in orders)
    Console.WriteLine(order.Items.Count); // lazy load per iteration

// GOOD — single query with join
var orders = await context.Orders
    .Include(o => o.Items)
    .ToListAsync();
```

### Project to DTOs with Select
- Never load full entities when you only need a few fields — project to a DTO.

```csharp
var summaries = await context.Orders
    .Where(o => o.CustomerId == customerId)
    .Select(o => new OrderSummaryDto(o.Id, o.Status, o.Items.Count))
    .ToListAsync(ct);
```

### AsNoTracking for Read-Only Queries
- Use `AsNoTracking()` on all read-only queries to save memory and improve performance.

```csharp
var order = await context.Orders
    .AsNoTracking()
    .FirstOrDefaultAsync(o => o.Id == id, ct);
```

### Deferred Execution
- Build queries as `IQueryable<T>` and materialize only at the end.
- Never call `ToList()` mid-chain when you still have filtering to apply.

```csharp
IQueryable<Order> query = context.Orders.AsNoTracking();

if (status.HasValue)
    query = query.Where(o => o.Status == status.Value);

if (customerId.HasValue)
    query = query.Where(o => o.CustomerId == customerId.Value);

var result = await query
    .OrderByDescending(o => o.CreatedAt)
    .Skip((page - 1) * pageSize)
    .Take(pageSize)
    .ToListAsync(ct);
```

---

## Transactions

```csharp
await using var transaction = await context.Database.BeginTransactionAsync(ct);
try
{
    // perform multiple operations
    await context.SaveChangesAsync(ct);
    await transaction.CommitAsync(ct);
}
catch
{
    await transaction.RollbackAsync(ct);
    throw;
}
```

---

## Concurrency

Use a `RowVersion` / `xmin` (PostgreSQL) concurrency token to detect conflicting updates:

```csharp
public class Order
{
    [Timestamp]
    public byte[] RowVersion { get; set; } = [];
}

// Configuration alternative
builder.Property(o => o.RowVersion).IsRowVersion();
```

Handle `DbUpdateConcurrencyException` in your application layer.

---

## Performance Tips

| Tip | Why |
|---|---|
| `AsNoTracking()` on read queries | Avoids change-tracker overhead |
| `Select()` projections | Avoids loading unused columns |
| Indexes on foreign keys and filter columns | Prevents full table scans |
| `ExecuteUpdateAsync` / `ExecuteDeleteAsync` | Bulk operations without loading entities into memory |
| Compiled queries | Reduces query plan compilation overhead for hot paths |
| Split queries for large collection includes | Avoids Cartesian explosion |

```csharp
// Bulk delete without loading entities (EF Core 7+)
await context.Orders
    .Where(o => o.Status == OrderStatus.Cancelled && o.CreatedAt < cutoff)
    .ExecuteDeleteAsync(ct);

// Bulk update (EF Core 7+)
await context.Orders
    .Where(o => o.CustomerId == customerId)
    .ExecuteUpdateAsync(s => s.SetProperty(o => o.Status, OrderStatus.Cancelled), ct);
```

---

## Repository Pattern with EF Core

Use a thin repository to abstract EF Core from the application layer:

```csharp
public interface IOrderRepository
{
    Task<Order?> FindAsync(Guid id, CancellationToken ct);
    Task<List<Order>> ListByCustomerAsync(Guid customerId, CancellationToken ct);
    void Add(Order order);
}

public class OrderRepository(AppDbContext context) : IOrderRepository
{
    public Task<Order?> FindAsync(Guid id, CancellationToken ct) =>
        context.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id, ct);

    public Task<List<Order>> ListByCustomerAsync(Guid customerId, CancellationToken ct) =>
        context.Orders
            .AsNoTracking()
            .Where(o => o.CustomerId == customerId)
            .ToListAsync(ct);

    public void Add(Order order) => context.Orders.Add(order);
}
```

The `AppDbContext` itself acts as the Unit of Work — call `SaveChangesAsync()` once per request/use-case to commit all tracked changes.

---

## Data Seeding

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Category>().HasData(
        new Category { Id = 1, Name = "Electronics" },
        new Category { Id = 2, Name = "Books" }
    );
}
```

For complex seeding logic, use a separate seeder class called from `Program.cs` in development:

```csharp
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
    await seeder.SeedAsync();
}
```

---

## Common Mistakes to Avoid

- **Lazy loading in production** — can trigger hundreds of queries; always use eager or explicit loading.
- **Disposing DbContext too early** — use scoped lifetime; let the DI container manage it.
- **Calling SaveChanges inside a loop** — batch all changes and call once.
- **Returning `IQueryable<T>` from repositories** — leaks EF Core dependency into the application layer.
- **Not using CancellationToken** — always pass it to async EF Core methods.
- **Migrations in wrong project** — always specify `--project` and `--startup-project`.
