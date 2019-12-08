'use strict'
let publicaciones = [];
let Upets = [];
let globalUsers = [];
let siguiendo = [];
let seguidores = [];
let usuario;
let id;
let newPostForm = document.getElementById('newPost');
let newPostBtn = newPostForm.querySelector('button');
let searchBtn = document.getElementById('dropdownSearch');

let uId = localStorage.userId;

document.body.onload = loadUser;

function loadUser() {
    makeHTTPRequest(`/usuarios/${uId}`, 'GET',/* '', */'',
                (xhr) => {
                    if(xhr.status == 200) {
                        usuario = JSON.parse(xhr.response);
                        loadFeed();
                    } else {
                        alert("Error al cargar la pagina");
                    }
                });
}

function loadFeed() {
    newPostBtn.setAttribute('disabled', '');
    document.querySelector('nav button:first-of-type').innerText = usuario.nombre;
    if(usuario.admin) {
        document.querySelector('.dropdown-menu:first-of-type a:nth-of-type(2)').removeAttribute('hidden');
    }
    if(usuario.moderador) {
        document.querySelector('.dropdown-menu:first-of-type a:nth-of-type(3)').removeAttribute('hidden');
    }

    let ids = `idU=${usuario.id}`;
    usuario.siguiendo.forEach(elem => ids += `&idU=${elem}`);
    makeHTTPRequest(`/usuarios`, 'GET',/* '', */'',
                (xhr) => {
                    if(xhr.status != 200) {console.log('error'); return}
                    //arreglo de JSONs de las publicaciones del usuario y de usuarios que sigue
                    globalUsers = JSON.parse(xhr.response);
                    siguiendo = globalUsers.filter(u => usuario.siguiendo.includes(u.id));
                    seguidores = globalUsers.filter(u => usuario.seguidores.includes(u.id));
                    // console.log(siguiendo);
                    // console.log(seguidores);
                });
    makeHTTPRequest(`/publicaciones`, 'GET',/* '',*/ '',
                (xhr) => {
                    if(xhr.status != 200) {console.log('error'); return}
                    //busca el ultimo id
                    publicaciones = JSON.parse(xhr.response);
                    let ids = publicaciones.map(p => p.id);
                    id = Math.max(...ids)+1;
                    //arreglo de JSONs de las publicaciones del usuario y de usuarios que sigue
                    publicaciones = publicaciones.filter(p => (p.idU==usuario.id)||(usuario.siguiendo.find(u => u==p.idU) != undefined));
                    publicaciones = publicaciones.sort(sortByDate); //ordenar de mas reciente a menos reciente
                    findUsersInPosts();
                    // console.log(publicaciones);
                });
    makeHTTPRequest(`/mascotas?${ids}`, 'GET',/* '',*/ '',
                (xhr) => {
                    if(xhr.status != 200) {console.log('error'); return}
                    //arreglo de JSONs de las publicaciones del usuario y de usuarios que sigue
                    Upets = JSON.parse(xhr.response);
                    // console.log(Upets);
                });
}

function sortByDate(a,b) {
    if(a.fecha.toLowerCase() > b.fecha.toLowerCase()) {return -1}
    else if(a.fecha.toLowerCase() < b.fecha.toLowerCase()) {return 1}
    else {return 0}
}

function findUsersInPosts() {
    // publicaciones.forEach(elem => {
    //     elem.username = globalUsers.find(usu => (elem.idU == usu.id)).nombre;
    // });
    findPets();
}

function findPets() {
    let ids = `idU=${usuario.id}`;
    usuario.siguiendo.forEach(elem => ids += `&idU=${elem}`);
    makeHTTPRequest(`/mascotas?${ids}`, 'GET',/* '',*/ '',
                (xhr) => {
                    if(xhr.status != 200) {console.log('error'); return}
                    //arreglo de JSONs de las publicaciones del usuario y de usuarios que sigue
                    let pets = JSON.parse(xhr.response);
                    
                    displayPosts();
                    displayForm();
                    displayFollowers();
                    displayFollowing();
                    // console.log(publicaciones);
                });
}

function displayPosts() {
    let posts = publicaciones.map(post => { //recorre toda la lista con map y retorna un nuevo arreglo
        return postToHTML(post);
    });
    document.getElementsByClassName('publicaciones')[0].innerHTML = posts.join('');
}

function displayForm() {
    let petList = Upets.map(pet => { //recorre toda la lista con map y retorna un nuevo arreglo
        if(pet.idU==usuario.id) {
            return petToHTML(pet);
        }
    });
    document.getElementsByTagName('ul')[0].innerHTML = petList.join('');
}

