document.querySelector("#addPay .btn-primary").setAttribute("disabled", true);
document.querySelector("#addAddress .btn-primary").setAttribute("disabled", true);
let iva = 1.16;
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
let userId = 0;

//conseguir metodos de pago
let displayPay = makeHTTPRequest('metodosPago?idU=' + userId, 'GET', undefined,
    kk => {
        let metodos = JSON.parse(kk);
        let listaMetodos = document.querySelector(".metodos-pago");
        listaMetodos.querySelectorAll("label").forEach(e => e.remove());
        metodos.forEach(element => {
            let censor = "************" + ("" + element.tarjeta).substring(12);
            let a = `<label class="form-check-label">
        <input type="radio" class="form-check-input" name="Metodos" id="Met${element.id}" value="${element.id}">
        <div class="card">
            <div class="card-body">
                <h6 class="card-title">${censor}</h6>
            </div>
        </div>
    </label><br>`
            listaMetodos.insertAdjacentHTML('afterbegin', a);
        });
    },
    err => {
        console.log(err);
    })
let displayDirs = makeHTTPRequest('direccionesEnvio?idU=' + userId, 'GET', undefined,
    kk => {
        let dirs = JSON.parse(kk);
        let listaDirs = document.querySelector(".direcciones");
        listaDirs.querySelectorAll("label").forEach(e => e.remove());
        dirs.forEach(element => {
            let a = `<label>
        <input type="radio" name="envio" id="" value="${element.id}">
        <div class="card">
            <div class="card-body">
                <h6 class="card-title">${element.direccion}</h6>
                <p class="card-text">${element.ciudad}, ${element.estado}</p>
            </div>
        </div>
    </label>
    <br>`
            listaDirs.insertAdjacentHTML('afterbegin', a);
        });
    },
    err => {
        console.log(err);
    })

let a;
let subTotal;
makeHTTPRequest('pedidos?idU=' + userId + "&status=1", 'GET', undefined,
    ok => {
        a = JSON.parse(ok)[0];
        subTotal = 0.0;
        document.getElementById("numPedido").innerText = "NA";
        let tbod = document.querySelector("#lista-carrito tbody");
        tbod.innerHTML = "";
        a.productos.forEach(e => {
            let h = `<tr>
            <td>${e.cantidad}</td>
            <td><img src="${e.img}" alt="${e.nombre}" class="thumbnail"></td>
            <td>${e.nombre}</td>
            <td>$${e.precio}</td>
            </tr>`
            tbod.insertAdjacentHTML('beforeend', h)
            subTotal += e.precio;
        })
        document.getElementById("subtotal").innerText = subTotal;
        document.getElementById("total").innerText = subTotal * iva;

    },
    nok=>{
        subTotal = 0.0;
        document.getElementById("numPedido").innerText = a.id;
        let tbod = document.querySelector("#lista-carrito tbody");
        tbod.innerHTML = `<tr>
        <td>0</td>
        <td><img src="$" alt="" class="thumbnail"></td>
        <td>/td>
        <td>$0</td>
        </tr>`;
        
    })

