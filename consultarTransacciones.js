'use strict';

document.addEventListener('DOMContentLoaded', function() {
    const listaTransacciones = document.getElementById('listaTransacciones');
    const estadoTarjetaSelect = document.getElementById('estadoTarjeta');
    const consultarEstadoBtn = document.getElementById('consultarEstado');
    const resultadoEstado = document.getElementById('resultadoEstado');
    const fechaInicioInput = document.getElementById('fechaInicio');
    const fechaFinInput = document.getElementById('fechaFin');
    const consultarFechasBtn = document.getElementById('consultarFechas');
    const resultadoFechas = document.getElementById('resultadoFechas');
    const historialTitulo = document.getElementById('historialTitulo');
    const consultarPromedioBtn = document.getElementById('consultarPromedio');
    const resultadoPromedio = document.getElementById('resultadoPromedio');
    const consultarPromedioCargasBtn = document.getElementById('consultarPromedioCargas');
    const resultadoPromedioCargas = document.getElementById('resultadoPromedioCargas');
    const consultarMontoTotalCargasBtn = document.getElementById('consultarMontoTotalCargas');
    const resultadoMontoTotalCargas = document.getElementById('resultadoMontoTotalCargas');
    const consultarMontoTotalCargasDeshabilitadasBtn = document.getElementById('consultarMontoTotalCargasDeshabilitadas');
    const resultadoMontoTotalCargasDeshabilitadas = document.getElementById('resultadoMontoTotalCargasDeshabilitadas');

    consultarEstadoBtn.addEventListener('click', consultarEstadoTarjetas);
    consultarFechasBtn.addEventListener('click', consultarTransaccionesPorFechas);
    consultarPromedioBtn.addEventListener('click', consultarPromedioSaldosAnteriores);
    consultarPromedioCargasBtn.addEventListener('click', consultarPromedioCargas);
    consultarMontoTotalCargasBtn.addEventListener('click', consultarMontoTotalCargas);
    consultarMontoTotalCargasDeshabilitadasBtn.addEventListener('click', consultarMontoTotalCargasDeshabilitadas);

    
    actualizarListaTransacciones();

    function actualizarListaTransacciones() {
        listaTransacciones.innerHTML = '';

        const historialTransacciones = JSON.parse(localStorage.getItem('historialTransacciones')) || [];

        historialTransacciones.forEach(transaccion => {
            const li = document.createElement('li');
            li.textContent = `Nº Tarjeta: ${transaccion.numeroTarjeta}, Tipo Movimiento: ${transaccion.tipoMovimiento}, Saldo Anterior: ${transaccion.saldoAnterior}, Monto: ${transaccion.monto}, Saldo Nuevo: ${transaccion.saldoNuevo}, Fecha y hora: ${transaccion.fechaHora}`;
            listaTransacciones.appendChild(li);
        });

        
        if (historialTransacciones.length > 0) {
            historialTitulo.style.display = 'block';
        } else {
            historialTitulo.style.display = 'none';
        }
    }

    function consultarEstadoTarjetas() {
        const estadoTarjeta = estadoTarjetaSelect.value;

        const historialTransacciones = JSON.parse(localStorage.getItem('historialTransacciones')) || [];

        const filtradasPorEstado = historialTransacciones.filter(transaccion => {
            if (estadoTarjeta === 'habilitadas' && transaccion.tipoMovimiento === 'Habilitación') {
                return true;
            }
            if (estadoTarjeta === 'deshabilitadas' && transaccion.tipoMovimiento === 'Deshabilitación') {
                return true;
            }
            return false;
        });

        
        resultadoEstado.textContent = `Cantidad de tarjetas ${estadoTarjeta}: ${filtradasPorEstado.length}`;

        
        mostrarTransacciones(filtradasPorEstado);
    }

    function consultarTransaccionesPorFechas() {
        const fechaInicio = fechaInicioInput.value.trim();
        const fechaFin = fechaFinInput.value.trim();
    
        if (!fechaInicio || !fechaFin) {
            alert('Por favor ingrese ambas fechas para realizar la consulta.');
            return;
        }
    
        const historialTransacciones = JSON.parse(localStorage.getItem('historialTransacciones')) || [];
    
        const fechaInicioComp = parseFechaChile(fechaInicio);
        const fechaFinComp = parseFechaChile(fechaFin);
    
        if (!fechaInicioComp || !fechaFinComp) {
            alert('Formato de fecha inválido. Ingrese las fechas en formato DD-MM-YYYY.');
            return;
        }
    
        const filtradasPorFecha = historialTransacciones.filter(transaccion => {
            const fechaTransaccion = new Date(transaccion.fechaHora);
            return fechaTransaccion >= fechaInicioComp && fechaTransaccion <= fechaFinComp && transaccion.tipoMovimiento === 'Habilitación';
        });
    
        if (filtradasPorFecha.length === 0) {
            resultadoFechas.textContent = `No hay tarjetas habilitadas entre ${fechaInicio} y ${fechaFin}.`;
        } else {
            resultadoFechas.textContent = `Número de tarjetas habilitadas entre ${fechaInicio} y ${fechaFin}: ${filtradasPorFecha.length}`;
        }
    
        mostrarTransacciones(filtradasPorFecha);
    }
    
    

    function consultarPromedioSaldosAnteriores() {
        const historialTransacciones = JSON.parse(localStorage.getItem('historialTransacciones')) || [];

        if (historialTransacciones.length === 0) {
            resultadoPromedio.textContent = 'No hay transacciones para calcular el promedio.';
            return;
        }

        const totalSaldosAnteriores = historialTransacciones.reduce((acumulador, transaccion) => {
            return acumulador + transaccion.saldoAnterior;
        }, 0);

        const promedioSaldosAnteriores = Math.round(totalSaldosAnteriores / historialTransacciones.length);

        resultadoPromedio.textContent = `Promedio de los saldos anteriores de todas las tarjetas: ${promedioSaldosAnteriores}`;
    }

    function consultarPromedioCargas() {
        const historialTransacciones = JSON.parse(localStorage.getItem('historialTransacciones')) || [];

        
        const transaccionesCargas = historialTransacciones.filter(transaccion => {
            return transaccion.tipoMovimiento === 'Carga';
        });

        if (transaccionesCargas.length === 0) {
            resultadoPromedioCargas.textContent = 'No hay transacciones de carga para calcular el promedio.';
            return;
        }

        const totalCargas = transaccionesCargas.reduce((acumulador, transaccion) => {
            return acumulador + transaccion.monto;
        }, 0);

        const promedioCargas = totalCargas / transaccionesCargas.length;

        resultadoPromedioCargas.textContent = `Promedio de las cargas en tarjetas de pago: ${promedioCargas.toFixed(0)}`;
    }

    function consultarMontoTotalCargas() {
        const historialTransacciones = JSON.parse(localStorage.getItem('historialTransacciones')) || [];
        const tarjetas = JSON.parse(localStorage.getItem('tarjetas')) || [];

        
        const tarjetasHabilitadas = tarjetas.filter(tarjeta => tarjeta.estado === 'Activa');

        
        const transaccionesCargasHabilitadas = historialTransacciones.filter(transaccion => {
            const tarjeta = tarjetasHabilitadas.find(t => t.numeroTarjeta === transaccion.numeroTarjeta);
            return transaccion.tipoMovimiento === 'Carga' && tarjeta && tarjeta.estado === 'Activa';
        });

        if (transaccionesCargasHabilitadas.length === 0) {
            resultadoMontoTotalCargas.textContent = 'No hay cargas en tarjetas habilitadas para calcular el monto total.';
            return;
        }

        const montoTotalCargas = transaccionesCargasHabilitadas.reduce((acumulador, transaccion) => {
            return acumulador + transaccion.monto;
        }, 0);

        resultadoMontoTotalCargas.textContent = `Monto total de cargas en tarjetas habilitadas: ${montoTotalCargas}`;
    }

    function consultarMontoTotalCargasDeshabilitadas() {
        const historialTransacciones = JSON.parse(localStorage.getItem('historialTransacciones')) || [];
        const tarjetas = JSON.parse(localStorage.getItem('tarjetas')) || [];
    
        
        const tarjetasInactivas = tarjetas.filter(tarjeta => tarjeta.estado === 'Inactiva');
    
        
        const transaccionesCargasInactivas = historialTransacciones.filter(transaccion => {
            const tarjeta = tarjetasInactivas.find(t => t.numeroTarjeta === transaccion.numeroTarjeta);
            return transaccion.tipoMovimiento === 'Carga' && tarjeta && tarjeta.estado === 'Inactiva';
        });
    
        if (transaccionesCargasInactivas.length === 0) {
            resultadoMontoTotalCargasDeshabilitadas.textContent = 'No hay cargas en tarjetas inactivas para calcular el monto total.';
            return;
        }
    
        const montoTotalCargasInactivas = transaccionesCargasInactivas.reduce((acumulador, transaccion) => {
            return acumulador + transaccion.monto;
        }, 0);
    
        resultadoMontoTotalCargasDeshabilitadas.textContent = `Monto total de cargas en tarjetas inactivas: ${montoTotalCargasInactivas}`;
    }
    

    function mostrarTransacciones(transacciones) {
        
        if (transacciones.length > 0) {
            historialTitulo.style.display = 'block';
        } else {
            historialTitulo.style.display = 'none';
        }

        listaTransacciones.innerHTML = '';

        transacciones.forEach(transaccion => {
            const li = document.createElement('li');
            li.textContent = `Nº Tarjeta: ${transaccion.numeroTarjeta}, Tipo Movimiento: ${transaccion.tipoMovimiento}, Saldo Anterior: ${transaccion.saldoAnterior}, Monto: ${transaccion.monto}, Saldo Nuevo: ${transaccion.saldoNuevo}, Fecha y hora: ${transaccion.fechaHora}`;
            listaTransacciones.appendChild(li);
        });
    }

    function parseFechaChile(fechaString) {
        const partes = fechaString.split('-');
        if (partes.length !== 3) return null;
        const dia = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10) - 1;
        const anio = parseInt(partes[2], 10);
        if (isNaN(dia) || isNaN(mes) || isNaN(anio)) return null;
        return new Date(anio, mes, dia);
    }
});
