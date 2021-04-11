const url = "https://603c46e8f4333a0017b6755c.mockapi.io/api/Operaciones";

cargaResultados = async () => {
    // var req = new XMLHttpRequest();
    // req.open("GET", "https://603c46e8f4333a0017b6755c.mockapi.io/api/Operaciones");
    // req.send();
    let resultados;
    //resultados = await fetch("https://603c46e8f4333a0017b6755c.mockapi.io/api/Operaciones").then(response => response.json());
    resultados = await axios.get(url).then((response) => {
        return response.data;
    })
    console.log(resultados);
    creaMovimiento(resultados);
    let AhorroTotal = 0;
    for (const res of resultados) {
        if (res.EsGasto) {
            AhorroTotal -= Number(res.Importe);
        } else {
            AhorroTotal += Number(res.Importe);
        }
    }
    document.querySelector("#Ahorro").innerHTML = "$" + AhorroTotal;
}

creaMovimiento = (data) => {
    let lista = document.querySelector(".listaOperaciones")
    lista.innerHTML = ""
    for (const res of data) {
        let TipoOperacion = (res.EsGasto ? 'Gasto' : 'Ingreso')
        lista.innerHTML +=
            `<div style="position: sticky; border: 1px solid; border-radius: 5%; margin: auto auto" class="col-md-9">
                    <input type="hidden" id="Id" value="${res.id}"/>
                    <h1>${TipoOperacion}</h1>
                    <p>${res.Razon}</p>
                    <p>${res.Importe}</p>
                    <p>${new Date(res.Fecha).getDay()}/${new Date(res.Fecha).getMonth() + 1}/${new Date(res.Fecha).getFullYear()}</p>
                    <button style="top:0; right:0; position: absolute;" id="botonBorrar${res.id}" onclick="eliminarOperacion(${res.id})">Eliminar Operacion</button>
                </div>`
    }
}

subirDatos = () => {
    const EsGasto = (document.querySelector("#TipoOperacion").value == "gasto" ? true : false);
    const Razon = document.querySelector("#Razon").value;
    const Importe = document.querySelector("#Importe").value;
    const Fecha = new Date();

    console.log(Fecha);

    axios.post(url, {
        Razon,
        Importe,
        Fecha,
        EsGasto
    }).then(() => {
        cargaResultados();
    })
}

eliminarOperacion = (index) => {
    axios.delete(url + `/${index}`).then(() => {
        cargaResultados()
    })
}

document.addEventListener("DOMContentLoaded", cargaResultados());