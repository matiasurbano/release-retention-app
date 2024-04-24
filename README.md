# Release Retention

Author: Matias Urbano

# Tech Stack

- Typescript
- Unit Test & Coverage Tests: Jest
- Observability: opentelemetry
- Logging: Bunyan + opentelemetry instrumentation
- Multi-environment support
  - dotenv (.env locally)
  - via environment variables/pipelines in Prod.

# Pre-requisites

- node
- yarn
- typescript

# Get started

### Install dependencies

```
yarn install
```

### Set environment variables

On the project root folder copy the .env from the .env.example

```
 cp .env.example .env
```

- `NODE_ENV=development`
  Will let us see Bunyan DEBUG logs as well as

- `KEEP_NUBER_OF_RELEASES=2`
  It will define the number of releases to keep that is passed to the `applyRule` function. Feel free to update this value and run it again to see different outcomes.

### Run process

This command runs ts-node with dotenv and opentelemetry instrumentation as required dependencies, and then it executes the entry-level app.ts file which starts the `applyRule` with an Opentelemetry tracer attached to it. For the purpose of this exercise, the process will import projects, environments, releases and deployments from JSON files, it has been built in a way that can be easily interchangeable by an API way, DB query or other methods.

```
yarn start
```

The process will log the details of which releases will be kept and the justification. Finally, the `applyRule` function will return a list of Releases that need to be keep.

![Results sample](/static/console-results-sample.png)

### Run Tests

The following command will run all the Unit Tests & Coverage Reports (set as >90)

```
yarn test
```

## Assumptions

### Invalid entries

Before running the `applyRule` function there is a set of verifications in place to ensure the data is accurate and valid.

I defined the following validations:

- A **Release** is invalid and not considered when:
  - VERSION is NULL
  - There is no existing (Active) project
- A **Deployment** is invalid and not considered when:
  - it has non existing ENVIRONMENT ID
  - it has non-existing Release/Project combination
