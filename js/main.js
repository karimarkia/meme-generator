'use strict';

var gCanvas;
var gCtx;
var gIsMoving;
var gPrevPos;

//onLoad page
function init() {
    gIsMoving = false;
    gPrevPos = {};

    createImgs()
    gKeyWordsMap = getFromStorage('keywordsMap');
    if (!gKeyWordsMap) {
        creatKeyWordsMap();
        saveToStorage('keywordsMap', gKeyWordsMap)
    }
    initGalleryAndRenderKeywords()
}

//render functions
function initGalleryAndRenderKeywords() {
    renderGallery(gImgs);
    renderKeywords();
    renderKeywordsDatalist();
}

function renderGallery(img) {
    var elGallery = document.querySelector('.gallery-items ul');
    var strHTMLs = img.map(function (img) {
        return ` <li class="gallery-img">
                        <img src="${img.url}" data-id="${img.id}" onclick="onSelectImg('${img.id}')">
                        </li>`
    })
    elGallery.innerHTML = strHTMLs.join('');
}


// KEYWORDS filter functions
function onKeywordSelect(keyword) {
    var elDatalist = document.querySelector('.keywords-input');
    // if isn't selecting the same keyword
    if (gCurrKeyword !== keyword) {
        gCurrKeyword = keyword
        elDatalist.value = ''
        updateKeyWordsMap(keyword);
        var imgs = getImgsByFilter(keyword);
        renderGallery(imgs);
    }
    // renderKeywordsDatalist()
    // console.log('1');
}

// render the dropdown
function renderKeywordsDatalist() {
    var elDatalist = document.querySelector('#keywords-list');
    var keywords = Object.keys(gKeyWordsMap);
    // console.log(keywords);
    var strHtmls = keywords.map(keyword => {
        return `
                <option value="${keyword}">
               `;
    });
    elDatalist.innerHTML = strHtmls.join('');
}

// render the li
function renderKeywords() {
    gKeyWordsMap = getFromStorage('keywordsMap');
    var keywords = Object.keys(gKeyWordsMap);
    var strHtmls = keywords.map(keyword => {
        let keywordSize = gKeyWordsMap[keyword] * 2 + 15;
        // console.log(keywordSize);
        if (keywordSize > 50) {
            keywordSize = 50;
        }
        return `
        <li class="keyword" onclick="onKeywordSelect('${keyword}')" style="font-size: ${keywordSize}px">
            ${keyword}
        </li>
        `;
    });
    var elKeywords = document.querySelector('.keywords');
    elKeywords.innerHTML = strHtmls.join('');
}

// SELECT IMG functions
function onSelectImg(id) {
    document.body.classList.remove('gallery');
    document.querySelector('.gallery-container').style.display = 'none';
    document.querySelector('.about-container ').style.display = 'none';
    document.querySelector('main').style.display = 'flex';
    createMeme(id);
    initCanvas();
    //did a change-need to check it 
    renderTextEditor();
    renderMeme();
}

function initCanvas() {
    gCanvas = document.getElementById('canvas');
    gCtx = gCanvas.getContext('2d')
    var containerWidth = document.querySelector('main').offsetWidth;
    var containerHeight = document.querySelector('main').offsetHeight;
    gCanvas.width = containerWidth;
    gCanvas.height = containerHeight;
    // console.log(gCanvas.height);

    // set canvas width and height
    var img;
    if (gMeme.elImg) img = gMeme.elImg;
    else img = getImageById(gMeme.selectedImgId);

    var imageRatio = img.width / img.height;

    var canvasComputed = {}
    canvasComputed = {
        width: gCanvas.width,
        height: gCanvas.width / imageRatio
    };

    // set canvas width and height/this is what Yovel told us that we can do to set the canvas height and
    // width by the image sizes , got an idea from google 
    if (canvasComputed.height < gCanvas.height) {
        gCanvas.height = canvasComputed.height;
        console.log(gCanvas.height);
    } else {
        // if width is more than height - miminize width
        if (imageRatio >= 1) {
            let ratio = img.height / gCanvas.height;
            gCanvas.width = img.width / ratio;
        }
    }
    // update aside to canvas height if desktop
    if (window.innerWidth >= 920) {
        var asideEl = document.querySelector('aside');
        // console.log(gCanvas.height);
        asideEl.style.height = `${gCanvas.height}px`;
    }
}

function setTextWidth(line) {
    var txt = line.txt;
    // console.log(txt);
    gCtx.font = `${line.size}px ${line.fontFamily}`;
    var width = gCtx.measureText(txt).width;
    // console.log(width);
    line.width = width;
}

