- [x] Add bookmarks schema to `supabase/schema.sql`
- [x] Implement `app/api/questions/count/route.ts`
- [x] Extend `lib/questions.ts` to include `author` field
- [x] Update `app/questions-list.tsx`:
  - [x] Disable empty submit
  - [x] Don’t allow blank questions
  - [x] Display total question count
  - [x] Copy question button
  - [x] Display author who posted
  - [x] Expand/Collapse long questions
  - [ ] Edit question UI + API calls
  - [ ] Delete question UI + API calls
  - [x] Bookmark button + persisted state

- [ ] Implement API routes:
  - [ ] `app/api/questions/[id]/route.ts` (PATCH + DELETE)
  - [ ] Bookmark endpoints (toggle + fetch user bookmarks)
- [ ] Run `npm run lint` and `npm run build`

