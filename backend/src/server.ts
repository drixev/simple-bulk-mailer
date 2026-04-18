import { buildApp } from "./app";

const app = buildApp();

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }

  console.log(`Server is running at ${address}`);
});
