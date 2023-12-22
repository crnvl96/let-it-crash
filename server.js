const UNKNOWN_ERROR = 1;

const knownErrors = [
  { exitCode: UNKNOWN_ERROR, event: "uncaughtException" },
  { exitCode: UNKNOWN_ERROR, event: "unhandledRejection" },
];

const log = (msg) => console.log(`pid: [${process.pid}] - ${msg}`);

process.on("exit", (code) => {
  log(`Server Closed with success`);
  log(`DB Closed with success`);
  return process.exit(code);
});

knownErrors.forEach(({ exitCode, event }) => {
  process.on(event, (error) => {
    log(`Process exiting due to ${event}`, error.message);

    if (exitCode === UNKNOWN_ERROR) {
      process.exit(exitCode);
      // process.abort() - generates an stacktrace for a deeper analysis
      return;
    }

    process.exit(exitCode);
    return;
  });
});

log("Process started");

let counter = 0;
const connectToDB = async () => {
  const random = Math.random();

  if (random < 0.3) {
    return Promise.reject("Could not connect to DB");
  }

  log("DB connected with success");

  if (++counter > 3) {
    return process.exit(0);
  }
};

setInterval(() => connectToDB(), 300);
