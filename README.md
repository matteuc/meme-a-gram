## meme-oir :sparkles:

A simple meme-sharing web-application, built upon the powerful **React.js** framework and serviced by a robust **Fastify** GraphQL API. It features/demonstrates the following technologies:

- Authentication provided by the **AWS Cognito** web SDK
- Global state management through the **Redux Toolkit**
- User images uploaded and hosted in an **AWS S3** storage bucket
- A fast GraphQL API built on the Node web framework **Fastify** and the **Mercurius** GraphQL plugin
- Connection to **PostgreSQL** databases via the **Prisma** ORM
- Automated unit testing via **Jest**, **React Testing Library**, and the HTTP server testing library **SuperTest**
- Scalable source code written in the **TypeScript** programming language



### Getting Started

*Prerequisites*

- Installation of `Node` and `yarn`
- An AWS account
- Installation of **PostgreSQL**

#### Client Setup

1. Install the dependencies for the client application (assuming at root `/`)

   ```sh
   cd client
   
   yarn
   ```

2. Duplicate the `client/.env.example` and name the new file `client/.env`

3. To fill in the values listed in `client/.env`, you will need to create a new Cognito User Pool (instructions [here](https://docs.aws.amazon.com/cognito/latest/developerguide/getting-started-with-cognito-user-pools.html)); replace the values as shown (replacing the existing values in quotes)

   ```
   REACT_APP_COGNITO_POOL_ID="us-west-123" // Cognito User pool ID
   REACT_APP_COGNITO_POOL_CLIENT_ID="abc"  // Cognito User pool client ID
   REACT_APP_API_BASE_URI="http://localhost:4000" // Leave unchanged
   ```

#### Server Setup

1. Install the dependencies for the client application (assuming at root `/`)

   ```shell
   cd api
   
   yarn
   ```

2. Duplicate the `api/.env.example` and name the new file `api/.env`

3. To fill in the values listed in `api/.env`, you will need to create a new S3 Bucket (instructions [here](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)); Replace the values in `api/.env.example` as shown (replacing the existing values in quotes)

   ```
   // From your PostgreSQL instance, provide the specified values
   // postgresql://postgres:{default-user-pwd}@localhost:{pg-port}/{db-name}
   DATABASE_URI="postgresql://johndoe:randompassword@localhost:3306/mydb"
   
   PORT="4000" // Port server runs on, update REACT_APP_API_BASE_URI if changed
   
   AWS_ACCESS_KEY_ID="ABC" // AWS account access key ID
   
   AWS_SECRET_ACCESS_KEY="ABC/123" // AWS account secret access key
   
   S3_BUCKET_NAME="example-bucket" // S3 bucket name
   
   S3_BUCKET_REGION="us-west-1" // S3 bucket region
   
   COGNITO_USER_POOL_REGION="us-west-1" // Cognito user pool region
   
   COGNITO_USER_POOL_ID="us-west-123" // Cognito user pool ID
   ```

4. Setup the database tables and the JWK (JSON Web Key) needed for JWT verification

   ```
   yarn setup-db && yarn setup
   ```

   A file at `api/jwk.json` should be generated; it contains the JWK for the Cognito user pool

   

#### Running the application

Run both the client and server in separate terminals

##### Client

```sh
cd client

yarn start
```

You can also run `yarn build` to generate a production-ready build (without live reload)

##### Server

```sh
cd api

yarn dev
```

You can also run `yarn start` to first transpile the server into JS and run the server (without live reload)

