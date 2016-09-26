$(document).ready(function(e) {

    var iconInterval = null;
    var resultSpan   = $('.resultSpan');
    var HTMLCode     = $('#HTMLCode');
    var CSSCode      = $('#CSSCode');
    var jQueryCode   = $('#jQueryCode');

    $("#btnGenerate").click(function(e) {
        clearInterval(iconInterval);
        var startIcon = $("#txtStartIcon").val().trim();
        var finalIcon = $("#txtFinalIcon").val().trim();
        var id = $("#txtIconID").val().trim();

        if(startIcon != "" && finalIcon != "" && id != "") {
           resultSpan.removeClass(resultSpan.attr('class').split(' ').pop());
           resultSpan.removeClass('spin');
           resultSpan.addClass(startIcon);

           $(".secondRow, .thirdRow").hide();

            iconInterval = setInterval(function(){ 
                resultSpan.toggleClass('spin ' + finalIcon + ' ' + startIcon);
            }, 1000);


        }
        HTMLCode.empty();
        HTMLCode.text("<span id=\"" + id + "\" class=\"spinnable fa\"></span>");

        CSSCode.empty();
        CSSCode.multiline(  ".spinnable{ \n" +
                            "\tanimation-duration: 200ms;\n" +
                            "\tanimation-timing-function: linear;\n" +
                            "\}\n" +
                            "@keyframes spin { \n" +
                            "\tfrom {transform:rotate(0deg);} \n" +
                            "\tto {transform:rotate(720deg);} \n" +
                            "}" +
                            "\n\n.spinnable.spin {\n" + 
                            "\tanimation-name: spin;\n" +
                            "\}");

        jQueryCode.empty();
        
+        jQueryCode.multiline(   "$('#" + id + "').toggleClass('spin "  + finalIcon + " " + startIcon + "')\;");

        // .secondRow, .thirdRow
        $(".secondRow").fadeIn("fast", function() {
            $(".thirdRow").fadeIn("fast");
        });
    });
});

$.fn.multiline = function(text){
    this.text(text);
    this.html(this.html().replace(/\n/g,'<br/>'));
    this.html(this.html().replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;'));
    return this;
}