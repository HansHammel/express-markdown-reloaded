express-markdown-reloaded
=========================

[![NPM](https://nodei.co/npm/express-markdown-reloaded.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/express-markdown-reloaded/)
[![NPM](https://nodei.co/npm-dl/express-markdown-reloaded.png?months=9&height=3)](https://nodei.co/npm/express-markdown-reloaded/)

[![npm version](https://img.shields.io/npm/v/express-markdown-reloaded.svg)](https://www.npmjs.com/package/express-markdown-reloaded)
[![npm license](https://img.shields.io/npm/l/express-markdown-reloaded.svg)](https://www.npmjs.com/package/express-markdown-reloaded)
[![npm download](https://img.shields.io/npm/dm/express-markdown-reloaded.svg)](https://www.npmjs.com/package/express-markdown-reloaded)
[![npm download](https://img.shields.io/npm/dt/express-markdown-reloaded.svg)](https://www.npmjs.com/package/express-markdown-reloaded)
[![Package Quality](http://npm.packagequality.com/shield/express-markdown-reloaded.svg)](http://packagequality.com/#?package=express-markdown-reloaded)
[![Inline docs](http://inch-ci.org/github/HansHammel/express-markdown-reloaded.svg?branch=master)](http://inch-ci.org/github/HansHammel/express-markdown-reloaded)
[![star this repo](http://githubbadges.com/star.svg?user=HansHammel&repo=express-markdown-reloaded&style=flat&color=fff&background=007ec6)](https://github.com/HansHammel/express-markdown-reloaded)
[![fork this repo](http://githubbadges.com/fork.svg?user=HansHammel&repo=express-markdown-reloaded&style=flat&color=fff&background=007ec6)](https://github.com/HansHammel/express-markdown-reloaded/fork)
[![david dependency](https://img.shields.io/david/HansHammel/express-markdown-reloaded.svg)](https://david-dm.org/HansHammel/express-markdown-reloaded)
[![david devDependency](https://img.shields.io/david/dev/HansHammel/express-markdown-reloaded.svg)](https://david-dm.org/HansHammel/express-markdown-reloaded)
[![david optionalDependency](https://img.shields.io/david/optional/HansHammel/express-markdown-reloaded.svg)](https://david-dm.org/HansHammel/express-markdown-reloaded)
[![david peerDependency](https://img.shields.io/david/peer/HansHammel/express-markdown-reloaded.svg)](https://david-dm.org/HansHammel/express-markdown-reloaded)
[![npms score](https://badges.npms.io/express-markdown-reloaded.svg)](https://www.npmjs.com/package/express-markdown-reloaded)
[![Known Vulnerabilities](https://snyk.io/test/github/HansHammel/express-markdown-reloaded/badge.svg)](https://snyk.io/test/github/HansHammel/express-markdown-reloaded) 

Express middleware for rendering markdown files

It looks for URLs ending in ".md" or ".markdown", example: http://mysite.com/README.md

supports:
- camel case path routing
- highlighting (client and/or server side)
- line numbers
- marked options
- templates

![Render View with marked.js](screenshots/render.jpg?raw=true "Render View with marked.js")
![Editor View of EpicEditor](screenshots/edit.jpg?raw=true "Editor View of EpicEditor")
![Preview View of EpicEditor](screenshots/preview.jpg?raw=true "Preview View of EpicEditor")

Installation
------------

    npm install express-markdown-reloaded --save

or

	git clone https://github.com/HansHammel/express-markdown-reloaded.git
	cd express-markdown-reloaded
	npm install

	cd example
	npm install
	npm start

or

    npm install "git+https://git@github.com/HansHammel/express-markdown-reloaded.git" --save

Usage
-----

```javascript
var expressmarkdown = require('express-markdown-reloaded');

//optional
var highlightjs = require('highlight.js');

// optional
// set view engine
app.set('views', path.join(__dirname, 'views'));
// set .ejs as the default extension
app.set('view engine', 'ejs');

// !!!IMPORTANT: place this before static or similar middleware
app.use('/docs',expressmarkdown({

    // directory where markdown files are stored
    // required
    directory: path.join(__dirname,'/docs'),

    // case sensitive/ camel case routing, defaults to lower case
    // optional
    // app.get('case sensitive routing') -> use express settings
    caseSensitive: app.get('case sensitive routing'),

    // view to use for rendering markdown files with a view engine
    // e.g with an ejs template -> full html page
    // optional
    // default is undefined, no view -> raw html content
    view: 'markdown',

    // include raw text in hidden div
    includerawtext: true,

    // load epic editor, for use with markdown_epiceditor.ejs
    loadepiceditor: true,

    //optional
    // options for marked (see [https://github.com/chjj/marked](https://github.com/chjj/marked))
    // tip: skip the server side highlighting function and use markdown_advanced.ejs with client
    // side code highlighting and line numbers !!!
    marked: {
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false,
        highlight: function (code) {
            return highlightjs.highlightAuto(code).value;
        }
    },

    // variable passed in the context when rendering with a view engine
    // optional
    // e.g a title, js- and css- script may be passed in, and, raw css
    // and/or js can be executed, depending on your template (see markdown.ejs)
    context: {
        stylesheeturl: 'http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.0/styles/googlecode.min.css',
        styleraw: '',
        title: 'Markdown',
        //script: 'http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.0/highlight.min.js',
        jsraw: '',
        jsscripturl: ''
    }

}));

// now the static middleware
app.use('/docs',express.static(path.join(__dirname,'docs'), { maxAge: 0 }));

// optional
// and maybe we want to list the files
app.use('/docs',express.directory(path.join(__dirname,'docs'), { icons:true }));
```

sample ejs template for your view directory (markdown.ejs)

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title><%= title %></title>
        <link rel="stylesheet" href='<%= stylesheeturl %>'>
        <style>
            <%- styleraw %>
        </style>
    </head>
    <body>
        <div class="container">
            <%- content %>
        </div>
    <script defer="defer" type="text/javascript" src='<%= jsscripturl %>'></script>
        <script defer="defer" ><%= jsraw %></script>
    </body>
</html>
```

Known issues
============

- none

Contribution
============

if you would like to help improving this module, please:
- write tests
- help debugging/ solving the known issues
- send bug fixes/ pull request
- if you use this module, provide a link for reference

Changelog
=========
