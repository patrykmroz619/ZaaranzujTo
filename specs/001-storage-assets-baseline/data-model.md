# Storage & File Assets Data Model

## FileAsset (MongoDB Collection: `file_assets`)

This collection tracks the metadata for physical files stored in Cloudflare R2 or other S3-compatible blobstores.

### Schema

| Field         | Type           | Required | Description                                                         |
|---------------|----------------|----------|---------------------------------------------------------------------|
| `_id`         | `ObjectId`     | Yes      | Internal MongoDB identifier.                                        |
| `userId`      | `String`       | Yes      | The external authentication identifier (e.g., Clerk Auth ID) of the asset owner. |
| `key`         | `String`       | Yes      | The physical storage key/path in the external bucket (e.g., `user_xxx/vis_yyy/img.jpg`). |
| `mimeType`    | `String`       | Yes      | The file format identifier (e.g., `image/jpeg`).                    |
| `sizeBytes`   | `Number`       | Yes      | Exact file size in bytes for validation limits.                     |
| `createdAt`   | `Date`         | Yes      | Timestamp of metadata record creation.                              |
| `updatedAt`   | `Date`         | Yes      | Timestamp of metadata last update.                                  |

### Indexes
- `{ userId: 1 }` (Ascending) - Speeds up isolation/ownership checks.
- `{ key: 1 }` (Unique) - Ensures we don't duplicate pointers to external physical storage paths.

### Relationships
- Belongs to a single **User** implicitly via the `userId`.
- Future relationships (`projects` or `visualizations`) will hold arrays of `FileAsset._id` implicitly establishing one-to-many linkages from those domains down to storage.