// mark line around selected line
function markLine(line) {
    console.log('here');
    // If line is not empty
    if (line.txt) {
        gCtx.beginPath();
        gCtx.moveTo(line.x - 10, line.y - line.size - 10);
        gCtx.lineTo(line.x + line.width + 10, line.y - line.size - 10);
        gCtx.lineTo(line.x + line.width + 10, line.y + 15);
        gCtx.lineTo(line.x - 10, line.y + 15);
        gCtx.lineTo(line.x - 10, line.y - line.size - 10);
        gCtx.strokeStyle = 'orange';
        gCtx.stroke();
    }
}

function drawImgOnCanvas(img) {
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}

// Text functions
function onEnterText(txt) {
    var line = gMeme.selectedLine;
    // if there is no line selected - 
    // creates new line with current values
    if (!line) {
        let currentValues = getCurrentValues();
        addNewLine(currentValues);
    }
    // update line's txt
    gMeme.selectedLine.txt = txt;
    renderMeme();
}

function getCurrentValues() {
    let elColor = document.querySelector('.colorInput');
    let color = elColor.value;
    console.log(color);
    let elStrokeolor = document.querySelector('.strokeColorInput');
    let strokeColor = elStrokeolor.value;
    let elFont = document.querySelector('.fontSelector');
    let font = elFont.value;
    // console.log(font);
    return {
        color,
        strokeColor,
        font
    }
}

// called when key is pressed while user on input line text
function onKeyPress(ev) {
    if (ev.key === 'Enter') {
        // remove selection and current line
        gMeme.selectedLine.isSelected = false;
        gMeme.selectedLine = undefined;
        // get out of input
        var elInput = document.querySelector('.textInput');
        elInput.blur();
        // render text editor and meme
        // renderTextEditor();
        renderMeme();
    }
}

//onKeyPress function
function renderTextEditor(line) {
    var elHeadline = document.querySelector('.editorHeadline');
    var elColor = document.querySelector('.colorInput');
    var elStrokeColor = document.querySelector('.strokeColorInput');
    var elTextInput = document.querySelector('.textInput');
    var elFont = document.querySelector('.fontSelector');

    // if there is line selected
    if (line) {
        elHeadline.innerHTML = 'Edit Line';
        // update values
        elColor.value = line.color;
        elStrokeColor.value = line.strokeColor;
        elTextInput.value = line.txt;
        elFont.value = line.fontFamily;
    } else {
        elHeadline.innerHTML = 'New Line Editor';
        elColor.value = '#000000';
        elStrokeColor.value = '#ffffff';
        elTextInput.value = '';
        elFont.value = 'impact';
    }
}

function onAddNewLine() {
    // if there is a line selected - add new line with default values.
    // if not - add new line with current values that user chose
    var currentValues;
    if (!gMeme.selectedLine) {
        currentValues = getCurrentValues();
    }
    addNewLine(currentValues);
    // get focus on input
    var elInput = document.querySelector('.textInput');
    elInput.focus();
    renderMeme();
}

//delete line function
function onEraseClick() {
    gMeme.txts.forEach(txt => {
        deleteLine(txt.id)
    })
    renderMeme()
}

//change text color
function onChangeTextColor(color) {
    if (gMeme.selectedLine) {
        changeColor(gMeme.selectedLine, color)
        renderMeme()
    }
}

function onChangeStrokeColor(stroke) {
    if (gMeme.selectedLine) {
        changeStroke(gMeme.selectedLine, stroke)
        renderMeme()
    }
}

function onChangeFontFamily(font) {
    // console.log(font);
    if (gMeme.selectedLine) {
        changeFont(gMeme.selectedLine, font)
        renderMeme()
    }
}

function onChangeFontSize(value) {
    if (gMeme.selectedLine) {
        if (value === 'plus') changeFontSize(gMeme.selectedLine, 5);
        else if (value === 'minus') {
            //cannot decrease font more if it 15
            if (gMeme.selectedLine.size > 15) changeFontSize(gMeme.selectedLine, -5);
        }
        renderMeme()
    }
}

function returnToGallery(ev) {
    ev.preventDefault();
    document.body.classList.add('gallery');
    document.querySelector('main').style.display = 'none';
    document.querySelector('.gallery-container').style.display = 'inherit';
    document.querySelector('.about-container ').style.display = 'flex';
    initGalleryAndRenderKeywords();
    renderTextEditor()
}