document.getElementById("addPay").querySelector("form").addEventListener('change', event => {
    let d = new Date();

    let form = document.getElementById("addPay").querySelector("form");
    let card = form.querySelector("#card-num");
    let date = form.querySelector("#valid-thru-date");
    let nombre = form.querySelector("#card-first-name");
    let apellidos = form.querySelector("#card-last-name");
    let code = form.querySelector("#security-code");
    let calle = form.querySelector("#calle")
    let numExt = form.querySelector("#numExt");
    let numInt = form.querySelector("#numInt");
    let colonia = form.querySelector("#colonia")
    let ciudad = form.querySelector("#ciudad");
    let estado = form.querySelector("#estado");
    let cp = form.querySelector("#cp");
    let btn = document.querySelector("#addPay .btn-primary")
    btn.removeAttribute("disabled")
    if (isNaN(card.value) || card.value.length != 16) {
        card.removeAttribute("style")
        btn.setAttribute("disabled", true)
    } else {
        card.setAttribute("style", "background: #daf6da");
    }
    if (isNaN(code.value) || code.value.length != 3) {
        code.removeAttribute("style")
        btn.setAttribute("disabled", true)
    } else {
        code.setAttribute("style", "background: #daf6da");
    }

    if (Date.parse(date.value) < d || date.value == "") {
        date.removeAttribute("style");
        btn.setAttribute("disabled", true);
    } else {
        date.setAttribute("style", "background: #daf6da");
    }
    if (nombre.value == "" || nombre.value == undefined) {
        nombre.removeAttribute("style");
        btn.setAttribute("disabled", true);
    } else {
        nombre.setAttribute("style", "background: #daf6da");
    }
    if (apellidos.value == "" || apellidos.value == undefined) {
        apellidos.removeAttribute("style");
        btn.setAttribute("disabled", true);
    } else {
        apellidos.setAttribute("style", "background: #daf6da");
    }
    if (calle.value == "" || calle.value == undefined) {
        calle.removeAttribute("style");
        btn.setAttribute("disabled", true);
    } else {
        calle.setAttribute("style", "background: #daf6da");
    }
    if (numExt.value == "" || numExt.value == undefined || isNaN(numExt.value)) {
        numExt.removeAttribute("style");
        btn.setAttribute("disabled", true);
    } else {
        numExt.setAttribute("style", "background: #daf6da");
    }

    if (numInt.value == "" || numInt.value == undefined || isNaN(numInt.value)) {
        numInt.removeAttribute("style");
        btn.setAttribute("disabled", true);
    } else {
        numInt.setAttribute("style", "background: #daf6da");
    }

    if (colonia.value == "" || colonia.value == undefined) {
        colonia.removeAttribute("style");
        btn.setAttribute("disabled", true);
    } else {
        colonia.setAttribute("style", "background: #daf6da");
    }

    if (ciudad.value == "" || ciudad.value == undefined) {
        ciudad.removeAttribute("style");
        btn.setAttribute("disabled", true);
    } else {
        ciudad.setAttribute("style", "background: #daf6da");
    }
    if (estado.value == "" || estado.value == undefined) {
        estado.removeAttribute("style");
        btn.setAttribute("disabled", true);
    } else {
        estado.setAttribute("style", "background: #daf6da");
    }
    if (cp.value == "" || cp.value == undefined || isNaN(cp.value)) {
        cp.removeAttribute("style");
        btn.setAttribute("disabled", true);
    } else {
        cp.setAttribute("style", "background: #daf6da");
    }


});

document.getElementById("addAddress").querySelector("form").addEventListener('change', event => {

    let form = document.getElementById("addAddress").querySelector("form");

    let nombre = form.querySelector("#name");

    let dir1 = form.querySelector("#dir1")
    let dir2 = form.querySelector("#dir2")
    let ciudad = form.querySelector("#city");
    let estado = form.querySelector("#state");
    let cp = form.querySelector("#pc");
    let tel = form.querySelector("#tel");
    let btn = document.querySelector("#addAddress .btn-primary")
    btn.removeAttribute("disabled")

    if (nombre.value == "" || nombre.value == undefined) {
        nombre.removeAttribute("style");
        btn.setAttribute("disabled", true);
    } else {
        nombre.setAttribute("style", "background: #daf6da");
    }
    if (dir1.value == "" || dir1.value == undefined) {
        dir1.removeAttribute("style");
        dir2.removeAttribute("style");
        btn.setAttribute("disabled", true);
    } else {
        dir1.setAttribute("style", "background: #daf6da");
        dir2.setAttribute("style", "background: #daf6da");
    }
    if (tel.value == "" || tel.value == undefined || isNaN(tel.value) || tel.value.length != 10) {
        tel.removeAttribute("style");
        btn.setAttribute("disabled", true);
    } else {
        tel.setAttribute("style", "background: #daf6da");
    }


    if (ciudad.value == "" || ciudad.value == undefined) {
        ciudad.removeAttribute("style");
        btn.setAttribute("disabled", true);
    } else {
        ciudad.setAttribute("style", "background: #daf6da");
    }
    if (estado.value == "" || estado.value == undefined) {
        estado.removeAttribute("style");
        btn.setAttribute("disabled", true);
    } else {
        estado.setAttribute("style", "background: #daf6da");
    }
    if (cp.value == "" || cp.value == undefined || isNaN(cp.value)) {
        cp.removeAttribute("style");
        btn.setAttribute("disabled", true);
    } else {
        cp.setAttribute("style", "background: #daf6da");
    }
});


