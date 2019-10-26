'use strict';

let gImgs;
let gKeyWordsMap;
let gCurrKeyword;
let gId = 1;

const createImgs = () => {
    gImgs = [
        createImg('img/003.jpg', ['trump', 'stupid', 'man']),
        createImg('img/004.jpg', ['cute', 'dog', 'cute']),
        createImg('img/005.jpg', ['dog', 'kid', 'sleepy']),
        createImg('img/006.jpg', ['cat', 'sleepy']),
        createImg('img/2.jpg', ['happy', 'dance']),
        createImg('img/5.jpg', ['happy', 'kid']),
        createImg('img/8.jpg', ['happy']),
        createImg('img/9.jpg', ['happy', 'kid', 'cute']),
        createImg('img/12.jpg', ['man']),
        createImg('img/19.jpg', ['man', 'angry']),
        createImg('img/img6.jpg', ['dog', 'happy', 'cute']),
        createImg('img/drevil.jpg', ['man']),
        createImg('img/img2.jpg', ['kid', 'dance', 'happy', 'cute']),
        createImg('img/img4.jpg', ['trump', 'stupid', 'man']),
        createImg('img/img5.jpg', ['happy', 'kid', 'cute']),
        createImg('img/img11.jpg', ['happy', 'man']),
        createImg('img/img12.jpg', ['man']),
        createImg('img/leo.jpg', ['happy', 'man']),
        createImg('img/putin.jpg', ['happy', 'man']),
        createImg('img/One.jpg', ['happy', 'man']),
    ];
}

const createImg = (url, keyWords) => {
    return {
        id: gId++,
        url,
        keyWords
    };
}

const getImageById = (id) => {
    return document.querySelector(`[data-id='${id}']`);
}

const updateKeyWordsMap = key => {
    if (gKeyWordsMap[key]) {
        gKeyWordsMap[key]++;
        saveToStorage('keywordsMap', gKeyWordsMap);
    }
}

const creatKeyWordsMap = () => {
    gKeyWordsMap = {};
    // go over imgs keywords and init keywords count to 1
    gImgs.forEach((img) => {
        img.keyWords.forEach(keyWord => {
            gKeyWordsMap[keyWord] = 1;
        });
    });
}

const getImgsByFilter = keyword => {
    let filteredImgs = gImgs.filter(img => {
        return img.keyWords.some(imgKewWord => {
            return imgKewWord === keyword
        })
    })
    return filteredImgs;
}

const uploadNewImg = imgEl => {
    gMeme.elImg = imgEl;
    deleteAll();
    initCanvas();
    renderTextEditor();
    renderMeme();
}