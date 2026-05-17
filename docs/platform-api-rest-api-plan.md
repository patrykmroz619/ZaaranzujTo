# Platform API REST Plan (v1)

## API Overview

- **Base URL (prod):** `https://api.zaaranzujto.pl/api/v1`
- **Base URL (local):** `http://localhost:3002/api/v1`
- **API versioning:** prefiks ścieżki (`/v1`).
- **Data format:** `application/json` (wyjątek: upload plików przez `multipart/form-data`).
- **Character encoding:** UTF-8.
- **Time format:** ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- **Id strategy:** MongoDB ObjectId jako string.

## Authentication

- API korzysta z **Bearer Token** wydanego przez Clerk.
- Nagłówek wymagany dla wszystkich endpointów domenowych:
  - `Authorization: Bearer <clerk_jwt_token>`
- Walidacja tokenu odbywa się po stronie `platform-api` (server-side JWT verification).
- Endpointy publiczne (bez Bearer):
  - `GET /health`
  - `POST /payments/webhook` (autoryzacja przez podpis webhooka dostawcy płatności)

## Global Data Models

Poniższe modele są używane wielokrotnie w odpowiedziach endpointów.

### UserObject

```json
{
  "id": "65f0f5f8d27f4f3d31e33a11",
  "clerkUserId": "user_2abcXYZ",
  "email": "jan.kowalski@example.com",
  "createdAt": "2026-03-15T09:00:00.000Z",
  "updatedAt": "2026-03-15T09:00:00.000Z"
}
```

### ProfileObject

```json
{
  "user": {
    "id": "65f0f5f8d27f4f3d31e33a11",
    "clerkUserId": "user_2abcXYZ",
    "email": "jan.kowalski@example.com",
    "createdAt": "2026-03-15T09:00:00.000Z",
    "updatedAt": "2026-03-15T09:00:00.000Z"
  },
  "creditBalance": 12,
  "theme": "system"
}
```

### CreditBalanceObject

```json
{
  "balance": 12,
  "reserved": 1,
  "available": 11,
  "updatedAt": "2026-03-15T11:45:00.000Z"
}
```

### CreditPackageObject

```json
{
  "packageCode": "small_20",
  "name": "Pakiet 20",
  "credits": 20,
  "price": {
    "amount": 39.0,
    "currency": "PLN"
  },
  "isActive": true
}
```

### PaymentObject

```json
{
  "id": "65f10241d27f4f3d31e33b18",
  "userId": "65f0f5f8d27f4f3d31e33a11",
  "providerPaymentId": "blik_tx_904551",
  "packageCode": "small_20",
  "creditsToAdd": 20,
  "currency": "PLN",
  "status": "confirmed",
  "idempotencyKey": "0ab6d6fb-dce7-45ba-bf7d-332055ec0c8f",
  "confirmedAt": "2026-03-15T12:01:23.000Z",
  "createdAt": "2026-03-15T11:59:10.000Z",
  "updatedAt": "2026-03-15T12:01:23.000Z"
}
```

### ProjectObject

```json
{
  "id": "65f10430d27f4f3d31e33c01",
  "name": "Mieszkanie 2026",
  "visualizationsCount": 3,
  "createdAt": "2026-03-15T12:20:00.000Z",
  "updatedAt": "2026-03-15T12:45:00.000Z"
}
```

### VisualizationSummaryObject

```json
{
  "id": "65f1084ad27f4f3d31e33d13",
  "projectId": "65f10430d27f4f3d31e33c01",
  "name": "Salon",
  "mode": "fromPhoto",
  "iterationsCount": 4,
  "latestIteration": {
    "id": "65f10a7ad27f4f3d31e33d99",
    "iterationNo": 4,
    "imageAssetId": "65f10a6fd27f4f3d31e33d98",
    "createdAt": "2026-03-15T13:02:12.000Z"
  },
  "createdAt": "2026-03-15T12:30:00.000Z",
  "updatedAt": "2026-03-15T13:02:12.000Z"
}
```

### IterationObject

