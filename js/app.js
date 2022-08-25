const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda:'',
    criptomoneda: ''
};

//Crear un Promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve =>{
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () =>{
    consultarCriptomonedas();

    formulario.addEventListener('submit',submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})

async function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=25&tsym=USD';

    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(resultado => obtenerCriptomonedas(resultado.Data))
    //     .then(criptomonedas => selectCriptomonedas(criptomonedas));

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(resultado.Data);
        selectCriptomonedas(criptomonedas);
        
    } catch (error) {
        console.log(error);
    }
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto =>{
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    })
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e){
    e.preventDefault();

    //Validar
    const {moneda,criptomoneda} = objBusqueda;
    if(moneda === ''  || criptomoneda === ''){
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    //Consultar API con los resultados
    consultarAPI();

}

function mostrarAlerta(msg){
    const existeAlerta = document.querySelector('.error');

    if(!existeAlerta){
    const divAlerta = document.createElement('div');
    divAlerta.classList.add('error');

    divAlerta.textContent = msg;

    formulario.appendChild(divAlerta);

    setTimeout(()=>{
        divAlerta.remove();
    },3000);

    }
}

async function consultarAPI(){
    const {moneda,criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    mostrarSpinner();

    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(cotizacion => {
    //         mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    //     })

        try {
            const respuesta = await fetch(url);
            const cotizacion = await respuesta.json();
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        } catch (error) {
            console.log(error);
        }
}


function mostrarCotizacionHTML(cotizacion){

    limpiarHTML();

    const {PRICE, SUPPLY, MKTCAP, CHANGE24HOUR, HIGHDAY, LOWDAY} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `Precio: <span>${PRICE}</span>`;

    const precioMasAlto = document.createElement('p');
    precioMasAlto.classList.add('cryptodata');
    precioMasAlto.innerHTML = `Precio más alto del día: <span>${HIGHDAY}</span>`;

    const precioMasBajo = document.createElement('p');
    precioMasBajo.classList.add('cryptodata');
    precioMasBajo.innerHTML = `Precio más bajo del día: <span>${LOWDAY}</span>`;

    const cambiosDelDia = document.createElement('p');
    cambiosDelDia.classList.add('cryptodata');
    cambiosDelDia.innerHTML = `Diferencia las últimas 24 Horas: <span>${CHANGE24HOUR}</span>`;

    const circulante = document.createElement('p');
    circulante.classList.add('cryptodata');
    circulante.innerHTML = `Circulante: <span>${SUPPLY}</span>`;

    const capitalizacionMercado = document.createElement('p');
    capitalizacionMercado.classList.add('cryptodata');
    capitalizacionMercado.innerHTML = `Capitalización de Mercado: <span>${MKTCAP}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioMasAlto);
    resultado.appendChild(precioMasBajo);
    resultado.appendChild(cambiosDelDia);
    resultado.appendChild(circulante);
    resultado.appendChild(capitalizacionMercado);
    
    
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML =`
        <div class="sk-cube-grid">
        <div class="sk-cube sk-cube1"></div>
        <div class="sk-cube sk-cube2"></div>
        <div class="sk-cube sk-cube3"></div>
        <div class="sk-cube sk-cube4"></div>
        <div class="sk-cube sk-cube5"></div>
        <div class="sk-cube sk-cube6"></div>
        <div class="sk-cube sk-cube7"></div>
        <div class="sk-cube sk-cube8"></div>
        <div class="sk-cube sk-cube9"></div>
        </div>
    `;

    resultado.appendChild(spinner);
}