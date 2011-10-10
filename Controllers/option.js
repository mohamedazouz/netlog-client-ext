var background=chrome.extension.getBackgroundPage();
NetlogOptionObject=function(){
    var netLogOption={
        authenticate:function(){
            if(!localStorage.authtokenObj){
                $("#loader").show();
                $("#authMsg").html("Authentication Process......");
                background.netLogBG.netlogAuth.open( function(response){
                    $("#authMsg").html("Getting User Data.......");
                    console.log(JSON.stringify(response));
                    background.netLogBG.initUserData(function(){
                        $("#loader").hide();
                        $("#auth").html("remove");
                        console.log("Ready to use extension");
                    })
                });
            }else{
                netLogOption.removeUserData();
                $("#auth").html("auth");
            }
        },
        removeUserData:function(){
            background.netLogBG.removeUserData();
        }
    };
    $(function(){
        var auth="";
        if(!localStorage.authtokenObj){
            auth="auth";
        }else{
            auth="remove";
        }
        $("#auth").html(auth)
        $("#auth").click(function(){
            netLogOption.authenticate();
        })

        $("#getfunction").click(function(){
            console.log($("#functionid").val())
      //      jsontemp=JSON.parse("{key:c3dbdee3-f4e5-c7c0-8ce8-eacef9c5fcc0, secret:3ea5faa7207a6ced5086c3dfcf8c264d}");
            json=
            {
                "key":"c3dbdee3-f4e5-c7c0-8ce8-eacef9c5fcc0",
                "secret":"3ea5faa7207a6ced5086c3dfcf8c264d",
                "function":$("#functionid").val()
            }
            $.ajax({
                url:netlogStaticData.baseURL+netlogStaticData.dofunctionURL,
                data:json,
                type: "POST",
                dataType:"json",
                success: function(response){
                    console.log(JSON.stringify(response));
                }
            });

        });
    })
    return netLogOption;
}
var netLogOption=new NetlogOptionObject();

