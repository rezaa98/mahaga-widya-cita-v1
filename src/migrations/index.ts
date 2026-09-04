import * as migration_20260719_165539_prod_sync from "./20260719_165539_prod_sync";
import * as migration_20260722_170000_enable_rls_security from "./20260722_170000_enable_rls_security";
import * as migration_20260803_173500_translation_workflow from "./20260803_173500_translation_workflow";
import * as migration_20260806_210000_translation_review_history from "./20260806_210000_translation_review_history";
import * as migration_20260807_000100_beranda_team_intro from "./20260807_000100_beranda_team_intro";
import * as migration_20260807_002300_tentang_kami_show_stats from "./20260807_002300_tentang_kami_show_stats";
import * as migration_20260813_170000_localize_tentang_kami_arrays from "./20260813_170000_localize_tentang_kami_arrays";
import * as migration_20260904_173000_service_catalog_enhancements from "./20260904_173000_service_catalog_enhancements";

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
  {
    up: migration_20260803_173500_translation_workflow.up,
    down: migration_20260803_173500_translation_workflow.down,
    name: "20260803_173500_translation_workflow",
  },
  {
    up: migration_20260806_210000_translation_review_history.up,
    down: migration_20260806_210000_translation_review_history.down,
    name: "20260806_210000_translation_review_history",
  },
  {
    up: migration_20260807_000100_beranda_team_intro.up,
    down: migration_20260807_000100_beranda_team_intro.down,
    name: "20260807_000100_beranda_team_intro",
  },
  {
    up: migration_20260807_002300_tentang_kami_show_stats.up,
    down: migration_20260807_002300_tentang_kami_show_stats.down,
    name: "20260807_002300_tentang_kami_show_stats",
  },
  {
    up: migration_20260813_170000_localize_tentang_kami_arrays.up,
    down: migration_20260813_170000_localize_tentang_kami_arrays.down,
    name: "20260813_170000_localize_tentang_kami_arrays",
  },
  {
    up: migration_20260904_173000_service_catalog_enhancements.up,
    down: migration_20260904_173000_service_catalog_enhancements.down,
    name: "20260904_173000_service_catalog_enhancements",
  },
];
