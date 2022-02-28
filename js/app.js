var agregarContacto = document.getElementById('agregar');
var formulario = document.getElementById('formulario_crear_usuario');
var action = formulario.getAttribute('action');
var divCrear = document.getElementById('crear_contacto');
var tablaRegistrados = document.getElementById('registrados');
var checkboxes = document.getElementsByClassName('borrar_contacto');
var btn_borrar = document.getElementById('btn_borrar');
var tableBody = document.getElementsByTagName('tbody');
var divExistentes = document.getElementsByClassName('existentes');
var inputBuscadorNombre = document.getElementById('buscadorNombre');
var inputBuscadorNumero = document.getElementById('buscadorNumero');
var totalRegistros = document.getElementById('total');
var checkTodos = document.getElementById('borrar_todos')

agregarContacto.addEventListener('click', function (e) {
  e.preventDefault();
  crearUsuario();
});

btn_borrar.addEventListener('click', function () {
  checkboxSeleccionado();
});

inputBuscadorNombre.addEventListener('input', function () {
  ocultarRegistrosNombre(this.value);
});

inputBuscadorNumero.addEventListener('input', function () {
  ocultarRegistrosNumero(this.value);
});

// Seleccionar todos
checkTodos.addEventListener('click', function () {
  var todosRegistros = tableBody[0].getElementsByTagName('tr')
  if (this.checked) {
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = true
      todosRegistros[i].classList.add('activo')
    }
  } else {
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false
      todosRegistros[i].classList.remove('activo')
    }
  }
})

function crearUsuario() {
  var form_datos = new FormData(formulario);
  for ([key, value] of form_datos.entries()) {
/*     console.log(key + ": " + value);
 */  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', action, true);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var resultado = xhr.responseText;
/*       console.log(resultado);
 */      var json = JSON.parse(resultado);
      if (json.respuesta == true) {
        registroExitoso(json.nombre);
        construirTemplate(json.nombre, json.telefono, json.id);
        var totalActualizado = parseInt(totalRegistros.textContent) + 1;
        totalRegistros.innerHTML = totalActualizado;
      }
    }
  }
  xhr.send(form_datos);

}

function registroExitoso(nombre) {

  //crear div y agregar un id
  var divMensaje = document.createElement('DIV');
  divMensaje.setAttribute('id', "mensaje");

  //agregar texto
  var texto = document.createTextNode('Creado: ' + nombre);
  divMensaje.appendChild(texto);

  divCrear.insertBefore(divMensaje, divCrear.childNodes[4]);

  //agrgar la clase mostrar
  divMensaje.classList.add('mostrar');

  //ocultar el mensaje de creación
  setTimeout(function () {
    divMensaje.classList.add('ocultar');
    setTimeout(function () {
      var divPadreMensaje = divMensaje.parentNode;
      divPadreMensaje.removeChild(divMensaje);
    }, 500);
  }, 3000);
}

