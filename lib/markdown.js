var fs = require('fs'),
    path = require('path'),
    url = require('url'),
    marked = require('marked');

/** Helper method to replace custom <nop></nop> tags for escaping the
 marked engine */
var replaceNops = function (html) {
    return html
        .replace(/<nop>/g, '')
        .replace(/<\/nop>/g, '');
};


/** Unescapes the following symbols, initially these are escaped by the
 marked engine */
var unescape = function (html) {
    return html
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&');
};


function expressMarkdown(options) {
    if (!options)
        throw new Error("Missing options argument");

    var dir = options.directory;

    if (!dir)
        throw new Error('Missing "directory" value in options');

    marked.setOptions(options.marked);

    // clean up path, remove '..'
    dir = path.resolve(dir);

    return function (req, res, next) {
        var file = decodeURIComponent(url.parse(req.url).pathname);
        file = options.caseSensitive ? file : file.toLowerCase();

        if (file.slice(-3) !== '.md' && file.slice(-9) !== '.markdown')
            return next();

        file = dir + file;
        file = path.normalize(file);

        // make sure the final path is in our defined directory
        if (file.substr(0, dir.length) !== dir)
        // bad request
            return res.send(400);

        fs.exists(file, function (exists) {
            if (!exists)
            // not found
                return res.send(404);
            //return next();

            fs.readFile(file, 'utf8', function (err, data) {
                if (err)
                // internal server error
                    return res.send(500);
                //return next(err);

                //data = replaceNops(data);
                //data = unescape(data);

                if (options.view) {
                    options.context.includerawtext = options.includerawtext ? true : false;
                    options.context.rawtext = options.includerawtext ? data : '';
                    options.context.loadepiceditor = options.loadepiceditor ? true : false;
                    options.context.content = marked(data);
                    res.render(options.view, options.context);
                }
                else {
                    res.send(data);
                }
            });
        });
    }
}

module.exports = expressMarkdown;