function displayFollowers() {
    let followerList = seguidores.map(u => { //recorre toda la lista con map y retorna un nuevo arreglo
        return tableRowToHTML(u);
    });
    document.querySelector('#Seguidores tbody').innerHTML = followerList.join('');
}

function displayFollowing() {
    let followingList = siguiendo.map(u => { //recorre toda la lista con map y retorna un nuevo arreglo
        return tableRowToHTML(u);
    });
    document.querySelector('#Siguiendo tbody').innerHTML = followingList.join('');
}

function tableRowToHTML(person) {
    let sResultado = `<tr>
        <td scope="row"><img src="${person.img}" alt=""></td>
        <td class="usuario">${person.nombre}</td>
    </tr>
    `;
    return sResultado;
}

function postToHTML(post) {
    let sResultado = `<div class="card">
    <div class="card-header">
        ${post.username}
    </div>
    <img src="${post.img}" class=" card-img-top" alt="foto publicacion">
    <div class=" card-body">
        <p class="mascota">${post.nombreMascotas}</p>
        <p class="card-text">${post.descripcion}</p>
        <table width="100%">
            <tr>
                <td><button style="color: brown;"" onclick="meGusta('${post.id}')"><i class=" fas fa-paw"></i> Me gusta</button>  <b class="like" style="font-size:15px">${post.likes.length}</b></td>
            </tr>
        </table>
    </div>
</div>
    `;
    // document.getElementById('info').innerHTML = sResultado;
    return sResultado;
}

function petToHTML(pet) {
    let sResultado = `<li>
        <input type="checkbox" name="post-pets" id="${pet.nombre}" value="${pet.nombre}">
        <label for="${pet.nombre}">${pet.nombre}</label>
    </li>`;
    return sResultado;
}

newPostForm.onchange = validatePost;
function validatePost(event) {
    let mascotas = document.querySelector('ul :checked');
    let foto = document.getElementById('imagen').value;
    if(mascotas != null && foto != '') {newPostBtn.removeAttribute('disabled')}
    else {newPostBtn.setAttribute('disabled', '');}
}

newPostBtn.onclick = createPost;
function createPost(event) {
    event.preventDefault();
    let petList = document.querySelectorAll('ul :checked');
    // for(let i = 0; i < petList.length; i++) {
    //     console.log(petList[i].value);
    // }
    let petArray = [];
    petList.forEach(pet => {
        let p = Upets.find(elem => elem.nombre == pet.value);
        petArray.push(p.id);
    });
    let nombreMascotas = '';
    petArray.forEach(pet => {
        nombreMascotas += '#'+pet.nombre;
    });
    let newPost = {
        "id": id,
        "idU": usuario.id,
        "descripcion": newPostForm.getElementsByTagName('textarea')[0].value,
        "img": document.getElementById('imagen').value,
        "fecha": new Date(),
        "likes": [],
        "nombreMascotas": nombreMascotas,
        "username": usuario.nombre
    }
    // console.log(newPost);
    // location.reload();
    makeHTTPRequest(`/publicaciones`,'POST', /*{'Content-Type': 'application/json'},*/ newPost,
                (xhr) => {
                    if(xhr.status == 201) {
                        alert('Publicado');
                        // window.location.reload();
                    }
                    else {
                        alert('Error en publicación');
                    }
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
    makeHTTPRequest(`/usuarios/${usuario.id}`, 'PATCH', /*{'Content-Type': 'application/json'},*/ usuario, cbNewPost);
    makeHTTPRequest(`/usuarios/${user.id}`, 'PATCH', /*{'Content-Type': 'application/json'},*/ user, cbNewPost);
    
}

function cbNewPost(xhr) {
    if(xhr.status == 200) {
        console.log('cambio exitoso');
        window.location.reload();
    } else {
        console.log('error en actualizacion');
    }
}

function meGusta(postId) {
    let post = publicaciones.find(p => p.id==Number(postId));
    let i = post.likes.indexOf(usuario.id);
    if(i != -1) {
        post.likes.splice(i, 1);
    } else {
        post.likes[post.likes.length] = usuario.id;
    }

    event.currentTarget.parentNode.querySelector('b').innerText = post.likes.length;

    // console.log("hola");
    //envia los cambios
    makeHTTPRequest(`/publicaciones/${post.id}`, 'PATCH', /*{'Content-Type': 'application/json'},*/ post,
                (xhr) => {
                    if(xhr.status == 200) {
                        console.log('like exitoso');
                    } else {
                        console.log('error en like');
                    }
                });
}