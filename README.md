
# SOLAB AGENTS

This is the backend application (REST API) for solab agents.

## Steps

## 1. Download & Install packages

```
//on local
git clone <repo-host>/solab-agents
```
```
cd solab-agents

nvm install

yarn install

sudo yarn global add typeorm
```

## 2. Create gitignored files.

They are:

- src/pre-start/env/[NODE_ENV].env

## 2. Transpile

```
yarn build-dist [NODE_ENV]
```

## 3. Start the application.

```
pm2 start ./dist/ecosystem.config.js -- [NODE_ENV]
```

## 4. Application management

- restart

```
pm2 restart solab-agents
```

- logs

```
pm2 logs solab-agents
```

## 5. Migrations
Bash scripts to generate and run/revert migration(s) are located in the bash-scripts dir

```
cd bash-scripts
```

action | script 
---|---
 generate migration file | ```bash create-new-migration.sh```
 run migrations | ```bash run-migrations.sh```
 revert last migration | ```bash revert-migration.sh```
>>>>>>> 385cfab (clone-branch feat: initial commit)
