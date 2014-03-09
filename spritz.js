// spritz.js
// A JavaScript Speed Reader
// rich@gun.io
// https://github.com/Miserlou/OpenSpritz

// Please don't abuse this.
var readability_token = '172b057cd7cfccf27b60a36f16b1acde12783893';

// Create the view from the remote resource.
function create_spritz(){

     spritz_loader = function() {

        //$.get("https://rawgithub.com/Miserlou/OpenSpritz/master/spritz.html", function(data){
        $.get("https://rawgithub.com/smorin/OpenSpritz/master/spritz.html", function(data){

            if (!($("#spritz_container").length) ) {
                $("body").prepend(data);
            }
        },'html');
        
        //$(document).bind('keypress', 'ctrl+a', function() {alert("worked")});
        // Hot keys throws an error and seems to bind to every ket  instead of just shift
        //jQuery(document).bind('keypress', 'Shift+p',function (evt){alert('shift+p'); return false; });
        
    };

    load_jq(spritz_loader);
}

// jQuery loader: http://coding.smashingmagazine.com/2010/05/23/make-your-own-bookmarklets-with-jquery/
// This is pretty fucked and should be replaced. Is there anyway we can just force 
// the latest jQ? I wouldn't have a problem with that.
function load_jq(spritz_loader){

    // the minimum version of jQuery we want
    var v = "1.7.0";

    // check prior inclusion and version
    if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
      var done = false;
      var script = document.createElement("script");
      script.src = "https://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
      // https://github.com/jeresig/jquery.hotkeys
      var script_keys = document.createElement("script");
      script_keys.src = "https://rawgithub.com/jeresig/jquery.hotkeys/master/jquery.hotkeys.js";
      
      script.onload = script.onreadystatechange = function(){
        if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
          done = true;
          spritz_loader();
        }
      };
      document.getElementsByTagName("head")[0].appendChild(script);
      document.getElementsByTagName("head")[0].appendChild(script_keys);
    } else{
        spritz_loader();
    }
}

function hide_spritz(){
    $('#spritz_spacer').slideUp();
    $('#spritz_container').slideUp();
    $('#spritz_holder').slideUp();
}

// Entry point to the beef.
// Gets the WPM and the selected text, if any.
function spritz(){

    var wpm = parseInt($("#spritz_selector").val(), 10);
    if(wpm < 1){
        return;
    }

    var selection = getSelectionText();
    if(selection){
        spritzify(selection);
    }
    else{
        spritzifyURL();
    }
}

spritz_words = [""];
spritz_index = 1;
spritz_interval = undefined;
spritz_pause = false;

function spritz_pause_toggle() {
    if (spritz_pause == true) {
        spritz_pause = false;
    } else {
        spritz_pause = true;
    }
}

function spritzify(input){
    spritz_index = 1;
    spritzify_go(input);
}

function spritzify_go(input){

    var wpm = parseInt($("#spritz_selector").val(), 10);
    var ms_per_word = 60000/wpm;

    // Split on any spaces.
    spritz_words = input.split(/\s+/);

    var word = '';
    var result = '';


    // Preprocess words
    var temp_words = spritz_words.slice(0); // copy Array
    var t = 0;

    for (var i=0; i<spritz_words.length; i++){

        if(spritz_words[i].indexOf('.') != -1){
            temp_words[t] = spritz_words[i].replace('.', '&#8226;');
        }

        // Double up on long words and words with commas.
        if((spritz_words[i].indexOf(',') != -1 || spritz_words[i].indexOf(':') != -1 || spritz_words[i].indexOf('-') != -1 || spritz_words[i].indexOf('(') != -1|| spritz_words[i].length > 8) && spritz_words[i].indexOf('.') == -1){
            temp_words.splice(t+1, 0, spritz_words[i]);
            temp_words.splice(t+1, 0, spritz_words[i]);
            t++;
            t++;
        }

        // Add an additional space after punctuation.
        if(spritz_words[i].indexOf('.') != -1 || spritz_words[i].indexOf('!') != -1 || spritz_words[i].indexOf('?') != -1 || spritz_words[i].indexOf(':') != -1 || spritz_words[i].indexOf(';') != -1|| spritz_words[i].indexOf(')') != -1){
            temp_words.splice(t+1, 0, ".");
            temp_words.splice(t+1, 0, ".");
            temp_words.splice(t+1, 0, ".");
            t++;
            t++;
            t++;
        }

        t++;

    }
    spritz_words = temp_words.slice(0);

    // Set the timers!
    if (! spritz_interval === undefined ) {
        clearInterval(spritz_interval);
    }
    spritz_interval= setInterval(function() { 
        if (spritz_index < spritz_words.length) {
            if (! spritz_pause) {
                var p = pivot(spritz_words[spritz_index]);
                spritz_index = spritz_index + 1;
                $('#spritz_result').html(p);
            }
            } else {
                clearInterval(spritz_interval);
            }
        } , ms_per_word);
        
    
}

