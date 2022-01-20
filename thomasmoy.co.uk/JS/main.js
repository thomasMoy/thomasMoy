/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
document.getElementById("responsiveIcon").onclick = function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }

/**Typing effect in Hero section */
var i = 0;
var txt = 'Hi, my name is Thomas.'; /* The text */
var speed = 50; /* The speed/duration of the effect in milliseconds */

document.getElementById("typeWrite").onload = function typeWriter() {
  if (i < txt.length) {
    document.getElementById("type").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

/**About Me Section */



function openSection(evt, sectionName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(sectionName).style.display = "block";
  evt.currentTarget.className += " active";
}

document.getElementById("task").onclick = function() {
  document.location="../task/index.html";
}




