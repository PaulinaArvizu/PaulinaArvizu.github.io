let baseURL = "http://localhost:3000";

function makeHTTPRequest2(endpoint, method, data, cbOk, cbErr) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, baseURL + endpoint);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    xhr.onload = () => {
        if (xhr.status != 200) {
            cbErr(xhr.status + ": " + xhr.statusText);
        } else {
            cbOk(xhr.responseText);
        }
    }
}

makeHTTPRequest2('/productos', 'GET', undefined,
    kk => {
        let ps = JSON.parse(kk);
        let mapPs = ps.map(x => htmlProduct(x));
        document.getElementById("productos").innerHTML = mapPs.join(" ");
    },
    nok => {

    })

function deleteProduct(id) {
    makeHTTPRequest2('/productos/' + id, 'DELETE', undefined,
        kk => {
            makeHTTPRequest2('/productos', 'GET', undefined,
                kk => {
                    let ps = JSON.parse(kk);
                    let mapPs = ps.map(x => htmlProduct(x));
                    document.getElementById("productos").innerHTML = mapPs.join(" ");
                },
                nok => {

                })
        },
        nok => {

        })
}
let pId;

function loadEdit(id) {
    makeHTTPRequest2('/productos/' + id, 'GET', undefined,
        kk => {
            let p = JSON.parse(kk)
            pId = p.id;
            document.getElementById("pNombre").value = p.nombre;
            document.getElementById("pPrecio").value = p.precio;
            document.getElementById("pMarca").value = p.marca;
            document.getElementById("pDetalles").value = p.detalles;
            document.getElementById("pSize").value = p.size;
            document.getElementById("pImg").value = p.img;
        })
}

function htmlProduct(p) {
    return `<div class="card border-info mb-3">
    <div class="card-header">
        <h5 class="card-title">${p.marca} ${p.nombre}</h5>
    </div>
    <div class="card-body">
        <p align="center">
            <img src="${p.img}" class="ProductP" alt="PP">
        </p>
        <hr>
        <p class="card-text">
            <ul type="none">
                <li><b>Nombre: </b>${p.nombre}</li>
                <li><b>Costo: </b>$${p.precio}</li>
                <li><b>Descripcion: </b>${p.detalles} ${p.size}</li>

                </li>
            </ul>
        </p>
        <table align="center">
            <tr>
            <td>
                <form>
                    <div class="input-group mb-3">
                        <div class="input-group-append">
                            <button class="btn btn-success" type="button" onclick="loadEdit(${p.id})" data-toggle="modal" data-target="#edit"><i
                                    class="fas fa-pen"></i> Editar</button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-danger col" type="button" onclick="deleteProduct(${p.id})"><i
                                    class="fas fa-trash-alt"></i> Eliminar</button>
                        </div>
                    </div>
                </form>
            </td>
            </tr>
        </table>
    </div>
</div>`
}

document.getElementById("edit").querySelector(".btn-primary").addEventListener("click", e => {
    let a = {
        "nombre": document.getElementById("pNombre").value,
        "precio": Number.parseFloat(document.getElementById("pPrecio").value),
        "marca": document.getElementById("pMarca").value,
        "detalles": document.getElementById("pDetalles").value,
        "size": document.getElementById("pSize").value,
        "img": document.getElementById("pImg").value
    }
    makeHTTPRequest2('/productos/' + pId, 'PATCH', a,
        kk => {
            makeHTTPRequest2('/productos', 'GET', undefined,
                kk => {
                    let ps = JSON.parse(kk);
                    let mapPs = ps.map(x => htmlProduct(x));
                    document.getElementById("productos").innerHTML = mapPs.join(" ");
                },
                nok => {

                })

        })
})

document.getElementById("add").querySelector(".btn-primary").addEventListener("click", e => {
    let a = {
        "nombre": document.getElementById("aNombre").value,
        "precio": Number.parseFloat(document.getElementById("aPrecio").value),
        "marca": document.getElementById("aMarca").value,
        "detalles": document.getElementById("aDetalles").value,
        "size": document.getElementById("aSize").value,
        "img": document.getElementById("aImg").value,
        "fecha": new Date()
    }
    makeHTTPRequest2('/productos', 'POST', a,
        kk => {

            makeHTTPRequest2('/productos', 'GET', undefined,
                kk => {
                    let ps = JSON.parse(kk);
                    let mapPs = ps.map(x => htmlProduct(x));
                    document.getElementById("productos").innerHTML = mapPs.join(" ");
                },
                nok => {

                })
        },
        nok => {

        })
})