document.getElementById('gananciasForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let nombrePrincipal = document.getElementById('nombrePrincipal').value;
    let monto = parseFloat(document.getElementById('monto').value);
    let porcentaje = parseFloat(document.getElementById('porcentaje').value) / 100;
    let tipoCuenta = obtenerTipoCuenta(porcentaje);

    if (!nombrePrincipal || isNaN(monto) || isNaN(porcentaje)) {
        alert('Por favor, ingrese valores válidos');
        return;
    }

    let gananciaDiaria = calcularGanancia(monto, porcentaje, tipoCuenta);
    let gananciaSemanal = calcularGanancia(monto, porcentaje, tipoCuenta, 7);
    let gananciaMensual = calcularGanancia(monto, porcentaje, tipoCuenta, 30);

    document.getElementById('resultadosPrincipales').innerHTML = `
        <h3>${nombrePrincipal}</h3>
        <p>Ganancia Diaria: $${gananciaDiaria.toFixed(2)}</p>
        <p>Ganancia Semanal: $${gananciaSemanal.toFixed(2)}</p>
        <p>Ganancia Mensual: $${gananciaMensual.toFixed(2)}</p>
    `;

    distribuirGanancias(monto, gananciaDiaria, gananciaSemanal, gananciaMensual);
});

document.getElementById('agregarInversionista').addEventListener('click', function() {
    let container = document.getElementById('inversionistasContainer');
    let div = document.createElement('div');
    
    div.innerHTML = `
        <input type="text" placeholder="Agregue nombre inversor" required>
        <input type="number" placeholder="Agregue valor a invertir" required>
        <button class="confirmar-btn">✓</button>
    `;
    container.appendChild(div);

    div.querySelector('.confirmar-btn').addEventListener('click', function() {
        calcularGananciasInversionista(div);
    });
});

function obtenerTipoCuenta(porcentaje) {
    switch (porcentaje) {
        case 0.021: return "V1";
        case 0.023: return "V2";
        case 0.027: return "V3";
        case 0.031: return "V4";
        case 0.036: return "V5";
        case 0.040: return "V6";
        default: return "Desconocido";
    }
}

const limitesCuentas = {
    "V1": 1000,
    "V2": 2000,
    "V3": 6000,
    "V4": 10000,
    "V5": 40000,
    "V6": 100000
};

function calcularGanancia(monto, porcentaje, tipo, dias = 1) {
    let ganancia = 0;
    let limite = limitesCuentas[tipo] || monto;

    for (let i = 0; i < dias; i++) {
        if (tipo !== "Desconocido" && monto >= limite) {
            ganancia += limite * porcentaje;
        } else {
            let gananciaDiaria = monto * porcentaje;
            ganancia += gananciaDiaria;
            monto += gananciaDiaria;
        }
    }
    return ganancia;
}

function calcularGananciasInversionista(div) {
    let monto = parseFloat(document.getElementById('monto').value);
    let porcentaje = parseFloat(document.getElementById('porcentaje').value) / 100;
    let tipoCuenta = obtenerTipoCuenta(porcentaje);
    let nombre = div.querySelector('input[type="text"]').value;
    let montoInversion = parseFloat(div.querySelector('input[type="number"]').value);

    if (!nombre || isNaN(monto) || isNaN(porcentaje) || isNaN(montoInversion)) {
        alert('Por favor, ingrese valores válidos');
        return;
    }

    let gananciaDiaria = calcularGanancia(montoInversion, porcentaje, tipoCuenta);
    let gananciaSemanal = calcularGanancia(montoInversion, porcentaje, tipoCuenta, 7);
    let gananciaMensual = calcularGanancia(montoInversion, porcentaje, tipoCuenta, 30);

    let resultDiv = document.createElement('div');
    resultDiv.innerHTML = `
        <h3>${nombre}</h3>
        <p>Ganancia Diaria: $${gananciaDiaria.toFixed(2)}</p>
        <p>Ganancia Semanal: $${gananciaSemanal.toFixed(2)}</p>
        <p>Ganancia Mensual: $${gananciaMensual.toFixed(2)}</p>
    `;
    document.getElementById('gananciasInversionistas').appendChild(resultDiv);

    // Clear input fields after calculation
    div.querySelector('input[type="text"]').value = '';
    div.querySelector('input[type="number"]').value = '';
}

function distribuirGanancias(monto, gananciaDiaria, gananciaSemanal, gananciaMensual) {
    let inversionistas = document.getElementById('inversionistasContainer').querySelectorAll('div');
    let gananciasContainer = document.getElementById('gananciasInversionistas');
    gananciasContainer.innerHTML = '';

    inversionistas.forEach(div => {
        let nombre = div.querySelector('input[type="text"]').value;
        let montoInversion = parseFloat(div.querySelector('input[type="number"]').value);

        if (nombre && !isNaN(montoInversion) && montoInversion > 0) {
            let porcentajeInversion = montoInversion / monto;

            let gananciaDiariaInversionista = gananciaDiaria * porcentajeInversion;
            let gananciaSemanalInversionista = gananciaSemanal * porcentajeInversion;
            let gananciaMensualInversionista = gananciaMensual * porcentajeInversion;

            let resultDiv = document.createElement('div');
            resultDiv.innerHTML = `
                <h3>${nombre}</h3>
                <p>Ganancia Diaria: $${gananciaDiariaInversionista.toFixed(2)}</p>
                <p>Ganancia Semanal: $${gananciaSemanalInversionista.toFixed(2)}</p>
                <p>Ganancia Mensual: $${gananciaMensualInversionista.toFixed(2)}</p>
            `;
            gananciasContainer.appendChild(resultDiv);
        }
    });
}
