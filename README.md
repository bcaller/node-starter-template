# node-starter-template
An opinionated template for kickstarting Node web apps

##Client side
- Add script files in the order you want to ./client/index.html
- Add Handlebars templates as kebab-cased *.hbs files in ./client/templates
- Add non-parametric templates as kebab-cased *.html files in ./client/templates
- Run `grunt templating` to add these template files to a Templates object (keys are camelCased file names) in the generated ./client/templates/templates.js and ./client/templates/html.js
- Use `grunt watch` to watch for changes to the templates. Maybe also use a sass watcher.

##Build on deploy / install dependencies
`npm install`

You don't need to rebuild after every change when you're developing. By default, node serves from ./client. To use the built ./dist directory use the NODE_ENV environment variable, `set NODE_ENV=production` and rebuild ./dist directory
with `grunt`
