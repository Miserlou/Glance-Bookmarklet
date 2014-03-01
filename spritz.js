function spritzify(input, output, wpm){
    var ms_per_word = 60000/wpm;

    var all_words = input.split(' ');

    centerWord(all_words);

    function showWord(word, position){
        var p = pivot(word);
            $(output).html(p);
        if(all_words.length > position){
            setTimeout(function(x){ return showWord(all_words[x++], x)}, ms_per_word, position);
        }
    }

    // Set the timers!
    setTimeout(function(x){ return showWord(all_words[x], x); }, ms_per_word , 0);
    
}

function centerWord(all_words){
    var t = 0;
    var temp_words = all_words.slice(0); // copy Array

    for (var i=0; i<all_words.length; i++){

        if(all_words[i].indexOf('.') != -1){
            temp_words[t] = all_words[i].replace('.', '•');
        }

        if(isSubset(all_words[i])){
            temp_words.splice(t+1, 0, all_words[i]);
            temp_words.splice(t+1, 0, all_words[i]);
            t++;
            t++;
        }

        if(isEnd(all_words[i])){
            temp_words.splice(t+1, 0, ".");
            temp_words.splice(t+1, 0, ".");
            temp_words.splice(t+1, 0, ".");
            t++;
            t++;
            t++;
        }

        t++;

    }

}

function isSubset(word){
    return (word.indexOf(',') != -1 || word.indexOf(':') != -1 || word.indexOf('-') != -1 || word.indexOf('(') != -1|| word.length > 8) && word. indexOf('.') == -1;
}

function isEnd(word){
    return word.indexOf('.') != -1 || word.indexOf('!') != -1 || word.indexOf('?') != -1 || word.indexOf(':') != -1 || word.indexOf(';') != -1|| word.indexOf(')') != -1;
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

String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
}
