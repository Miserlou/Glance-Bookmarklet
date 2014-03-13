// spritz.js
// A JavaScript Speed Reader
// rich@gun.io
// https://github.com/Miserlou/OpenSpritz

// Please don't abuse this.
var readability_token = '172b057cd7cfccf27b60a36f16b1acde12783893';
var diffbot_token = '2efef432c72b5a923408e04353c39a7c';

function create_spritz(){

     spritz_loader = function() {
        //getURL("https://rawgithub.com/Miserlou/OpenSpritz/master/spritz.html", function(data){

        //getURL("https://rawgithub.com/Miserlou/OpenSpritz/dev/spritz.html", function(data){

        // This won't work in Firefox because an old bug and won't work in Chrome because of security stuff:
        //getURL("spritz.html", function(data){

        //getURL("https://rawgithub.com/Miserlou/OpenSpritz/dev/spritz.html", function(data){
        getURL("https://rawgithub.com/Miserlou/OpenSpritz/master/spritz.html", function(data){
            var spritzContainer = document.getElementById("spritz_container");

            if (!spritzContainer) {
                var ele = document.createElement("div");
                data = data.replace(/(\r\n|\n|\r)/gm,"");
                ele.innerHTML = data;
                document.body.insertBefore(ele, document.body.firstChild);
                document.getElementById("spritz_toggle").style.display = "none";
            };

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

    // The reader won't stop if the selection starts or ends with spaces
    if (all_words[0] == "")
    {
        all_words = all_words.slice(1, all_words.length);
    }

    if (all_words[all_words.length - 1] == "")
    {
        all_words = all_words.slice(0, all_words.length - 1);
    }

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
            temp_words.splice(t+1, 0, " ");
            temp_words.splice(t+1, 0, " ");
            temp_words.splice(t+1, 0, " ");
            t++;
            t++;
            t++;
        }

        t++;

    }

    all_words = temp_words.slice(0);

    var currentWord = 0;
    var running = true;
    var spritz_timers = new Array();

    document.getElementById("spritz_toggle").addEventListener("click", function() {
        if(running) {
            stopSpritz();
        } else {
            startSpritz();
        }
    });

    function updateValues(i) {

        var p = pivot(all_words[i]);
        document.getElementById("spritz_result").innerHTML = p;
        currentWord = i;

    }

    function startSpritz() {

        document.getElementById("spritz_toggle").style.display = "block";
        document.getElementById("spritz_toggle").textContent = "Pause";

        running = true;

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

        document.getElementById("spritz_toggle").textContent = "Play";
        running = false;
    }

    startSpritz();
}

// Find the red-character of the current word.
function pivot(word){
    var length = word.length;

    var bestLetter = 1;
    switch (length) {
        case 1:
            bestLetter = 1; // first
            break;
        case 2:
        case 3:
        case 4:
        case 5:
            bestLetter = 2; // second
            break;
        case 6:
        case 7:
        case 8:
        case 9:
            bestLetter = 3; // third
            break;
        case 10:
        case 11:
        case 12:
        case 13:
            bestLetter = 4; // fourth
            break;
        default:
            bestLetter = 5; // fifth
    };

    word = decodeEntities(word);
    var start = '.'.repeat((11-bestLetter)) + word.slice(0, bestLetter-1).replace('.', '&#8226;');
    var middle = word.slice(bestLetter-1,bestLetter).replace('.', '&#8226;');
    var end = word.slice(bestLetter, length).replace('.', '&#8226;') + '.'.repeat((11-(word.length-bestLetter)));

    var result;
    result = "<span class='spritz_start'>" + start;
    result = result + "</span><span class='spritz_pivot'>";
    result = result + middle;
    result = result + "</span><span class='spritz_end'>";
    result = result + end;
    result = result + "</span>";

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

    //getURL("https://www.readability.com/api/content/v1/parser?url="+ encodeURIComponent(url) +"&token=" + readability_token +"&callback=?",
    getURL("https://api.diffbot.com/v2/article?url="+ encodeURIComponent(url) +"&token=" + diffbot_token, // +"&callback=?",
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
            if(data.author !== undefined){
                author = "By " + data.author + ". ";
            }

            var body = data.text;
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
    if(num < 1){
        return new Array( Math.abs(num) + 1 ).join( this );
    }
    return new Array( num + 1 ).join( this );
};

function decodeEntities(s){
    var str, temp= document.createElement('p');
    temp.innerHTML= s;
    str= temp.textContent || temp.innerText;
    temp=null;
    return str;
}


