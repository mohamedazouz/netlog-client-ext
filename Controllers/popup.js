var background=chrome.extension.getBackgroundPage();
NetlogPopupObject=function(){
    var netLogPopup={
        makeItActive:function(nextActive){
            var lastActive=$(".active").removeClass("active");
            $("#content-"+lastActive.attr("class")).hide();
            $("#content-"+nextActive.attr('class')).show();
            $(nextActive).addClass("active");   
        },
        authenticate:function(){
            if(!localStorage.authtokenObj){
                window.localStorage.pendingState=1;
                netLogPopup.pendingState();
                background.netLogBG.netlogAuth.open( function(response){
                    console.log(JSON.stringify(response));
                    background.netLogBG.initUserData(function(){
                        $(".logout").html("Log In");
                        console.log("Ready to use extension");
                    })
                });
            }else{
                netLogPopup.removeUserData();
            }
        },
        removeUserData:function(){
            background.netLogBG.removeUserData();
            $(".logout").html("Log In");
            netLogPopup.readyState();
        },
        readyState:function(){
            var lastActive=$(".active").removeClass("active");
            $("#content-"+lastActive.attr("class")).hide();
            $("#leftmenue").hide();
        },
        showNotification:function(start){
            var notifications=JSON.parse(window.localStorage.userNotification).friendActivities.list;
            var out="";
            for(i=0;i<notifications.length;i++){
                var notify=notifications[i];
                out+='<section class="gray-round">';
                userName=notify.userId.displayName;
                userlink=notify.userId.profileUrl;
                out+='<a href="'+userlink+'" target="_blanck">'+userName+'<span></span> </a>';
                out+="<p>"+notify.title+"</p>";
                var date=new Date(parseInt(notify.postedTime));
                out+='<p class="time">'+background.dateFormat(date, "dddd, mmmm dS, HH:MM")+"</p>";
                out+="</section>";
            }
            $("#notificationfeed").html(out);
        },
        showfriends:function(){
            background.netLogDB.getAllFriends(function(response){
                var out='<div class="date">All Friend List</div>';
                for(i=0;i<response.length;i++){
                    out+='<section class="gray-round fr-section">';
                    out+='<p>17:30  <a href="'+response[i].profileUrl+'">'+response[i].displayName+'</a>'
                    out+='</section>';
                }
                $("#friendfeed").html(out);
                $("#vistorfeed").html(out);
            });
        },
        updateview:function(){
            netLogPopup.showNotification();
            netLogPopup.showfriends();
        },
        pendingState:function(){
            netLogPopup.readyState();
            $("#loader").show();
        },
        startState:function(){
            $("#loader").hide();
            $("#leftmenue").show();
            $(".logout").html("Log Out");
            $(".tabs").click(function(){
                netLogPopup.makeItActive($(this).children('a'));
            });
            netLogPopup.updateview();
            $("#anotherimg").click(function(){
                $("#uploader").show();
                $("#addphoto").hide();
            });
            $("#notifaction-link").addClass("active");
            $("#content-notifaction-link").show()
        }
        
    };
    $(function(){//init
        $(".logout").click(function(){
            netLogPopup.authenticate();
        })
        if(window.localStorage.pendingState){
            netLogPopup.pendingState();
        }else{
            if(!window.localStorage.authtokenObj){
                netLogPopup.readyState()
                $(".logout").html("Log In");
                netLogPopup.authenticate();
            }else{
                $(".tabs").click(function(){
                    netLogPopup.makeItActive($(this).children('a'));
                });
                netLogPopup.updateview();
                $("#anotherimg").click(function(){
                    $("#uploader").show();
                    $("#addphoto").hide();
                });
            }
        }
        $("#friends-link").click(function(){
            netLogPopup.showfriends();
        });
        $("#notifaction-link").click(function(){
            netLogPopup.showNotification();
        });
        $("#visitors-link").click(function(){
            netLogPopup.showfriends();
        });
        $("input[type=file]").change(function(){
            $(this).parents(".uploader").find(".filename").val($(this).val());
        });
        $("input[type=file]").each(function(){
            if($(this).val()==""){
                $(this).parents(".uploader").find(".filename").val("No file selected...");
            }
        });
    });
    return netLogPopup;
}
var netLogPopup=new NetlogPopupObject();

