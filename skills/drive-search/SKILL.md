---
name: drive-search
description: Searches Google Drive for documents and personal information (e.g. NIE, passport, IDs). Uses GOOGLE_CREDENTIALS_JSON from environment. Optional GOOGLE_DRIVE_FOLDER_ID to limit search scope.
---

# Drive Search Skill

Searches documents in Google Drive and extracts personal information.

## Overview

Use when the user asks for personal IDs (NIE, DNI, passport number, document number), or to search/find documents in Drive. Requires `GOOGLE_CREDENTIALS_JSON` (service account JSON string). Optionally set `GOOGLE_DRIVE_FOLDER_ID` to search a specific folder.

## Commands

- "what is my NIE" / "find my passport number" - Search Drive for personal info
- "search drive for [query]" - Search documents
- "find document [name]" - Locate a document

## Notes

- Service account must have access to the Drive folder or shared files.
- For personal info queries, search proactively and return the value or "not found".
