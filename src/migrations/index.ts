import * as migration_20260930_134216_initial from "./20260930_134216_initial";
import * as migration_20261007_082215_media_folders from "./20261007_082215_media_folders";

export const migrations = [
  {
    up: migration_20260930_134216_initial.up,
    down: migration_20260930_134216_initial.down,
    name: "20260930_134216_initial",
  },
  {
    up: migration_20261007_082215_media_folders.up,
    down: migration_20261007_082215_media_folders.down,
    name: "20261007_082215_media_folders",
  },
];
