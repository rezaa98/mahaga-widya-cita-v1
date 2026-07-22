import * as migration_20260719_165539_prod_sync from "./20260719_165539_prod_sync";
import * as migration_20260722_170000_enable_rls_security from "./20260722_170000_enable_rls_security";

export const migrations = [
  {
    up: migration_20260719_165539_prod_sync.up,
    down: migration_20260719_165539_prod_sync.down,
    name: "20260719_165539_prod_sync",
  },
  {
    up: migration_20260722_170000_enable_rls_security.up,
    down: migration_20260722_170000_enable_rls_security.down,
    name: "20260722_170000_enable_rls_security",
  },
];

