# EF Core Invalid Column Name 'TempId' generated on scaffolded view with navigation property added afterward

## long story short:
If the column is utterly bogus and coming out of god knows where, add `entity.Ignore("TempId")` to model creating.

### context:
Scaffolded a DB context with a view, A, that should be able to left join to a table, B.
For ease of EF querying, wanted A to have a navigation property to B and vice versa.
No hacks to the scaffolded code - nothing should get borked because of re-scaffolding


etc etc etc finish this later 
