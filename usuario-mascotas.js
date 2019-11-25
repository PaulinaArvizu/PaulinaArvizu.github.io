'use strict'
const baseURL = 'http://localhost:3000';
document.body.onload = loadPets;
let detailedPets = [];
let userId = 0;

let mRegistro = document.getElementById("addPet");
let mInvCampos = document.querySelectorAll(":invalid");
let mValCampos = document.querySelectorAll(":valid");
let mBtnAgregar = document.getElementById("PetAdd");
let mBtnEditar = document.getElementById("PetEdit");
let mBtnEliminar = document.getElementById("PetDelete");
let mBtnActualizar = document.getElementById("PetEd");
let mBtnBorrar = document.getElementById("PetDel");

let hoy = new Date();

mInvCampos.forEach(function (obj) {
    obj.style = "border-color: lightcoral";
});

//EVENT LISTENERS
mRegistro.addEventListener('change', openReg);
mBtnAgregar.addEventListener('click', addPet);
mBtnEditar.addEventListener('click', editPet);
mBtnEliminar.addEventListener('click', deletePet);
mBtnActualizar.addEventListener('click', updatePet);
mBtnBorrar.addEventListener('click', DoDeletePet);

//FUNCIONES
function loadPets(event) {
    makeHTTPRequest('/mascotas', 'GET', '', listPets);
    loadUser();
}

function petListToHTML(pets) {
    let arrPets = pets.map(function(pet) {
        return petToHTML(pet);
    });
    document.getElementById('listaDeMascotas').innerHTML = arrPets.join("");
}

function petToHTML(pet) {
    let fechaNacimiento = new Date(pet.fecha);
    let edad = Math.floor((hoy - fechaNacimiento)/31557600000);
    let ret = `<div class="card">
    <table width="100%">
        <tr>
            <td>
                <img class="MascotaPP card-img-top border border-dark rounded" src="${pet.img}"
                    alt="Card image cap">
            </td>
            <td align="right">
                <p><button type="button" class="btn btn-primary" onclick="editPet('${pet.id}')" data-toggle="modal" data-target="#edit-Pet"> <i class="fas fa-pen"></i> Editar</button></p>
                <p><button type="button" class="btn btn-danger" onclick="deletePet('${pet.id}')" data-toggle="modal" data-target="#delete-Pet"><i class="fas fa-trash-alt"></i>
                        Eliminar</button></p>
            </td>
        </tr>
    </table>
    <div class="card-body">
        <h5 class="card-title">${pet.nombre}</h5>
        <p class="card-text">${pet.descripcion}</p>
    </div>
    <div class="card-footer">
        <small>
            <ul type="none">
                <li><b>Tipo:</b> ${pet.tipo}</li>
                <li><b>Raza:</b> ${pet.raza}</li>
                <li><b>Edad:</b> ${edad}</li>
            </ul>
        </small>
    </div>
</div>`;
    return ret;
}

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

function addPet(event) {
    event.preventDefault();
    console.log("hoa");

    let idPet = detailedPets[detailedPets.length-1].id+1;
    console.log(idPet);
    let newPet = {
        id: idPet,
        idU: userId,
        nombre: document.getElementById("nombre-mascota").value,
        fecha: document.getElementById("nacim-mascota").value,
        tipo: document.getElementById("tipo-mascota").value,
        raza: document.getElementById("raza-mascota").value,
        size: document.getElementById("pet-size").value,
        descripcion: document.getElementById("about-pet").value,
        img: ""
    }
    console.log(newPet);
    makeHTTPRequest('/mascotas', 'POST', newPet, cbAddPet);
}


function editPet(id) {
    console.log(id);
    makeHTTPRequest(`/mascotas/${id}`,'GET', '', cbEditPet);
}

function updatePet(event) {
    event.preventDefault();
    let newPet = {
        id: document.getElementById("edit-pet-id").value,
        idU: userId,
        nombre: document.getElementById("edit-nombre-mascota").value,
        fecha: document.getElementById("edit-nacim-mascota").value,
        tipo: document.getElementById("edit-tipo-mascota").value,
        raza: document.getElementById("edit-raza-mascota").value,
        size: document.getElementById("edit-pet-size").value,
        descripcion: document.getElementById("edit-about-pet").value,
    }
    makeHTTPRequest(`/mascotas/${newPet.id}`, 'PATCH', newPet, cbUpdatePet);
}

function deletePet(id) {
    makeHTTPRequest(`/mascotas/${id}`, 'GET', '', cbToDeletePet);
}

function DoDeletePet(event) {
    console.log("entro");
    console.log(document.getElementById("delete-id-mascota").innerText);
    let petId = document.getElementById("delete-id-mascota").innerText;
    makeHTTPRequest(`/mascotas/${petId}`, 'DELETE', '', cbDoDeletePet);
}
//REQUEST
function makeHTTPRequest(endpoint, method, data, callback) {
    console.log(method);
    let headers = {
        'Content-Type': 'application/json'
    };
    if(method=='DELETE')
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


function listPets(xhr) {
    
    switch (xhr.status) {
        case 200:
            let pList = JSON.parse(xhr.response);
            pList.forEach(element => {
            if(element.idU == userId){
                let petId = element.id;
                makeHTTPRequest(`/mascotas/${petId}`, 'GET', '', petDetails);
            }
            });
            break;
        default:
            alert("Error " + xhr.status);
    }
    return xhr.status;
}

function petDetails(xhr) {
    switch (xhr.status) {
        case 200:
            let newPet = JSON.parse(xhr.response);
            detailedPets.push(newPet);
            petListToHTML(detailedPets);
    }
    return xhr.status;
}

function cbAddPet(xhr) {
        switch (xhr.status) {
            case 200:
                let newPet = JSON.parse(xhr.response);
                detailedPets.push(newPet);
                petListToHTML(detailedPets);
        }
        return xhr.status;
}

function cbEditPet(xhr) {
    let pet = JSON.parse(xhr.response);
    console.log(pet);
    document.getElementById("edit-pet-id").value = pet.id;
    document.getElementById("edit-nombre-mascota").value = pet.nombre;
    document.getElementById("edit-nacim-mascota").value = pet.fecha;
    document.getElementById("edit-tipo-mascota").value = pet.tipo;
    document.getElementById("edit-raza-mascota").value = pet.raza;
    document.getElementById("edit-pet-size").value = pet.size;
    document.getElementById("edit-about-pet").value = pet.descripcion;
    return xhr.status;
}

function cbUpdatePet(xhr) {
    switch(xhr.status)
        {
            case 200: console.log("Exitoso: " + xhr.status);
                alert("Mascota Actualizada");
                window.location.reload(true);
                break;
            default:
                alert("Error "+ xhr.status);
        }
        return xhr.status;
}

function cbToDeletePet(xhr) {
    console.log(xhr.response);
    let pet2del = JSON.parse(xhr.response);
    document.getElementById("delete-nombre-mascota").innerText = pet2del.nombre;
    document.getElementById("delete-id-mascota").innerText = pet2del.id;

    return xhr.status;

}

function cbDoDeletePet(xhr) {
    switch(xhr.status)
        {
            case 200: console.log("Exitoso: " + xhr.status);
                alert("Mascota Eleminado");
                window.location.reload(true);
                break;
            default:
                alert("Error "+ xhr.status);
        }
        return xhr.status;

}
