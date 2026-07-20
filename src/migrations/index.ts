import * as migration_20260719_165539_prod_sync from "./20260719_165539_prod_sync";

export const migrations = [
  {
    up: migration_20260719_165539_prod_sync.up,
    down: migration_20260719_165539_prod_sync.down,
    name: "20260719_165539_prod_sync",
  },
];
