'use strict';

/// Función del Loader

document.addEventListener("DOMContentLoaded", function() {
    var loader = document.getElementById("loader");
    var overlay = document.getElementById("overlay");

    function showLoader() {
        loader.style.display = "block";
        overlay.style.display = "block";
    }

    function hideLoader() {
        loader.style.display = "none";
        overlay.style.display = "none";
    }

    
    function redirectTo(url) {
        showLoader();
        setTimeout(function() {
            window.location.href = url;
        }, 1000);
    }

    
    var cajas = document.querySelectorAll(".box");
    cajas.forEach(function(caja) {
        caja.addEventListener("click", function(event) {
            event.preventDefault();
            var targetUrl = this.getAttribute("href");
            redirectTo(targetUrl);
        });
    });
});

///------------------------------------------------------------------------------


/// Función para crear y guardar tarjetas

const tarjetas = JSON.parse(localStorage.getItem('tarjetas')) || [];

        function crearTarjeta() {
            const numeroTarjeta = generarNumeroTarjeta();
            const numeroChip = generarNumeroChip();

            document.getElementById('numeroTarjeta').value = numeroTarjeta;
            document.getElementById('numeroChip').value = numeroChip;

            document.getElementById('guardarTarjetaBtn').style.display = 'block';
        }

        function generarNumeroTarjeta() {
            let numero;
            do {
                numero = Math.floor(10000000 + Math.random() * 90000000);
            } while (tarjetas.some(tarjeta => tarjeta.numeroTarjeta === numero));
            return numero;
        }

        function generarNumeroChip() {
            let numero;
            do {
                numero = Math.floor(100 + Math.random() * 900);
            } while (tarjetas.some(tarjeta => tarjeta.numeroChip === numero));
            return numero;
        }

        function guardarTarjeta() {
            const numeroTarjeta = document.getElementById('numeroTarjeta').value;
            const numeroChip = document.getElementById('numeroChip').value;
            const fechaCreacion = new Date().toISOString().slice(0, 10);

            const nuevaTarjeta = {
                numeroTarjeta,
                numeroChip,
                fechaCreacion,
                saldoAnterior: 0,
                estado: 'Activa',
                cargas: []
            };

            tarjetas.push(nuevaTarjeta);
            localStorage.setItem('tarjetas', JSON.stringify(tarjetas));

            alert('¡Tarjeta guardada exitosamente!');

            document.getElementById('guardarTarjetaBtn').style.display = 'none';
            document.getElementById('numeroTarjeta').value = '';
            document.getElementById('numeroChip').value = '';

            actualizarListaTarjetas();
        }

        function actualizarListaTarjetas() {
            const listaTarjetas = document.getElementById('listaTarjetas');
            listaTarjetas.innerHTML = '';

            tarjetas.forEach(tarjeta => {
                const li = document.createElement('li');
                li.textContent = `Tarjeta: ${tarjeta.numeroTarjeta}, Chip: ${tarjeta.numeroChip}, Fecha: ${tarjeta.fechaCreacion}, Saldo: ${tarjeta.saldoAnterior}, Estado: ${tarjeta.estado}`;
                listaTarjetas.appendChild(li);
            });
        }

        document.addEventListener('DOMContentLoaded', function() {
            if (document.getElementById('listaTarjetas')) {
                actualizarListaTarjetas();
            }
        });

        function cargarDatos() {
            localStorage.setItem('tarjetas', JSON.stringify(tarjetas));
            window.location.href = 'consultas.html';
        }

///---------------------------------------------------------------------------


