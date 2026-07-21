---
version: alpha
name: UI Skills
description: Design language for the UI Skills catalog and its design-engineering documentation surfaces.
colors:
  parchment-50: oklch(0.985 0 0)
  parchment-100: oklch(0.97 0 0)
  parchment-200: oklch(0.92 0 0)
  parchment-300: oklch(0.84 0 0)
  parchment-400: oklch(0.7 0 0)
  parchment-500: oklch(0.55 0 0)
  parchment-600: oklch(0.42 0 0)
  parchment-700: oklch(0.3 0 0)
  parchment-800: oklch(0.18 0 0)
  parchment-900: oklch(0.09 0 0)
  primary: oklch(0.09 0 0)
  secondary: oklch(0.42 0 0)
  tertiary: oklch(0.7 0 0)
typography:
  mono:
    fontFamily: JetBrains Mono
---

## Overview

UI Skills is a catalog for design-engineering skills and copy-ready implementation guidance. Its interface uses a restrained neutral system, compact editorial layouts, and code-oriented surfaces so the content remains the visual focus.

## Colors

- Use the parchment scale for interface text, borders, muted states, and neutral surfaces.
- Use `primary` for the strongest text and action contrast, `secondary` for supporting copy, and `tertiary` for subdued labels and unavailable states.
- Keep the page background at the light end of the parchment scale and use white for elevated or focused surfaces such as cards, code blocks, dialogs, inputs, and navigation controls.

## Typography

- Use the project sans-serif stack for body and interface copy, with medium-weight, tight-tracking headings for page titles and section headings.
- Use `{typography.mono.fontFamily}` for commands, code, keyboard shortcuts, and other technical content.
- Keep body copy at the base text size; use larger section copy and major headings to establish hierarchy without decorative display treatments.

## Layout

- Keep primary content in a centered, narrow reading column with generous vertical separation between breadcrumb, heading, content, and related sections.
- Use responsive grid layouts for skill collections, expanding from compact mobile columns to multiple desktop columns while preserving consistent gaps.
- Keep mobile content flush to the viewport with horizontal padding and allow long technical strings to wrap or scroll rather than forcing layout overflow.

## Elevation & Depth

- Prefer light borders and minimal shadows to separate surfaces; reserve stronger separation for white code, dialog, input, and content surfaces.
- Use a translucent dark backdrop and a white raised panel for modal search, with the active result distinguished by a light parchment fill rather than a saturated accent.

## Shapes

- Use restrained rounded corners on cards, controls, tags, inputs, dialogs, and code surfaces; keep the page and long-form content structure open and rectangular where no surface boundary is needed.
- Use thin neutral borders for outlined controls and cards, with parchment-tinted hover fills instead of heavy decoration.

## Components

- Skill cards should present the skill identifier first, optional supporting description second, and source attribution last with a small circular avatar; the entire card is the interaction target.
- Buttons and navigation controls should use compact inline layouts, sentence-case labels, neutral outlines or transparent ghost treatments, and visible parchment hover states.
- Code blocks should use a white surface, monospace content, restrained framing, and a nearby copy action; installation commands should remain easy to scan and copy on mobile.
- Search should open as a focused white dialog with a clear input, keyboard navigation, result highlighting, and explicit empty-state feedback.

## Do's and Don'ts

- Do keep labels and link text in sentence case.
- Do provide visible focus treatment for interactive controls.
- Don't introduce decorative color accents when the parchment neutral scale can express the state.
