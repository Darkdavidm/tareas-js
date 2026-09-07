// Task.js

export class Task {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.completed = false; // Estado por defecto
    }

    // Método de clase para cambiar el estado de completado
    toggleStatus() {
        this.completed = !this.completed;
    }
}