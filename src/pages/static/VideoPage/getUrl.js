var RPCClient = require('@alicloud/pop-core').RPCClient;

function initVodClient(accessKeyId, secretAccessKey,) {
    var regionId = 'cn-shanghai';   // 点播服务接入区域
    var client = new RPCClient({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        endpoint: 'http://vod.' + regionId + '.aliyuncs.com',
        apiVersion: '2017-03-21'
    });

    return client;
}
var client = initVodClient('LTAI4G8qrB7zzPDKKLRKMDFs','f6myZK4ZvmtAHTlEhZVwl9vvfkINGK');
client.request("GetPlayInfo", {
    VideoId: '0cbc5384e4dd4a5d9cbadb3b2c550d3c'
}, {}).then(function (response) {
    // play url
    if (response.PlayInfoList && response.PlayInfoList.PlayInfo && response.PlayInfoList.PlayInfo.length > 0){
        for (var i=0; i<response.PlayInfoList.PlayInfo.length; i++){
            console.log("PlayInfo.PlayURL = " + response.PlayInfoList.PlayInfo[i].PlayURL);
        }
    }
    // base metadata
    if (response.VideoBase){
        console.log('VideoBase.Title = ' + response.VideoBase.Title);
    }
    console.log('RequestId = ' + response.RequestId);
}).catch(function (response) {
    
    console.log('ErrorMessage = ' + response.data.Message);
    console.log('RequestId = ' + response.data.RequestId);
});