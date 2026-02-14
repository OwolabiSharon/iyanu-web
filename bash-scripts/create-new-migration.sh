#! /usr/bin/bash
read -p "migration name: " MIGRATION_NAME
echo $MIGRATION_NAME
# typeorm migration:create ../src/database/migration/$MIGRATION_NAME
npx typeorm-ts-node-commonjs migration:generate -d ../src/database/ormconfig.ts ../src/database/migration/$MIGRATION_NAME -- --node_env=development

# npx typeorm-ts-node-esm migration:generate ./src/database/migration/migration-name -d ./src/database/ormconfig.ts

# bash create-new-migration.sh

