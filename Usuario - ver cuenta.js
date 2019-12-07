let user;
let userId = 0;
let baseURL = "http://localhost:3000/";

function makeHTTPRequest2(endpoint, method, data, cbOk, cbErr) {
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
let publicaciones;

makeHTTPRequest2('usuarios/' + userId, 'GET', undefined,
    kk => {
        user = JSON.parse(kk);
        document.querySelector('#user-title').innerText = user.nombre;
        // displayPost;
        makeHTTPRequest2('publicaciones?idU=' + userId, 'GET', undefined,
            kk => {
                publicaciones = JSON.parse(kk);
                console.log(kk)
                let postMap = JSON.parse(kk).map(x => htmlPublicacion(x));
                document.querySelector(".publicaciones").innerHTML = "<h3>Tus publicaciones</h3>" + postMap.join(" ");
            },
            nok => {

            });

        makeHTTPRequest2('mascotas?idU=' + userId, 'GET', undefined,
            kk => {
                console.log(kk)
                let petMap = JSON.parse(kk).map(x => htmlPet(x));
                document.querySelector(".tus-mascotas table tbody").innerHTML = petMap.join(" ");
            },
            nok => {
            })
        makeHTTPRequest2('pedidos?idU=' + userId, 'GET', undefined,
            kk => {
                console.log(kk)
                let a = JSON.parse(kk);
                let pOrderMap = a.filter(e => e.status == 2).map(e => htmlPendingOrders(e))
                document.querySelector(".pedidos-pendientes").innerHTML = pOrderMap.join(" ");
                let cOrderMap = a.filter(e => e.status == 3).map(e => htmlPendingOrders(e))
                document.querySelector(".historial-pedidos").innerHTML = cOrderMap.join(" ");
            },
            nok => {
            })
    },
    nok => {
        alert('No existe el usuario');
    });



// let displayPost = makeHTTPRequest2('publicaciones?idU=' + userId, 'GET', undefined,
//     kk => {
//         console.log(kk)
//         let postMap = JSON.parse(kk).map(x => htmlPublicacion(x));
//         document.querySelector(".publicaciones").innerHTML = "<h3>Tus publicaciones</h3>" + postMap.join(" ");
//     },
//     nok => {

//     })


function htmlPublicacion(post) {
    return `<div class="card">
    <div class="card-header">
        ${user.nombre}
    </div>
    <img src="${post.img}"" class=" card-img-top" alt="foto publicacion ${post.id}"">
    <div class=" card-body">
        <p class="mascota">${post.nombreMascotas==undefined?"":post.nombreMascotas}</p>
        <p class="card-text">${post.descripcion}</p>
        <table width="100%">
            <tr>
                <td><button style="color: brown;"" onclick="meGusta('${post.id}')"><i class=" fas fa-paw"></i> Me gusta</button>  <b class="like" style="font-size:15px">${post.likes.length}</b></td>
                <td align="right"><a class="delete" href="#" style="color: red;" onclick="deletePost(${post.id})"><i class="fas fa-times-circle"></i> Eliminar</a></td>
            </tr>
        </table>
    </div>
</div>`
}

function htmlPet(pet) {
    return `<tr>
    <td scope="row"><img src="${pet.img}" alt=""></td>
    <td class="mascota">${pet.nombre}</td>
    </tr>`
}

function deletePost(id) {
    makeHTTPRequest2('publicaciones/' + id, 'DELETE', undefined,
        kk => {
            console.log(kk)
            makeHTTPRequest2('publicaciones?idU=' + userId, 'GET', undefined,
                kk => {
                    console.log(kk)
                    let postMap = JSON.parse(kk).map(x => htmlPublicacion(x));
                    document.querySelector(".publicaciones").innerHTML = "<h3>Tus publicaciones</h3>" + postMap.join(" ");
                },
                nok => {
                    console.log(nok)
                })
        },
        nok => {
            console.log(nok)
        })
}

function htmlPendingOrders(order) {
    return `
    <div class="card border-warning mb-3">
        <div class="card-header">Pedido: #${order.id}</div>
        <div class="card-body">
            <table class="table-striped table-condensed" width="100%">
                <thead>
                    <tr>
                        <th>Cantidad</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                    </tr>
                </thead>
                <tbody>` + order.productos.map(x => `<tr><td scope="row">${x.cantidad}</td><td>${x.nombre}</td><td>$${x.precio}</td></tr>`).join(' ') + `</tbody>
            </table>
        </div>
    </div>`;
}

function htmlCompleteOrders(order) {
    return `<h3>Pedidos en curso</h3>
    <div class="card border-success mb-3">
        <div class="card-header">Pedido: #${order.id}</div>
        <div class="card-body">
        <table class="table-striped table-condensed" width="100%">
    <thead>
        <tr>
            <th>Cantidad</th>
            <th>Nombre</th>
            <th>Precio</th>
        </tr>
    </thead>
    <tbody>` + order.productos.map(x => `<tr><td scope="row">${x.cantidad}</td><td>${x.nombre}</td><td>${x.precio}</td></tr>`).join(' ') + `</tbody>
    </table>`;
}

document.querySelectorAll(".btn-link")[0].addEventListener('click',e=>{
    document.location.href = "Usuario - editar cuenta.html"  
})

document.querySelectorAll(".btn-link")[1].addEventListener('click',e=>{
    document.location.href = "Usuario - Editar Mascotas.html"  
})

function meGusta(postId) {
    let post = publicaciones.find(p => p.id==Number(postId));
    let i = post.likes.indexOf(user.id);
    if(i != -1) {
        post.likes.splice(i, 1);
    } else {
        post.likes[post.likes.length] = user.id;
    }

    event.currentTarget.parentNode.querySelector('b').innerText = post.likes.length;

    makeHTTPRequest2(`publicaciones/${post.id}`, 'PATCH', post,
    kk=>{
        console.log("like exitoso")
    },
    nok=>{
        console.log("no like")
    })
}
