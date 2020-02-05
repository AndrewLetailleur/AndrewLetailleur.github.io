/* toggle between hiding and showing the dropdown content.
If, and when the user clicks on the button. */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}



  window.addEventListener("DOMContentLoaded", function(e) {

    var stage = document.getElementById("stage");
    var fadeComplete = function(e) { stage.appendChild(arr[0]); };
    var arr = stage.getElementsByTagName("a");
    for(var i=0; i < arr.length; i++) {
      arr[i].addEventListener("animationend", fadeComplete, false);
    }

  }, false);


$(document).ready(function(){})

//begin use/assumption of JQuery



//End of Javascript