---
name: coding-agent
description: Helps with GitHub PR reviews, Linear ticket management, and Posthog analysis. Uses GITHUB_TOKEN, LINEAR_API_KEY, POSTHOG_API_KEY, POSTHOG_HOST from environment.
---

# Coding Agent Skill

Helps with GitHub PRs, Linear tickets, and Posthog analytics.

## Overview

Environment variables: `GITHUB_TOKEN`, `LINEAR_API_KEY`, `POSTHOG_API_KEY`, `POSTHOG_HOST`. Use when the user mentions GitHub, PR, Linear, tickets, or Posthog.

## Features

### GitHub
- PR review requests
- PR status and details

### Linear
- List tickets
- Ticket details
- Create/update tickets

### Posthog
- Event analysis
- Funnel and cohort insights

## Commands

- "revisar PR #123" / "PR #123" - GitHub PR
- "tickets Linear" / "ticket ABC-123" - Linear
- "análisis Posthog" / "eventos últimos 7 días" - Posthog
