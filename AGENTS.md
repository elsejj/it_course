This project use `bun` and `nuxt4` to build a questions web app


# Tech Stack
- bun : package manager
- nuxt4 : web framework
- tailwindcss : css framework
- nuxt/ui : ui components
- nuxt/hub : backend database


# Folder Structure

Follow nuxt4 folder structure

# MCPs

use `nuxt` mcp to get help for nuxt4
use `nuxt-ui` mcp to get help for nuxt/ui 


# Database

- **Database Dialect**: The database dialect is set in the `nuxt.config.ts` file, within the `hub.db` option or `hub.db.dialect` property.
- **Drizzle Config**: Don't generate the `drizzle.config.ts` file manually, it is generated automatically by NuxtHub.
- **Generate Migrations**: Use `bunx nuxt db generate` to automatically generate database migrations from schema changes
- **Never Write Manual Migrations**: Do not manually create SQL migration files in the `server/db/migrations/` directory
- **Workflow**:
  1. Create or modify the database schema in `server/db/schema.ts` or any other schema file in the `server/db/schema/` directory
  2. Run `bunx nuxt db generate` to generate the migration
  3. Run `bunx nuxt db migrate` to apply the migration to the database, or run `bunx nuxt dev` to apply the migration during development
- **Access the database**: Use the `db` instance from `@nuxthub/db` (or `hub:db` for backwards compatibility) to query the database, it is a Drizzle ORM instance.


# Skills

- nuxt-ui: for guide to build ui