document.querySelector("#addPay .btn-primary").addEventListener("click", e => {
    let form = document.getElementById("addPay").querySelector("form");
    let card = form.querySelector("#card-num");
    let date = form.querySelector("#valid-thru-date");
    let nombre = form.querySelector("#card-first-name");
    let apellidos = form.querySelector("#card-last-name");
    let code = form.querySelector("#security-code");
    let calle = form.querySelector("#calle")
    let numExt = form.querySelector("#numExt");
    let numInt = form.querySelector("#numInt");
    let colonia = form.querySelector("#colonia")
    let ciudad = form.querySelector("#ciudad");
    let estado = form.querySelector("#estado");
    let cp = form.querySelector("#cp");
    let cat = form.querySelector("#card-cat");
    let type = form.querySelector("#card-type");
    let a = {
        "idU": userId,
        "tarjeta": Number.parseInt(card.value),
        "fecha": date.value,
        "nombre": nombre.value,
        "apellido": apellidos.value,
        "codigo": Number.parseInt(code.value),
        "categoria": cat.value,
        "tipo": type.value,
        "direccion": [
            calle.value,
            numExt.value,
            numInt.value,
            colonia.value,
            ciudad.value,
            estado.value,
            cp.value
        ]
    }

    makeHTTPRequest('metodosPago', 'POST', a,
        ok => {
            displayDirs()
        },
        err => {
            console.log(err);
        });
})
document.querySelector("#addAddress .btn-primary").addEventListener("click", e => {

    let form = document.getElementById("addAddress").querySelector("form");

    let nombre = form.querySelector("#name");
    let dir1 = form.querySelector("#dir1")
    let dir2 = form.querySelector("#dir2")
    let ciudad = form.querySelector("#city");
    let estado = form.querySelector("#state");
    let cp = form.querySelector("#pc");
    let tel = form.querySelector("#tel");

    let a = {
        "idU": userId,
        "nombreCompleto": nombre.value,
        "direccion": dir1.value,
        "subDireccion": dir2.value,
        "ciudad": ciudad.value,
        "estado": estado.value,
        "CP": cp.value,
        "telefono": tel.value
    }

    makeHTTPRequest('direccionesEnvio', 'POST', a,
        ok => {
            displayDirs()
        },
        err => {
            console.log(err);
        });

})

document.querySelector(".finalizar").addEventListener("click", e => {
    console.log("ded")
    let v = document.querySelectorAll(".envio :checked, .metodos-pago :checked");
    console.log(v);
    console.log(v[0].value);
    if(v.length != 2){
        alert("selecciona direccion y metodo de pago")
        return;
    }
    makeHTTPRequest(`pedidos/${a.id}`,'PATCH',{
        "total": subTotal*iva,
        "subtotal":subTotal,
        "status":2,
        "idPago": Number.parseInt(v[0].value),
        "idEnvio":Number.parseInt(v[1].value)
    },
    ok=>{
        console.log("cool")
    },
    nok=>{
        console.log(nok)
    })
})
document.querySelector(".cancelar").addEventListener("click",e=>{
    makeHTTPRequest(`pedidos/${a.id}`,'DELETE',undefined,
    ok=>{
        console.log(ok);
    },
    nok=>{
        console.log(nok);
    })
})