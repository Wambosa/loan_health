function Http() {

    var defaultErrorHandler = function(error){
        console.warn("http service default error handler called");
        console.log(error);
    };

    var get = function (url, data, successHandler, errorHandler) {
        return $.ajax({
            method: "GET",
            url: url,
            data: data,
            dataType: "json",
            success: successHandler,
            error: errorHandler || defaultErrorHandler
        });
    };

    var post = function (url, data, successHandler, errorHandler) {
        return $.ajax({
            url: url,
            data: JSON.stringify(data),
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            success: successHandler,
            error: errorHandler || defaultErrorHandler
        });
    };

    return {
        get: get,
        post: post
    };
}