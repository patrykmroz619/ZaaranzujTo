# Storage Module - Quickstart

## Local Setup

To run storage endpoints locally, ensure you have the following `.env` settings pointing to a true or mocked S3-compatible service:

```env
# S3/R2 Configuration
R2_ENDPOINT=https://<your-account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-key-id
R2_SECRET_ACCESS_KEY=your-secret
R2_BUCKET_NAME=zaaranzujto-assets
```

## Running the app

Since this is part of the `platform-api` modular monolith, deploy via standard startup:

```bash
cd apps/platform-api
bun run start:dev
```

## Testing Signed URLs locally

Once authenticated via Swagger/Clerk, call the API locally:
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/v1/storage/assets/{assetId}/download-url
```
You will receive a temporary direct R2 link.
