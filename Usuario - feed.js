'use strict'
let publicaciones = [];
let Upets = [];
let globalUsers = [];
let siguiendo = [];
let seguidores = [];
let usuario = {
    id: 0,
    correo: "abc@abc.abc",
    nombre: "abc",
    fecha: "2000-05-01",
    password: "12345",
    reportado: false,
    seguidores: [4,5],
    siguiendo: [1,2,3],
    admin: false,
    moderador: true,
    img: "https://www.tialoto.bg/media/files/resized/article/615x/zip/zip-814d2ef213786c340967119ea9f88f8f.jpg"
  };
let newPostForm = document.getElementById('newPost');
let newPostBtn = newPostForm.querySelector('button');
let searchBtn = document.getElementById('dropdownSearch');

document.body.onload = loadFeed;
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
    makeHTTPRequest(`/usuarios`, 'GET', '', '',
                (xhr) => {
                    if(xhr.status != 200) {console.log('error'); return}
                    //arreglo de JSONs de las publicaciones del usuario y de usuarios que sigue
                    globalUsers = JSON.parse(xhr.response);
                    siguiendo = globalUsers.filter(u => usuario.siguiendo.includes(u.id));
                    seguidores = globalUsers.filter(u => usuario.seguidores.includes(u.id));
                    // console.log(siguiendo);
                    // console.log(seguidores);
                });
    makeHTTPRequest(`/publicaciones?${ids}`, 'GET', '', '',
                (xhr) => {
                    if(xhr.status != 200) {console.log('error'); return}
                    //arreglo de JSONs de las publicaciones del usuario y de usuarios que sigue
                    publicaciones = JSON.parse(xhr.response).sort(sortByDate); //ordenar de mas reciente a menos reciente
                    findUsersInPosts();
                    // console.log(publicaciones);
                });
    makeHTTPRequest(`/mascotas?${ids}`, 'GET', '', '',
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
    publicaciones.forEach(elem => {
        elem.username = globalUsers.find(usu => (elem.idU == usu.id)).nombre;
    });
    findPets();
}

function findPets() {
    let ids = `idU=${usuario.id}`;
    usuario.siguiendo.forEach(elem => ids += `&idU=${elem}`);
    makeHTTPRequest(`/mascotas?${ids}`, 'GET', '', '',
                (xhr) => {
                    if(xhr.status != 200) {console.log('error'); return}
                    //arreglo de JSONs de las publicaciones del usuario y de usuarios que sigue
                    let pets = JSON.parse(xhr.response);
                    publicaciones.forEach(elem => {
                        elem.nombreMascotas = '';
                        // console.log(elem.mascotas);
                        elem.mascotas.forEach(pet => {
                            let pName = Upets.find(p => p.id == pet);
                            console.log(typeof(pName.nombre));
                            elem.nombreMascotas += '#'+pName.nombre;
                        });
                    });
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
        return petToHTML(pet);
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
                <td><a href="#" style="color: brown;""><i class=" fas fa-paw"></i> Me gusta</a></td>
                <td align="right"><a class="report" href="#" style="color: red;"><i class="fas fa-times-circle"></i> Reportar</a></td>
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
    for(let i = 0; i < petList.length; i++) {
        console.log(petList[i].value);
    }
    let petArray = [];
    petList.forEach(pet => {
        let p = Upets.find(elem => elem.nombre == pet.value);
        petArray.push(p.id);
    })
    console.log(petArray);
    let newPost = {
        "id": 4,
        "idU": usuario.id,
        "descripcion": newPostForm.getElementsByTagName('textarea')[0].value,
        "img": document.getElementById('imagen').value,
        "mascotas": petArray,
        "reportado": false,
        "fecha": new Date(),
        "likes": 0
    }
    // console.log(newPost);
    // location.reload();
    makeHTTPRequest(`/publicaciones`,'POST', {'Content-Type': 'application/json'}, newPost,
                (xhr) => {
                    if(xhr.status == 201) {
                        alert('Exito');
                        window.location.reload();
                    }
                    else {
                        alert('Error en registro');
                    }
                });
}

searchBtn.onclick = buscarUsuarios;
function buscarUsuarios() {
    let search = document.querySelector('[placeholder="Buscar"]').value;
    let searchResult = globalUsers.filter(u => u.nombre.toLowerCase().includes(search.toLowerCase()));
    searchResult = searchResult.map(u => { //recorre toda la lista con map y retorna un nuevo arreglo
        return resultTable(u);
    });
    document.querySelector('#resultadoBusqueda tbody').innerHTML = searchResult.join('');
}

function resultTable(person) {
    let sResultado = `<tr>
        <td scope="row"><img src="${person.img}" alt=""></td>
        <td class="usuario">${person.nombre}</td>
        <td><a href="#" style="color:green;" class="seguir">Seguir</a></td>
    </tr>
    `;
    return sResultado;
}