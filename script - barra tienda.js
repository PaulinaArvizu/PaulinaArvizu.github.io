function makeHTTPRequest(endpoint, method, data, cbOk, cbErr) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, "http://localhost:3000/" + endpoint);
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
let uId = 1;

makeHTTPRequest('usuarios/' + uId, 'GET', undefined,
    kk => {
        let a = JSON.parse(kk);
        document.getElementById("username").innerText = a.nombre;
        if (a.admin) {
            document.querySelectorAll("#vistas a")[1].removeAttribute("hidden");
        }
        if (a.moderador) {
            document.querySelectorAll("#vistas a")[2].removeAttribute("hidden");
        }
    },
    nok => {
        console.log(nok);
    }
)
document.querySelector("#buscar button").addEventListener('click', e => {
    let search = document.querySelector("#buscar input");
    makeHTTPRequest('productos/?q=' + search.value, 'GET', undefined,
        kk => {
            let a = JSON.parse(kk);
            let table = document.querySelector("#buscar tbody")
            table.innerHTML=""
            a.forEach(element => {

                let v = `<tr>
                <td scope="row"><img src="${element.img}" height="30px" alt="xd"></td>
                <td><a href="Tienda - detalle de producto.html" onclick="detail(${element.id})">${element.nombre}</a></td>
                </tr>`;
                table.insertAdjacentHTML('beforeend', v)

            })

        },
        nok => {
            console.log(nok);
        })
})

function detail(id){
    localStorage.productId = id;
}