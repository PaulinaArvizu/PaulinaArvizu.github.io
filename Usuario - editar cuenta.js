'use strict'
let usernameModal = document.getElementById('change-username');
let newUsernameBtn = usernameModal.querySelector('.modal-footer button:last-of-type');

let PWModal = document.getElementById('changePW');
let newPWBtn = PWModal.querySelector('.modal-footer button:last-of-type');

let imgModal = document.getElementById('change-img');
let newImgBtn = imgModal.querySelector('.modal-footer button:last-of-type');

function loadImg() {
    // let promise = new Promise((resolve, reject) => {
    //     resolve
    // })
    document.querySelector('.foto-perfil img').setAttribute('src', usuario.img);
}

usernameModal.querySelector('input').onchange = changeUsername;
function changeUsername() {
    let input = usernameModal.querySelector('input').value;
    if(input != '') {
        newUsernameBtn.removeAttribute('disabled');
    } else {
        newUsernameBtn.setAttribute('disabled', '');
    }
}

newUsernameBtn.onclick = applyChangeUsername;
function applyChangeUsername() {
    usuario.nombre = usernameModal.querySelector('input').value;
    if(globalUsers.find(u => u.nombre.toLowerCase()==usuario.nombre.toLowerCase()) != undefined) {
        alert('Ya existe este nombre de usuario.');
        return;
    }
    // alert(globalUsers.find(u => u.nombre.toLowerCase()==usuario.nombre.toLowerCase()));
    
    makeHTTPRequest(`/usuarios/${usuario.id}`, 'PATCH', /*{'Content-Type': 'application/json'},*/ usuario,
                (xhr) => {
                    if(xhr.status == 200) {
                        alert('Nombre de usuario modificado con éxito.');
                        window.location.reload(true);
                    } else {
                        alert('Error en modificación.');
                    }
                });
}

PWModal.onchange = changePassword;
function changePassword() {
    let oldPW = document.getElementById('PW-actual').value;
    if(oldPW != usuario.password) {
        newPWBtn.setAttribute('disabled', '');
        return;
    }
    // console.log('hola1');
    let newPW = [document.getElementById('PW-new').value, document.getElementById('PW-confirm').value];
    if((newPW[0] == '') || (newPW[0] != newPW[1])) {
        newPWBtn.setAttribute('disabled', '');
        return;
    }
    // console.log('adios');
    newPWBtn.removeAttribute('disabled');
}

newPWBtn.onclick = applyChangePW;
function applyChangePW() {
    usuario.password = document.getElementById('PW-new').value;
    // alert(usuario.password);
    makeHTTPRequest(`/usuarios/${usuario.id}`, 'PUT', /*{'Content-Type': 'application/json'},*/ usuario, cbOkPW);
}

function cbOkPW(xhr) {
    if(xhr.status == 200) {
        alert('Contraseña modificado con éxito.');
    } else {
        alert('Error en modificación.');
    }
}

imgModal.querySelector('input').onchange = changeImg;
function changeImg() {
    let input = imgModal.querySelector('input').value;
    if(input != '') {
        newImgBtn.removeAttribute('disabled');
    } else {
        newImgBtn.setAttribute('disabled', '');
    }
}

newImgBtn.onclick = applyChangeImg;
function applyChangeImg() {
    usuario.img = imgModal.querySelector('input').value;
    makeHTTPRequest(`/usuarios/${usuario.id}`, 'PATCH', /*{'Content-Type': 'application/json'},*/ usuario,
                (xhr) => {
                    if(xhr.status == 200) {
                        alert('Foto de perfil modificado con éxito.');
                        window.location.reload(true);
                    } else {
                        alert('Error en modificación de foto de perfil.');
                    }
                });
}

//SCRIPT DE BARRA SUPERIOR
let searchBtn = document.getElementById('dropdownSearch');
let globalUsers = [];
let usuario;

document.body.onload = loadUser; //si se usa este evento en otro js, borrar este y ejecutar la funcion loadUser() dentro de la otra funcion

function loadUser() {
    makeHTTPRequest(`/usuarios/0`, 'GET', '', cbOk1);
}

function cbOk1(xhr){
    if(xhr.status == 200) {
        usuario = JSON.parse(xhr.response);
        loadBar();
    } else {
        alert("Error al cargar la pagina");
    }
}

function loadBar() {
    document.querySelector('nav button:first-of-type').innerText = usuario.nombre;
    if(usuario.admin) {
        document.querySelector('.dropdown-menu:first-of-type a:nth-of-type(2)').removeAttribute('hidden');
    }
    if(usuario.moderador) {
        document.querySelector('.dropdown-menu:first-of-type a:nth-of-type(3)').removeAttribute('hidden');
    }

    makeHTTPRequest(`/usuarios`, 'GET', '', cbOk2);
}

function cbOk2(xhr) {
    if(xhr.status != 200) {console.log('error'); return}
    globalUsers = JSON.parse(xhr.response);
    loadImg();
}


searchBtn.onclick = buscarUsuarios;
function buscarUsuarios() {
    let search = document.querySelector('[placeholder="Buscar"]').value;
    // console.log(search);
    let searchResult = globalUsers.filter(u => ((search != '') && u.nombre.toLowerCase().includes(search.toLowerCase())));
    searchResult = searchResult.map(u => { //recorre toda la lista con map y retorna un nuevo arreglo
        return resultTable(u);
    });
    document.querySelector('#resultadoBusqueda tbody').innerHTML = searchResult.join('');
}

function resultTable(person) {
    let sResultado = `<tr>
        <td scope="row"><img src="${person.img}" alt=""></td>
        <td class="usuario">${person.nombre}</td>
        <td><a href="#" style="color:green;" onclick="seguirUsuario(${person.id})">Seguir</a></td>
    </tr>
    `;
    return sResultado;
}

function seguirUsuario(userId) {
    // console.log(typeof(userId));
    if(usuario.siguiendo.find(u => u == userId) != undefined) {return} //ya lo esta siguiendo
    // console.log("hola");
    usuario.siguiendo[usuario.siguiendo.length] = userId; //agrega a la lista de siguiendo
    let user = globalUsers.find(u => u.id==userId);
    user.seguidores[user.seguidores.length] = usuario.id; //agrega a la lista de seguidores

    //envia los cambios
    makeHTTPRequest(`/usuarios/${usuario.id}`, 'PATCH', usuario, cbOk3);
    makeHTTPRequest(`/usuarios/${user.id}`, 'PATCH', user, cbOk3);
    window.location.reload();
}

function cbOk3 (xhr) {
    if(xhr.status == 200) {
        console.log('cambio exitoso');
    } else {
        console.log('error en actualizacion');
    }
}