```json
{
  "id": "65f10a7ad27f4f3d31e33d99",
  "iterationNo": 4,
  "baseIterationId": "65f109f1d27f4f3d31e33d54",
  "status": "succeeded",
  "generationInput": {
    "mode": "edit",
    "stylePreset": "scandinavian",
    "colors": ["light", "warm"],
    "roomType": "livingRoom",
    "prompt": "Dodaj więcej jasnego drewna i roślin",
    "referenceAssets": ["65f10a11d27f4f3d31e33d78"]
  },
  "result": {
    "imageAssetId": "65f10a6fd27f4f3d31e33d98"
  },
  "createdAt": "2026-03-15T13:02:12.000Z"
}
```

### VisualizationDetailsObject

```json
{
  "id": "65f1084ad27f4f3d31e33d13",
  "projectId": "65f10430d27f4f3d31e33c01",
  "name": "Salon",
  "mode": "fromPhoto",
  "inputRoomPhotoAssetId": "65f1082fd27f4f3d31e33d10",
  "iterations": [
    {
      "id": "65f108f4d27f4f3d31e33d30",
      "iterationNo": 1,
      "baseIterationId": null,
      "status": "succeeded",
      "generationInput": {
        "mode": "fromPhoto",
        "stylePreset": "minimalist",
        "colors": ["light"],
        "roomType": "livingRoom",
        "prompt": "Jasne, nowoczesne wnętrze",
        "referenceAssets": []
      },
      "result": {
        "imageAssetId": "65f108e9d27f4f3d31e33d2f"
      },
      "createdAt": "2026-03-15T12:31:00.000Z"
    }
  ],
  "createdAt": "2026-03-15T12:30:00.000Z",
  "updatedAt": "2026-03-15T13:02:12.000Z"
}
```

### FileAssetObject

```json
{
  "id": "65f1082fd27f4f3d31e33d10",
  "bucket": "zaaranzujto-assets",
  "r2Key": "65f0f5f8d27f4f3d31e33a11/65f10430d27f4f3d31e33c01/65f1084ad27f4f3d31e33d13/input-room.jpg",
  "mimeType": "image/jpeg",
  "sizeBytes": 1832450,
  "width": 1920,
  "height": 1080,
  "kind": "roomPhoto",
  "linkedTo": {
    "type": "visualization",
    "id": "65f1084ad27f4f3d31e33d13"
  },
  "status": "active",
  "expiresAt": null,
  "createdAt": "2026-03-15T12:29:10.000Z",
  "updatedAt": "2026-03-15T12:29:10.000Z"
}
```

### ErrorObject

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Invalid request payload",
  "details": [
    {
      "field": "name",
      "issue": "required"
    }
  ],
  "requestId": "req_1f924f00b611"
}
```

### PaginationObject

```json
{
  "page": 1,
  "pageSize": 20,
  "totalItems": 63,
  "totalPages": 4
}
```

## Endpoint Definitions

### Health

#### GET /health

- **Description**: Publiczny healthcheck do monitoringu instancji API.
- **Headers**:
  - `Accept: application/json`
- **Query Parameters**: Nie dotyczy.
- **Request Body**: Nie dotyczy.
- **Success Response**: `200 OK`

```json
{
  "status": "ok",
  "service": "platform-api",
  "version": "v1",
  "timestamp": "2026-03-15T12:00:00.000Z"
}
```

- **Error Responses**:
  - `503 Service Unavailable` — serwis chwilowo niedostępny.

### Profile

#### GET /me

- **Description**: Zwraca profil aktualnie zalogowanego użytkownika wraz z bilansem kredytów.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Accept: application/json`
- **Query Parameters**: Nie dotyczy.
- **Request Body**: Nie dotyczy.
- **Success Response**: `200 OK` (`ProfileObject`)

```json
{
  "user": {
    "id": "65f0f5f8d27f4f3d31e33a11",
    "clerkUserId": "user_2abcXYZ",
    "email": "jan.kowalski@example.com",
    "createdAt": "2026-03-15T09:00:00.000Z",
    "updatedAt": "2026-03-15T09:00:00.000Z"
  },
  "creditBalance": 12,
  "theme": "system"
}
```

- **Error Responses**:
  - `401 Unauthorized` — brak/nieprawidłowy token.
  - `404 Not Found` — profil nie istnieje (niezsynchronizowany użytkownik).

#### PATCH /me

