function vow(l){
    if ("АЕЁИОУЫЭЮЯ".indexOf(l.toUpperCase()) + 1) { return true } else { return false };
}

function isIot(l){
    if ("ЕЁЮЯ".indexOf(l.toUpperCase()) + 1) { return true } else { return false };
}

function Transcribe(){
    var s = document.getElementsByTagName('input')[0].value;
    var t = s.split('')
    for (var i = 0; i < s.length; i++){
        t[i] = {
            s: t[i], 
            vow: false, 
            red: false, 
            pal: false,
            lon : false
        }
        if (vow(t[i].s)) t[i].vow = true;
    }

    // ч и щ
    for (var i = 0; i < t.length; i++){
        if (t[i].s == 'ч') { 
            t[i].pal = true 
        } else if (t[i].s == 'щ') { 
            t[i].pal = true; 
            t[i].s = 'ш';
            if (i == 0) {
                if (t[i + 1].vow) {
                    t[i].lon = true;
                }
            } else if (i == t.length - 1) {
                if (t[i - 1].vow) {
                    t[i].lon = true;
                }
            } else if (t[i - 1].vow && t[i + 1].vow){
                t[i].lon = true;
            }
        }
    }

    // Определение степени редукции гласных
    var accFound = false, firBefFound = false;
    for (var i = t.length - 1; i >= 0; i--){
        if (t[i].vow) {
            if (!accFound) {
                if (t[i].s == t[i].s.toUpperCase()) {
                    t[i].red = 3;
                    t[i].s = t[i].s.toLowerCase()
                    accFound = true;
                } else {
                    t[i].red = 1;
                }
            } else if (!firBefFound) {
                t[i].red = 2;
                firBefFound = true;
            } else if((i == 0) && ('еёюяЕЁЮЯ'.indexOf(t[i].s) == -1)) {
                t[i].red = 2
            } else if (i > 0) {
                if (t[i-1].vow) {
                    t[i].red = 2
                } else t[i].red = 1
            } else {
                t[i].red = 1
            }
        }
    }

    // Йотированные
    for (var i = 0; i < t.length; i++){
        if(isIot(t[i].s)) {
            switch(t[i].s.toLowerCase()){
                case 'я': t[i].s = 'a'; break;
                case 'ё': t[i].s = 'о'; break;
                case 'ю': t[i].s = 'у'; break;
            }

            if((i == 0)||('ьъ'.indexOf(t[i - 1].s) + 1)||vow(t[i - 1].s)) {
                if (t[i].red == 3) {
                    t.splice(i, 0, {s: 'j', vow: false, red: false, pal: false, lon: false})
                } else {
                    t.splice(i, 0, {s: 'й', vow: false, red: false, pal: false, lon: false})
                }
            } else if ('жцш'.indexOf(t[i - 1]) == -1) {
                t[i - 1].pal = true;
            }
        }
    }

    // Убрать ъ
    for (var i = 1; i < t.length; i++){
        if (t[i].s == 'ъ') t.splice(i, 1)
    }

    // Смягчение
    for (var i = 1; i < t.length; i++){
        if (t[i].s == 'ь') {
            t[i - 1].pal = true;
            t.splice(i, 1)
        }
        if (('еи'.indexOf(t[i]) + 1) && ('жцш'.indexOf(t[i - 1]) == -1)) {
            t[i - 1].pal = true;
        }
    }


    // Редукция гласных
    for (var i = 0; i < t.length; i++){
        if(t[i].s == 'у') {
            if (t[i].red == 1) {
                t[i].s = 'ʊ'
            } else {
                t[i].s = 'у'
            }
        }
    }

   var transcript = '';
    for (var i = 0; i < t.length; i++){ 
        transcript += t[i].s;
        if (t[i].lon) transcript += ":";
        if (t[i].pal) transcript += "'";
    }
    console.log(transcript)
    document.getElementsByTagName('span')[0].innerHTML = transcript;
    console.log(document.getElementsByTagName('span'));
}

document.getElementsByTagName('button')[0].addEventListener(type="click", listener=Transcribe)
/*
VOWELS
И    Ы    У
  и  ы  у
Е е ьъʊ о О
Э э  а
     А
*/
