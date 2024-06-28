'use strict';

document.addEventListener('DOMContentLoaded', function() {
    const tarjetas = JSON.parse(localStorage.getItem('tarjetas')) || [];
    const numeroTarjetaInput = document.getElementById('numeroTarjeta');
    const accionSelect = document.getElementById('accion');
    const procesarAccionBtn = document.getElementById('procesarAccion');
    const limpiarCamposBtn = document.getElementById('limpiarCampos');

    numeroTarjetaInput.addEventListener('input', function() {
        let value = this.value;
        value = value.replace(/\D/g, '');
        if (value.length > 8) {
            value = value.slice(0, 8);
        }
        this.value = value;
    });

    procesarAccionBtn.addEventListener('click', function() {
        const numeroTarjeta = numeroTarjetaInput.value.trim();
        const accion = accionSelect.value;

        if (!numeroTarjeta) {
            alert('Por favor ingrese un número de tarjeta válido.');
            return;
        }

        const tarjetaEncontrada = tarjetas.find(tarjeta => tarjeta.numeroTarjeta === numeroTarjeta);

        if (tarjetaEncontrada) {
            const saldoAnterior = tarjetaEncontrada.saldoAnterior;
            const saldoNuevo = saldoAnterior; 

            
            tarjetaEncontrada.estado = accion === 'habilitar' ? 'Activa' : 'Inactiva';
            localStorage.setItem('tarjetas', JSON.stringify(tarjetas));

            
            agregarTransaccion(numeroTarjeta, accion === 'habilitar' ? 'Habilitación' : 'Deshabilitación', saldoAnterior, 0, saldoNuevo);

            
            alert(`La tarjeta número ${numeroTarjeta} ha sido ${accion === 'habilitar' ? 'habilitada' : 'deshabilitada'}.`);

           
            numeroTarjetaInput.value = '';
            accionSelect.selectedIndex = 0;
        } else {
            alert(`La tarjeta número ${numeroTarjeta} no fue encontrada. Verifique el número ingresado.`);
        }
    });

    function agregarTransaccion(numeroTarjeta, tipoMovimiento, saldoAnterior, monto, saldoNuevo) {
        const transaccion = {
            numeroTarjeta: numeroTarjeta,
            tipoMovimiento: tipoMovimiento,
            saldoAnterior: saldoAnterior,
            monto: monto,
            saldoNuevo: saldoNuevo,
            fechaHora: obtenerFechaHoraActual()
        };

        
        const historialTransacciones = JSON.parse(localStorage.getItem('historialTransacciones')) || [];
        historialTransacciones.push(transaccion);
        localStorage.setItem('historialTransacciones', JSON.stringify(historialTransacciones));
    }

    function obtenerFechaHoraActual() {
        const fechaHora = new Date().toLocaleString('es-CL');
        return fechaHora;
    }
});
