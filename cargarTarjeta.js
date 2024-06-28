'use strict';


/// Función de validación de solo entrada de números

document.addEventListener('DOMContentLoaded', function() {
    const numeroTarjetaInput = document.getElementById('numeroTarjeta');
    const montoSelect = document.getElementById('monto');
    const limpiarCamposBtn = document.getElementById('limpiarCampos');

   
    numeroTarjetaInput.addEventListener('input', function() {
        let value = this.value;
        value = value.replace(/\D/g, '');
        if (value.length > 8) {
            value = value.slice(0, 8);
        }
        this.value = value;
    });

/// -----------------------------------------------------------


/// Función para limpiar campos

    limpiarCamposBtn.addEventListener('click', function() {
        numeroTarjetaInput.value = '';
        montoSelect.selectedIndex = 0; 
    });
});

/// -----------------------------------------------------------


document.addEventListener('DOMContentLoaded', function() {
    const tarjetas = JSON.parse(localStorage.getItem('tarjetas')) || [];
    const cargarTarjetaForm = document.getElementById('cargarTarjetaForm');
    const listaTarjetas = document.getElementById('listaTarjetas');

    cargarTarjetaForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const numeroTarjeta = document.getElementById('numeroTarjeta').value.trim();
        const monto = parseInt(document.getElementById('monto').value);

        if (!numeroTarjeta || isNaN(monto) || monto <= 0) {
            alert('Por favor ingresa un número de tarjeta y selecciona un monto válido.');
            return;
        }

        const tarjetaEncontrada = tarjetas.find(tarjeta => tarjeta.numeroTarjeta === numeroTarjeta);

        if (tarjetaEncontrada) {
            const saldoAnterior = tarjetaEncontrada.saldoAnterior;
            const saldoNuevo = saldoAnterior + monto;

            tarjetaEncontrada.saldoAnterior = saldoNuevo;

            localStorage.setItem('tarjetas', JSON.stringify(tarjetas));

            agregarTransaccion(numeroTarjeta, 'Carga', saldoAnterior, monto, saldoNuevo);

            alert(`Se ha cargado exitosamente ${monto} en la tarjeta número ${numeroTarjeta}.`);

            actualizarListaTarjetas();
        } else {
            alert(`La tarjeta número ${numeroTarjeta} no fue encontrada. Verifique el número ingresado.`);
        }

        document.getElementById('numeroTarjeta').value = '';
        document.getElementById('monto').selectedIndex = 0;
    });

    function actualizarListaTarjetas() {
        listaTarjetas.innerHTML = '';

        if (tarjetas.length === 0) {
            const mensaje = document.createElement('p');
            mensaje.textContent = 'No hay tarjetas disponibles.';
            listaTarjetas.appendChild(mensaje);
        } else {
            tarjetas.forEach(tarjeta => {
                const li = document.createElement('li');
                li.textContent = `Tarjeta: ${tarjeta.numeroTarjeta}, Chip: ${tarjeta.numeroChip}, Fecha: ${tarjeta.fechaCreacion}, Saldo: ${tarjeta.saldoAnterior}, Estado: ${tarjeta.estado}`;
                listaTarjetas.appendChild(li);
            });
        }
    }

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

    actualizarListaTarjetas();
});
