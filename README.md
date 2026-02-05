# Aegis

A bug bounty platform for all [Hack Club](https://hackclub.com) programs. Think HackerOne, but with more teenagers and fewer corporate suits.

## What is this?

Aegis lets security researchers (that's you, hopefully) submit bug reports for Hack Club projects. Found a vulnerability? Report it. Get glory. Maybe even a nice wad of cash.

This is the next iteration of the program, build from the ground up to not just be a Slack webhook relay.

## Getting Started

Docker is recommened for both deployment and local development since we use Postgres as a database.

1. Clone and install packages

   ```bash
   git clone https://github.com/3kh0/aegis.git
   cd aegis
   bun i
   ```

2. Start the database:

   ```bash
   docker compose up -d
   ```

3. Set up your environment:

   ```bash
   cp .env.example .env
   ```

   The only thing you will want to change is the NUXT_SESSION_PASSWORD, everything else is not mission critical

4. Run migrations and profit???

   ```bash
   bun run db:migrate
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) and try not to break anything.

## Contributing

Found a bug in the bug bounty platform? How ironic. Open an issue or PR.
