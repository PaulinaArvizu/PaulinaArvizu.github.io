'use strict'
let inicioForm = document.getElementById('inicioSesion');
let iniciar = inicioForm.getElementsByTagName('a')[0];
let registerForm = document.getElementById('registro');
let registro = registerForm.getElementsByTagName('a')[0];

let Usuario = {
    id: 0,
    correo: "",
    nombre: "",
    fecha: "",
    password: "",
    reportado: false,
    seguidores: [],
    siguiendo: [],
    admin: false,
    moderador: false
}

iniciar.onclick = () => {
    //validar que no haya datos invalidos
    let invalid = inicioForm.querySelectorAll(':invalid');
    if(invalid.length == 0) {
        let email = inicioForm.querySelector('[type="email"]').value;
        let pw = inicioForm.querySelector('[type="password"]').value;
        makeHTTPRequest(`/usuarios?correo=${email}`,'GET', '','',(xhr) => {
            if(xhr.status == 200) {
                let user = JSON.parse(xhr.response)[0];
                if(user.password == pw) {window.location.href = 'Usuario - feed.html';}
            }
            else {
                alert('error');
            }
        })
        
    } else {
        invalid.forEach(obj => {obj.style = "border-color: red"});
    }
}

registro.onclick = () => {
    //validar que no haya datos invalidos
    let invalid = registerForm.querySelectorAll(':invalid');
    if(invalid.length == 0) {

        //busca el usuario en la base de datos
        makeHTTPRequest('/usuarios', 'GET', '', '', addUser);
           
    } else {
        invalid.forEach(obj => {obj.style = "border-color: red"});
    }
}

function addUser(xhr) {
    if(xhr.status != 200) {
        alert('error');
        return;
    }
    let users = JSON.parse(xhr.response);
    //validar que no exista el nombre de usuario o el correo
    let nomUsu = registerForm.querySelector('[placeholder="Nombre de Usuario"]').value;
    let email = registerForm.querySelector('[type="email"]').value;
    let repetido = users.find(elem => elem.correo == email);
    if(repetido != undefined) {alert("Ya existe un usuario con este correo."); return}
        
    repetido = users.find(elem => elem.nombre == nomUsu);
    if(repetido != undefined) {alert("Ya existe un usuario con este nombre de usuario."); return}

    // verifica que los datos esten correctos
    let pw = registerForm.querySelectorAll('[type="password"]');
    if(pw[0].value != pw[1].value) {
        pw.forEach(obj => {obj.style = "border-color: red"});
        return;
    }

    //asignar nuevo id
    users = users.map(u => u.id);

    Usuario.id = Math.max(...users)+1;
    Usuario.correo = email;
    Usuario.nombre = nomUsu;
    Usuario.fecha = registerForm.querySelector('[type="date"]').value;
    Usuario.password = pw[0].value;
    Usuario.reportado = false;
    Usuario.admin = false;
    Usuario.moderador = false;
    // console.log(Usuario);
        
    makeHTTPRequest(`/usuarios`,'POST', {'Content-Type': 'application/json'}, Usuario,
                (xhr) => {
                    if(xhr.status == 201) {
                        window.location.href = 'Usuario - feed.html';
                    }
                    else {
                        alert('Error en registro');
                    }
                });
}
