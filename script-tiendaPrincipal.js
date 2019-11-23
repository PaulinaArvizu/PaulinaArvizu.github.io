// `<li class="list-group-item"><a href=""><img src="${img}" alt="P1"> ${producto}</a><p>${precio}</p>`
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

// let productos;
makeHTTPRequest('productos', 'GET', undefined,
    kk => {
        let productos = JSON.parse(kk);
        let newP = productos.filter(e =>{
            let d = new Date();
            let d1 = new Date(e.fecha);

            d.setMonth(d.getMonth()-1);
            

            return d < d1;
        })
        let newList = document.querySelector('.new');
        let oldList = document.querySelector('.old');
        newP.forEach(element => {
            newList.insertAdjacentHTML('beforeend',`<li class="list-group-item"><a href="Tienda - detalle de producto.html" onclick=verDetalle(${element.id})><img src="${element.img}" alt="P${element.id}"> ${element.nombre}</a><p>${element.precio}</p>`)
        });
        productos.forEach(element => {
            oldList.insertAdjacentHTML('beforeend',`<li class="list-group-item"><a href="Tienda - detalle de producto.html" onClick=verDetalle(${element.id})><img src="${element.img}" alt="P${element.id}"> ${element.nombre}</a><p>${element.precio}</p>`)
        });
    },
    (errStatus,errTxt) => {
        console.log(errStatus+ ": "+ errTxt);
    }
)

function verDetalle(i){
    localStorage.productId = i;
}