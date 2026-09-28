# Notifications API

## What We Built

Full notification system for users:
- Get notifications for the current user
- Mark notifications as read (single or all)
- Unread count for badge display
- Create notifications (Admin, Fleet Manager)

## API Endpoints

| Method | Route | Description | Access |
|---|---|---|---|
| GET | /api/notifications | Get my notifications | Any authenticated user |
| GET | /api/notifications/unread-count | Get unread count | Any authenticated user |
| GET | /api/notifications/:id | Get single notification | Any authenticated user |
| POST | /api/notifications | Create notification | Admin, Fleet Manager |
| PUT | /api/notifications/:id/read | Mark as read | Any authenticated user |
| PUT | /api/notifications/mark-all-read | Mark all as read | Any authenticated user |
| DELETE | /api/notifications/:id | Delete notification | Any authenticated user |

## Notification Types

| Type | Description |
|---|---|
| maintenance | Service due, repair needed |
| request | Request approved, declined, pending |
| assignment | Vehicle assigned, assignment ending |
| document | Insurance expiring, inspection due |
| system | General system notifications |

## Business Rules

- Users only see their own notifications
- Unread count is always for the current user
- Only Admin and Fleet Manager can create notifications
- Marking as read is per-user (doesn't affect other users)

## Request/Response Examples

### Get My Notifications
```
GET /api/notifications?read=false

Response:
{
  "success": true,
  "data": [
    {
      "id": "not123",
      "type": "maintenance",
      "title": "UAT 706P service due",
      "message": "Service interval reached at 156,000 km",
      "read": false,
      "link": "/maintenance",
      "timestamp": "2024-07-18T10:30:00.000Z"
    }
  ]
}
```

### Get Unread Count
```
GET /api/notifications/unread-count

Response:
{
  "success": true,
  "data": { "count": 3 }
}
```

### Mark All as Read
```
PUT /api/notifications/mark-all-read

Response:
{
  "success": true,
  "message": "All notifications marked as read"
}
```

## Query Parameters for GET /api/notifications

| Param | Type | Description |
|---|---|---|
| read | string | Filter by read status (true/false) |
| type | string | Filter by notification type |

## Next: Reports API
