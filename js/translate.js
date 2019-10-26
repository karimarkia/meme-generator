'use strict';

// Internationalization and localization
let gLanguage = 'eng';
let language = [{}]

// object with all translation
let gTranslations = {
    eng: {
        isRtl: false,
        headergallery: 'Gallery',
        headerabout: 'About',
        headlayers: 'Layers',
        texteditor: 'Text Editor',
        btnback: 'Back',
        btnshare: 'Share',
        btnupload: 'Upload',
        btndownload: 'Download',
        headfooter: 'all Right recerved 2019',
        modaldelline: 'Are you sure you want to delete all?',
        deletebtn: 'Delete',
        deletebtncancel: 'Cancel',
        progremername: 'Karim Arkia',
        programerpos: 'Full-stack web developer',

    },
    heb: {
        isRtl: true,
        headergallery: 'גלריה',
        headerabout: 'צור קשר',
        headlayers: 'שכבות',
        texteditor: 'עורך טקסט',
        btnback: 'חזרה',
        btnshare: 'שיתוף',
        btnupload: 'העלאה',
        btndownload: 'הורדה',
        headfooter: ' כל הזכויות שמורות 2019',
        modaldelline: 'האם אתה בטוח שתרצה למחוק?',
        deletebtn: 'מחק',
        deletebtncancel: 'ביטול',
        progremername: 'קארים ארקייה',
        programerpos: 'מתכנת פול-סטאק',

    }
}

let gTranslationsTitles = {
    eng: {
        btnback: 'Back to Gallery',
        btnshare: 'Share with friends',
        btnupload: 'Upload to server',
        btndownload: 'Download image',
    },
    heb: {
        btnback: 'חזרה לגלריה',
        btnshare: 'שיתוף לחברים',
        btnupload: 'העלאה לשרת',
        btndownload: 'הורדה',
    }
}

function getUserLang() {
    return gLanguage;
}

let gTranslationsPlaceholder = {
    eng: {
        inputtext: 'Enter Text',
        searchKeyword: 'Enter Search Word',
    },
    heb: {
        inputtext: 'הזן טקסט',
        searchKeyword: 'הכנס מילת חיפוש',
    }
}

function changeLanguage(lang) {
    gLanguage = lang;
    translateElements(lang);
    translateElementsTitle(lang);
    translateElementsPlaceholder(lang);
    if (gTranslations[lang].isRtl) document.body.classList.add('rtl');
    else document.body.classList.remove('rtl');
}

function translateElements(lang) {
    // select all the element with data attribute - for each - translate;
    let translateEls = document.querySelectorAll('[data-translate]');
    for (let i = 0; i < translateEls.length; i++) {
        let translateEl = translateEls[i];
        let translate = translateEl.dataset.translate;
        translateEl.innerText = gTranslations[lang][translate];
    }
}

function translateElementsTitle(lang) {
    // select all the element with data attribute - for each - translate title;
    let translateEls = document.querySelectorAll('[data-translate]');
    for (let i = 0; i < translateEls.length; i++) {
        let translateEl = translateEls[i];
        if (translateEl.title) {
            let translate = translateEl.dataset.translate;
            translateEl.title = gTranslationsTitles[lang][translate];
        }
    }
}

function translateElementsPlaceholder(lang) {
    // select all the element with data attribute - for each - translate placeholder;
    let translateEls = document.querySelectorAll('[data-translate]');
    for (let i = 0; i < translateEls.length; i++) {
        let translateEl = translateEls[i];
        if (translateEl.placeholder) {
            let translate = translateEl.dataset.translate;
            translateEl.placeholder = gTranslationsPlaceholder[lang][translate];
        }
    }
}