### Mentalny model pracy:

1. zmieniasz model w `contract.prisma`
2. `pnpm db:emit` (tworzy w folderze `generated/` typy)
3. `pnpm db:update` (aplikuje zmiany bezpośredio do bazy)
4. kodujesz w NestJS/Next.js z aktualnymi typami

### Gdy feature jest skończony (przygotonie do commita w Git):

1. `pnpm db:plan --name add_user_model` (tworzy snapshot migracji, flaga name opcjonalna)
2. `pnpm db:migrate` (zatwierdza migracje w bazie)
3. można commitować do gita