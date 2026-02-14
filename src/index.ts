
import server from "./server";



const { APP_NAME, PORT, SENTRY_URL } = process.env;

const port = Number(PORT) || 10000;
// Start by making sure the `assemblyai` and `node-record-lpcm16` packages are installed.
// If not, you can install it by running the following command:
// npm install assemblyai node-record-lpcm16


server.listen(port, '0.0.0.0', async () => {
  console.log(`⚡️[server]: ${APP_NAME} backend is running at port:${port}`);
});
