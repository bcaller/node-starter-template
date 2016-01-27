/**
 * Created by Ben on 29/11/2015.
 */
Handlebars.registerHelper('toLowerCase', function(str) {
    return str ? str.toLowerCase() : ""
});

Handlebars.registerHelper('def', function(x, options) {
    return x != null
});

Handlebars.registerHelper('round', function(x) {
    return Math.round(x)
});

Handlebars.registerHelper('eitherOr', function(a, b) {
    return a || b
});

Handlebars.registerHelper('not', function(a) {
    return !a
});

Handlebars.registerHelper('head', function(context, options) {
    //Only take first of array
    if(context.length) return options.fn(context[0])
    return ""
});

Handlebars.registerHelper('listSep', function(context, options) {
    // context is the array we iterate over
    var length = context.length
    if(length > 1 && !options.data.last) {
        var index = options.data.index
        if(index == length - 2)
            return " & "
        return ", "
    }
});