'use strict'
const baseURL = 'http://localhost:3000';
document.body.onload = loadUsers;
let detailedUsers = [];

let mBtnBorrar = document.getElementById("userDel");
let mBtnUpdate = document.getElementById("userUpdate");

let hoy = new Date();

//EVENT LISTENERS
mBtnUpdate.addEventListener('click', DoUpdateUser);
mBtnBorrar.addEventListener('click', DoDeleteUser);

function loadUsers(event) {
    makeHTTPRequest('/usuarios', 'GET', '', listUsers);
    loadUser();
}


//FUNCTIONS

function userListToHTML(users) {
    let arrUsers = users.map(function (user) {
        return userToHTML(user);
    });
    document.getElementById('ListaDeUsuarios').innerHTML = arrUsers.join("");
}

function userToHTML(user) {
    let fechaNacimiento = new Date(user.fecha);
    let edad = Math.floor((hoy - fechaNacimiento)/31557600000);
    let ret = `<table class="table table-condensed usuario" width="50%">
    <tbody>
        <tr>
            <th>
                <img src="${user.img}">
                <p>${user.nombre}</p>
            </th>
            <td>
                <p><b>Especifiaciones</b></p>
                <ul type="none">
                    <li>Correo: ${user.correo}</li>
                    <li>Edad: ${edad}</li>
                </ul>
            </td>
            <td>
               
            </td>
            <td>
                <p><button type="button" class="btn btn-secondary" id="btnMakeAdmin" onclick="updateUser('${user.id}')" data-toggle="modal" data-target="#update-User">Cambiar a administrador</button></p>
                <p><button type="button" class="btn btn-danger" id="btnDeleteUser" onclick="deleteUser('${user.id}')" data-toggle="modal" data-target="#delete-User">Eliminar usuario</button></p>
            </td>
        </tr>
    </tbody>
</table>`;
    return ret;
}


function deleteUser(id) {
    makeHTTPRequest(`/usuarios/${id}`, 'GET', '', cbToDeleteUser);
}

function updateUser(id) {
    makeHTTPRequest(`/usuarios/${id}`, 'GET', '', cbToUpdateUser);
}

function DoDeleteUser(event) {
    console.log("entro");
    console.log(document.getElementById("delete-id-user").innerText);
    let userId = document.getElementById("delete-id-user").innerText;
    makeHTTPRequest(`/usuarios/${userId}`, 'DELETE', '', cbDoDeleteUser);
}

function DoUpdateUser(event) {
    console.log("entro");
    console.log(document.getElementById("update-id-user").innerText);
    let userId = document.getElementById("update-id-user").innerText;
    let newUser = {
        admin: "true"
    };
    makeHTTPRequest(`/usuarios/${userId}`, 'PATCH', newUser, cbDoUpdateUser);
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


function listUsers(xhr) {

    switch (xhr.status) {
        case 200:
            let uList = JSON.parse(xhr.response);
            uList.forEach(element => {
                let userId = element.id;
                makeHTTPRequest(`/usuarios/${userId}`, 'GET', '', userDetails);
            });
            break;
        default:
            alert("Error " + xhr.status);
    }
    return xhr.status;
}


function userDetails(xhr) {
    switch (xhr.status) {
        case 200:
            let newUser = JSON.parse(xhr.response);
            detailedUsers.push(newUser);
            userListToHTML(detailedUsers);
    }
    return xhr.status;
}


function cbDoDeleteUser(xhr) {
    switch(xhr.status)
        {
            case 200: console.log("Exitoso: " + xhr.status);
                alert("Usuario Eliminado");
                window.location.reload(true);
                break;
            default:
                alert("Error "+ xhr.status);
        }
        return xhr.status;
}

function cbDoUpdateUser(xhr) {
    switch(xhr.status)
        {
            case 200: console.log("Exitoso: " + xhr.status);
                alert("Usuario actualizado");
                window.location.reload(true);
                break;
            default:
                alert("Error "+ xhr.status);
        }
        return xhr.status;
}

function cbToUpdateUser(xhr) {
    console.log(xhr.response);
    let user2up = JSON.parse(xhr.response);
    document.getElementById("update-nombre-user").innerText = user2up.nombre;
    document.getElementById("update-id-user").innerText = user2up.id;

    return xhr.status;

}

function cbToDeleteUser(xhr) {
    console.log(xhr.response);
    let user2del = JSON.parse(xhr.response);
    document.getElementById("delete-nombre-user").innerText = user2del.nombre;
    document.getElementById("delete-id-user").innerText = user2del.id;

    return xhr.status;

}
