'use strict'
const baseURL = 'http://localhost:3000';
document.body.onload = loadPm;
let detailedPm = [];
let userId = localStorage.userId;

function loadPm(event) {
    makeHTTPRequest(`/metodosPago?idU=${userId}`, 'GET', '', listPm);
    loadUser();
}

let mRegistro = document.getElementById("addMethod");
let mInvCampos = document.querySelectorAll(":invalid");
let mValCampos = document.querySelectorAll(":valid");
let mBtnAgregar = document.getElementById("pmAdd");
let mBtnBorrar = document.getElementById("PmDel");
let mBtnEliminar = document.getElementById("PmDelete");

mInvCampos.forEach(function (obj) {
    obj.style = "border-color: lightcoral";
});

//EVENT LISTENERS
mRegistro.addEventListener('change', openReg);
mBtnAgregar.addEventListener('click', addPm);
mBtnBorrar.addEventListener('click', DoDeletePm);

//FUNCIONES


function openReg(event) {

    console.log("funca");
    mInvCampos = document.querySelectorAll(":invalid");
    mValCampos = document.querySelectorAll(":valid");

    mInvCampos.forEach(function (obj) {
        obj.style = "border-color: lightcoral";
    });
    mValCampos.forEach(function (obj) {
        obj.style = "border-color: lightgreen";
    });
        if (mInvCampos.length != 0) {
            mBtnAgregar.setAttribute('disabled', '');
        } else {
            mBtnAgregar.removeAttribute('disabled');
        }
}

function addPm(event) {
    event.preventDefault();
    console.log("hoa");

    let idPm = Number(detailedPm[detailedPm.length - 1].id) + 1;
    let direc = [];
    console.log(document.getElementById("calle-card").value);
    direc.push(document.getElementById("calle-card").value);
    direc.push(document.getElementById("numext-card").value);
    direc.push(document.getElementById("numint-card").value);
    direc.push(document.getElementById("col-card").value);
    direc.push(document.getElementById("ciudad-card").value);
    direc.push(document.getElementById("estado-card").value);
    direc.push(document.getElementById("cp-card").value);
    console.log(direc);
    let newPm = {
        id: idPm,
        idU: userId,
        tarjeta: document.getElementById("card-num").value,
        tipo: document.getElementById("card-type").value,
        categoria: document.getElementById("card-cat").value,
        fecha: document.getElementById("valid-thru-date").value,
        nombre: document.getElementById("card-first-name").value,
        apellido: document.getElementById("card-last-name").value,
        codigo: document.getElementById("security-code").value,
        direccion: direc
    }
    console.log(newPm);
    if((document.getElementById("card-num").value>999999999999999)&&(document.getElementById("card-num").value<10000000000000000)){
        if((document.getElementById("security-code").value>99)&&(document.getElementById("security-code").value<1000))
        makeHTTPRequest('/metodosPago', 'POST', newPm, cbAddPm);
    }
    else{
        alert("Datos invalidos");
    }
}

function pmListToHTML(pms) {
    let arrPm = pms.map(function (pm) {
        return pmToHTML(pm);
    });
    document.getElementById('listaDeMetodos').innerHTML = arrPm.join("");
}

function deletePm(id) {
    makeHTTPRequest(`/metodosPago/${id}`, 'GET', '', cbToDeletePm);
}

function DoDeletePm(event) {
    console.log("entro");
    console.log(document.getElementById("delete-id-card").innerText);
    let pmId = document.getElementById("delete-id-card").innerText;
    makeHTTPRequest(`/metodosPago/${pmId}`, 'DELETE', '', cbDoDeletePm);
}

function pmToHTML(pm) {
    let num = (pm.tarjeta);
    let Corto = num.substring(12, 16);
    let numCorto = "x-" + Corto;
    console.log(numCorto);
    let ret = ` <div class="card bg-light mb-3">
    <div class="card-body">
        <h5 class="card-title" id="MetodoNombre"> ${pm.categoria} <b>${numCorto}</b>
            <!-- <img src="/Imagenes/MasterCard_Logo.png" class="Logo" alt="LogoCC"> -->
        </h5>
            <hr>
        <p class="card-text">
            <ul type="none">
               
                <li><b>Tarjeta: </b>${numCorto}</li>
                <li><b>Tipo: </b>${pm.tipo}</li>
                <li><b>Fecha de Vencimiento: </b>${pm.fecha}</li>
                <li><b>Direccion: </b>
                    <table>
                        <tr>
                            <td>${pm.direccion[0]} ${pm.direccion[1]}, ${pm.direccion[2]}</td>
                        </tr>
                        <tr>
                            <td>${pm.direccion[3]}</td>
                        </tr>
                        <tr>
                            <td>${pm.direccion[6]}, ${pm.direccion[4]} ${pm.direccion[5]}</td>
                        </tr>
                    </table>
                </li>
            </ul>
        </p>
        <table align="center">
            <tr>
                <td>
                </td>
                <td>
                    <button type="button" class="btn btn-danger" id="PmDelete" onclick="deletePm('${pm.id}')" data-toggle="modal" data-target="#delete-Pm"> <i class="fas fa-trash-alt"></i> Eliminar</button>
                <td>
                </td>
            </tr>
        </table>
    </div>
    </div>`;
    return ret;
}

//REQUEST
function makeHTTPRequest(endpoint, method, data, callback) {
    console.log(method);
    let headers = {
        'Content-Type': 'application/json'
    };
    if (method == 'DELETE')
        headers = '';
    // 1. crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. configurar: PUT actualizar archivo
    xhr.open(method, baseURL + endpoint);
    for (let key in headers) {
        xhr.setRequestHeader(key, headers[key]);
        xhr.setRequestHeader
    }
    // 4. Enviar solicitud
    console.log(data);
    console.log(headers);
    xhr.send(JSON.stringify(data));
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = () => {
        callback(xhr);
    }
}

//CALLBACKS

function cbAddPm(xhr) {
    switch (xhr.status) {
        case 200:
            let newPm = JSON.parse(xhr.response);
            detailedPm.push(newPm);
            pmListToHTML(detailedPm);
    }
    return xhr.status;
}


function listPm(xhr) {

    switch (xhr.status) {
        case 200:
            let pList = JSON.parse(xhr.response);
            pList.forEach(element => {
                let pmId = element.id;
                makeHTTPRequest(`/metodosPago/${pmId}`, 'GET', '', pmDetails);
            });
            break;
        default:
            alert("Error " + xhr.status);
    }
    return xhr.status;
}

function pmDetails(xhr) {
    switch (xhr.status) {
        case 200:
            let newPm = JSON.parse(xhr.response);
            detailedPm.push(newPm);
            pmListToHTML(detailedPm);
    }
    return xhr.status;
}

function cbToDeletePm(xhr) {
    console.log(xhr.response);
    let pm2del = JSON.parse(xhr.response);
    document.getElementById("delete-num-card").innerText = pm2del.tarjeta;
    document.getElementById("delete-id-card").innerText = pm2del.id;

    return xhr.status;

}


function cbDoDeletePm(xhr) {
    switch(xhr.status)
        {
            case 200: console.log("Exitoso: " + xhr.status);
                alert("Metodo de pago Eliminado");
                window.location.reload(true);
                break;
            default:
                alert("Error "+ xhr.status);
        }
        return xhr.status;

}
