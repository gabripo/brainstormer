const fs = require("fs");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="refresh" content="0;url=/brainstormer/setup" />
  <title>Brainstormer — Structured Brainstorming</title>
  <link rel="icon" href="/brainstormer/favicon.ico" />
</head>
<body>
  <p>Redirecting to <a href="/brainstormer/setup">Brainstormer</a>...</p>
</body>
</html>`;

fs.writeFileSync("docs/index.html", html);
console.log("✓ docs/index.html replaced with meta-refresh redirect");
