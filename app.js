// app.js

import { Task } from './Task.js';

// --- DECLARACIÓN DE VARIABLES (Scope Global para el módulo) ---
// Usamos 'let' porque el array cambiará al eliminar tareas.
let tareas = [];
// Variable para saber qué filtro estamos aplicando actualmente
let filtroActual = 'todas'; 

// --- REFERENCIAS AL DOM ---
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const btnAll = document.getElementById('btnAll');
const btnPending = document.getElementById('btnPending');
const btnCompleted = document.getElementById('btnCompleted');


// --- FUNCIONES ---

function agregarTarea(taskName) {
    if (taskName.trim() === '') return; // Evita agregar tareas vacías
    
    // Creamos un ID único usando Date.now()
    const nuevaTarea = new Task(Date.now(), taskName);
    tareas.push(nuevaTarea);
    
    taskInput.value = ''; // Limpiamos el input
    mostrarTareas(); // Actualizamos el DOM
}

function eliminarTarea(taskId) {
    // USO DE 'filter': Retorna un nuevo array excluyendo la tarea con el ID indicado
    tareas = tareas.filter(tarea => tarea.id !== taskId);
    mostrarTareas();
}

function cambiarEstado(taskId) {
    // USO DE 'forEach': Iteramos para buscar la tarea y usamos su método de clase
    tareas.forEach(tarea => {
        if (tarea.id === taskId) {
            tarea.toggleStatus(); 
        }
    });
    mostrarTareas();
}

function filtrarTareas(estadoFiltro) {
    // USO DE 'filter' para devolver tareas según su estado
    if (estadoFiltro === 'completadas') {
        return tareas.filter(tarea => tarea.completed === true);
    } else if (estadoFiltro === 'pendientes') {
        return tareas.filter(tarea => tarea.completed === false);
    }
    return tareas; // Si es 'todas', devuelve el array completo
}

function mostrarTareas() {
    // Limpiamos la lista actual en el DOM
    taskList.innerHTML = ''; 

    // Obtenemos el array filtrado según el botón que se haya presionado
    const tareasAMostrar = filtrarTareas(filtroActual);

    // USO DE 'map': Mapeamos el array de objetos Task a un array de elementos HTML (Nodos)
    const elementosDOM = tareasAMostrar.map(tarea => {
        const li = document.createElement('li');
        // Si está completada, le añade la clase 'completed' para tacharla por CSS
        li.className = `task-item ${tarea.completed ? 'completed' : ''}`;
        
        // Creamos el checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = tarea.completed;
        // Evento para marcar/desmarcar
        checkbox.addEventListener('change', () => cambiarEstado(tarea.id));

        // Creamos el texto
        const span = document.createElement('span');
        span.textContent = tarea.name;

        // Creamos el botón de eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        // Evento para eliminar
        deleteBtn.addEventListener('click', () => eliminarTarea(tarea.id));

        // Ensamblamos el <li>
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        return li; // Retornamos el Nodo HTML creado
    });

    // USO DE 'forEach': Iteramos sobre los elementos HTML creados con map para inyectarlos al DOM
    elementosDOM.forEach(elementoLi => {
        taskList.appendChild(elementoLi);
    });
}


// --- MANIPULACIÓN DEL DOM Y EVENTOS ---

// Agregar tarea haciendo click en el botón
addBtn.addEventListener('click', () => {
    agregarTarea(taskInput.value);
});

// Agregar tarea presionando 'Enter' en el teclado
taskInput.addEventListener('keypress', (evento) => {
    if (evento.key === 'Enter') {
        agregarTarea(taskInput.value);
    }
});

// Eventos de los botones de filtro
btnAll.addEventListener('click', () => {
    filtroActual = 'todas';
    mostrarTareas();
});

btnPending.addEventListener('click', () => {
    filtroActual = 'pendientes';
    mostrarTareas();
});

btnCompleted.addEventListener('click', () => {
    filtroActual = 'completadas';
    mostrarTareas();
});

// Render inicial (para que inicie limpia o con datos predeterminados si los hubiera)
mostrarTareas();