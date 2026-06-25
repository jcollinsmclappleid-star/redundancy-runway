import { createApp } from "./createApp";
import { log } from "./log";

(async () => {
  const { httpServer } = await createApp();

  const port = parseInt(process.env.PORT || "5000", 10);
  const host = "0.0.0.0";
  const onListen = () => log(`serving on port ${port}`);

  if (process.env.REPL_ID !== undefined) {
    httpServer.listen({ port, host, reusePort: true }, onListen);
  } else {
    httpServer.listen(port, host, onListen);
  }
})();
