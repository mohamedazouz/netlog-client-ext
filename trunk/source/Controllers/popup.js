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
                $(".logout").hide();
                window.localStorage.pendingState=1;
                netLogPopup.pendingState();
                background.netLogBG.netlogAuth.open( function(response){
                    console.log(JSON.stringify(response));
                    background.netLogBG.initUserData(function(){
                        $(".logout").html("Log Out");
                        $(".logout").show();
                        console.log("Ready to use extension");
                    })
                });
            }else{
                netLogPopup.removeUserData();
                chrome.browserAction.setIcon({
                    path:'../views/images/icon.png'
                });
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
            if(JSON.parse(window.localStorage.userInfo).code==400){
                out+="There is No Notification";
            }else{
                var notifications=JSON.parse(window.localStorage.userInfo).notifications;
                var out="";
                if(notifications){
                    if(notifications.length==0){
                        out+="There is No Notification";
                    }
                    for(i=0;i<notifications.length;i++){
                        out+='<section class="gray-round">';
                        out+='<a href="'+notifications[i].url+'" target="_blanck">'+notifications[i].nickname+'</a>';
                        out+="<p>"+notifications[i].message+"</p>";
                        var date=new Date(parseInt(notifications[i].date));
                        out+='<p class="time">'+background.dateFormat(date, "dddd, mmmm dS, HH:MM")+"</p>";
                        out+="</section>";
                    }
                }else{
                    out+="There is No Notification";
                }
            }
            $("#notificationfeed").html(out);
        },
        showfriends:function(){
            background.netLogDB.getAllFriends(function(response){
                var out='<div class="date">Friends Log</div>';
                for(i=0;i<response.length;i++){
                    out+='<section class="gray-round fr-section">';
                    out+='<p>17:30  <a href="'+response[i].profileUrl+'" target="_blanck">'+response[i].displayName?response[i].displayName:"Netlog"+'</a>'
                    out+='</section>';
                }
                $("#friendfeed").html(out);
            });
        },
        showVisitor:function(){
            if(JSON.parse(window.localStorage.userInfo).code==400){
                out+="There is No Vistor";
            }else{

                var vistitors=JSON.parse(window.localStorage.userInfo).profilevisitors;
                var out='';
                console.log(vistitors);
                if(vistitors){
                    if(vistitors.length==0){
                        out+="There is No Vistor";
                    }
                    for(i=0;i<vistitors.length;i++){
                        out+='<section class="gray-round visitors-container">';
                        out+='<img src="'+vistitors[i].visitorid.thumbnailUrl+'" class="f"/>';
                        out+='<a href="'+vistitors[i].visitorid.profileUrl+'" class="f" target="_blanck">'+vistitors[i].nickname ?vistitors[i].nickname:"Netlog"+'</a>';
                        var date=new Date(parseInt(vistitors[i].date));
                        out+='<span class="f-r visitor-time">'+background.dateFormat(date, "dddd, mmmm dS, HH:MM")+'</span>'
                        out+='<div class="clearfix"></div>';
                        out+='</section>'
                    }
                }else{
                    out+="There is No Vistor";
                }
            }
            $("#vistorfeed").html(out);
        },
        showFriendsLog:function(){
            if(JSON.parse(window.localStorage.friendsLog).code==400){
                out+="There is No Friends Log";
            }else{
                var friendsLog=JSON.parse(window.localStorage.friendsLog).friendActivities.list;
                var out='<div class="date">Friends Log</div>';
                if(friendsLog){
                    if(friendsLog.length==0){
                        out+="There is No Friends Log";
                    }else{
                        for(i=0;i<friendsLog.length;i++){
                            userName="Netlog";
                            if(friendsLog[i].userId.displayName){
                                userName=friendsLog[i].userId.displayName
                            }
                            userlink=friendsLog[i].userId.profileUrl;
                            out+='<section class="gray-round fr-section">';
                            //out+='<p><a href="'+userlink+'" target="_blanck">'+userName+'</a></p>'
                            out+='<p>'+friendsLog[i].title+'</p>'
                            out+='</section>';
                        }
                    }
                    
                }else{
                    out+="There is No Friends Log";
                }
            }
            $("#friendfeed").html(out);
        },
        updateview:function(){
            netLogPopup.showNotification();
            netLogPopup.showFriendsLog();
            netLogPopup.showVisitor();
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
            netLogPopup.setBadge()
            netLogPopup.updateview();
            $("#anotherimg").click(function(){
                $("#uploader").show();
                $("#addphoto").hide();
            });
            $("#notifaction-link").addClass("active");
            $("#content-notifaction-link").show()
        },
        showUploader:function(){
            if(window.localStorage.uploading){
                $("#uploadLoader").show();
                $('.upload-area').hide();
            }else{
                $('.upload-area').show();
            }
        },
        removebagde:function(class_){
            $("#"+class_).html("");
            $("#"+class_).removeClass("notifaction-counter");
        },
        setBadge:function(){
            chrome.browserAction.setBadgeText({
                text:""
            });
            if(window.localStorage.notifyNumberUserNotification!="0"){
                $("#notify-counter").html(window.localStorage.notifyNumberUserNotification);
                setTimeout("netLogPopup.removebagde('notify-counter')",2*1000);
            }else{
                netLogPopup.removebagde('notify-counter')
            }
            if(window.localStorage.notifyNumberfriendsLog!="0"){
                $("#log-counter").html(window.localStorage.notifyNumberfriendsLog);
            }else{
                netLogPopup.removebagde('log-counter')
            }

            if(window.localStorage.notifyNumberUserVisitor!="0" && window.localStorage.notifyNumberUserVisitor){
                $("#visitor-counter").html(window.localStorage.notifyNumberUserVisitor);
            }else{
                netLogPopup.removebagde('visitor-counter');
            }
            window.localStorage.notifyNumberUserNotification="0";
            window.localStorage.notifyNumberfriendsLog="0";
            window.localStorage.notifyNumberUserVisitor="0";
        }
        
    };
    $(function(){//init
        $(".logout").click(function(){
            netLogPopup.authenticate();
        })
        if(window.localStorage.pendingState){
            netLogPopup.pendingState();
        }else{
            $("#loader").hide();
            if(!window.localStorage.authtokenObj){
                netLogPopup.readyState()
                $(".logout").html("Log In");
            // netLogPopup.authenticate();
            }else{
                netLogPopup.setBadge();
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
            setTimeout("netLogPopup.removebagde('log-counter')",2*1000);
            netLogPopup.showFriendsLog();
        });
        $("#notifaction-link").click(function(){
            setTimeout("netLogPopup.removebagde('notify-counter')",2*1000);
            netLogPopup.showNotification();
        });
        $("#visitors-link").click(function(){
            setTimeout("netLogPopup.removebagde('visitor-counter')",2*1000);
            netLogPopup.showVisitor();
        });
        $("input[type=file]").change(function(){
            $(this).parents(".uploader").find(".filename").val($(this).val());
        });
        $("#photo-link").click(function(){
            netLogPopup.showUploader();
        });
        $("input[type=file]").each(function(){
            if($(this).val()==""){
                $(this).parents(".uploader").find(".filename").val("No file selected...");
            }
        });
        if(window.localStorage.uploading){
            window.localStorage.removeItem("uploading")
        }
    });
    return netLogPopup;
}
var netLogPopup=new NetlogPopupObject();

