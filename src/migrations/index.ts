import * as migration_20260611_130023_init_production_schema from './20260611_130023_init_production_schema';
import * as migration_20260612_121806_add_media_engine_prod from './20260612_121806_add_media_engine_prod';

export const migrations = [
  {
    up: migration_20260611_130023_init_production_schema.up,
    down: migration_20260611_130023_init_production_schema.down,
    name: '20260611_130023_init_production_schema',
  },
  {
    up: migration_20260612_121806_add_media_engine_prod.up,
    down: migration_20260612_121806_add_media_engine_prod.down,
    name: '20260612_121806_add_media_engine_prod'
  },
];
