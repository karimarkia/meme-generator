'use strict';

let gMeme;

const createMeme = (id) => {
    gMeme = {
        elImg: null,
        selectedImgId: id,
        txts: [],
        selectedLine: undefined
    };
}

const createLine = (size, x, y, color, strokeColor, fontFamily) => {
    let line = {
        id: gId++,
        txt: ' New Line ',
        size,
        x,
        y,
        color,
        strokeColor,
        fontFamily,
        isSelected: true
    }
    gMeme.txts.push(line)
    return line
}

// Text functions
const addNewLine = currentValues => {
    // if there is a line selected - remove selection
    if (gMeme.selectedLine) {
        checkIfLineEmpty(gMeme.selectedLine);
        renderTextEditor();
    }
    //create new line
    let size = 50;
    // let x = gCanvas.width/2;
    let x = 20;
    let y = getLineCorectY()
    let color;
    let strokeColor
    let font
    //get the new line that user put
    if (currentValues) {
        color = currentValues.color;
        strokeColor = currentValues.strokeColor;
        font = currentValues.font;
        //if not , the meme will create new line with this defult values
    } else {
        color = '#000000';
        strokeColor = '#ffffff';
        font = 'impact';
    }
    gMeme.selectedLine = createLine(size, x, y, color, strokeColor, font);
}

const checkIfLineEmpty = line => {
    // if line empty - erase it from array
    if (line.txt === '') {
        deleteLine(line);
        // if not empty - remove its selection
    } else {
        line.isSelected = false;
    }
}

const deleteLine = line => {
    let lineIdx = gMeme.txts.findIndex(currLine => line.id === currLine.id)
    gMeme.selectedLine = undefined;
    gMeme.txts.splice(lineIdx, 1);
}

const deleteAll = () => {
    gMeme.selectedLine = undefined;
    gMeme.txts = [];
}

//get some info from google with this function , text function
const getLineCorectY = () => {
    let y;
    // if its the first line - put it on top
    if (!gMeme.txts.length) {
        y = 65;
        // if its the second line
    } else if (gMeme.txts.length === 1) {
        // if the first one is on top - put the second down
        if (gMeme.txts[0].y < 150) {
            y = gCanvas.height - 30;
            // if the first one in down - put the second top
        } else {
            y = 65;
        }
    } else {
        let prevLine = gMeme.txts[gMeme.txts.length - 1];
        let prevY = prevLine.y;
        let spaceBetweenLines = gCanvas.height / 6;
        y = prevY + spaceBetweenLines;
        // if y more than canvas
        if (y > gCanvas.height) {
            y = 140;
        }
    }
    return y;
}

const changeColor = (line, color) => {
    line.color = color
}

const changeStroke = (line, stroke) => {
    line.strokeColor = stroke
}

const changeFont = (line, font) => {
    line.fontFamily = font
}

const changeFontSize = (line, value) => {
    line.size += value
}

const moveCanvasEl = (line, direction) => {
    let moveLenght = 10;
    switch (direction) {
        case 'left':
            if (line.x + line.width > 30) {
                line.x -= moveLenght;
            }
            break;
        case 'right':
            if (line.x < gCanvas.width - 30) {
                line.x += moveLenght;
            }
            break;
        case 'up':
            if (line.y > 30) {
                line.y -= moveLenght;
            }
            break;
        case 'down':
            if (line.y - line.size < gCanvas.height - 30) {
                line.y += moveLenght;
            }
            break;
    }
}