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
    participant WT as /process-text (Worker)
    participant WI as /process-images (Worker)
    participant AI as AI Services (Text + Image)

    U->>API: POST /listings
    API->>DB: Create Listing (status=DRAFT)
    API-->>U: 201 Created (listingId)

    U->>API: POST /listings/:id/generate-text
    API->>DB: Update status=TEXT_PROCESSING
    API->>Q: Publish Job (process-text)
    API-->>U: 202 Accepted

    Q->>WT: HTTP POST (listingId)
    WT->>DB: Fetch Listing
    WT->>AI: Generate Title + Description
    AI-->>WT: Generated Text
    WT->>DB: Save title + description
    WT->>DB: Update status=TEXT_COMPLETED

    U->>API: PATCH /listings/:id/image
    API->>DB: Save originalImageUrl
    API-->>U: 200 OK

    U->>API: POST /listings/:id/generate-images
    API->>DB: Update status=IMAGE_PROCESSING
    API->>Q: Publish Job (process-images)
    API-->>U: 202 Accepted

    Q->>WI: HTTP POST (listingId)
    WI->>DB: Fetch Listing
    WI->>AI: Generate 3 Images from reference
    AI-->>WI: Generated Images
    WI->>DB: Save images
    WI->>DB: Update status=COMPLETED
```
