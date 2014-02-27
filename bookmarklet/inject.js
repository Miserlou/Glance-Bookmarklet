

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var temp = document.createElement("div");
            for (var i = 0; i < sel.rangeCount; ++i) {
                temp.appendChild(sel.getRangeAt(i).cloneContents());
            }
            text = temp.innerText;
        }
    } else if (document.selection) {
        if (document.selection.type == "Text") {
            text = document.selection.createRange().text;
        }
    }
    return text;
}

//Add font 
document.body.innerHTML += '<style>' +
    '@import url(http://fonts.googleapis.com/css?family=Droid+Sans+Mono); '+
    '#openspritz-text .pivot { color: #D00; }' +
    '#openspritz-text .invisible { color: #fff }' +
    "#openspritz-text { text-align: center; }"
'</style>';
//Add a top bar
var container = document.createElement('div');
container.style.position = "fixed";
container.style.top = '0'
container.style.left = '0';
container.style.width = '100%';
container.style.zIndex = "90000"; //try to keep the bar in front
var bar = document.createElement('div');
bar.style.width = '360px';
bar.style.marginLeft = bar.style.marginRight = 'auto';
bar.style.height = '90px';
bar.style.backgroundColor = 'white';
bar.style.border = "2px solid grey";
bar.style.fontFamily = "Droid Sans Mono"
bar.style.paddingTop = "9px";
bar.style.textAlign = "center";
bar.style.boxSizing = "border-box";
document.body.appendChild(container);
container.appendChild(bar);

var text = document.createElement("div");
text.id = "openspritz-text";
text.innerText = "Select Some Text"
text.style.fontSize = '24px';
var speedSelect = document.createElement("select");
for(var i = 100; i <= 1000; i+=100) {
    var opt = document.createElement("option")
    opt.value = i;
    opt.innerText = i + 'wpm';
    speedSelect.appendChild(opt);
}
bar.appendChild(speedSelect);
var startButton = document.createElement('button');
startButton.innerText = '->';
bar.appendChild(startButton);
bar.appendChild(text);
startButton.onclick = function() {
    var input = getSelectionText();
    var wpm = speedSelect.value;
    clearTimeouts();
    spritzify(input, text, wpm);
}