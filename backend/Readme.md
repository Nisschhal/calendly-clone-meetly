## Dependencies

- bcryptjs
- class-tranfromer
- class-validator
- cors
- date-fns
- express
- dotenv
- googleapis
- js-base
- passport
- passport-jwt
- pg
- reflect-metadata
- typeorm
- uuid
- ts-node
- typescript
  `npm install bcryptjs class-transformer class-validator cors date-fns express dotenv googleapis js-base passport passport-jwt pg reflect-metadata typeorm uuid ts-node typescript`

  # Also their types are installed

  - @types/bcryptjs
  - @types/cors
  - @types/dotenv
  - @types/express
  - @types/node
  - @types/passport

  ```
  npm install -D @types/bcryptjs @types/cors @types/dotenv @types/express @types/node @types/passport
  ```

Initalize the typescript project

```
npx tsc --init
```

This will create the tsconfig.json file into the following settings
{
// Visit https://aka.ms/tsconfig to read more about this file
"compilerOptions": {
// File Layout
"rootDir": "./src",
"outDir": "./dist",

    // Environment Settings
    // See also https://aka.ms/tsconfig/module
    "module": "nodenext",
    "target": "es2021",
    "types": [],
    // For nodejs:
    // "lib": ["esnext"],
    // "types": ["node"],
    // and npm install -D @types/node

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Style Options
    // "noImplicitReturns": true,
    // "noImplicitOverride": true,
    // "noUnusedLocals": true,
    // "noUnusedParameters": true,
    // "noFallthroughCasesInSwitch": true,
    // "noPropertyAccessFromIndexSignature": true,

    // Recommended Options
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true

}
}

Create the following file structure - src - controllers - middlewares - routes - services - enums - config - @types - utils - index.ts

- ` mkdir src && cd src && mkdir controllers middlewares routes services enums config @types utils`

Create a .env file in the root directory and Copy the .env file into the root directory

## Run the server

- use the express.json() middleware to parse the body of the request
- use the express.urlencoded() middleware to parse the url of the request
- use the cors({ origin: config.clientUrl , credentials: true}) middleware to allow cross-origin requests

And run the server

## Implementation Detail

- add a .gitignore file to ignore the node_modules folder

### /src/config

- create app.config.ts to store environment variables
- create http.config.ts to store http status name: codes in object and get its type

### /src/middleware

- create errorHandler middleware to handle any error
- create asyncHandler middleware to handle async functions

### error handler middleware

- create error-code.enum.ts to store error codes
- create app-error.ts to create custom error class
- create error-handler middleware to handle AppError and other error

### database

1. Install the npm package:

`npm install typeorm`

2. You need to install reflect-metadata shim:

`npm install reflect-metadata`

and import it somewhere in the global place of your app (for example in app.ts):

`import "reflect-metadata"`

3. You may need to install node typings:

`npm install @types/node --save-dev`

4. Create database connection: src/database/database.ts
5. Create database config for typeorm: src/config/db.config.ts

6. Create database entities: src/database/entities
7. Create database migrations: src/database/migrations
