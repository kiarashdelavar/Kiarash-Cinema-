# Auth API Endpoints

## Register a new user

**POST** `/api/auth/register`

Registers a new user.

### Request Body (application/json)
```json
{
  "email": "kia@example.com",
  "password": "123456kd",
  "role": "user"
}
```

### Responses
- `201`: User registered successfully
- `400`: Missing required fields
- `409`: User already exists
- `500`: Error registering user

---

## Log in a user

**POST** `/api/auth/login`

Logs in a user and returns a JWT token.

### Request Body (application/json)
```json
{
  "email": "kia@example.com",
  "password": "123456kd"
}
```

### Responses
- `200`: Logged in successfully, returns a JWT token
- `401`: Invalid credentials
- `500`: Login failed

---

## Get all users (Admin only)

**GET** `/api/auth/users`

Returns a list of all registered users.

### Responses
- `200`: List of all users
```json
[
  {
    "id": 1,
    "email": "kia@example.com",
    "role": "user"
  }
]
```
- `401`: Unauthorized (no/invalid token)
- `403`: Forbidden (not admin)

---

## Delete a user (Admin only)

**DELETE** `/api/auth/users/{id}`

Deletes a user by ID.

### Parameters
- `id` (path, integer): The ID of the user to delete

### Responses
- `200`: User deleted successfully
- `401`: Unauthorized
- `403`: Forbidden
- `404`: User not found

---

## Update a user (Admin only)

**PUT** `/api/auth/users/{id}`

Updates a user's information.

### Parameters
- `id` (path, integer): The ID of the user to update

### Request Body (application/json)
```json
{
  "email": "updated@email.com",
  "password": "newpassword123",
  "role": "admin"
}
```

### Responses
- `200`: User updated successfully
- `401`: Unauthorized
- `403`: Forbidden
- `404`: User not found
- `500`: Server error during update


--- 

---

## Get Your Own Profile

**GET** `/api/auth/profile`  
Returns the profile details of the currently logged-in user.

### Responses

- `200`: Your profile info  
  Example:
  ```json
  {
    "name": "Kia",
    "email": "kia@example.com",
    "phoneNumber": "+31-612345678",
    "dateOfBirth": "1998-05-25",
    "favoriteMovies": "Interstellar, Joker",
    "bio": "Movie fan and developer"
  }
  

# Movie API Endpoints

## Get all movies

**GET** `/api/movies`

Retrieves a list of all movies.

### Responses
- `200`: A list of movies

---

## Create a new movie (Admin only)

**POST** `/api/movies`

Creates a new movie in the system.

### Request Body (application/json)
```json
{
  "title": "Inception",
  "description": "A sci-fi thriller about dreams within dreams.",
  "duration": 148,
  "genre": "sci-fi",
  "image": "https://image.url/poster.jpg",
  "price": 30
}
```

### Responses
- `201`: Movie created successfully
- `400`: Missing required fields
- `401`: Unauthorized
- `403`: Forbidden - Only admins

---

## Update a movie (Admin only)

**PUT** `/api/movies/{id}`

Updates movie details.

### Parameters
- `id` (path, integer): The ID of the movie to update

### Request Body (application/json)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "duration": 150,
  "genre": "Action",
  "image": "https://image.url/newposter.jpg",
  "price": 35
}
```

### Responses
- `200`: Movie updated
- `401`: Unauthorized
- `403`: Forbidden - Only admins
- `404`: Movie not found

---

## Delete a movie (Admin only)

**DELETE** `/api/movies/{id}`

Deletes a movie by ID.

### Parameters
- `id` (path, integer): The ID of the movie to delete

### Responses
- `200`: Movie deleted successfully
- `401`: Unauthorized
- `403`: Forbidden - Only admins
- `404`: Movie not found

---

## Get a movie by ID

**GET** `/api/movies/{id}`

Retrieves a single movie by its ID.

### Parameters
- `id` (path, integer): The ID of the movie

### Responses
- `200`: Movie found
- `404`: Movie not found

--- 

## Get Movie by Slug

**GET** `/api/movies/slug/{slug}`  
Fetches a movie using its URL-friendly slug.

### Parameters

| Name | Type   | In   | Description                     | Required |
|------|--------|------|---------------------------------|---------|
| slug | string | path | The movie slug (URL-friendly)   |  yes   |

### Responses

- `200 OK`: Movie found
- `404 Not Found`: Movie not found

---

# Reservation API Endpoints

## Create a new reservation

**POST** `/api/reservations`

Creates a new seat reservation.

### Request Body (application/json)
```json
{
  "movieId": 1,
  "userId": 5,
  "seatNumbers": "A1",
  "reservationTime": "2025-10-24T22:24:18.087Z",
  "phoneNumber": "+31-612345678",
  "building": "Cinema One",
  "seatClass": "first",
  "totalPrice": 15
}
```

### Responses
- `201`: Reservation created successfully
- `409`: Seat already reserved
- `500`: Internal server error

---

## Get all reservations (Admin only)

**GET** `/api/reservations`

Returns all reservations in the system.

### Responses
- `200`: Returns all reservations
- `401`: Unauthorized
- `403`: Forbidden

---

## Get current user's reservations

**GET** `/api/reservations/my`

Returns the reservations made by the logged-in user.

### Responses
- `200`: User's reservations
- `401`: Unauthorized

---

## Cancel a reservation (Logged-in users only)

**DELETE** `/api/reservations/{id}`

Cancels a reservation by ID.

### Parameters
- `id` (path, integer): Reservation ID

### Responses
- `200`: Reservation cancelled
- `401`: Unauthorized
- `404`: Not found

---

## Update a reservation (Logged-in users only)

**PUT** `/api/reservations/{id}`

Updates the reservation's showtime or seats.

### Parameters
- `id` (path, integer): Reservation ID

### Request Body (application/json)
```json
{
  "showtimeId": 2,
  "seatIds": [5, 6]
}
```

### Responses
- `200`: Reservation updated
- `401`: Unauthorized
- `404`: Reservation not found

--- 

## Stream

### `GET /api/stream`

Establishes a Server-Sent Events (SSE) connection for **real-time seat updates**.  
This endpoint opens a persistent connection to stream seat reservation changes (e.g., reserved, canceled) to connected clients in real time.

####  Parameters
_None_

####  Responses

| Code | Description           |
|------|-----------------------|
| 200  | SSE stream connected  |

####  Example usage

```http
GET /api/stream HTTP/1.1
Host: localhost:3000
Accept: text/event-stream
```

--- 

## Buildings

### `GET /api/buildings`

Fetches a list of all available buildings (cinema halls).

####  Parameters
_None_

####  Responses

| Code | Description            |
|------|------------------------|
| 200  | List of buildings      |
| 500  | Error fetching buildings |

####  Example usage

```http
GET /api/buildings HTTP/1.1
Host: localhost:3000
Accept: application/json
```
--- 

## Showtimes

### `GET /api/showtimes`

Fetches all available showtimes, or filters them by movie ID if provided.

####  Query Parameters

| Name     | Type    | Description                   |
|----------|---------|-------------------------------|
| movieId  | integer | (Optional) Filter by movie ID |

####  Responses

| Code | Description        |
|------|--------------------|
| 200  | List of showtimes  |
| 500  | Server error       |

####  Example usage

```http
GET /api/showtimes?movieId=3 HTTP/1.1
Host: localhost:3000
Accept: application/json
