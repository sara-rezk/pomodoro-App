# Security Specification & "Dirty Dozen" Payloads

This specification documents the Firestore Access Control design for Lumina. All data resides inside secure subfolders containing the authenticated user's ID (`request.auth.uid`).

## 1. Data Invariants

- **Ownership Integrity**: A user can ONLY read, create, update, or delete profiles, tasks, goals, flashcards, or session todos that sit directly under their own subfolder `/users/{userId}`.
- **Strict Schema Control**: Any created object must strictly match the types and lengths defined. No "ghost fields" (additional fields like `isAdmin`) can be injected and saved.
- **Timestamp Integrity**: `createdAt` and `updatedAt` on tasks and profiles must use `request.time` directly rather than client-controlled values.

## 2. The "Dirty Dozen" Payloads (Red Team Attack Simulation)

The following payloads outline adversarial write attempts designed to break rules:

1. **Identity Spoofing**: Registering a profile under user id `victim_uid` while authenticated as `attacker_uid`.
2. **Ghost Field Injection**: Adding an unrequested field `role: "admin"` to the user profile payload to try to secure administrative privileges.
3. **Invalid Email Binding**: Registering a profile with `email: "admin@systems.com"` whilst using a basic oauth credential, attempting to sign up with a fake unverified email.
4. **Task Orphanage**: Appending a task under another victim's task path: `/users/victim_uid/tasks/some_task_id`.
5. **Session Todo Poisoning**: Injecting a 2MB string as task description or name to exhaust Firestore database quota space.
6. **Timeline Hijacking**: Artificially bypassing limits by injecting `createdAt: "2019-01-01"` in order to claim early level-ups.
7. **Negative Level Cheat**: Sending profile update with `level: -5` or `xp: -100` to corrupt the database levels.
8. **Goal State Cheat**: Tampering hours to complete a goal without study: `currentHours: 99999` while the goal target is `10`.
9. **Flashcard Repetition Cheat**: Setting `repetition: -1` or extreme easing value `easeFactor: 1000` to crash cards reviews scheduler.
10. **Priority Spoofing**: Creating a Session Todo with priority `"forbidden_priority_rank"`, bypassing allowed high, medium, and low enums.
11. **Blanket Read Attack**: Requesting raw document access to `/users` without specifying an ID query.
12. **Foreign Flashcard Review Theft**: Attempting to delete or read memory cards belonging to `/users/victim_uid/flashcards/card_123`.

## 3. Policy Rule Verification

The security rules defined in `firestore.rules` must strictly reject all 12 of these rogue operations with `PERMISSION_DENIED` errors.
