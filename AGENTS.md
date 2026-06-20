# Codex Working Rules

## Review / Check Mode

When I ask you to "review", "check", "analyze", "inspect", "explain", or "find bugs":

- Do not modify any file.
- Do not ask for confirmation before reading files inside this project.
- Directly inspect the relevant code.
- Give me the result with:
  - issues found
  - why they are issues
  - exact file names
  - suggested fixes
- Do not make code changes in this mode.

## Edit / Modify Mode

When I ask you to "fix", "modify", "edit", "update", "implement", "refactor", or "change":

- First analyze the code.
- Do not directly modify files.
- First show me the proposed changes or diff.
- Tell me exactly which files will change.
- Wait for my approval.
- Only after I say "approved", "yes apply", or "make the changes", modify the files.

## Safety Rules

- Never edit `.env`.
- Never expose secrets.
- Never delete files unless I explicitly approve.
- Stay inside the current project workspace.