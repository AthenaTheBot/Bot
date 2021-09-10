const http = require("http");
const https = require("https");
const path = require("path");
const fs = require("fs");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const Athena = require("../../Athena");

const httpPort = 80;
const httpsPort = 443;

const httpsOptions = {
  cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")),
  ca: fs.readFileSync(path.join(__dirname, "certs", "chain.pem")),
  key: fs.readFileSync(path.join(__dirname, "certs", "privkey.pem")),
};

const app = express();
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
});
const httpsServer = https.createServer(httpsOptions, app);

// Configuration
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.get("/support", (req, res) => {
  res.redirect("https://discord.com/invite/etsgB9J");
});

app.get("/invite", (req, res) => {
  res.redirect(Athena.config.DASHBOARD.INVITE_LINK);
});

app.get("/source", (req, res) => {
  res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
});

// Oauth Route
const oauthRoute = require("./routes/oauth");
oauthRoute.sj = true;
app.use("/oauth", oauthRoute);

// Api Route
const apiRoute = require("./routes/api");
app.use("/api", apiRoute);

// Main Route
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

try {
  httpServer.listen(httpPort);
  httpsServer.listen(httpsPort);
} catch (err) {
  return Athena.log(2, err);
}

Athena.log(1, "Server is started on port " + httpsPort + ".");
