// spritz.js
// A JavaScript Speed Reader
// rich@gun.io
// https://github.com/Miserlou/OpenSpritz

// Please don't abuse this.
var readability_token = '172b057cd7cfccf27b60a36f16b1acde12783893';

function create_spritz(){

     spritz_loader = function() {
        //getURL("https://rawgithub.com/Miserlou/OpenSpritz/master/spritz.html", function(data){

        alert("GETTING DATA");

        getURL("https://rawgithub.com/Miserlou/OpenSpritz/dev/spritz.html", function(data){

            alert("GOT DATA");

            var spritzContainer = document.getElementById("spritz_container");

            if (!spritzContainer) {
                var ele = document.createElement("div");
                ele.innerHTML = data;
                document.body.insertBefore(ele.firstChild, document.body.firstChild);
            }
            
            document.getElementById("spritz_selector").addEventListener("change", function(e) {
                clearTimeouts();
                spritz();
            });
        });
    };

    spritz_loader();
}

function getURL(url, callback) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callback(xmlhttp.responseText);
        }
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function hide_spritz(){
    document.getElementById("spritz_spacer").style.display = "none";
    document.getElementById("spritz_container").style.display = "none";
    document.getElementById("spritz_holder").style.display = "none";
}

// Entry point to the beef.
// Gets the WPM and the selected text, if any.
function spritz(){

    var wpm = parseInt(document.getElementById("spritz_selector").value, 10);
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

// The meat!
function spritzify(input){

    var wpm = parseInt(document.getElementById("spritz_selector").value, 10);
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

    var currentWord = 0;
    var running = false;
    var spritz_timers = new Array();

    document.getElementById("spritz_toggle").addEventListener("click", function() {
        if(running) {
            stopSpritz();
        } else {
            startSpritz();
        }
    });

    document.getElementById("spritz_slider").addEventListener("change", function() {
        updateValues(document.getElementById("spritz_slider").value - 1);
    });

    function updateValues(i) {
        document.getElementById("spritz_slider").value = i;
        var p = pivot(all_words[i]);

        document.getElementById("spritz_result").innerHTML = p;
        currentWord = i;
    }

    function startSpritz() {

        document.getElementById("spritz_toggle").innerText = "Stop";

        running = true;
        // Set slider max value
        document.getElementById("spritz_slider").max = all_words.length;

        spritz_timers.push(setInterval(function() {
            updateValues(currentWord);
            currentWord++;
            if(currentWord >= all_words.length) {
                currentWord = 0;
                stopSpritz();
            }
        }, ms_per_word));
    }

    function stopSpritz() {
        for(var i = 0; i < spritz_timers.length; i++) {
            clearTimeout(spritz_timers[i]);
        }

        document.getElementById("spritz_toggle").innerText = "Play";
        running = false;
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

    getURL("https://www.readability.com/api/content/v1/parser?url="+ encodeURIComponent(url) +"&token=" + readability_token +"&callback=?",
    function(data) {
        data = JSON.parse(data);

        if(data.error){
            document.getElementById("spritz_result").innerText = "Article extraction failed. Try selecting text instead.";
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

        var body = document.createElement("div");
        body.innerHTML = data.content;
        body = body.innerText; // Textify HTML content.
        body = body.trim(); // Trim trailing and leading whitespace.
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
};
