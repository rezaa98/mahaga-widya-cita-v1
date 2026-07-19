# Sprint 4: Editorial Experience

This sprint focuses on significantly improving the editorial workflow, content moderation, and visual aesthetics of the admin panel for Mahaga Widya Cita.

## Features Implemented

### 1. Custom Visual List Cells
- **ArticleTitleCell**: Replaces plain text with a visual summary in the admin list view. Shows the article's featured image thumbnail, title, and category badge.
- **JournalTitleCell**: Shows the journal's cover image thumbnail alongside its title, publication year, volume, and issue.
- **MediaPreviewCell**: Provides a thumbnail preview for images or a corresponding file type icon for PDFs and other files in the Media collection list.

### 2. Enhanced Editorial Workflow
- **EditorialStatusCell**: A completely revamped status badge. It now uses semantic colors (e.g., green for approved, amber for in review) and displays icons and tooltips explaining the meaning of each workflow stage.
- **EditorActionBar**: A sticky action bar positioned below the Payload editor toolbar. It shows the current status and provides role-based action buttons (e.g., "Kirim Review", "Publish") for quick status transitions. Includes a prominent "Preview" button.
- **ReviewPanel**: A styled card in the sidebar that makes review notes more prominent. It changes border color based on the review status (in review, revision requested, approved).

### 3. Search and Filtering
- Added `listSearchableFields` to Articles, Journals, and Media collections, allowing editors to easily search by title, slug, excerpt, doi, alt text, and filename.

### 4. Admin CSS Tokens and Polish
- Added semantic design tokens for the editorial statuses (e.g., `--admin-status-draft-bg`).
- Polished responsive behavior for the admin dashboard and list cells.
- Added accessibility improvements (e.g., focus rings on interactive elements).

## Defenses Added for Production
- Re-architected the `payload.config.ts` so `push: true` is only enabled in development. This prevents dangerous uncontrolled schema synchronizations on Vercel during cold starts.
- Added defensive `try/catch` error boundaries to all frontend routes (`/`, `/jurnal`, `/jurnal/[slug]`, `sitemap.ts`) so the website degrades gracefully instead of crashing if a database collection or column is temporarily missing.
- Added a robust, user-friendly `error.tsx` boundary for the frontend route group to replace the default Next.js stack trace.
