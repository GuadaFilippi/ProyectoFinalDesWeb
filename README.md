# Gestor de Tareas Colaborativas

Este es un proyecto de gestión de tareas colaborativas desarrollado como proyecto final universitario. La aplicación permite crear, actualizar, eliminar y filtrar tareas, con una interfaz de usuario moderna y responsive.

## Estructura del Proyecto

```
.
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── data/
│   └── tasks.json
├── server.js
├── package.json
└── README.md
```

## Características

- Arquitectura monolítica (primera fase)
- Creación y gestión de tareas
- Interfaz de usuario responsive
- Filtrado de tareas por estado
- Almacenamiento en JSON
- API RESTful

## Tecnologías Utilizadas

- Node.js
- Express.js
- JavaScript (Frontend)
- HTML5
- CSS3
- JSON (para almacenamiento de datos)

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

## Instalación

1. Clona el repositorio o descarga los archivos

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor:
```bash
npm start
```

Para desarrollo, puedes usar:
```bash
npm run dev
```

4. Abre tu navegador y visita `http://localhost:3000`

## Estructura de la API

### Endpoints

- `GET /api/tasks` - Obtener todas las tareas
- `POST /api/tasks` - Crear una nueva tarea
- `PUT /api/tasks/:id` - Actualizar una tarea existente
- `DELETE /api/tasks/:id` - Eliminar una tarea

### Formato de Tarea

```json
{
  "id": 1234567890,
  "title": "Título de la tarea",
  "description": "Descripción de la tarea",
  "assignedTo": "Nombre del responsable",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Próximos Pasos

- Migración a arquitectura de tres capas
- Implementación de autenticación de usuarios
- Migración a una base de datos relacional
- Implementación de roles y permisos 