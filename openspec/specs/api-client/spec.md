## ADDED Requirements

### Requirement: Centralized Axios API client
The system SHALL provide a single Axios instance configured with `baseURL` from environment variable `VITE_API_BASE_URL`, a 15-second timeout, and request/response interceptors.

#### Scenario: Session token injection
- **WHEN** a request is made and a session token exists in the auth store
- **THEN** the interceptor SHALL add `x-session-id` header with the token value

#### Scenario: Request without session
- **WHEN** a request is made and no session token exists
- **THEN** the interceptor SHALL NOT add the `x-session-id` header

### Requirement: 401 response handling
The API client SHALL intercept 401 responses and trigger automatic logout.

#### Scenario: 401 on any request
- **WHEN** any API response returns HTTP 401
- **THEN** the client SHALL clear the auth store, clear storage, and redirect to `/login`

#### Scenario: Non-401 errors pass through
- **WHEN** an API response returns a non-401 error (400, 403, 500, etc.)
- **THEN** the client SHALL reject with a normalized `AppError` object

### Requirement: Shared API response types
The system SHALL export TypeScript types for the backend response format.

#### Scenario: Successful response shape
- **WHEN** a successful API response is received
- **THEN** it SHALL conform to `ApiResponse<T>` with shape `{ success: true, data: T }`

#### Scenario: Paginated response shape
- **WHEN** a paginated API response is received
- **THEN** it SHALL conform to `PaginatedResponse<T>` with shape `{ success: true, data: T[], meta: { page, limit, total } }`

### Requirement: Error normalization
The system SHALL provide a `normalizeApiError` utility that converts any error into a consistent `AppError` shape.

#### Scenario: Axios error with response body
- **WHEN** an AxiosError with response body `{ code, message, statusCode }` is caught
- **THEN** `normalizeApiError` SHALL return `{ code, message, statusCode }` from the body

#### Scenario: Network error without response
- **WHEN** a network error occurs (no response)
- **THEN** `normalizeApiError` SHALL return `{ code: "NETWORK_ERROR", message: "Unable to reach the server", statusCode: 0 }`

#### Scenario: Unknown error
- **WHEN** a non-Axios error is caught
- **THEN** `normalizeApiError` SHALL return `{ code: "UNKNOWN", message: "An unexpected error occurred", statusCode: 500 }`