- **Description**: Aktualizuje ustawienia profilu aplikacyjnego (np. preferencja motywu).
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Query Parameters**: Nie dotyczy.
- **Request Body**:

```json
{
  "theme": "dark"
}
```

- **Success Response**: `200 OK` (`ProfileObject`)

```json
{
  "user": {
    "id": "65f0f5f8d27f4f3d31e33a11",
    "clerkUserId": "user_2abcXYZ",
    "email": "jan.kowalski@example.com",
    "createdAt": "2026-03-15T09:00:00.000Z",
    "updatedAt": "2026-03-15T09:00:00.000Z"
  },
  "creditBalance": 12,
  "theme": "dark"
}
```

- **Error Responses**:
  - `400 Bad Request` — nieobsługiwana wartość pola `theme`.
  - `401 Unauthorized` — brak/nieprawidłowy token.

#### DELETE /me

- **Description**: Inicjuje trwałe usunięcie konta użytkownika oraz danych powiązanych (projekty, wizualizacje, pliki).
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Query Parameters**: Nie dotyczy.
- **Request Body**:

```json
{
  "confirm": true
}
```

- **Success Response**: `200 OK`

```json
{
  "deleted": true,
  "scheduledAt": "2026-03-15T13:30:00.000Z"
}
```

- **Error Responses**:
  - `400 Bad Request` — brak potwierdzenia usunięcia.
  - `401 Unauthorized` — brak/nieprawidłowy token.
  - `409 Conflict` — trwa już proces usuwania konta.

### Credits

#### GET /credits/balance

- **Description**: Pobiera bieżący bilans kredytów użytkownika (łącznie z rezerwacjami). Dla użytkownika bez utworzonego jeszcze konta kredytowego endpoint zwraca poprawny obiekt zerowy zamiast błędu 404.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Accept: application/json`
- **Query Parameters**: Nie dotyczy.
- **Request Body**: Nie dotyczy.
- **Success Response**: `200 OK` (`CreditBalanceObject`)

```json
{
  "balance": 12,
  "reserved": 1,
  "available": 11,
  "updatedAt": "2026-03-15T11:45:00.000Z"
}
```

- **Error Responses**:
  - `401 Unauthorized` — brak/nieprawidłowy token.

Przykład odpowiedzi dla użytkownika bez konta kredytowego:

```json
{
  "balance": 0,
  "reserved": 0,
  "available": 0,
  "updatedAt": "2026-03-15T11:45:00.000Z"
}
```

#### GET /credits/packages

- **Description**: Zwraca aktywne pakiety kredytowe konfigurowane po stronie backendu.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Accept: application/json`
- **Query Parameters**: Nie dotyczy.
- **Request Body**: Nie dotyczy.
- **Success Response**: `200 OK`

```json
{
  "items": [
    {
      "packageCode": "small_20",
      "name": "Pakiet 20",
      "credits": 20,
      "price": {
        "amount": 39.0,
        "currency": "PLN"
      },
      "isActive": true
    },
    {
      "packageCode": "medium_60",
      "name": "Pakiet 60",
      "credits": 60,
      "price": {
        "amount": 99.0,
        "currency": "PLN"
      },
      "isActive": true
    }
  ]
}
```

- **Error Responses**:
  - `401 Unauthorized` — brak/nieprawidłowy token.

#### POST /credits/topup

- **Description**: Ręcznie doładowuje konto kredytowe wskazanego użytkownika. Endpoint techniczny przeznaczony do użycia operatorskiego/integracyjnego i zabezpieczony kluczem API.
- **Headers**:
  - `x-api-key: <MANUAL_TOPUP_API_KEY>`
  - `Content-Type: application/json`
- **Query Parameters**: Nie dotyczy.
- **Request Body**:

```json
{
  "userId": "65f10430d27f4f3d31e33c01",
  "amount": 20,
  "reason": "Manual correction"
}
```

- **Success Response**: `201 Created`

```json
{
  "toppedUpAmount": 20,
  "balance": {
    "balance": 32,
    "reserved": 1,
    "available": 31,
    "updatedAt": "2026-03-29T12:10:00.000Z"
  }
}
```

- **Error Responses**:
  - `400 Bad Request` — niepoprawne dane wejściowe (`userId`, `amount`, `reason`).
  - `401 Unauthorized` — brak/niepoprawny `x-api-key`.

