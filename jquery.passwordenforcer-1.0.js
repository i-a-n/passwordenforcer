/****
password enforcer 1.0: a jquery plugin
written by ian for (mt) media temple

conventions:
ul#output:                 where the rules will go
ul#output li.complete:     what a completed rule will look like
ul#output li.broken-rule:  what a broken rule looks like
.does-not-match:           what a failed retype input looks like
#password-submit:          the submit button

usage:
$("#element-to-enforce-rules-upon").passwordEnforce( [minchar], [maxchar] );
$("form").verifyRetype( "primary password input id", "retype password input id" );
****/

(function($) {
    $.extend($.fn, {
        passwordEnforce: function(minChar, maxChar, retypeID) {
            var reqs = {
                // basic requirements. sequential.
                id: [
                    // the ID for the rule's <li>
                    "lowercase",
                    "uppercase",
                    "numeral",
                    "symbol"
                ],
                friendlyName: [ 
                    // tell the user what to do
                    "At least one lower case letter [a-z]", 
                    "At least one upper case letter [A-Z]", 
                    "At least one numeral [0-9]", 
                    "At least one symbol [!@#^&*()+_,.{}?-]" ],
                expression: [
                    // expression to evaluate
                    ".match(/[a-z]/)",
                    ".match(/[A-Z]/)",
                    ".match(/[0-9]/)",
                    ".match(/[\!\@\#\^\&\*\(\)\+\_\,\.\{\}\?\-]/)"
                ]
            };
            
            // minimum and maximum characters are optional
            if( minChar > 0 ) {
                reqs['id'].push("minchar");
                reqs['friendlyName'].push("Minimum "+minChar+" characters");
                reqs['expression'].push(".length >= "+minChar);
            }
            if( maxChar > 0 ) {
                reqs['id'].push("maxchar");
                reqs['friendlyName'].push("Maximum "+maxChar+" characters");
                reqs['expression'].push(".length <= "+maxChar);
            }
            
            // display the list and bind the keyup thing
            return this.each(function() {
                $.fn.showReqs( reqs );
                $(this).keyup(function() {
                    $.fn.checkPassword($(this).val(), reqs);
                })
            })
        },
        
        // dirty work
        showReqs: function( reqs ) {
            $.each( reqs.id, function( i, v ) {
               $("#output").append("<li id='"+reqs.id[i]+"'>"+reqs.friendlyName[i]+"</li>");
            });
            $("#password-submit").attr("disabled", true);
            return;
        },
        
        // more dirty work
        checkPassword: function(input, reqs) {
            incompleteCount = 0;
            $.each( reqs.id, function( i, v ) {
                cond = "input"+reqs.expression[i];
                if( eval( cond ) ) {
                    $("li#"+reqs.id[i]).addClass("complete");
                }
                else {
                    $("li#"+reqs.id[i]).removeClass("complete");
                    incompleteCount++;
                }
            });
            
            // enable/disable the submit button
            if( incompleteCount == 0 ) {
                $("#password-submit").removeAttr("disabled", false);
            }
            else {
                $("#password-submit").attr("disabled", true);
            }
        }
    });
    
    // retyped-password checker. simples.
    $.extend($.fn, {
        verifyRetype: function(typeID, retypeID) {
            $(this).submit( function() {
                if( $("#"+typeID).val() !== $("#"+retypeID).val() ) {
                    if( $("li.broken-rule").size() == 0 ) {
                        $("ul#output").append("<li class='broken-rule'>Retyped password did not match</li>");
                        $("#"+retypeID).addClass("does-not-match");
                    }
                    else {
                        $("#"+retypeID+", li.broken-rule").hide().fadeIn();
                    }
                    $("html, body").animate({ scrollTop: $("#"+typeID).offset().top });
                    return false;
                }
            });
        }
    });
})(jQuery);
