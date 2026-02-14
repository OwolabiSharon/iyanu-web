
import server from "./server";



const { APP_NAME, PORT, SENTRY_URL } = process.env;

const port =  PORT || 3000;
// Start by making sure the `assemblyai` and `node-record-lpcm16` packages are installed.
// If not, you can install it by running the following command:
// npm install assemblyai node-record-lpcm16


server.listen(port, async () => {
  console.log(`⚡️[server]: ${APP_NAME} backend is running at port:${port}`);

});
