# Twitter Backend Clone

This project is a backend implementation for a Twitter clone using technologies such as Prisma ORM, Node.js, Express, TypeScript, and PostgreSQL.

## Technologies

- **Prisma**: A next-generation ORM for Node.js and TypeScript.
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: A minimal and flexible Node.js web application framework.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **JWT**: A compact, URL-safe means of representing claims to be transferred between two parties.

## Features

- User authentication and authorisation (signup, login)
- Request validation
- Rate limiting
- Create, read, update, and delete tweets
- Like and unlike tweets
- Retweet and unretweet tweets
- Comment on tweets
- Pagination
- Search tweets

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL

### Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/Monsieur-II/twitter-backend-clone.git
   cd twitter-backend-clone
   ```

2. **Install dependencies**:

   ```sh
    npm install
   ```

3. **Set you connection string**:

   In the `.env` file at the root of the project modify the `DATABASE_URL` variable to match your PostgreSQL connection string.:

   ```sh
   DATABASE_URL="postgresql://<username>:<password>@localhost:5432/twitter-clone"
   ```

   Replace `<username>` and `<password>` with your PostgreSQL username and password.

4. **Run the project**:

   ```sh
   npm run dev
   ```

   The server should be running on `http://localhost:3000`.

## License

See the [LICENSE](./LICENSE) file for licensing information.
