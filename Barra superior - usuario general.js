'use strict'
let searchBtn = document.getElementById('dropdownSearch');
let globalUsers = [];
let usuario;

document.body.onload = loadUser;

function loadUser() {
    makeHTTPRequest(`/usuarios/0`, 'GET', '', '',
                (xhr) => {
                    if(xhr.status == 200) {
                        usuario = JSON.parse(xhr.response);
                        loadBar();
                    } else {
                        alert("Error al cargar la pagina");
                    }
                });
}

function loadBar() {
    document.querySelector('nav button:first-of-type').innerText = usuario.nombre;
    if(usuario.admin) {
        document.querySelector('.dropdown-menu:first-of-type a:nth-of-type(2)').removeAttribute('hidden');
    }
    if(usuario.moderador) {
        document.querySelector('.dropdown-menu:first-of-type a:nth-of-type(3)').removeAttribute('hidden');
    }

    makeHTTPRequest(`/usuarios`, 'GET', '', '',
                (xhr) => {
                    if(xhr.status != 200) {console.log('error'); return}
                    globalUsers = JSON.parse(xhr.response);
                });
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
    makeHTTPRequest(`/usuarios/${usuario.id}`, 'PATCH', {'Content-Type': 'application/json'}, usuario,
                (xhr) => {
                    if(xhr.status == 200) {
                        console.log('cambio exitoso');
                    } else {
                        console.log('error en actualizacion');
                    }
                });
    makeHTTPRequest(`/usuarios/${user.id}`, 'PATCH', {'Content-Type': 'application/json'}, user,
                (xhr) => {
                    if(xhr.status == 200) {
                        console.log('cambio exitoso');
                    } else {
                        console.log('error en actualizacion');
                    }
                });
    window.location.reload();
}