// The meat!
function spritzify_orig(input){

    var wpm = parseInt($("#spritz_selector").val(), 10);
    var ms_per_word = 60000/wpm;

    // Split on any spaces.
    var all_words = input.split(/\s+/);

    var word = '';
    var result = '';


    // Preprocess words
    var temp_words = all_words.slice(0); // copy Array
    var t = 0;

    for (var i=0; i<all_words.length; i++){

        if(all_words[i].indexOf('.') != -1){
            temp_words[t] = all_words[i].replace('.', '&#8226;');
        }

        // Double up on long words and words with commas.
        if((all_words[i].indexOf(',') != -1 || all_words[i].indexOf(':') != -1 || all_words[i].indexOf('-') != -1 || all_words[i].indexOf('(') != -1|| all_words[i].length > 8) && all_words[i].indexOf('.') == -1){
            temp_words.splice(t+1, 0, all_words[i]);
            temp_words.splice(t+1, 0, all_words[i]);
            t++;
            t++;
        }

        // Add an additional space after punctuation.
        if(all_words[i].indexOf('.') != -1 || all_words[i].indexOf('!') != -1 || all_words[i].indexOf('?') != -1 || all_words[i].indexOf(':') != -1 || all_words[i].indexOf(';') != -1|| all_words[i].indexOf(')') != -1){
            temp_words.splice(t+1, 0, ".");
            temp_words.splice(t+1, 0, ".");
            temp_words.splice(t+1, 0, ".");
            t++;
            t++;
            t++;
        }

        t++;

    }
    all_words = temp_words.slice(0);

    // Set the timers!
    for (var i=0; i<all_words.length; i++){
        setTimeout(function(x) { 
            return function() { 

                var p = pivot(all_words[x]);
                $('#spritz_result').html(p);

        }; }(i), ms_per_word * i);
        
    }
}

// Find the red-character of the current word.
function pivot(word){
    var length = word.length;

    // Longer words are "right-weighted" for easier readability.
    if(length<6){

        var bit = 1;
        while(word.length < 22){
            if(bit > 0){
                word = word + '.';
            }
            else{
                word = '.' + word;
            }
            bit = bit * -1;
        }

        var start = '';
        var end = '';
        if((length % 2) === 0){
            start = word.slice(0, word.length/2);
            end = word.slice(word.length/2, word.length);
        } else{
            start = word.slice(0, word.length/2);
            end = word.slice(word.length/2, word.length);
        }

        var result;
        result = "<span class='spritz_start'>" + start.slice(0, start.length -1);
        result = result + "</span><span class='spritz_pivot'>";
        result = result + start.slice(start.length-1, start.length);
        result = result + "</span><span class='spritz_end'>";
        result = result + end;
        result = result + "</span>";
    }

    else{

        var tail = 22 - (word.length + 7);
        if( tail < 0) {
            tail = 0;
        }
        word = '.......' + word + ('.'.repeat(tail));

        var start = word.slice(0, word.length/2);
        var end = word.slice(word.length/2, word.length);

        var result;
        result = "<span class='spritz_start'>" + start.slice(0, start.length -1);
        result = result + "</span><span class='spritz_pivot'>";
        result = result + start.slice(start.length-1, start.length);
        result = result + "</span><span class='spritz_end'>";
        result = result + end;
        result = result + "</span>";

    }

    result = result.replace(/\./g, "<span class='invisible'>.</span>");

    return result;
}

// Get the currently selected text, if any.
// Shameless pinched from StackOverflow.
function getSelectionText() {
    var text = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            text = container.innerText || container.textContent;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            text = document.selection.createRange().text;
        }
    }
    if(text === ""){
        return false;
    }
    else{
        return text;
    }
}

// Uses the Readability API to get the juicy content of the current page.
function spritzifyURL(){
    var url = document.URL;

    $.getJSON("https://www.readability.com/api/content/v1/parser?url="+ encodeURIComponent(url) +"&token=" + readability_token +"&callback=?",
    function (data) {

        if(data.error){
            $('#spritz_result').html("Article extraction failed. Try selecting text instead.");
            return;
        }

        var title = '';
        if(data.title !== ""){
            title = data.title + ". ";
        }

        var author = '';
        if(data.author !== null){
            author = "By " + data.author + ". ";
        }

        var body = jQuery(data.content).text(); // Textify HTML content.
        body = $.trim(body); // Trim trailing and leading whitespace.
        body = body.replace(/\s+/g, ' '); // Shrink long whitespaces.

        var text_content = title + author + body;
        text_content = text_content.replace(/\./g, '. '); // Make sure punctuation is apprpriately spaced.
        text_content = text_content.replace(/\?/g, '? ');
        text_content = text_content.replace(/\!/g, '! ');
        spritzify(text_content);
    });

}

//////
// Helpers
//////

// This is a hack using the fact that browers sequentially id the timers.
function clearTimeouts(){
    var id = window.setTimeout(function() {}, 0);

    while (id--) {
        window.clearTimeout(id);
    }
}

// Let strings repeat themselves,
// because JavaScript isn't as awesome as Python.
String.prototype.repeat = function( num ){
    return new Array( num + 1 ).join( this );
}

