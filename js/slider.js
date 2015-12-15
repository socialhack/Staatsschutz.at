var firstnames, lastnames, states, messages;
var slideAuthor, slideText, slideContent;
var current = -1;
var blocked = false;

function findElements() {
    slideAuthor = document.getElementById("slideauthor");
    slideText = document.getElementById("slidetext");
    slideContent = document.getElementById("slideContent");
}

function setSlideScreen(index) {
    var firstname, lastname, state, message;
    
    firstname = firstnames[index].childNodes[0].nodeValue;
    lastname = lastnames[index].childNodes[0].nodeValue;
    state = states[index].childNodes[0].nodeValue;
    message = messages[index].childNodes[0].nodeValue;
    
    slideAuthor.innerHTML = firstname + " " + lastname + ", " + state;
    slideText.innerHTML = message;
}

function getElements(xml) {
    var xmlDoc = xml.responseXML;
    firstnames = xmlDoc.getElementsByTagName("firstname");
    lastnames = xmlDoc.getElementsByTagName("lastname");
    states = xmlDoc.getElementsByTagName("state");
    messages = xmlDoc.getElementsByTagName("message");
}

function openXML(path) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            getElements(xhttp);
            findElements();
            autoSlide();
        }
    };
    xhttp.open("GET", path, true);
    xhttp.send();
}

function slideForwards() {
    if (blocked == true)
        return;
    
    blocked = true;
    
    if (current + 1 >= firstnames.length) {
        current = 0;
    } else {
        current++;
    }
    
    slideContent.classList.remove("slideBackwards");
    slideContent.classList.remove("slideForwards");
    slideContent.offsetWidth = slideContent.offsetWidth;
    slideContent.classList.add("slideForwards");
    
    setTimeout(function() {
        setSlideScreen(current);
        blocked = false;
    }, 300);
}

function slideBackwards() {
    if (blocked == true)
        return;
    
    blocked = true;
    
    if (current - 1 < 0) {
        current = firstnames.length - 1;
    } else {
        current--;
    }
    
    slideContent.classList.remove("slideBackwards");
    slideContent.classList.remove("slideForwards");
    slideContent.offsetWidth = slideContent.offsetWidth;
    slideContent.classList.add("slideBackwards");
    
    setTimeout(function() {
        setSlideScreen(current);
        blocked = false;
    }, 300);
}

function autoSlide() {
    slideForwards();
    setTimeout(autoSlide, 15000);
}

window.onload = function () {
    openXML("./docs/comments.xml");
};