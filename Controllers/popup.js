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
        showNotification:function(){
            var notifications=JSON.parse(window.localStorage.userNotification).friendActivities.list;
            var out="";
            var query="";
            for(i=0;i<notifications.length;i++){
                query+=notifications[i].userId
                if(i!=notifications.length-1){
                    query+=",";
                }
            }   
            background.netLogDB.getFriendsByListUID(query,function(response){
                for(i=0;i<notifications.length;i++){
                    var notify=notifications[i];
                    out+='<section class="gray-round">';
                    userName="undefiend";
                    userlink="";
                    for(j=0;j<response.length;j++){
                        if(notify.userId==response[j].uid){
                            userName=response[j].displayName;
                            userlink=response[j].profileUrl;
                            break;
                        }
                    }
                    out+='<a href="'+userlink+'" target="_blanck">'+userName+'<span></span> </a>';
                    out+="<p>"+notify.body+"</p>";
                    var date=new Date(parseInt(notify.postedTime));
                    now=new Date();
                    diff=now.getTime()-date.getTime();
                    out+='<p class="time">'+background.dateFormat(new Date(diff), "dddd, mmmm dS, HH:MM")+"</p>";
                    out+="</section>";
                }
                $("#notificationfeed").html(out);
               
            });
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
        }
        
    };
    $(function(){//init
        $(".logout").click(function(){
            netLogPopup.authenticate();
        })
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
        $("#friends-link").click(function(){
            netLogPopup.showNotification();
        });
        $("#notifaction-link").click(function(){
            netLogPopup.showfriends();
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