# API Contract
**Project:** PT Mahaga Widya Cita Corporate Website & Portal

*Note: The platform heavily relies on Next.js Server Components and Server Actions. REST APIs are primarily exposed via Payload CMS automatically.*

## 1. Articles API
### `GET /api/articles`
Fetches a paginated list of articles.
- **Query Params:** `limit`, `page`, `sort`, `where[status][equals]=published`
- **Response:**
  ```json
  {
    "docs": [
      {
        "id": "uuid",
        "title": "Article Title",
        "slug": "article-slug",
        "category": { "name": "Tech" }
      }
    ],
    "totalDocs": 100,
    "totalPages": 10
  }
  ```

### `GET /api/articles/[id]`
Fetches a single article by ID or Slug.

## 2. Newsletter API
### `POST /api/newsletter`
Subscribes a user to the newsletter.
- **Payload:** `{ "email": "user@example.com" }`
- **Response:** `201 Created`
