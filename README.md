# ANUNCIA.AI API

## 🔄 Listing Generation Flow

### Flow Explanation

1. The frontend sends a request to create a new listing.
2. The API stores the listing with `PROCESSING` status.
3. A background job is published to Upstash QStash.
4. QStash triggers the `/process-listing` route.
5. The API generates AI images and SEO content.
6. The listing is updated to `COMPLETED`.

```mermaid
sequenceDiagram
    participant U as User (Frontend Next.js)
    participant API as API Node + Express
    participant DB as PostgreSQL
    participant Q as Upstash QStash
    participant W as /process-listing (Express Route)
    participant AI as AI Services (Image + Text)

    U->>API: POST /listings
    API->>DB: Create Listing (status=PROCESSING)
    API->>Q: Publish Job (listingId)
    API-->>U: 202 Accepted (processing)

    Q->>W: HTTP POST with listingId
    W->>DB: Fetch Listing
    W->>AI: Generate Images + SEO Content
    AI-->>W: Generated Data
    W->>DB: Save images + title + description
    W->>DB: Update status=COMPLETED
```
