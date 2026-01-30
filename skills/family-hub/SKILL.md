---
name: family-hub
description: Manages family calendar (Google Calendar), tasks, grocery lists, and nanny coordination. Uses GOOGLE_CALENDAR_ID, GOOGLE_CREDENTIALS_JSON, SUPABASE_URL, SUPABASE_ANON_KEY from environment.
---

# Family Hub Skill

Manages family calendar, tasks, grocery lists, and nanny coordination.

## Overview

Integrates with Google Calendar for scheduling and Supabase for task and grocery management. Environment variables: `GOOGLE_CALENDAR_ID`, `GOOGLE_CREDENTIALS_JSON`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`.

## Features

### Calendar (Google Calendar)
- Read family schedules
- Daily event summaries
- Create events

### Tasks (Supabase)
- Create and track tasks
- Assign to family members or nanny
- Due date and completion status

### Grocery (Supabase)
- Lactose-free filtering
- Add/complete items

## Commands

- "calendario" / "eventos hoy" - Today's events
- "eventos mañana" - Tomorrow's events
- "añadir tarea: [título] para [persona]" - Add task
- "tareas" / "tareas pendientes" - List tasks
- "lista de compra" - Grocery list
- "añadir a compra: [artículo]" - Add to grocery
