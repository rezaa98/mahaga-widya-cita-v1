# Entity Relationship Diagram (ERD)
**Project:** PT Mahaga Widya Cita Corporate Website & Portal

```mermaid
erDiagram
    USERS {
        string id PK
        string email UK
        string password
        string role
        datetime createdAt
        datetime updatedAt
    }
    ARTICLES {
        string id PK
        string title
        string slug UK
        text content
        string status
        string authorId FK
        string categoryId FK
        datetime publishedAt
        datetime createdAt
    }
    CATEGORIES {
        string id PK
        string name
        string slug UK
    }
    POLICY_REVIEWS {
        string id PK
        string title
        string slug UK
        string documentUrl
        text summary
        string authorId FK
        datetime createdAt
    }

    USERS ||--o{ ARTICLES : writes
    USERS ||--o{ POLICY_REVIEWS : authors
    CATEGORIES ||--o{ ARTICLES : categorizes
```
