// app.js

import { Task } from './Task.js';

// --- 1. RECUPERAR DATOS AL INICIAR (LOCALSTORAGE) ---
// Intentamos buscar tareas guardadas previas; si no hay, iniciamos un arreglo vacío []
const tareasGuardadas = JSON.parse(localStorage.getItem('misTareas')) || [];

// Al recuperar de LocalStorage obtenemos objetos de texto plano.
// Usamos 'map' para volver a convertirlos en instancias reales de nuestra clase 'Task'.
let tareas = tareasGuardadas.map(obj => {
    const tareaObj = new Task(obj.id, obj.name);
    tareaObj.completed = obj.completed;
    return tareaObj;
});

let filtroActual = 'todas'; 

// --- REFERENCIAS AL DOM ---
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const btnAll = document.getElementById('btnAll');
const btnPending = document.getElementById('btnPending');
const btnCompleted = document.getElementById('btnCompleted');

// --- 2. NUEVA FUNCIÓN PARA GUARDAR ---
function guardarTareas() {
    // Convierte nuestro arreglo de tareas en formato de texto (JSON) y lo guarda en el navegador
    localStorage.setItem('misTareas', JSON.stringify(tareas));
}

// --- FUNCIONES PRINCIPALES ---
function agregarTarea(taskName) {
    if (taskName.trim() === '') return; 
    
    const nuevaTarea = new Task(Date.now(), taskName);
    tareas.push(nuevaTarea);
    
    guardarTareas(); // <-- Guardamos el cambio
    taskInput.value = ''; 
    mostrarTareas(); 
}

function eliminarTarea(taskId) {
    tareas = tareas.filter(tarea => tarea.id !== taskId);
    guardarTareas(); // <-- Guardamos el cambio
    mostrarTareas();
}

function cambiarEstado(taskId) {
    tareas.forEach(tarea => {
        if (tarea.id === taskId) {
            tarea.toggleStatus(); 
        }
    });
    guardarTareas(); // <-- Guardamos el cambio
    mostrarTareas();
}

function filtrarTareas(estadoFiltro) {
    if (estadoFiltro === 'completadas') {
        return tareas.filter(tarea => tarea.completed === true);
    } else if (estadoFiltro === 'pendientes') {
        return tareas.filter(tarea => tarea.completed === false);
    }
    return tareas; 
}

function mostrarTareas() {
    taskList.innerHTML = ''; 

    const tareasAMostrar = filtrarTareas(filtroActual);

    const elementosDOM = tareasAMostrar.map(tarea => {
        const li = document.createElement('li');
        li.className = `task-item ${tarea.completed ? 'completed' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = tarea.completed;
        checkbox.addEventListener('change', () => cambiarEstado(tarea.id));

        const span = document.createElement('span');
        span.textContent = tarea.name;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.addEventListener('click', () => eliminarTarea(tarea.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        return li; 
    });

    elementosDOM.forEach(elementoLi => {
        taskList.appendChild(elementoLi);
    });
}

// --- EVENTOS DEL DOM ---
addBtn.addEventListener('click', () => { agregarTarea(taskInput.value); });
taskInput.addEventListener('keypress', (evento) => {
    if (evento.key === 'Enter') { agregarTarea(taskInput.value); }
});
btnAll.addEventListener('click', () => { filtroActual = 'todas'; mostrarTareas(); });
btnPending.addEventListener('click', () => { filtroActual = 'pendientes'; mostrarTareas(); });
btnCompleted.addEventListener('click', () => { filtroActual = 'completadas'; mostrarTareas(); });

// Render inicial
mostrarTareas();