### Payments

#### POST /payments

- **Description**: Tworzy płatność za wybrany pakiet i zwraca dane inicjalizacyjne do bramki płatniczej.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Query Parameters**: Nie dotyczy.
- **Request Body**:

```json
{
  "packageCode": "small_20",
  "method": "blik",
  "returnUrl": "https://app.zaaranzujto.pl/payments/success",
  "cancelUrl": "https://app.zaaranzujto.pl/payments/cancel"
}
```

- **Success Response**: `201 Created`

```json
{
  "payment": {
    "id": "65f10241d27f4f3d31e33b18",
    "status": "pending",
    "packageCode": "small_20",
    "creditsToAdd": 20,
    "currency": "PLN",
    "createdAt": "2026-03-15T11:59:10.000Z"
  },
  "gateway": {
    "redirectUrl": "https://payments.provider.example/checkout/abc123",
    "providerPaymentId": "blik_tx_904551"
  }
}
```

- **Error Responses**:
  - `400 Bad Request` — niepoprawne dane wejściowe.
  - `401 Unauthorized` — brak/nieprawidłowy token.
  - `404 Not Found` — pakiet nie istnieje lub nieaktywny.
  - `409 Conflict` — duplikat `Idempotency-Key` z innym payloadem.

#### POST /payments/webhook

- **Description**: Publiczny webhook do potwierdzania/cancelowania płatności przez dostawcę.
- **Headers**:
  - `Content-Type: application/json`
  - `X-Provider-Signature: <signature>`
- **Query Parameters**: Nie dotyczy.
- **Request Body**:

```json
{
  "eventId": "evt_801123",
  "type": "payment.confirmed",
  "providerPaymentId": "blik_tx_904551",
  "status": "confirmed",
  "amount": 39.0,
  "currency": "PLN",
  "occurredAt": "2026-03-15T12:01:20.000Z"
}
```

- **Success Response**: `200 OK`

```json
{
  "processed": true,
  "idempotentReplay": false
}
```

- **Error Responses**:
  - `400 Bad Request` — niepoprawny format eventu.
  - `401 Unauthorized` — niepoprawny podpis webhooka.
  - `409 Conflict` — event zduplikowany z niespójnymi danymi.

### Projects

#### GET /projects

