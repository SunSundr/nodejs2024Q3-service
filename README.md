# Node.js Home Library Service

This repository contains solution for a REST Home Library Service.

The project was completed as part of the [RS School](https://rs.school/) [NodeJS 2024 Q3 course (Home Library Service)](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/rest-service/assignment.md).

## Project Setup

1. **Clone the repository:**
```
git clone https://github.com/SunSundr/nodejs2024Q3-service
```
2. **Navigate to the project directory:**
```
cd nodejs2024Q3-service
```
3. **Define the `.env` file:**
```
cp .env.example .env
```
Then, open the newly created `.env` file and set the `PORT` variable to the desired port number for your application.

4. **Install the dependencies:**
```
npm install
```

## Running the Application

To run the application, you can use the following commands (npm-scripts are defined in the `package.json` file):

1. **Start the development server:**
   ```bash
   npm run start:dev
   ```
   Starts the application in development mode with automatic restarting on file changes. This is typically used for local development.

2. **Start the application (without watch mode):**
   ```bash
   npm run start
   ```
   Starts the application in development mode without automatic restarting.

3. **Start the application in debug mode:**
   ```bash
   npm run start:debug
   ```
   Starts the application in debug mode with automatic restarting on file changes.  Useful for debugging issues.

4. **Start the application in production mode:**
   ```bash
   npm run start:prod
   ```
   Starts the built application in production mode. Use this after running `npm run build`.

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.


## API Endpoints

The API exposes the following endpoints:

- ### Users *(/user route)*
`User`:
  ```typescript
  interface User {
    id: string; // uuid v4
    login: string;
    password: string;
    version: number; // integer number, increments on update
    createdAt: number; // timestamp of creation
    updatedAt: number; // timestamp of last update
  }
  ```
| Method | Endpoint | Description | Response Structure | Status Codes |
|---|---|---|---|---|
| **`GET`** | `/user` | Get all users | `[{user}, {user}, ...]` | `200 OK` |
| **`GET`** | `/user/:id` | Get single user by id | `{user}` | `200 OK`, `400 Bad Request` (Invalid UUID), `404 Not Found` |
| **`POST`** | `/user` | Create user | `{createdUser}` | `201 Created`, `400 Bad Request` (Missing required fields) |
| **`PUT`** | `/user/:id` | Update user's password | `{updatedUser}` | `200 OK`, `400 Bad Request` (Invalid UUID), `403 Forbidden` (Wrong password), `404 Not Found` |
| **`DELETE`** | `/user/:id` | Delete user | (No Content) | `204 No Content`, `400 Bad Request` (Invalid UUID), `404 Not Found` |

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
| Method | Endpoint | Description | Response Structure | Status Codes |
|---|---|---|---|---|
| **`GET`** | `/track` | Get all tracks | `[{track}, {track}, ...]` | `200 OK` |
| **`GET`** | `/track/:id` | Get single track by id | `{track}` | `200 OK`, `400 Bad Request` (Invalid UUID), `404 Not Found` |
| **`POST`** | `/track` | Create new track | `{createdTrack}` | `201 Created`, `400 Bad Request` (Missing required fields) |
| **`PUT`** | `/track/:id` | Update track info | `{updatedTrack}` | `200 OK`, `400 Bad Request` (Invalid UUID), `404 Not Found` |
| **`DELETE`** | `/track/:id` | Delete track | (No Content) | `204 No Content`, `400 Bad Request` (Invalid UUID), `404 Not Found` |

- ### Artists *(/artist route)*
`Artist`:
  ```typescript
  interface Artist {
    id: string; // uuid v4
    name: string;
    grammy: boolean;
  }
  ```
| Method | Endpoint | Description | Response Structure | Status Codes |
|---|---|---|---|---|
| **`GET`** | `/artist` | Get all artists | `[{artist}, {artist}, ...]` | `200 OK` |
| **`GET`** | `/artist/:id` | Get single artist by id | `{artist}` | `200 OK`, `400 Bad Request` (Invalid UUID), `404 Not Found` |
| **`POST`** | `/artist` | Create new artist | `{createdArtist}` | `201 Created`, `400 Bad Request` (Missing required fields) |
| **`PUT`** | `/artist/:id` | Update artist info | `{updatedArtist}` | `200 OK`, `400 Bad Request` (Invalid UUID), `404 Not Found` |
| **`DELETE`** | `/artist/:id` | Delete artist | (No Content) | `204 No Content`, `400 Bad Request` (Invalid UUID), `404 Not Found` |

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
| Method | Endpoint | Description | Response Structure | Status Codes |
|---|---|---|---|---|
| **`GET`** | `/album` | Get all albums | `[{album}, {album}, ...]` | `200 OK` |
| **`GET`** | `/album/:id` | Get single album by id | `{album}` | `200 OK`, `400 Bad Request` (Invalid UUID), `404 Not Found` |
| **`POST`** | `/album` | Create new album | `{createdAlbum}` | `201 Created`, `400 Bad Request` (Missing required fields) |
| **`PUT`** | `/album/:id` | Update album info | `{updatedAlbum}` | `200 OK`, `400 Bad Request` (Invalid UUID), `404 Not Found` |
| **`DELETE`** | `/album/:id` | Delete album | (No Content) | `204 No Content`, `400 Bad Request` (Invalid UUID), `404 Not Found` |

- ### Favorites *(/favs route)*
`Favorites`:
  ```typescript
  interface Favorites {
    artists: string[]; // favorite artists ids
    albums: string[]; // favorite albums ids
    tracks: string[]; // favorite tracks ids
  }
  ```
| Method | Endpoint | Description | Response Structure | Status Codes |
|---|---|---|---|---|
| **`GET`** | `/favs` | Get all favorites | `{ artists: [Artist[]], albums: [Album[]], tracks: [Track[]] }` | `200 OK` |
| **`POST`** | `/favs/track/:id` | Add track to favorites | (No Content) | `201 Created`, `400 Bad Request` (Invalid UUID), `422 Unprocessable Entity` (Track doesn't exist) |
| **`DELETE`** | `/favs/track/:id` | Delete track from favorites | (No Content) | `204 No Content`, `400 Bad Request` (Invalid UUID), `404 Not Found` |
| **`POST`** | `/favs/album/:id` | Add album to favorites | (No Content) | `201 Created`, `400 Bad Request` (Invalid UUID), `422 Unprocessable Entity` (Album doesn't exist) |
| **`DELETE`** | `/favs/album/:id` | Delete album from favorites | (No Content) | `204 No Content`, `400 Bad Request` (Invalid UUID), `404 Not Found` |
| **`POST`** | `/favs/artist/:id` | Add artist to favorites | (No Content) | `201 Created`, `400 Bad Request` (Invalid UUID), `422 Unprocessable Entity` (Artist doesn't exist) |
| **`DELETE`** | `/favs/artist/:id` | Delete artist from favorites | (No Content) | `204 No Content`, `400 Bad Request` (Invalid UUID), `404 Not Found` |


## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
