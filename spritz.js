
// Please don't abuse this.
var readability_token = '172b057cd7cfccf27b60a36f16b1acde12783893';

function spritz(){
    var selection = getSelectionHtml();
    if(selection){
        spritzify(selection);
    }
    else{
        spritzifyURL();
    }
}

function spritzify(input){

    var wpm = 500;
    var ms_per_word = 60000/wpm;

    var all_words = input.split(' ');

    var word = '';
    var result = '';


    // Preprocess words
    var temp_words = all_words.slice(0); // copy Array
    var t = 0;

    for (var i=0; i<all_words.length; i++){

        if(all_words[i].indexOf('.') != -1){
            temp_words[t] = all_words[i].replace('.', '•');
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

function pivot(word){
    var length = word.length;

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
        result = "<span class='start'>" + start.slice(0, start.length -1);
        result = result + "</span><span class='pivot'>";
        result = result + start.slice(start.length-1, start.length);
        result = result + "</span><span class='end'>";
        result = result + end;
        result = result + "</span>";
    }

    else{

        var tail = 22 - (word.length + 7);
        word = '.......' + word + ('.'.repeat(tail));

        var start = word.slice(0, word.length/2);
        var end = word.slice(word.length/2, word.length);

        var result;
        result = "<span class='start'>" + start.slice(0, start.length -1);
        result = result + "</span><span class='pivot'>";
        result = result + start.slice(start.length-1, start.length);
        result = result + "</span><span class='end'>";
        result = result + end;
        result = result + "</span>";

    }

    result = result.replace(/\./g, "<span class='invisible'>.</span>");

    return result;
}

// This is a hack using the fact that browers sequentially id the timers.
function clearTimeouts(){
    var id = window.setTimeout(function() {}, 0);

    while (id--) {
        window.clearTimeout(id);
    }
}

function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    if(html === ""){
        return false;
    }
    else{
        return html;
    }
}

function spritzifyURL(){
    var url = document.URL;
    //var url = "http://www.theguardian.com/world/2014/feb/27/gchq-nsa-webcam-images-internet-yahoo";
    //var url = "http://www.gq.com/sports/profiles/201202/david-diamante-interview-cigar-lounge-brooklyn-new-jersey-nets?currentPage=all";

    $.getJSON("https://www.readability.com/api/content/v1/parser?url="+ url +"&token=" + readability_token +"&callback=?",
    function (data) {

        var title = '';
        if(data.title !== ""){
            title = data.title + ". ";
        }

        var author = '';
        if(data.author !== null){
            author = "By " + data.author + ". ";
        }

        var body = jQuery(data.content).text();
        body = $.trim(body);

        var text_content = title + author + body;
        text_content = text_content.replace(/\./g, '. ');
        text_content = text_content.replace(/\?/g, '? ');
        text_content = text_content.replace(/\!/g, '! ');
        spritzify(text_content);
        $('#spritz_me').text(text_content);
    });

}

String.prototype.repeat = function( num ){
    return new Array( num + 1 ).join( this );
}
