'use strict'
// let url = "https://api.myjson.com/bins/rty5e";
let baseURl = "http://localhost:3000";

function makeHTTPRequest(endpoint, method, headers, data, cb){
    // 1. crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. configurar
    xhr.open(method, baseURl+endpoint);
    for(let key in headers) {
        xhr.setRequestHeader(key, headers[key]);
    }
    // 4. Enviar solicitud
    xhr.send(JSON.stringify(data));
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = () => {
        // console.log(xhr.response);
        cb(xhr);
    }
}