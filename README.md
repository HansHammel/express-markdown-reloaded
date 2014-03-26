express-markdown
================

Express middleware for rendering markdown files

It looks for URLs ending in ".md" or ".markdown", example: http://mysite.com/README.md

supports:
- camel case path routing
- highlighting (client and/or server side)
- line numbers
- marked options
- templates


Installation
------------

	git clone git://github.com/HansHammel/express-markdown.git
	npm install

Usage
-----

    var expressmarkdown = require('express-markdown');

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
    app.use('/docs',express.directory(path.join(__dirname,'docs'), { icons:true });

sample ejs template for your view directory (markdown.ejs)

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