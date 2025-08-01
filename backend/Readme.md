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

And run the server