- **Description**: Zwraca listę projektów użytkownika (dashboard).
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Accept: application/json`
- **Query Parameters**:
  - `page` (opcjonalny, domyślnie `1`)
  - `pageSize` (opcjonalny, domyślnie `20`, max `100`)
  - `sort` (opcjonalny, np. `createdAt:desc`)
- **Request Body**: Nie dotyczy.
- **Success Response**: `200 OK`

```json
{
  "items": [
    {
      "id": "65f10430d27f4f3d31e33c01",
      "name": "Mieszkanie 2026",
      "visualizationsCount": 3,
      "createdAt": "2026-03-15T12:20:00.000Z",
      "updatedAt": "2026-03-15T12:45:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

- **Error Responses**:
  - `400 Bad Request` — niepoprawne parametry paginacji/sortowania.
  - `401 Unauthorized` — brak/nieprawidłowy token.

#### POST /projects

- **Description**: Tworzy nowy projekt użytkownika.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Query Parameters**: Nie dotyczy.
- **Request Body**:

```json
{
  "name": "Mieszkanie 2026"
}
```

- **Success Response**: `201 Created` (`ProjectObject`)

```json
{
  "id": "65f10430d27f4f3d31e33c01",
  "name": "Mieszkanie 2026",
  "visualizationsCount": 0,
  "createdAt": "2026-03-15T12:20:00.000Z",
  "updatedAt": "2026-03-15T12:20:00.000Z"
}
```

- **Error Responses**:
  - `400 Bad Request` — niepoprawna długość nazwy projektu.
  - `401 Unauthorized` — brak/nieprawidłowy token.

#### GET /projects/{projectId}

- **Description**: Pobiera szczegóły pojedynczego projektu.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Accept: application/json`
- **Query Parameters**: Nie dotyczy.
- **Request Body**: Nie dotyczy.
- **Success Response**: `200 OK` (`ProjectObject`)

```json
{
  "id": "65f10430d27f4f3d31e33c01",
  "name": "Mieszkanie 2026",
  "visualizationsCount": 3,
  "createdAt": "2026-03-15T12:20:00.000Z",
  "updatedAt": "2026-03-15T12:45:00.000Z"
}
```

- **Error Responses**:
  - `401 Unauthorized` — brak/nieprawidłowy token.
  - `404 Not Found` — projekt nie istnieje lub nie należy do użytkownika.

#### PATCH /projects/{projectId}

- **Description**: Aktualizuje nazwę projektu.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Query Parameters**: Nie dotyczy.
- **Request Body**:

```json
{
  "name": "Mieszkanie 2026 - wersja finalna"
}
```

- **Success Response**: `200 OK` (`ProjectObject`)

```json
{
  "id": "65f10430d27f4f3d31e33c01",
  "name": "Mieszkanie 2026 - wersja finalna",
  "visualizationsCount": 3,
  "createdAt": "2026-03-15T12:20:00.000Z",
  "updatedAt": "2026-03-15T13:10:00.000Z"
}
```

- **Error Responses**:
  - `400 Bad Request` — niepoprawna długość nazwy.
  - `401 Unauthorized` — brak/nieprawidłowy token.
  - `404 Not Found` — projekt nie istnieje lub nie należy do użytkownika.

#### DELETE /projects/{projectId}

- **Description**: Usuwa projekt wraz z wizualizacjami, iteracjami i plikami.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Query Parameters**: Nie dotyczy.
- **Request Body**: Nie dotyczy.
- **Success Response**: `200 OK`

```json
{
  "deleted": true,
  "projectId": "65f10430d27f4f3d31e33c01"
}
```

- **Error Responses**:
  - `401 Unauthorized` — brak/nieprawidłowy token.
  - `404 Not Found` — projekt nie istnieje lub nie należy do użytkownika.
  - `409 Conflict` — nie można usunąć projektu w trakcie aktywnej generacji.

### Visualizations

#### GET /projects/{projectId}/visualizations

- **Description**: Lista wizualizacji w projekcie (widok szczegółu projektu).
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Accept: application/json`
- **Query Parameters**:
  - `page` (opcjonalny, domyślnie `1`)
  - `pageSize` (opcjonalny, domyślnie `20`, max `100`)
  - `sort` (opcjonalny, domyślnie `updatedAt:desc`)
- **Request Body**: Nie dotyczy.
- **Success Response**: `200 OK`

```json
{
  "items": [
    {
      "id": "65f1084ad27f4f3d31e33d13",
      "projectId": "65f10430d27f4f3d31e33c01",
      "name": "Salon",
      "mode": "fromPhoto",
      "iterationsCount": 4,
      "latestIteration": {
        "id": "65f10a7ad27f4f3d31e33d99",
        "iterationNo": 4,
        "imageAssetId": "65f10a6fd27f4f3d31e33d98",
        "createdAt": "2026-03-15T13:02:12.000Z"
      },
      "createdAt": "2026-03-15T12:30:00.000Z",
      "updatedAt": "2026-03-15T13:02:12.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

- **Error Responses**:
  - `400 Bad Request` — niepoprawna paginacja/sortowanie.
  - `401 Unauthorized` — brak/nieprawidłowy token.
  - `404 Not Found` — projekt nie istnieje lub nie należy do użytkownika.

#### POST /projects/{projectId}/visualizations

- **Description**: Tworzy nową wizualizację bez generowania iteracji (0 kredytów na tym etapie).
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
  - `Idempotency-Key: <uuid>`
- **Query Parameters**: Nie dotyczy.
- **Request Body**:

```json
{
  "name": "Salon",
  "mode": "fromPhoto"
}
```

- **Success Response**: `201 Created` (`VisualizationDetailsObject`)

```json
{
  "id": "65f1084ad27f4f3d31e33d13",
  "projectId": "65f10430d27f4f3d31e33c01",
  "name": "Salon",
  "mode": "fromPhoto",
  "inputRoomPhotoAssetId": null,
  "iterations": [],
  "createdAt": "2026-03-15T12:30:00.000Z",
  "updatedAt": "2026-03-15T12:30:00.000Z"
}
```

- **Error Responses**:
  - `400 Bad Request` — walidacja pól formularza.
  - `401 Unauthorized` — brak/nieprawidłowy token.
  - `404 Not Found` — projekt nie istnieje.

#### GET /visualizations/{visualizationId}

- **Description**: Pobiera szczegóły wizualizacji wraz z pełną listą iteracji.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Accept: application/json`
- **Query Parameters**: Nie dotyczy.
- **Request Body**: Nie dotyczy.
- **Success Response**: `200 OK` (`VisualizationDetailsObject`)

```json
{
  "id": "65f1084ad27f4f3d31e33d13",
  "projectId": "65f10430d27f4f3d31e33c01",
  "name": "Salon",
  "mode": "fromPhoto",
  "inputRoomPhotoAssetId": "65f1082fd27f4f3d31e33d10",
  "iterations": [
    {
      "id": "65f10a7ad27f4f3d31e33d99",
      "iterationNo": 4,
      "baseIterationId": "65f109f1d27f4f3d31e33d54",
      "status": "succeeded",
      "generationInput": {
        "mode": "edit",
        "stylePreset": "scandinavian",
        "colors": ["light", "warm"],
        "roomType": "livingRoom",
        "prompt": "Dodaj więcej jasnego drewna i roślin",
        "referenceAssets": ["65f10a11d27f4f3d31e33d78"]
      },
      "result": {
        "imageAssetId": "65f10a6fd27f4f3d31e33d98"
      },
      "createdAt": "2026-03-15T13:02:12.000Z"
    }
  ],
  "createdAt": "2026-03-15T12:30:00.000Z",
  "updatedAt": "2026-03-15T13:02:12.000Z"
}
```

- **Error Responses**:
  - `401 Unauthorized` — brak/nieprawidłowy token.
  - `404 Not Found` — wizualizacja nie istnieje lub nie należy do użytkownika.

#### GET /visualizations/{visualizationId}/iterations

- **Description**: Zwraca historię iteracji (thumbnail strip) posortowaną chronologicznie.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Accept: application/json`
- **Query Parameters**:
  - `page` (opcjonalny, domyślnie `1`)
  - `pageSize` (opcjonalny, domyślnie `50`, max `200`)
  - `sort` (opcjonalny, domyślnie `iterationNo:asc`)
- **Request Body**: Nie dotyczy.
- **Success Response**: `200 OK`

```json
{
  "items": [
    {
      "id": "65f108f4d27f4f3d31e33d30",
      "iterationNo": 1,
      "baseIterationId": null,
      "status": "succeeded",
      "generationInput": {
        "mode": "fromPhoto",
        "stylePreset": "minimalist",
        "colors": ["light"],
        "roomType": "livingRoom",
        "prompt": "Jasne, nowoczesne wnętrze",
        "referenceAssets": []
      },
      "result": {
        "imageAssetId": "65f108e9d27f4f3d31e33d2f"
      },
      "createdAt": "2026-03-15T12:31:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "totalItems": 4,
    "totalPages": 1
  }
}
```

- **Error Responses**:
  - `400 Bad Request` — niepoprawna paginacja/sortowanie.
  - `401 Unauthorized` — brak/nieprawidłowy token.
  - `404 Not Found` — wizualizacja nie istnieje lub nie należy do użytkownika.

#### POST /visualizations/{visualizationId}/iterations

- **Description**: Jedyny endpoint do tworzenia nowych iteracji dla istniejącej wizualizacji (koszt 1 kredyt); obsługuje też upload plików wejściowych.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Query Parameters**: Nie dotyczy.
- **Request Body**:

```json
{
  "parentIterationId": "65f109f1d27f4f3d31e33d54",
  "roomType": "livingRoom",
  "stylePreset": "scandinavian",
  "palette": "light",
  "prompt": "Dodaj więcej jasnego drewna i roślin",
  "inputPhoto": "<binary — room photo (initial mode) OR output image of parentIterationId (edit mode), opcjonalny>",
  "referencePhotos": ["<binary, opcjonalny>"]
}
```

> `parentIterationId` (opcjonalny): ID iteracji wybranej przez użytkownika jako punkt startowy. Gdy podany, `inputPhoto` powinien zawierać obraz wyjściowy tej iteracji (frontend pobiera go automatycznie). Gdy pominięty — generacja od podstaw z opcjonalnym zdjęciem pokoju.

- **Success Response**: `201 Created` (`IterationObject`)

```json
{
  "id": "65f10a7ad27f4f3d31e33d99",
  "iterationNo": 4,
  "baseIterationId": "65f109f1d27f4f3d31e33d54",
  "status": "succeeded",
  "generationInput": {
    "mode": "edit",
    "stylePreset": "scandinavian",
    "colors": ["light", "warm"],
    "roomType": "livingRoom",
    "prompt": "Dodaj więcej jasnego drewna i roślin",
    "referenceAssets": ["65f10a11d27f4f3d31e33d78"]
  },
  "result": {
    "imageAssetId": "65f10a6fd27f4f3d31e33d98"
  },
  "createdAt": "2026-03-15T13:02:12.000Z"
}
```

- **Error Responses**:
  - `400 Bad Request` — walidacja pola `prompt` lub parametrów edycji.
  - `401 Unauthorized` — brak/nieprawidłowy token.
  - `402 Payment Required` — brak kredytów.
  - `404 Not Found` — wizualizacja lub iteracja bazowa nie istnieje.
  - `409 Conflict` — aktywna generacja już trwa.
  - `413 Payload Too Large` — przekroczony limit rozmiaru plików wejściowych.
  - `422 Unprocessable Entity` — niepoprawny technicznie obraz wejściowy.
  - `502 Bad Gateway` — błąd provider API (OpenRouter).

### Storage

- **Scope modułu**: Moduł `storage` udostępnia wyłącznie endpoint do pobrania signed URL; upload plików odbywa się przez `POST /visualizations/{visualizationId}/iterations`.

#### GET /storage/assets/{assetId}/download-url

- **Description**: Generuje krótkotrwały signed URL do pobrania/podglądu pliku użytkownika.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Accept: application/json`
- **Query Parameters**:
  - `expiresInSeconds` (opcjonalny, domyślnie `300`, max `3600`)
- **Request Body**: Nie dotyczy.
- **Success Response**: `200 OK`

```json
{
  "assetId": "65f10a6fd27f4f3d31e33d98",
  "downloadUrl": "https://r2.example/signed/abc123",
  "expiresAt": "2026-03-15T13:20:00.000Z"
}
```

- **Error Responses**:
  - `400 Bad Request` — niepoprawny `expiresInSeconds`.
  - `401 Unauthorized` — brak/nieprawidłowy token.
  - `404 Not Found` — asset nie istnieje lub nie należy do użytkownika.

## Cross-Cutting API Rules

### Validation and DTO

- Walidacja requestów przez `nest-zod` (`*.dto.ts`) i globalny `zod-validation.pipe`.
- Błędy walidacji mapowane do `400 Bad Request` (`ErrorObject`).

### Authorization and Isolation

- Wszystkie zapytania domenowe filtrują dane po `userId` wynikającym z JWT.
- Brak dostępu do cudzych zasobów zwraca `404 Not Found` (preferowane ukrycie istnienia zasobu).

### Idempotency

- Endpointy mutujące operacje finansowe mogą wymagać `Idempotency-Key`.

### Async Generation Contract

- MVP dopuszcza synchroniczną odpowiedź po zakończeniu generacji (dłuższy request bez client timeout).
- W razie przyszłej migracji do job queue należy utrzymać kompatybilność przez dodanie statusów `queued/processing` bez łamania istniejących kontraktów.

### Iteration Context

- API nie utrzymuje i nie ustawia server-side "active iteration".
- Kontekst aktywnej iteracji jest zarządzany po stronie frontendu.

### Standard Error Codes

- `400` — walidacja/payload/query.
- `401` — brak lub błędny token.
- `402` — brak kredytów dla operacji generacji.
- `404` — zasób nie istnieje lub poza zakresem użytkownika.
- `409` — konflikt stanu.
- `413` — zbyt duży plik.
- `422` — technicznie niepoprawny obraz.
- `429` — przekroczony rate limit.
- `500` — błąd wewnętrzny.
- `502` — błąd zewnętrznego providera (OpenRouter/payment).
