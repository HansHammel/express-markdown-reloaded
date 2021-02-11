var express = require("express");
var app = express();
var serveIndex = require("serve-index");
var path = require("path");
var expressmarkdown = require("../index.js");
var open = require("open");
var fs = require("fs");
var highlightjs = require("highlight.js");

var expressmarkdownpath = null;
try {
  expressmarkdownpath = require.resolve("express-markdown");
} catch (err) {}
try {
  expressmarkdownpath = require.resolve("../index.js");
} catch (err) {}

//app.use(express.bodyParser());
app.post("/savemarkdownfiles", function (req, res) {
  var filePath = path.join(__dirname, "docs", req.query.filename);
  console.log("Writing to file " + filePath);
  var writable = fs.createWriteStream(filePath, {
    flags: "r+",
    defaultEncoding: "utf8",
    fd: null,
    mode: "0666",
    autoClose: true,
  });
  req.pipe(writable);
  writable.on("eror", function (err) {
    console.error(err);
    res.end(404);
  });
  req.on("end", function () {
    res.end();
  });
});

// optional
// set view engine
//use this in your project and copy required ejs templates from node_modules/express-markdown/ejs-samples to your views
//app.set('views', path.join(__dirname, 'views'));
app.set("views", path.join(path.dirname(expressmarkdownpath), "ejs-templates"));
// set .ejs as the default extension
app.set("view engine", "ejs");

// !!!IMPORTANT: place this before static or similar middleware
app.use(
  "/docs",
  expressmarkdown({
    // directory where markdown files are stored
    // required
    directory: path.join(__dirname, "/docs"),

    // case sensitive/ camel case routing, defaults to lower case
    // optional
    // app.get('case sensitive routing') -> use express settings
    caseSensitive: app.get("case sensitive routing"),

    // view to use for rendering markdown files with a view engine
    // e.g with an ejs template -> full html page
    // optional
    // default is undefined, no view -> raw html content
    view: "markdown_epiceditor",

    // include raw text in hidden div
    includerawtext: true,

    // load epic editor, for use with markdown_epiceditor.ejs
    loadepiceditor: true,

    //optional
    // options for marked (see [https://github.com/chjj/marked](https://github.com/chjj/marked))
    // tip: skip the server side highlighting function and use markdown_advanced.ejs with client
    // side code highlighting and line numbers !!!
    marked: {
      //optional use custom marked renderer, use: var marked = require('marked');
      //renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false,
      highlight: function (code) {
        return highlightjs.highlightAuto(code).value;
      },
    },

    // variable passed in the context when rendering with a view engine
    // optional
    // e.g a title, js- and css- script may be passed in, and, raw css
    // and/or js can be executed, depending on your template (see markdown.ejs)
    context: {
      stylesheeturl: "",
      styleraw: "",
      title: "Markdown",
      jsraw: "",
      jsscripturl: "",
    },
  })
);

// now the static middleware
app.use("/docs", express.static(path.join(__dirname, "docs"), { maxAge: 0 }));

// optional
// and maybe we want to list the files
app.use("/docs", serveIndex(path.join(__dirname, "docs"), { icons: true }));

const readline = require("readline");
const os = require("os");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

var server = app.listen(3000);
console.log("Express on http://localhost:3000");
console.log("visit http://localhost:3000/docs to see your markdown files");

function closeServer() {
  console.log("closing server..." + os.EOL);
  server.close();
  rl.close();
  process.exit(0);
}

var timer = setTimeout(closeServer, 2000);

// this is used for testing so it will exit with no error codes after few secounds
rl.question(
  "Open Browser? Press Key... or Exit in 2 Seconds" + os.EOL,
  (answer) => {
    // TODO: Log the answer in a database
    clearTimeout(timer);
    open("http://localhost:3000/docs");

    rl.close();
  }
);