// Construir template para insertar datos dinamicamente
function construirTemplate(nombre, telefono, registro_id) {
  // Crear  nombre de contacto
  var tdNombre = document.createElement('TD');
  var textoNombre = document.createTextNode(nombre);
  var parrafoNombre = document.createElement('P');
  parrafoNombre.appendChild(textoNombre)
  tdNombre.appendChild(parrafoNombre);

  // Crear input con el nombre
  var inputNombre = document.createElement('INPUT');
  inputNombre.type = 'text';
  inputNombre.name = 'contacto_' + registro_id;
  inputNombre.value = nombre;
  inputNombre.classList.add('nombre_contacto')
  tdNombre.appendChild(inputNombre);

  // Crear telefono de contacto
  var tdTelefono = document.createElement('TD');
  var textoTelefono = document.createTextNode(telefono);
  var parrafoTelefono = document.createElement('P');
  parrafoTelefono.appendChild(textoTelefono)
  tdTelefono.appendChild(parrafoTelefono);

  // Crear input con el telefono
  var inputNumero = document.createElement('INPUT');
  inputNumero.type = 'text';
  inputNumero.name = 'telefono_' + registro_id;
  inputNumero.value = telefono;
  inputNumero.classList.add('numero_contacto')
  tdTelefono.appendChild(inputNumero);

  // Crear enlace para editar
  var nodoBtnEditar = document.createElement('A');
  var textoEnlaceEditar = document.createTextNode('Editar');
  nodoBtnEditar.appendChild(textoEnlaceEditar);
  nodoBtnEditar.href = '#';
  nodoBtnEditar.classList.add('editarBtn')

  // Crear enlace para guardar
  var nodoBtnGuardar = document.createElement('A');
  var textoEnlaceGuardar = document.createTextNode('Guardar');
  nodoBtnGuardar.appendChild(textoEnlaceGuardar);
  nodoBtnGuardar.href = '#';
  nodoBtnGuardar.classList.add('guardarBtn')

  // Agregar el boton al td
  var nodoTdEditar = document.createElement('TD');
  nodoTdEditar.appendChild(nodoBtnEditar);
  nodoTdEditar.appendChild(nodoBtnGuardar);

  // Crear checkbox para borrar
  var checkBorrar = document.createElement('INPUT');
  checkBorrar.type = 'checkbox';
  checkBorrar.name = registro_id;
  checkBorrar.classList.add('borrar_contacto');

  // Agregar td a checkbox
  var tdCheckbox = document.createElement('TD');
  tdCheckbox.classList.add('borrar');
  tdCheckbox.appendChild(checkBorrar);


  // Agregar al TR
  var trContacto = document.createElement('TR');
  trContacto.setAttribute('id', registro_id);
  trContacto.appendChild(tdNombre);
  trContacto.appendChild(tdTelefono);
  trContacto.appendChild(nodoTdEditar);
  trContacto.appendChild(tdCheckbox);

  tablaRegistrados.childNodes[3].append(trContacto);

  recorrerCheckboxes();
  actualizarNumero();
  recorrerBotonesEditar();
  recorrerBotonesGuardar(registro_id);
}

function ocultarRegistrosNombre(nombre_buscar) {
  // variable para todos los registros
  var registros = tableBody[0].getElementsByTagName('tr');

  // expresion regular que busca el nombre con case insensitive
  var expression = new RegExp(nombre_buscar, "i");

  for (var i = 0; i < registros.length; i++) {
    registros[i].classList.add('ocultar');
    registros[i].style.display = 'none';

    if (registros[i].childNodes[1].textContent.replace(/\s/g, "").search(expression) != -1 || nombre == '') {
      registros[i].classList.add('mostrar');
      registros[i].classList.remove('ocultar');
      registros[i].style.display = 'table-row';
    }
  }
  actualizarNumero();
}

function ocultarRegistrosNumero(numero_buscar) {
  // variable para todos los registros
  var registros = tableBody[0].getElementsByTagName('tr');

  // expresion regular que busca el nombre con case insensitive
  var expression = new RegExp(numero_buscar, "i");

  for (var i = 0; i < registros.length; i++) {
    registros[i].classList.add('ocultar');
    registros[i].style.display = 'none';

    if (registros[i].childNodes[3].textContent.replace(/\s/g, "").search(expression) != -1 || nombre == '') {
      registros[i].classList.add('mostrar');
      registros[i].classList.remove('ocultar');
      registros[i].style.display = 'table-row';
    }
  }
  actualizarNumero();
}

function actualizarNumero() {
  var registros = tableBody[0].getElementsByTagName('tr');

  var cantidad = 0;
  var ocultos = 0;

  for (var i = 0; i < registros.length; i++) {
    var elementos = registros[i];
    if (elementos.style.display == 'table-row') {
      cantidad++;
      totalRegistros.innerHTML = cantidad;
    } else {
      if (elementos.style.display == 'none') {
        ocultos++;
        if (ocultos == registros.length) {
          ocultos -= registros.length;
          totalRegistros.innerHTML = ocultos;
        }
      }
    }
  }
}

function recorrerCheckboxes() {
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', function () {
      if (this.checked) {
        this.parentNode.parentNode.classList.add('activo');
      } else {
        this.parentNode.parentNode.classList.remove('activo');
      }
    })
  };
}

function checkboxSeleccionado() {
  var contactos = [];
  for (i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked == true) {
      contactos.push(checkboxes[i].name);
    }
  }
  contactosEliminar(contactos);
}

function contactosEliminar(contactos) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'borrar.php?id=' + contactos, true);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var resultadoBorrar = xhr.responseText;
      var json = JSON.parse(resultadoBorrar);
      if (json.respuesta == false) {
        alert("seleccione un elemento");
      } else {
        eliminarHTML(contactos);
        mostrarEliminado();
        var totalActualizado = parseInt(totalRegistros.textContent) - json.borrados;
        totalRegistros.innerHTML = totalActualizado;
      }
    }
  };
  xhr.send();
}

