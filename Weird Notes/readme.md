# EF Core Invalid Column Name 'TempId' generated on scaffolded view with navigation property added afterward

## long story short:
If the column is utterly bogus and coming out of god knows where, add `entity.Ignore("TempId")` to model creating.

### context:
Scaffolded a DB context with a view, A, that should be able to left join to a table, B.
For ease of EF querying, wanted A to have a navigation property to B and vice versa.
No hacks to the scaffolded code - nothing should get borked because of re-scaffolding

broad steps are like:
1. add navigation properties into partial classes for models A and B 
  2. no need to add decorators as magic will happen in OnModelCreatingPartial
1. to OnModelCreatingPartial for DB context, add entity with:
```
modelBuilder.Entity<ModelA>(entity =>
{
    entity.Ignore("TempId");    // stupid hack necessary to get rid of TempId that is erroneously expected when A has [Keyless] attribute (as scaffolded)
    entity.Metadata.IsKeyless = false;  // necessary if HasNoKey is generated
    entity.HasKey(a => a.IdOrEquivalent);
    entity.HasMany(a => a.Bs)
        .WithOne(b => b.A)  // use has one / many and with one / many as appropriate; set the nav props to each other
        .HasForeignKey(b => b.KeyToA)
        .HasPrincipalKey(a => a.IdOrEquivalent);
});
```
1. profit

etc etc etc finish this later 
