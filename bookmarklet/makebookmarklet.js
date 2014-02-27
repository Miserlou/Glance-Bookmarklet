(function (){
    var fs = require('fs');
    var uglify = require('uglify-js');
    //Parse arguments
    var code = uglify.minify(['../spritz.js', 'inject.js']).code
    var bookmarklet = 'javascript:void(function(){' + code + '}())';
    fs.writeFileSync('bookmarklet.txt', bookmarklet);
    console.log('Done.');
})();