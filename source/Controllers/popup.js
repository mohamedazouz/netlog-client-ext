var background=chrome.extension.getBackgroundPage();
NetlogPopupObject=function(){
    var netLogPopup={
        makeItActive:function(nextActive){
            var lastActive=$(".active").removeClass("active");
            $("#content-"+lastActive.attr("class")).hide();
            if($(nextActive).attr("class")=="photo-link" &&(navigator.appVersion.indexOf("Mac")!=-1 || navigator.appVersion.indexOf("Linux")!=-1)){
                chrome.tabs.create({
                    url:"views/upload.html",
                    selected:true
                });
            }else{
                $("#content-"+nextActive.attr('class')).show();
                $(nextActive).addClass("active");
            }
        },
        authenticate:function(){
            if(!localStorage.authtokenObj){
                $(".logout").hide();
                window.localStorage.pendingState=1;
                netLogPopup.pendingState();
                background.netLogBG.netlogAuth.open( function(response){
                    background.netLogBG.initUserData(function(){
                        $(".logout").html("Log Out");
                        $(".logout").show();
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
                        out+='<b style="color:#4276A6;">'+[notifications[i].nickname?notifications[i].nickname:notifications[i].type] + '</b>';
                        out+='<a href="'+notifications[i].url+'" target="_blanck">'+"<p>"+notifications[i].message+"</p>"+'</a>';
                        var theDate = new Date(parseInt(notifications[i].date)* 1000);
                        var date=theDate.toGMTString();
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
                if(vistitors){
                    if(vistitors.length==0){
                        out+="There is No Vistor";
                    }
                    for(i=0;i<vistitors.length;i++){
                        out+='<section class="gray-round">';
                        out+='<a href="'+vistitors[i].visitorid.profileUrl+'" target="_blanck">'+'<img src="'+vistitors[i].visitorid.thumbnailUrl+'" class="f"/>';
                        out+=[vistitors[i].nickname?vistitors[i].nickname:"Netlog"]+'</a>';
                        var theDate = new Date(parseInt(vistitors[i].date)* 1000);
                        var date=theDate.toGMTString();
                        out+='<p class="f time visitors-date">'+background.dateFormat(date, "dddd, mmmm dS, HH:MM")+'</p>'
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
            var out='';
            if(JSON.parse(window.localStorage.friendsLog).code==400){
                out="There is No Friends Log";
            }else{
                var friendsLog=JSON.parse(window.localStorage.friendsLog).friendActivities.list;
                if(friendsLog){
                    if(friendsLog.length==0){
                        out+="There is No Friends Log";
                    }else{
                        out+='<div class="date">Friends Log</div>'
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
        pendingState:function(msg){
            netLogPopup.readyState();
            $("#loader").show();
            msg_="You are still not logged,follow the link";
            if(msg && window.localStorage.authtokenObj){
                msg_=msg;
            }
            $("#authMsg").html(msg_);
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
        showUploader:function(mac){
            if(mac==0){
                if(window.localStorage.uploading){
                    $("#uploadLoader").show();
                    $('.upload-area').hide();
                }else{
                    $('.upload-area').show();
                }
            }else{
                chrome.tabs.create({
                    url:"views/upload.html",
                    selected:true
                });
            //$('.upload-area').html('<a href="" class="button" target="_blanck">upload</a>');
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
        },
        authenticationfail:function(){
            netLogPopup.readyState();
            $("#loader").children("img").attr("style","position: absolute;z-index: 100;top: 31%;left: 25%");
            $("#loader").children("img").attr("src","../views/images/bg.png");

            netLogPopup.loaderMessage("Faild to Authenticate, Please click Login to try again");
        },
        loaderMessage:function(msg){
            $("#authMsg").html(msg);
        }
        
    };
    $(function(){//init
        $(".logout").click(function(){
            netLogPopup.authenticate();
        })
        if(window.localStorage.errorObj){
            netLogPopup.authenticationfail();
        }else{
            if(window.localStorage.pendingState){
                netLogPopup.pendingState(window.localStorage.status);
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
                    $(".logout").html("Log out")
                    netLogPopup.updateview();
                    $("#anotherimg").click(function(){
                        $(".filename").val("No file selected...");
                        $("#uploader").show();
                        $("#addphoto").hide();
                    });
                }
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
            mac=0;
            if (navigator.appVersion.indexOf("Mac")!=-1 || navigator.appVersion.indexOf("Linux")!=-1){
                mac=1;
            }
            netLogPopup.showUploader(mac);
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

