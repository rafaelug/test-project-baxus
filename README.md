# TEST PROJECT

TEST PROJECT:

Develop a Node.js backend with two endpoints using the Temporal workflow management framework. The backend should include the following functionality:

- Upon starting the service, generate a random keypair that will be used for signing the messages.

- A POST endpoint that receives a message and a UUID as a reference ID. This endpoint will initiate the message signing process.

- A GET endpoint that accepts the reference ID as a path parameter, allowing users to check the status of the POST request. If the signing process is complete, the GET request should return the signed message.

Ensure that both endpoints are built using Node.js, and implement the Temporal framework for managing the workflow.

Open Source Durable Execution Platform | Temporal Technologies

Build invincible apps with Temporal's open-source platform to guarantee the successful execution of services and applications in the presence of any failure.

https://temporal.io/

https://github.com/temporalio/docker-compose

## Running this sample

1. `temporal server start-dev` to start [Temporal Server](https://github.com/temporalio/cli/#installation).
2. `npm install` to install dependencies.
3. `npm run start` to start the Worker.
4. In another shell, `npm run endpoint` to run endpoints.
5. `npm run test` for unit testing endpoints.

## Considerations

- [`crypto`](./src/activities/crypto.ts): In this folder reside sign process functions `signProcess` and `getKeys`.
  for real use cases is recommended to use a  key management system (KMS). This `getKeys` function should retrieve the keys from a KMS or MS however, for the sake of this test, I will generate the keys here to simulate they are retrived from KMS.


