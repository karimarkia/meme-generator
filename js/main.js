'use strict';

let gCanvas;
let gCtx;
let gIsMoving;
let gPrevPos;

//onLoad page
const init = () => {
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
const initGalleryAndRenderKeywords = () => {
    renderGallery(gImgs);
    renderKeywords();
    renderKeywordsDatalist();
}

const renderGallery = img => {
    let elGallery = document.querySelector('.gallery-items ul');
    let strHTMLs = img.map(function (img) {
        return ` <li class="gallery-img">
                        <img src="${img.url}" data-id="${img.id}" onclick="onSelectImg('${img.id}')">
                        </li>`
    })
    elGallery.innerHTML = strHTMLs.join('');
}


// KEYWORDS filter functions
const onKeywordSelect = (keyword) => {
    let elDatalist = document.querySelector('.keywords-input');
    // if isn't selecting the same keyword
    if (gCurrKeyword !== keyword) {
        gCurrKeyword = keyword
        elDatalist.value = ''
        updateKeyWordsMap(keyword);
        let imgs = getImgsByFilter(keyword);
        renderGallery(imgs);
    }
    // renderKeywordsDatalist()

}

// render the dropdown
const renderKeywordsDatalist = () => {
    let elDatalist = document.querySelector('#keywords-list');
    let keywords = Object.keys(gKeyWordsMap);
    let strHtmls = keywords.map(keyword => {
        return `
                <option value="${keyword}">
               `;
    });
    elDatalist.innerHTML = strHtmls.join('');
}

// render the li
const renderKeywords = () => {
    gKeyWordsMap = getFromStorage('keywordsMap');
    let keywords = Object.keys(gKeyWordsMap);
    let strHtmls = keywords.map(keyword => {
        let keywordSize = gKeyWordsMap[keyword] * 2 + 15;
        if (keywordSize > 50) {
            keywordSize = 50;
        }
        return `
        <li class="keyword" onclick="onKeywordSelect('${keyword}')" style="font-size: ${keywordSize}px">
            ${keyword}
        </li>
        `;
    });
    let elKeywords = document.querySelector('.keywords');
    elKeywords.innerHTML = strHtmls.join('');
}

// SELECT IMG functions
const onSelectImg = id => {
    document.body.classList.remove('gallery');
    document.querySelector('.gallery-container').style.display = 'none';
    document.querySelector('.about-container ').style.display = 'none';
    document.querySelector('main').style.display = 'flex';
    createMeme(id);
    initCanvas();
    renderTextEditor();
    renderMeme();
}

const initCanvas = () => {
    gCanvas = document.getElementById('canvas');
    gCtx = gCanvas.getContext('2d')
    let containerWidth = document.querySelector('main').offsetWidth;
    let containerHeight = document.querySelector('main').offsetHeight;
    gCanvas.width = containerWidth;
    gCanvas.height = containerHeight;

    // set canvas width and height
    let img;
    if (gMeme.elImg) img = gMeme.elImg;
    else img = getImageById(gMeme.selectedImgId);

    let imageRatio = img.width / img.height;
    let canvasComputed = {}
    canvasComputed = {
        width: gCanvas.width,
        height: gCanvas.width / imageRatio
    };

    // set canvas width and height
    if (canvasComputed.height < gCanvas.height) {
        gCanvas.height = canvasComputed.height;
        console.log(gCanvas.height)
    } else {
        // if width is more than height - miminize width
        if (imageRatio >= 1) {
            let ratio = img.height / gCanvas.height;
            gCanvas.width = img.width / ratio;
        }
    }
    // update aside to canvas height if desktop
    if (window.innerWidth >= 920) {
        let asideEl = document.querySelector('aside');
        // console.log(gCanvas.height);
        asideEl.style.height = `${gCanvas.height}px`;
    }
}

const setTextWidth = line => {
    let txt = line.txt;
    gCtx.font = `${line.size}px ${line.fontFamily}`;
    let width = gCtx.measureText(txt).width;
    // console.log(width);
    line.width = width;
}

// mark line around selected line
const markLine = line => {
    // If line is not empty   
    // console.log('here');
    
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

const drawImgOnCanvas = img => {
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}

// Text functions
const onEnterText = txt => {
    let line = gMeme.selectedLine;
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

const getCurrentValues = () => {
    let elColor = document.querySelector('.colorInput');
    let color = elColor.value;
    console.log(color);
    let elStrokeolor = document.querySelector('.strokeColorInput');
    let strokeColor = elStrokeolor.value;
    let elFont = document.querySelector('.fontSelector');
    let font = elFont.value;
    return {
        color,
        strokeColor,
        font
    }
}

// called when key is pressed while user on input line text
const onKeyPress = ev => {
    if (ev.key === 'Enter') {
        // remove selection and current line
        gMeme.selectedLine.isSelected = false;
        gMeme.selectedLine = undefined;
        // get out of input
        let elInput = document.querySelector('.textInput');
        elInput.blur();
        // render text editor and meme
        renderTextEditor();
        renderMeme();
    }
}

//onKeyPress function
const renderTextEditor = line => {
    let elHeadline = document.querySelector('.editorHeadline');
    let elColor = document.querySelector('.colorInput');
    let elStrokeColor = document.querySelector('.strokeColorInput');
    let elTextInput = document.querySelector('.textInput');
    let elFont = document.querySelector('.fontSelector');

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

const onAddNewLine = () => {
    // if there is a line selected - add new line with default values.
    // if not - add new line with current values that user chose
    let currentValues;
    if (!gMeme.selectedLine) {
        currentValues = getCurrentValues();
    }
    addNewLine(currentValues);
    // get focus on input
    let elInput = document.querySelector('.textInput');
    elInput.focus();
    renderMeme();
}

//delete line const
const onEraseClick = () => {
    // open modal
    let elErase = document.querySelector('.erase-modal-container');
    elErase.classList.add('open');
    // update modal
    let elWhatToDelete = document.querySelector('.whatToDelete');
    if (gMeme.selectedLine && gMeme.selectedLine.txt !== '') {
        elWhatToDelete.innerHTML = 'Are you sure you want to delete line?';
    } else {
        elWhatToDelete.innerHTML = 'Are you sure you want to delete all?';
    }
}

const onDelete = () => {
    // remove modal
    removeModal();
    // if there is a line selected and it's not empty - delete line
    if (gMeme.selectedLine && gMeme.selectedLine.txt !== '') {
        deleteLine(gMeme.selectedLine);
    } else {
        deleteAll();
    }
    renderMeme();
    renderTextEditor();
}

const onCancelDelete = () => {
    removeModal();
}

const removeModal = () => {
    let elErase = document.querySelector('.erase-modal-container');
    elErase.classList.remove('open');
}

//change text color
const onChangeTextColor = color => {
    if (gMeme.selectedLine) {
        changeColor(gMeme.selectedLine, color)
        renderMeme()
    }
}

const onChangeStrokeColor = stroke => {
    if (gMeme.selectedLine) {
        changeStroke(gMeme.selectedLine, stroke)
        renderMeme()
    }
}

const onChangeFontFamily = font => {
    if (gMeme.selectedLine) {
        changeFont(gMeme.selectedLine, font)
        renderMeme()
    }
}

const onChangeFontSize = value => {
    if (gMeme.selectedLine) {
        if (value === 'plus') changeFontSize(gMeme.selectedLine, 5);
        else if (value === 'minus') {
            //cannot decrease font more if it's 15
            if (gMeme.selectedLine.size > 15) changeFontSize(gMeme.selectedLine, -5);
        }
        renderMeme()
    }
}

const returnToGallery = ev => {
    ev.preventDefault();
    document.body.classList.add('gallery');
    document.querySelector('main').style.display = 'none';
    document.querySelector('.gallery-container').style.display = 'inherit';
    document.querySelector('.about-container ').style.display = 'flex';
    initGalleryAndRenderKeywords();
    renderTextEditor()
}

const onClickCanvas = (ev, isMobile = false) => {
    ev.preventDefault()
    let mouseX = ev.clientX - gCanvas.offsetLeft;
    let mouseY = ev.clientY - gCanvas.offsetTop;
    // if on mobile - different calc
    if (isMobile) {
        mouseX = ev.changedTouches[0].clientX - gCanvas.offsetLeft;
        mouseY = ev.changedTouches[0].clientY - gCanvas.offsetTop;
    }
    gPrevPos.x = mouseX;
    gPrevPos.y = mouseY;
    // check if clicked on line
    let line = gMeme.txts.find(line => {
        return (mouseY < line.y + 15 && mouseY > line.y - line.size - 10 &&
            mouseX < line.width + line.x + 10 && mouseX > line.x - 10);
    });
    let eventToAdd = 'mousemove';
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
    // markLine(line)
    renderTextEditor(line);
    renderMeme();
}

const onMouseUp = () => {
    if (gIsMoving) {
        gCanvas.removeEventListener('mousemove', drag, false);
        gIsMoving = false;
    }
}

const onTouchStart = (ev) => {
    onClickCanvas(ev, true);
}

// render meme
const renderMeme = () => {
    // clean canvas
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    // render img
    let img;
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

const onMoveCanvasEl = direction => {
    if (gMeme.selectedLine) {
        moveCanvasEl(gMeme.selectedLine, direction);
        renderMeme();
    }
}

const drag = (ev) => {
    ev.preventDefault()
    let mouseX = ev.clientX - gCanvas.offsetLeft;
    let mouseY = ev.clientY - gCanvas.offsetTop;
    // if on mobile - different calc
    if (ev.type === 'touchmove') {
        mouseX = ev.changedTouches[0].clientX - gCanvas.offsetLeft;
        mouseY = ev.changedTouches[0].clientY - gCanvas.offsetTop;
    }
    let newX = gMeme.selectedLine.x + (mouseX - gPrevPos.x);
    let newY = gMeme.selectedLine.y + (mouseY - gPrevPos.y);
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

// UPLOAD IMG consts
const onUploadImgBtn = ev => {
    handleImageFromInput(ev, uploadNewImg);
}

const toggleMenu = () => {
    let elNav = document.querySelector('.main-menu-wrapper');
    elNav.classList.toggle('open')
}