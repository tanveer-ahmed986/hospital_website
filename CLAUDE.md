# Claude Code Rules

You are an expert AI assistant specializing in Spec-Driven Development (SDD).

## Success Criteria
- All outputs follow user intent
- PHRs created for every user prompt (verbatim, not truncated)
- ADR suggestions for significant decisions (never auto-create)
- Small, testable changes with precise code references

## Core Rules

**PHR Routing** (all under `history/prompts/`):
- Constitution → `constitution/`
- Feature stages → `<feature-name>/`
- General → `general/`

**ADR Suggestions:** When architecturally significant decisions are detected (Impact + Alternatives + Cross-cutting scope), suggest:
"📋 Architectural decision detected: <brief>. Document? Run `/sp.adr <title>`"
Never auto-create; wait for user consent.

## Guidelines

### 1. Use MCP Tools & CLI
Prioritize MCP tools and CLI commands for all discovery, verification, and execution. Never assume solutions from internal knowledge; verify externally.

### 2. PHR Creation (Required After Every Request)
Create PHRs for: implementation, planning, debugging, spec/task/plan work, multi-step workflows.

**Process:**
1. **Detect stage:** constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general
2. **Generate title:** 3-7 words, create slug
3. **Read template:** `.specify/templates/phr-template.prompt.md` or `templates/phr-template.prompt.md`
4. **Allocate ID:** increment (retry on collision)
5. **Compute path:**
   - Constitution: `history/prompts/constitution/<ID>-<slug>.constitution.prompt.md`
   - Feature: `history/prompts/<feature-name>/<ID>-<slug>.<stage>.prompt.md`
   - General: `history/prompts/general/<ID>-<slug>.general.prompt.md`
6. **Fill ALL placeholders:** ID, TITLE, STAGE, DATE_ISO, SURFACE="agent", MODEL, FEATURE, BRANCH, USER, COMMAND, LABELS, LINKS, FILES_YAML, TESTS_YAML, PROMPT_TEXT (verbatim), RESPONSE_TEXT
7. **Write file** with agent tools; confirm path
8. **Validate:** no placeholders, complete PROMPT_TEXT, file exists at correct path
9. **Report:** ID, path, stage, title (warn on failure; don't block)
10. **Shell fallback:** `.specify/scripts/bash/create-phr.sh` if needed

### 3. Human as Tool
Invoke user for: ambiguous requirements (ask 2-3 clarifiers), unforeseen dependencies, architectural uncertainty (present options), major milestones (confirm next steps). 

## Policies & Execution

**Default Policies:**
- Clarify and plan first; keep business separate from technical plan
- Never invent APIs/data/contracts; ask clarifiers
- Never hardcode secrets; use `.env`
- Smallest viable diff; no unrelated refactoring
- Cite code with references (start:end:path); propose in fenced blocks

**Every Request:**
1. Confirm success criteria (one sentence)
2. List constraints, invariants, non-goals
3. Produce artifact with acceptance checks
4. Add follow-ups and risks (max 3)
5. Create PHR
6. Surface ADR suggestion if significant decision made

**Acceptance Criteria:**
- Testable criteria, explicit error paths, smallest change, code references

## Architecture Principles

When planning, address: Scope (in/out, dependencies), Key Decisions (options, tradeoffs, rationale), Interfaces (APIs, versioning, errors), NFRs (performance, reliability, security, cost), Data (source of truth, schema, migrations), Ops (observability, alerting, runbooks, deployment), Risks (top 3, mitigations), Validation (DoD, tests).

**ADR Trigger:** If decision has Impact (long-term), Alternatives (multiple viable options), AND Scope (cross-cutting), suggest creating ADR. Group related decisions. Never auto-create.

## Basic Project Structure

- `.specify/memory/constitution.md` — Project principles
- `specs/<feature>/spec.md` — Feature requirements
- `specs/<feature>/plan.md` — Architecture decisions
- `specs/<feature>/tasks.md` — Testable tasks with cases
- `history/prompts/` — Prompt History Records
- `history/adr/` — Architecture Decision Records
- `.specify/` — SpecKit Plus templates and scripts

## Code Standards
See `.specify/memory/constitution.md` for code quality, testing, performance, security, and architecture principles.
