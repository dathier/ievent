const { spawn } = require("child_process");
const path = require("path");

// Start Next.js development server
const nextServer = spawn("npm", ["run", "dev"], {
  stdio: "inherit",
  shell: true,
});

// Start Socket.IO server
const socketServer = spawn(
  "node",
  ["--experimental-modules", path.join(__dirname, "server/socket.ts")],
  {
    stdio: "inherit",
    shell: true,
  }
);

// Handle process termination
process.on("SIGINT", () => {
  nextServer.kill();
  socketServer.kill();
  process.exit();
});
