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
let producto;
makeHTTPRequest('productos/' + localStorage.productId, 'GET', undefined,
    kk => {
        producto = JSON.parse(kk);
        let nombre = document.getElementById("nombre");
        let img = document.getElementById("myImg");
        let det = document.getElementById("detalles");
        let precio = document.getElementById("precio");
        nombre.innerText = producto.nombre;
        img.setAttribute('src', producto.img);
        img.setAttribute('alt', producto.nombre);
        det.innerText = producto.detalles;
        precio.innerText = producto.precio;

        document.getElementById("marca").innerText = producto.marca;
        document.getElementById("size").innerText = producto.size;
    },
    (errStatus, errTxt) => {
        console.log(errStatus + ": " + errTxt);
    })


let idC;
let carrito;
makeHTTPRequest('pedidos', 'GET', undefined,
    kk => {
        let pedidos = JSON.parse(kk);
        let pedido = pedidos.find(a => a.status == 1 && a.idU == 1);
        if (pedido != undefined) {
            idC = pedido.id;
            carrito = pedido.productos;
        } else {
            makeHTTPRequest('pedidos', 'PUT', { // crea nuevo pedido con status de carrito
                "idU": 1,
                "productos": [],
                "subtotal": 0.0,
                "total": 0.0,
                "status": 1
            },
            ok=>{
                let p = JSON.parse(ok);
                idC = p.id;
                carrito = p.productos;
            },
            (noSt, noTxt)=>{
                console.log(noSt+ ": "+ noTxt);
            })
        }

    },
    (errStatus, errTxt) => {
        console.log(errStatus + ": " + errTxt);
    })


let i = 0;
let q = document.getElementById("quantity");
q.innerText = i;
document.getElementById("inc").addEventListener("click", a => {
    i++;
    q.innerText = i;
});
document.getElementById("dec").addEventListener("click", a => {
    i = i > 0 ? i - 1 : 0;
    q.innerText = i;
});


document.getElementById("add").addEventListener("click", event => {
    //agregar al carrito
    let a = carrito.find(e => e.idP == localStorage.productId);
    if (i > 0) {
        if (a == undefined) {
                carrito.push({
                    "id": "" + localStorage.productId,
                    "nombre": producto.nombre,
                    "img": producto.img,
                    "cantidad": i,
                    "precio": producto.precio * i
                });
            console.log(carrito)
            makeHTTPRequest('pedidos/' + idC, 'PATCH', {
                "productos": carrito
            }, kk => {
                console.log(kk)
            }, (errStatus, errTxt) => {
                console.log(errStatus + ": " + errTxt);
            });

        } else {
            a.cantidad += i;
            a.precio = a.cantidad * producto.precio;
            console.log(carrito)
            makeHTTPRequest('pedidos/' + idC, 'PATCH', {
                "productos": carrito
            }, kk => {
                console.log(kk)
                event.preventDefault();
            }, (errStatus, errTxt) => {
                console.log(errStatus + ": " + errTxt);
            })
        }

    }

    event.preventDefault();
})