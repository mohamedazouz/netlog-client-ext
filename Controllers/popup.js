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
            [{
                "nid":"10",
                "uid":"169319402",
                "type":"BIRTHDAYTOMORROW",
                "date":1315621195,
                "message":"It's Google Arabia's birthday in two days!",
                "url":"http:\/\/en.netlog.com\/ChromeArabia2\/actionState=birthday&ru=65457047",
                "visited":true,
                "nickname":"ChromeArabia2",
                "avatar":"http:\/\/s6.netlogstatic.com\/ar\/p\/tt\/169319402_5936028_46501213.jpg",
                "gender":"MALE",
                "itemid":"0"
            }]
            var notifications=JSON.parse(window.localStorage.userInfo).notifications;
            var out="";
            if(notifications){
                for(i=0;i<notifications.length;i++){
                    out+='<section class="gray-round">';
                    out+='<a href="'+notifications[i].url+'" target="_blanck">'+notifications[i].nickname+'</a>';
                    out+="<p>"+notifications[i].message+"</p>";
                    var date=new Date(parseInt(notifications[i].date));
                    out+='<p class="time">'+background.dateFormat(date, "dddd, mmmm dS, HH:MM")+"</p>";
                    out+="</section>";
                }
            }
            $("#notificationfeed").html(out);
        },
        showfriends:function(){
            background.netLogDB.getAllFriends(function(response){
                var out='<div class="date">Friends Log</div>';
                for(i=0;i<response.length;i++){
                    out+='<section class="gray-round fr-section">';
                    out+='<p>17:30  <a href="'+response[i].profileUrl+'" target="_blanck">'+response[i].displayName+'</a>'
                    out+='</section>';
                }
                $("#friendfeed").html(out);
            });
        },
        showVisitor:function(){
            [{
                "userid":"65457047",
                "visitorid":"172836915",
                "date":1315744121,
                "nickname":"Bravehearrt",
                "displayName":"Brave Heart",
                "mainphotoid":"44357948",
                "revisionid":"0",
                "age":"29",
                "gender":"MALE",
                "usertypeid":"1",
                "userType":"USER",
                "namespace":"",
                "status":"ACTIVE",
                "profileUrl":"\/Bravehearrt"
            }]
            var vistitors=JSON.parse(window.localStorage.userInfo).profilevisitors;
            var out='';
            console.log(vistitors);
            if(vistitors){
                for(i=0;i<vistitors.length;i++){
                    out+='<section class="gray-round visitors-container">';
                    out+='<img src="'+vistitors[i].visitorid.thumbnailUrl+'" class="f"/>';
                    out+='<a href="'+vistitors[i].visitorid.profileUrl+'" class="f" target="_blanck">'+vistitors[i].nickname+'</a>';
                    var date=new Date(parseInt(vistitors[i].date));
                    out+='<span class="f-r visitor-time">'+background.dateFormat(date, "dddd, mmmm dS, HH:MM")+'</span>'
                    out+='<div class="clearfix"></div>';
                    out+='</section>'
                }
            }else{
                out+="There is No Vistor";
            }
            $("#vistorfeed").html(out);
        },
        showFriendsLog:function(){
            var friendsLog=JSON.parse(window.localStorage.friendsLog).friendActivities.list;
            var out='<div class="date">Friends Log</div>';
            if(friendsLog){
                for(i=0;i<friendsLog.length;i++){
                    userName=friendsLog[i].userId.displayName;
                    userlink=friendsLog[i].userId.profileUrl;
                    out+='<section class="gray-round fr-section">';
                    out+='<p>17:30  <a href="'+userlink+'" target="_blanck">'+userName+'</a></p>'
                    out+='<p>'+friendsLog[i].title+'</p>'
                    out+='</section>';
                }
            }else{
                out+="There is No Friends Log";
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
            netLogPopup.showFriendsLog();
        });
        $("#notifaction-link").click(function(){
            netLogPopup.showNotification();
        });
        $("#visitors-link").click(function(){
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

