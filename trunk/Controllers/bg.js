NetlogBGObject=function(){
    var netLogBG={
        netlogAuth:{
            open:function(handler){
                netLogBG.netlogAuth.Authenticate(0,netlogStaticData.baseURL+netlogStaticData.gettokenURL,function(data){
                    handler(data);
                });
                chrome.tabs.create({
                    url:netlogStaticData.baseURL+netlogStaticData.loginAuthorizeURL,
                    selected:true
                });
            },
            Authenticate:function(count,link,handler){
                if(! count){
                    count=0;
                }
                count=parseInt(count);
                if(count == 59){
                    return;
                }
                //        url=link
                try{
                    $.ajax({
                        url:link,
                        dataType:'json',
                        success:function(res){
                            if(res.code==400){
                                window.setTimeout(function(){
                                    netLogBG.netlogAuth.Authenticate(count+1,link,handler);
                                }, 1000 * 2);
                            }else{
                                localStorage.authtokenObj=JSON.stringify(res);
                                handler(res);
                            }
                        },
                        error:function(){
                            if(count < 60){
                                window.setTimeout(function(){
                                    netLogBG.netlogAuth.Authenticate(count+1,link,handler);
                                }, 1000 * 2);
                            }
                        }
                    });
                }catch (e){
                    window.setTimeout(function(){
                        netLogBG.netlogAuth.Authenticate(count+1,link,handler);
                    }, 1000 * 2);
                }

            }
        },
        doFunction:function(functionid,options,handler){
            jsontemp=JSON.parse(localStorage.authtokenObj);
            json=
            {
                "key":jsontemp.token.key,
                "secret":jsontemp.token.secret,
                "function":functionid
            }
            if(functionid==5||functionid==6)//friend info || send notification required friend id
            {
                json.friend_id=options.friend_id;
            }
            if(functionid==6)// send notification required tile & body for notification form
            {
                json.body=options.body;
                json.title=options.title;
            }
            $.ajax({
                url:netlogStaticData.baseURL+netlogStaticData.dofunctionURL,
                data:json,
                type: "POST",
                dataType:"json",
                success: function(response){
                    handler(response)
                }
            });
        }
    };
    $(function(){
        //init
        })
    return netLogBG;
}


var netLogBG=new NetlogBGObject();