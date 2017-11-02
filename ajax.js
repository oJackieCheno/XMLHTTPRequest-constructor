//Ajax Request Object Constructor，新建ajaxReq对象的构造函数
/*之所以自定义ajaxReq对象而不是利用内置的XMLHTTPRequest()对象是因为：每次要运用内置的XMLHTTPRequest()对象，我们都需要把一定量的样板代码放到他的应用程序里，
如果我们自定义一个对象，在构造函数里把样板代码放进去，以后每次需要引用XMLHTTPRequest()对象，我们只需新建一个ajaxReq对象即可，省去了很多麻烦。这样，
创建一个可以在任何浏览器中发起Ajax请求的的AjaxRequest()对象只需要一步：var ajaxReq = new AjaxRequest(); 而AjaxRequest的构造函数会自动计算创建底层XMLHTTPRequest()对象时种种错综复杂之处*/
function AjaxRequest() {
    // Try the XMLHttpRequest object first
    if (window.XMLHTTPRequest) {
        try {
            this.request = new XMLHTTPRequest(); //JS内置对象，用于发起Ajax请求并处理Ajax响应，这条语句把内置的XMLHTTPRequest()对象整个存储与新建的ajaxReq()对象的request特性中
        } catch (e) {
            this.request = null; // try/catch语句是JS的高级错误处理机制，能让脚本优雅的处理运行时的错误
        }
        // Now try the ActiveX (IE) version
    } else if (window.ActiveXObject) {
        try {
            this.request = new ActiveXObject("Msxml2.XMLHTTP");
            // Try the older ActiveX object for older versions of IE
        } catch (e) {
            try {
                this.request = new ActiveXObject("Microsoft.XMLHTTP"); //尝试几种不同的方式来创建XMLHTTPRequest()对象，因为有些浏览器支持他的方式不一样
            } catch (e) {
                this.request = null;
            }
        }
    }
    // If the request creation failed, notify the user
    if (this.request == null) {
        alert("Ajax error creating the request.\n" + "Details: " + e)
    }
}

//add a method to AjaxRequest Object: send(): Send an Ajax request to the server
AjaxRequest.prototype.send = function(type, url, handler, postDataType, postDate) { //给自定义的ajasReq对象新建一个send()方法
    if (this.request != null) {
        // Kill the previous request
        this.request.abort(); //abort()：内置对象XMLHTTPRequest()的方法，用于清除Ajax请求
    }

    // Tack on a dummy(虚拟的) parameter to override browser caching
    url += "?dummy" + new Date().getTime();

    try {
        this.request.onreadystatechange = handler;
        /*handler是自定义的回调函数，一旦请求在服务器上处理完毕，它的响应在JS代码中使用回掉的请求处理器函数处理，在请求结束后立即被调用。除了表示请求已经成功，
        这个函数的工作还包括根据服务器返回的响应数据（存储在XMLHTTPRequest()对象的responseText或者responseXML特性中，通过var Data = XMLHTTPRequest().responseText，
        或者针对自定义的对象：var Data = ajaxReq.request.responseText,因为XMLHTTPRequest()对象存储在自定义对象的request特性中，即可把返回的数据存到Data变量中）而行动，所以，
        对不同的程序，handler函数是不一样的，根据程序量身定造，所以创建一个Ajax请求时，最主要的工作就是编写handler函数*/

        //XMLHTTPRequest()对象的特性，请求状态改变时调用函数引用。用于存储一个函数引用，引用于Ajax请求状态改变时被调用的自定义事件处理器--处理响应的地方
        this.open(type, url, true); // always asynchronous(异步的) (true)，open()：XMLHTTPRequest()对象的方法，用于准备请求，指定请求类型，URL及其他的细节，
        if (type.toLowerCase() == "get") {
            // Send a GET request; no data involved
            this.request.send(null); //send()：XMLHTTPRequest()对象的方法，用于传送请求，交给服务器处理
            //当是“GET”方法时，请求传送时没有向服务器发送数据，只是单纯的向服务器请求数据，所以send()自变量是null空
        } else {
            // Send a POST request; the last argument is data
            this.request.setRequestHeader("Content-Type", postDataType);
            this.request.send(postData);
            //当是“POST”方法时，请求传送时会同时向服务器发送数据，以更新服务器的数据，所以send()自变量是被传送给服务器的数据
        }
    } catch (e) {
        alert("Ajax error communicating with the server.\n" + "Details: " + e);
    }
}

//给自定义的ajaxReq对象新建方法
AjaxRequest.prototype.getStatus = function() {
    return this.request.status; //status：XMLHTTPRequest()对象的特性，显示HTTP的请求状态代码，如404：找不到文件；200：OK
}

AjaxRequest.prototype.getReadyState = function() {
        return this.request.readyState; //readyState：XMLHTTPRequest()对象的特性，显示请求的状态，0：未初始； 1：开启； 2：已传送； 3：接收中； 4：已载入。 
    }
    //当status显示200并且readystate显示4，则表示Ajax的请求已合格的响应结束
AjaxRequest.prototype.getResponseText = function() {
    return this.request.responseText; //responseText：XMLHTTPRequest()对象的特性，是由服务器返回的响应数据，格式为纯文本字符串
}

AjaxRequest.prototype.getResponseXML = function() {
        return this.request.responseXML; //responseXML：XMLHTTPRequest()对象的特性，是由服务器返回的响应数据，格式为XML节点树构成的对象
    }
    //responseText和responseXML两个特性用于存储服务器返回的Ajax响应数据