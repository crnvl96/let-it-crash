import { spawn } from "node:child_process";

const INSTANCES = 3;

const prepareLog = (pid) => (msg) => console.log(`pid: [${pid}] - ${msg}`);

function bootstrap() {
  const cp = spawn("node", ["server.js"]);
  const log = prepareLog(cp.pid);

  log("starting...");

  cp.stdout.on("data", (msg) => console.log(msg.toString().trim()));

  cp.on("exit", (code) => {
    log(`exited with code ${code}`);
    if (code === 0) {
      return;
    }

    bootstrap();
    return;
  });
}

for (let i = 0; i < INSTANCES; i += 1) {
  bootstrap();
}
