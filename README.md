# Node.js Home Library Service

This repository contains solution for a REST Home Library Service.

The project was completed as part of the [RS School](https://rs.school/) [NodeJS 2024 Q3 course (Home Library Service)](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/logging-error-authentication-authorization/assignment.md).


## Key Features & Improvements:
![image](https://github.com/user-attachments/assets/89a36611-407f-40ae-9dfb-94d5b695a2f6)
![image](https://github.com/user-attachments/assets/fbba4453-6f30-4b34-bf3d-b03f6392e5c2)
*  **Dual ORM Support with Dynamic Switching:** The application can seamlessly switch between two popular Object-Relational Mappers (ORMs) - Prisma and TypeORM - using a single PostgreSQL database. The desired ORM is configured via an environment variable (.env file). This allows for testing and comparisons without data loss as the database persists between ORM changes. Furthermore, the application can also be run in a database-less mode (in-memory database), which is useful for testing.
*  **Dynamic Database Initialization:** The database connection is configured based on environment variables (user, password, schema). Changes to these variables will trigger an automatic database rebuild, guaranteeing the database always matches the specified settings.
*  **Automated Migrations:** All initial database migrations are applied automatically upon application startup.
*  **Flexible Database Deployment:** The application can be run either with a local PostgreSQL database (without Docker), offering easier development and testing, or inside a Docker container.
*  **Unified & Advanced Logging System:** The application boasts a significantly improved logging system that consolidates logging from NestJS, Prisma, and TypeORM into a single, consistent output. All logs are written to files via streams for optimal speed.
*  **Efficient Log Management:** Log files are automatically rotated and deleted, with a user-defined purge strategy, ensuring that disk space doesn’t grow indefinitely. You can configure the percentage of log files to delete when the log directory hits the maximum size, allowing you to balance between data retention and storage capacity.
*  **Request & User Tracking:** Every request and response log includes a unique request ID and the associated user ID, enabling precise tracking and debugging of user interactions.
*  **Flexible Swagger Documentation:** Swagger documentation can be generated using either a dynamic method (using decorators in the code) or a static approach (from a pre-defined schema file), giving you flexible documentation options.  
*  **Dynamic Application Analysis:** The application exposes a dedicated endpoint ("/"), which provides a comprehensive report on all available application endpoints at runtime, which can be used for debugging and system audits.
*  **Optimized Container Size:** The final Docker image is aggressively optimized for size, removing unused files and resulting in a container image size under 470 MB.
*  **Styled Terminal Output:** Terminal outputs are enhanced with colors and styles, for an enhanced developer experience.
*  **Streamlined Dependencies:** The project uses the latest versions of dependencies, without introducing unnecessary libraries.

## Project Setup

1. **Clone the repository:**
```bash
git clone https://github.com/SunSundr/nodejs2024Q3-service
```
2. **Navigate to the project directory:**
```bash
cd nodejs2024Q3-service
```
3. **Define the `.env` file:**
```bash
cp .env.example .env
```
4. **Install the dependencies:**
```bash
npm ci
```
## Environment variables
App needs a .env file in the root directory of the project with following environment variables:

**Server & Database Configuration:**
- **`PORT`**: Server port
- **`POSTGRES_PASSWORD`**: PostgreSQL Admin Credentials (required for Docker image initialization).
- **`POSTGRES_PORT`**: Port for the direct PostgreSQL connection (used only for direct connection, if needed for testing).
- **`DATABASE_CONTAINER_HOST`**: Database Docker container host.
- **`DATABASE_PORT`**: Database port.
- **`DATABASE_USER`**: Database username.
- **`DATABASE_PASSWORD`**: Database password.
- **`DATABASE_NAME`**: Database name.
- **`DATABASE_SCHEMA`**: Database schema name.
- **`CONTAINER_NAME_APP`**: Docker Compose application container name.
- **`CONTAINER_NAME_DB`**: Docker Compose database container name.
- **`COMPOSE_PROJECT_NAME`**: Docker Compose project name.
- **`ORM_TYPE`**: ORM type used (prisma / typeorm / memory).
- **`TYPEORM_DROPSCHEMA`**: Drop schema on startup (true/false - use with caution!).
- **`TYPEORM_SYNCHRONIZE`**: Synchronize database schema on startup (true/false - use with caution!).

**Authentication & Authorization:**
- **`CRYPT_SALT`**: Number of rounds for password hashing (adjust as needed for security). (Default: 10)
- **`JWT_SECRET_KEY`**: Secret key for JSON Web Tokens (JWTs).
- **`JWT_SECRET_REFRESH_KEY`**: Secret key for JWT refresh tokens.
- **`TOKEN_EXPIRE_TIME`**: Expiration time for access tokens (e.g., 1h, 24h, 1d). (Default: 1h)
- **`TOKEN_REFRESH_EXPIRE_TIME`**: Expiration time for refresh tokens (e.g., 24h, 7d). (Default: 24h)

**Logging:**
- **`LOG_FILE_MAX_SIZE_KB`**: Maximum size of log files in kilobytes. (Default: 512)
- **`LOG_LEVEL`**: Logging level priority (0-5). Higher numbers have higher priority. Corresponds to NestJS log levels as follows:
    - `0`: 'fatal'
    - `1`: 'error'
    - `2`: 'warn'
    - `3`: 'log' (default)
    - `4`: 'debug'
    - `5`: 'verbose'
- **`LOG_VERBOSE_STACK`**: Enable verbose stack traces in logs (true/false). (Default: false)
- **`ORM_LOGGING`**: Enable TypeORM or Prisma logging (true/false).

A `.env.example` file is provided as a template.  Copy this file to `.env` and populate it with your values.

## Running the Application

   ```bash
   npm run docker:up
   ```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Stopping application

   ```bash
   npm run docker:down
   ```

## API Endpoints

The API exposes the following endpoints:

- ### Authentication

| Method | Endpoint        | Description                                             | Request Body                          | Response Structure                              | Status Codes                                                                        |
| ------ | --------------- | ------------------------------------------------------- | ------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| `POST` | `/auth/signup`  | Create a new user                                       | `{ login: string, password: string }` | `{user}` - interface User                       | `201 Created`, `400 Bad Request` (invalid DTO)                                      |
| `POST` | `/auth/login`   | Get access and refresh tokens                           | `{ login: string, password: string }` | `{ accessToken: string, refreshToken: string }` | `200 OK`, `400 Bad Request` (invalid DTO), `403 Forbidden` (authentication failed)  |
| `POST` | `/auth/refresh` | Get new access and refresh tokens using a refresh token | `{ refreshToken: string }`            | `{ accessToken: string, refreshToken: string }` | `200 OK`, `401 Unauthorized` (invalid DTO), `403 Forbidden` (authentication failed) |

- ### Users *(/user route)*
`User`:
  ```typescript
  interface User {
    id: string; // uuid v4
    login: string;
    password: string; // hidden
    version: number; // integer number, increments on update
    createdAt: number; // timestamp of creation
    updatedAt: number; // timestamp of last update
  }
  ```
| Method       | Endpoint    | Description            | Response Structure      | Status Codes                                                                                  |
| ------------ | ----------- | ---------------------- | ----------------------- | --------------------------------------------------------------------------------------------- |
| **`GET`**    | `/user`     | Get all users          | `[{user}, {user}, ...]` | `200 OK`                                                                                      |
| **`GET`**    | `/user/:id` | Get single user by id  | `{user}`                | `200 OK`, `400 Bad Request` (Invalid UUID), `404 Not Found`                                   |
| **`POST`**   | `/user`     | Create user            | `{createdUser}`         | `201 Created`, `400 Bad Request` (Missing required fields)                                    |
| **`PUT`**    | `/user/:id` | Update user's password | `{updatedUser}`         | `200 OK`, `400 Bad Request` (Invalid UUID), `403 Forbidden` (Wrong password), `404 Not Found` |
| **`DELETE`** | `/user/:id` | Delete user            | (No Content)            | `204 No Content`, `400 Bad Request` (Invalid UUID), `404 Not Found`                           |

- ### Tracks *(/track route)*
`Track`:
 ```typescript
  interface Track {
    id: string; // uuid v4
    name: string;
    artistId: string | null; // refers to Artist
    albumId: string | null; // refers to Album
    duration: number; // integer number
  }
  ```
| Method       | Endpoint     | Description            | Response Structure        | Status Codes                                                        |
| ------------ | ------------ | ---------------------- | ------------------------- | ------------------------------------------------------------------- |
| **`GET`**    | `/track`     | Get all tracks         | `[{track}, {track}, ...]` | `200 OK`                                                            |
| **`GET`**    | `/track/:id` | Get single track by id | `{track}`                 | `200 OK`, `400 Bad Request` (Invalid UUID), `404 Not Found`         |
| **`POST`**   | `/track`     | Create new track       | `{createdTrack}`          | `201 Created`, `400 Bad Request` (Missing required fields)          |
| **`PUT`**    | `/track/:id` | Update track info      | `{updatedTrack}`          | `200 OK`, `400 Bad Request` (Invalid UUID), `404 Not Found`         |
| **`DELETE`** | `/track/:id` | Delete track           | (No Content)              | `204 No Content`, `400 Bad Request` (Invalid UUID), `404 Not Found` |

- ### Artists *(/artist route)*
`Artist`:
  ```typescript
  interface Artist {
    id: string; // uuid v4
    name: string;
    grammy: boolean;
  }
  ```
| Method       | Endpoint      | Description             | Response Structure          | Status Codes                                                        |
| ------------ | ------------- | ----------------------- | --------------------------- | ------------------------------------------------------------------- |
| **`GET`**    | `/artist`     | Get all artists         | `[{artist}, {artist}, ...]` | `200 OK`                                                            |
| **`GET`**    | `/artist/:id` | Get single artist by id | `{artist}`                  | `200 OK`, `400 Bad Request` (Invalid UUID), `404 Not Found`         |
| **`POST`**   | `/artist`     | Create new artist       | `{createdArtist}`           | `201 Created`, `400 Bad Request` (Missing required fields)          |
| **`PUT`**    | `/artist/:id` | Update artist info      | `{updatedArtist}`           | `200 OK`, `400 Bad Request` (Invalid UUID), `404 Not Found`         |
| **`DELETE`** | `/artist/:id` | Delete artist           | (No Content)                | `204 No Content`, `400 Bad Request` (Invalid UUID), `404 Not Found` |

- ### Albums *(/album route)*
`Album`:
  ```typescript
  interface Album {
    id: string; // uuid v4
    name: string;
    year: number;
    artistId: string | null; // refers to Artist
  }
  ```
| Method       | Endpoint     | Description            | Response Structure        | Status Codes                                                        |
| ------------ | ------------ | ---------------------- | ------------------------- | ------------------------------------------------------------------- |
| **`GET`**    | `/album`     | Get all albums         | `[{album}, {album}, ...]` | `200 OK`                                                            |
| **`GET`**    | `/album/:id` | Get single album by id | `{album}`                 | `200 OK`, `400 Bad Request` (Invalid UUID), `404 Not Found`         |
| **`POST`**   | `/album`     | Create new album       | `{createdAlbum}`          | `201 Created`, `400 Bad Request` (Missing required fields)          |
| **`PUT`**    | `/album/:id` | Update album info      | `{updatedAlbum}`          | `200 OK`, `400 Bad Request` (Invalid UUID), `404 Not Found`         |
| **`DELETE`** | `/album/:id` | Delete album           | (No Content)              | `204 No Content`, `400 Bad Request` (Invalid UUID), `404 Not Found` |

- ### Favorites *(/favs route)*
`Favorites`:
  ```typescript
  interface Favorites {
    artists: string[]; // favorite artists ids
    albums: string[]; // favorite albums ids
    tracks: string[]; // favorite tracks ids
  }
  ```
| Method       | Endpoint           | Description                  | Response Structure                                              | Status Codes                                                                                       |
| ------------ | ------------------ | ---------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **`GET`**    | `/favs`            | Get all favorites            | `{ artists: [Artist[]], albums: [Album[]], tracks: [Track[]] }` | `200 OK`                                                                                           |
| **`POST`**   | `/favs/track/:id`  | Add track to favorites       | (No Content)                                                    | `201 Created`, `400 Bad Request` (Invalid UUID), `422 Unprocessable Entity` (Track doesn't exist)  |
| **`DELETE`** | `/favs/track/:id`  | Delete track from favorites  | (No Content)                                                    | `204 No Content`, `400 Bad Request` (Invalid UUID), `404 Not Found`                                |
| **`POST`**   | `/favs/album/:id`  | Add album to favorites       | (No Content)                                                    | `201 Created`, `400 Bad Request` (Invalid UUID), `422 Unprocessable Entity` (Album doesn't exist)  |
| **`DELETE`** | `/favs/album/:id`  | Delete album from favorites  | (No Content)                                                    | `204 No Content`, `400 Bad Request` (Invalid UUID), `404 Not Found`                                |
| **`POST`**   | `/favs/artist/:id` | Add artist to favorites      | (No Content)                                                    | `201 Created`, `400 Bad Request` (Invalid UUID), `422 Unprocessable Entity` (Artist doesn't exist) |
| **`DELETE`** | `/favs/artist/:id` | Delete artist from favorites | (No Content)                                                    | `204 No Content`, `400 Bad Request` (Invalid UUID), `404 Not Found`                                |


## Testing

After application running open new terminal and enter:

To run all tests

```bash
npm run test
```

```bash
npm run test:auth
```

```bash
npm run test:refresh
```

To run only one of all test suites

```bash
npm run test -- <path to suite>
```

### Auto-fix and format

```bash
npm run lint
```

```bash
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

### Docker volumes

Database files and logs are stored in volumes.

### Vulnerabilities scanning

```bash
npm run docker:scan:app
```

```bash
npm run docker:scan:db
```
