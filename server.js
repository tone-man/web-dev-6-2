/**
 * This is where the node server is run. Handles serving pages and database queries.
 *
 * Typically we would have a dedicated backend server but overkill for a class project.
 */

let http = require("http");
let url = require("url");
let fs = require("fs");
let path = require("path");

const PORT_NUM = 5008; // Port the server serves from
const doTrace = true; // Tracer for testing

// Create Server
const server = http.createServer(handleRequest);
server.listen(PORT_NUM, () => {
  console.log(`Server is running on port ${PORT_NUM}`);
});

/**
 * Entry point for handling client requests.
 *
 * @param {Object} req - The client request object.
 * @param {Object} res - The HTTP response object to send to the client.
 */
function handleRequest(req, res) {
  const { pathname } = url.parse(req.url, true);
  const subpaths = pathname.split("/");

  subpaths.shift(); // Remove the starting subpath
  trace(subpaths);

  trace(`Handling request from client for ${pathname}`);

  switch (subpaths.shift()) {
    case "":
      handleHomePage(subpaths, req, res);
      break;
    case "adduser":
      handleUsers(subpaths, req, res);
      break;
    case "public":
      handlePublic(subpaths, req, res);
      break;

    default:
      sendNotFound(res);
  }

  trace(`Completed request for ${pathname}`);
}

/**
 * Handles client requests to the home page.
 *
 * @param {Object} req - The client request object.
 * @param {Object} res - The HTTP response object to send to the client.
 */
function handleHomePage(subpaths, req, res) {
  trace(`Handling homepage request.`);

  if (req.method === "GET") {
    handleFile(res, "public/index.html");
  } else sendMethodNotAllowed(res);

  trace(`Completed homepage request.`);
}

/**
 * Handles client requests to the public directory.
 *
 * @param {Array<String>} subpaths - The subpaths left to travel.
 * @param {Object} req - The client request object.
 * @param {Object} res - The HTTP response object to send to the client.
 */
function handlePublic(subpaths, req, res) {
  trace(`Handling public directory request.`);

  if (req.method === "GET") {
    handleFile(res, path.join("src/", ...subpaths));
  } else sendMethodNotAllowed(res);

  trace(`Completed homepage request.`);
}

/**
 * Handles returning a file to the client
 * @param {object} res - The HTTP response object to send to the client.
 * @param {string} filepath - The path to the file.
 */
function handleFile(res, filepath) {
  trace(`Writing ${filepath} as response.`);

  fs.readFile(filepath, (err, data) => {
    if (err) {
      console.log(err);
      sendInternalServerError(res);
    } else {
      // Use path.extname to define content.
      let contentType = "text/plain";

      switch (path.extname(filepath)) {
        case ".html":
          contentType = "text/html";
          break;
        case ".css":
          contentType = "text/css";
          break;
        case ".js":
          contentType = "text/javascript";
      }

      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);

      trace(`index.html response written.`);
    }
  });
}

/**
 * Sends a "Bad Request" response to the client.
 * @param {object} res - The HTTP response object to send to the client.
 */
function sendBadRequest(res) {
  trace(`Writing bad request response.`);

  res.writeHead(400, { "Content-Type": "text/html" });
  res.end("Bad Request.");

  trace(`Bad request response written.`);
}

/**
 * Sends a "Resource Not Found" response to the client.
 * @param {object} res - The HTTP response object to send to the client.
 */
function sendNotFound(res) {
  trace(`Writing resource not found response.`);

  res.writeHead(404, { "Content-Type": "text/html" });
  res.end("Resource not found.");

  trace(`Resource not found response written.`);
}

/**
 * Sends a "Method Not Allowed" response to the client.
 * @param {object} res - The HTTP response object to send to the client.
 */
function sendMethodNotAllowed(res) {
  trace(`Writing method not allowed response.`);

  res.writeHead(405, { "Content-Type": "text/html" });
  res.end("Method not allowed.");

  trace(`Method not allowed response written.`);
}

/**
 * Sends an "Internal Server Error" response to the client.
 * @param {object} res - The HTTP response object to send to the client.
 */
function sendInternalServerError(res) {
  trace(`Writing intrenal server error response.`);

  res.writeHead(500, { "Content-Type": "text/html" });
  res.end("Internal Server Error");

  trace(`Internal server error response written.`);
}

// Close the db connection
function closeDB() {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Closed the database connection.");
  });
}

/**
 * Function to add a provided username to the user table
 * @param {string} username
 *
 * TODO: Move this function to another file called "userController.js" or the like.
 * TODO: Make this a promise so we can check if it succeeds/fails and respond accordingly.
 */
function addUser(username) {
  // insert one row into the langs table
  db.run(
    `INSERT OR IGNORE INTO user (username) VALUES(?)`,
    [username],
    function (err) {
      if (err) {
        return console.log(err.message);
      }
      // get the last insert id
      console.log(`A row has been inserted with rowid: ${this.lastID}`);
    }
  );
}

/**
 * This helper function prints a message to the screen on if {@code doTracing} is true.
 *
 * @param msg the message to display to the screen.
 */
function trace(msg) {
  if (doTrace) console.log(msg);
}
