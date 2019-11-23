// `<tr>
// <td>${cantidad}</td>
// <td><img src="${url}" alt="producto"></td>
// <td>${nombreProducto}</td>
// <td>${precio}</td>
// </tr>`

let baseURL = "http://localhost:3000/";
function makeHTTPRequest(endpoint, method, data, cbOk, cbErr) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, baseURL + endpoint);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    xhr.onload = () => {
        if (xhr.status != 200) {
            cbErr(xhr.status, xhr.statusText);
        } else {
            cbOk(xhr.responseText);
        }
    }
}