function eliminarHTML(ids_borrados) {
  for (i = 0; i < ids_borrados.length; i++) {
    var elementoBorrar = document.getElementById(ids_borrados[i]);
    tableBody[0].removeChild(elementoBorrar);
  }
}

function mostrarEliminado() {
  // crear div y agregar id
  var divEliminado = document.createElement('DIV');
  divEliminado.setAttribute('id', 'borrado');

  // agregar texto
  var texto = document.createTextNode('Eliminado de lista de contactos');
  divEliminado.appendChild(texto);

  divExistentes[0].insertBefore(divEliminado, divExistentes[0].childNodes[0]);

  //agregar clase de CSS
  divEliminado.classList.add('mostrar');

  //ocultar el mensaje de creación
  setTimeout(function () {
    divEliminado.classList.add('ocultar');
    setTimeout(function () {
      var divPadreMensaje = divEliminado.parentNode;
      divPadreMensaje.removeChild(divEliminado);
    }, 500);
  }, 3000);
}

// Editar registros
function recorrerBotonesEditar() {
  var btn_editar = tableBody[0].querySelectorAll('.editarBtn');
  for (var i = 0; i < btn_editar.length; i++) {
    btn_editar[i].addEventListener('click', function (event) {
      event.preventDefault();
      deshabilitarEdicion();
      var registroActivo = this.parentNode.parentNode;
      registroActivo.classList.add('modo-edicion');
      registroActivo.classList.remove('desactivado');

      // Actualizamos el registro en específico
      actualizarRegistro(registroActivo.id);
    })
  }
}

function recorrerBotonesGuardar(id) {
  var btn_guardar = tableBody[0].querySelectorAll('.guardarBtn')
  for (var i = 0; i < btn_guardar.length; i++) {
    btn_guardar[i].addEventListener('click', function (event) {
      // event.preventDefault();
      actualizarRegistro(id);
    })
  }
}

function deshabilitarEdicion() {
  var registrosTr = document.querySelectorAll('#registrados tbody tr')
  for (var i = 0; i < registrosTr.length; i++) {
    registrosTr[i].classList.remove('modo-edicion')
    registrosTr[i].classList.add('desactivado')
  }
}

function habilitarEdicion() {
  var registrosTr = document.querySelectorAll('#registrados tbody tr')
  for (var i = 0; i < registrosTr.length; i++) {
    registrosTr[i].classList.remove('desactivado')
  }
}

function actualizarRegistro(idRegistro) {

  // Seleccionar boton de guardar del registro en especifico (se pasa el ID)
  var registro = document.getElementById(idRegistro)
  var btnGuardar = registro.getElementsByClassName('guardarBtn')[0]

  btnGuardar.addEventListener('click', function (event) {
    event.preventDefault();

    // Obtiene el valor del campo nombre
    var nombreNuevo = registro.getElementsByClassName('nombre_contacto')[0].value;

    // Obtiene el valor del campo telefono
    var telefonoNuevo = registro.getElementsByClassName('numero_contacto')[0].value;

    // Objeto con todos los datos
    var contacto = {
      nombre: nombreNuevo,
      numero: telefonoNuevo,
      id: idRegistro
    };
    actualizarAjax(contacto);
  })
}

function actualizarAjax(datosContacto) {

  // Convierte objeto en JSON
  var jsonContacto = JSON.stringify(datosContacto)

  // Crear la conexión
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'actualizar.php?datos=' + jsonContacto, true);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var resultado = xhr.responseText;
      var resultadoJson = JSON.parse(resultado);
      if (resultadoJson.respuesta == true) {
        var registroActivo = document.getElementById(datosContacto.id)
        registroActivo.getElementsByTagName('td')[0].getElementsByTagName('p')[0].innerHTML = resultadoJson.nombre;
        registroActivo.getElementsByTagName('td')[1].getElementsByTagName('p')[0].innerHTML = resultadoJson.numero;

        // Borrar modo edicion
        registroActivo.classList.remove('modo-edicion');
        habilitarEdicion();
      } else {
        console.log('Hubo un error')
      }
    }
  };
  xhr.send();
}

document.addEventListener('DOMContentLoaded', function (event) {
  recorrerBotonesEditar();
  recorrerCheckboxes();
})