function onClickCanvas(ev, isMobile = false) {

    var mouseX = ev.clientX - gCanvas.offsetLeft;
    var mouseY = ev.clientY - gCanvas.offsetTop;
    // if on mobile - different calc
    if (isMobile) {
        mouseX = ev.changedTouches[0].clientX - gCanvas.offsetLeft;
        mouseY = ev.changedTouches[0].clientY - gCanvas.offsetTop;
    }
    gPrevPos.x = mouseX;
    gPrevPos.y = mouseY;
    // check if clicked on line
    var line = gMeme.txts.find(line => {
        return (mouseY < line.y + 15 && mouseY > line.y - line.size - 10 &&
            mouseX < line.width + line.x + 10 && mouseX > line.x - 10);
    });
    var eventToAdd = 'mousemove';
    // if on mobile - different event
    if (isMobile) {
        eventToAdd = 'touchmove';
    }
    // if a line was selected
    if (line) {
        line.isSelected = true;
        gCanvas.addEventListener(eventToAdd, drag, false);
        if (!isMobile) {
            gIsMoving = true;
        }
    } else {
        if (isMobile) {
            gCanvas.removeEventListener('touchmove', drag, false);
        }
    }
    // if clicked on different line
    // (or not on any line when there was a line selected)
    if (gMeme.selectedLine !== line) {
        // if there was a line selected before
        if (gMeme.selectedLine) {
            checkIfLineEmpty(gMeme.selectedLine);
        }
        // update current line
        gMeme.selectedLine = line;
    }
    // render text editor according to line
    renderTextEditor(line);
    renderMeme();
}

function onMouseUp() {
    if (gIsMoving) {
        gCanvas.removeEventListener('mousemove', drag, false);
        gIsMoving = false;
    }
}

function onTouchStart(ev) {
    onClickCanvas(ev, true);
}

// render meme
function renderMeme() {
    // clean canvas
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    // render img
    var img;
    if (gMeme.elImg) img = gMeme.elImg;
    else img = getImageById(gMeme.selectedImgId);
    drawImgOnCanvas(img);
    // render lines
    gMeme.txts.forEach(line => {
        if (line.txt) {
            if (line.isSelected) {
                setTextWidth(line);
                markLine(line);
            }
            gCtx.font = `${line.size}px ${line.fontFamily}`;
            // paint inner text 
            gCtx.fillStyle = line.color;
            gCtx.fillText(line.txt, line.x, line.y);
            // paint stroke text 
            gCtx.strokeStyle = line.strokeColor;
            gCtx.strokeText(line.txt, line.x, line.y);
        }
    })
}

function onMoveCanvasEl(direction) {
    if (gMeme.selectedLine) {
        moveCanvasEl(gMeme.selectedLine, direction);
        renderMeme();
    }
}

function drag(ev) {
    var mouseX = ev.clientX - gCanvas.offsetLeft;
    var mouseY = ev.clientY - gCanvas.offsetTop;
    // if on mobile - different calc
    if (ev.type === 'touchmove') {
        mouseX = ev.changedTouches[0].clientX - gCanvas.offsetLeft;
        mouseY = ev.changedTouches[0].clientY - gCanvas.offsetTop;
    }
    var newX = gMeme.selectedLine.x + (mouseX - gPrevPos.x);
    var newY = gMeme.selectedLine.y + (mouseY - gPrevPos.y);
    // if in range of canvas (relevant for mobile)
    if (newX + gMeme.selectedLine.width > 0 && newX < gCanvas.width &&
        newY > 0 && newY - gMeme.selectedLine.size < gCanvas.height) {
        gMeme.selectedLine.x = newX;
        gMeme.selectedLine.y = newY;
        gPrevPos.x = mouseX;
        gPrevPos.y = mouseY;
        renderMeme();
    }
}

// function onUploadImgBtn(ev) {

//     loadImageFromInput(ev, renderCanvas)
// }

// function loadImageFromInput(ev, onImageReady) {
//     // document.querySelector('imgData').innerHTML = ''
//     var reader = new FileReader();

//     reader.onload = function (event) {
//         var img = new Image();
//         img.onload = onImageReady.bind(null, img)
//         img.src = event.target.result;
//     }
//     reader.readAsDataURL(ev.target.files[0]);
// }

// function renderCanvas(img) {
//     gCanvas.width = img.width;
//     gCanvas.height = img.height;
//     gCtx.drawImage(img, 0, 0);
//     // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
// }