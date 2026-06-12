import * as migration_20260611_130023_init_production_schema from './20260611_130023_init_production_schema'

export const migrations = [
  {
    up: migration_20260611_130023_init_production_schema.up,
    down: migration_20260611_130023_init_production_schema.down,
    name: '20260611_130023_init_production_schema',
  },
]
