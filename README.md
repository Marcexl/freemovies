# 🎬 FreeMovies - Plataforma de Streaming

Una aplicación web moderna de streaming de películas y series, inspirada en Netflix, construida con Nuxt 3, Firebase y PrimeVue.

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Stack Tecnológico](#-stack-tecnológico)
- [Características](#-características)
- [UI/UX](#-uiux)
- [Sistema de Autenticación](#-sistema-de-autenticación)
- [Configuración de Firebase](#-configuración-de-firebase)
- [Reglas de Firestore](#-reglas-de-firestore)
- [API de OMDB](#-api-de-omdb)
- [Variables de Entorno](#-variables-de-entorno)
- [Instalación](#-instalación)
- [Dockerización](#-dockerización)
- [Uso con Docker](#-uso-con-docker)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)

## 🎯 Descripción

FreeMovies es una plataforma de streaming que permite a los usuarios:

- Buscar y explorar películas y series
- Crear una lista personalizada de favoritos
- Autenticarse mediante email/password o Google Sign-In
- Navegar por diferentes géneros y categorías
- Ver detalles completos de cada título

## 🛠 Stack Tecnológico

### Frontend

- **Nuxt 3** (v4.2.2) - Framework Vue.js con SSR
- **Vue 3** (v3.5.26) - Framework JavaScript reactivo
- **PrimeVue** (v4.5.4) - Biblioteca de componentes UI
- **PrimeFlex** (v4.0.0) - Sistema de utilidades CSS
- **PrimeIcons** (v7.0.0) - Iconos
- **Aura Theme** - Tema personalizado estilo Netflix

### Backend & Servicios

- **Firebase Authentication** - Autenticación de usuarios
- **Cloud Firestore** - Base de datos NoSQL
- **OMDB API** - API para información de películas y series

### Estado y Persistencia

- **Pinia** (v3.0.4) - Gestión de estado

## ✨ Características

- ✅ Autenticación con Email/Password y/o Google Sign-In
- ✅ Búsqueda de películas y series
- ✅ Carouseles por género (Acción, Suspense, Terror, etc.)
- ✅ Hero slider con contenido destacado
- ✅ Lista personalizada de favoritos (My List)
- ✅ Detalles completos de cada título
- ✅ Diseño responsive
- ✅ Tema oscuro estilo Netflix
- ✅ Persistencia de sesión en firebase

## 🎨 UI/UX

### Diseño

La aplicación utiliza un diseño moderno inspirado en Netflix con:

- **Paleta de Colores:**

  - Rojo Netflix: `#e50914`
  - Fondo oscuro: `#0a0a0a`
  - Grises oscuros para superficies
  - Texto blanco con buena legibilidad

- **Tipografía:**

  - **Bebas Neue** - Para títulos y encabezados
  - **Montserrat** - Para texto general

- **Componentes PrimeVue:**
  - Menubar para navegación
  - Cards para mostrar películas/series
  - Carousel para sliders
  - InputText y Password para formularios
  - Button con estilos personalizados
  - Avatar para perfil de usuario
  - Toast para notificaciones

### Experiencia de Usuario

- Navegación intuitiva con menú superior
- Búsqueda rápida con overlay expandible
- Transiciones suaves entre páginas
- Loading states con skeletons
- Diseño responsive para móviles y desktop

## 🔐 Sistema de Autenticación

### Métodos de Autenticación

1. **Email/Password:**

   - Registro con nombre, email y contraseña
   - Login con email y contraseña
   - Validación de formularios en cliente

2. **Google Sign-In:**
   - Autenticación con cuenta de Google
   - Obtiene automáticamente nombre y foto de perfil

## 🔥 Configuración de Firebase

Configurar Firebase no es mandatory podes usar la data ya instalada en este proyecto para probar va a estar disponible hasta el 1/2/26

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Authentication** y **Firestore Database**

### 2. Configurar Authentication

1. En Firebase Console, ve a **Authentication > Sign-in method**
2. Habilita:
   - ✅ **Email/Password**
   - ✅ **Google** (necesitas configurar el consent screen en Google Cloud Console)

### 3. Configurar Firestore

1. Ve a **Firestore Database**
2. Crea la base de datos en modo **Production** o **Test**
3. Configura las reglas de seguridad (ver sección siguiente)

### 4. Obtener Configuración

1. Ve a **Project Settings > General**
2. En "Your apps", selecciona la web app o crea una nueva
3. Copia la configuración de Firebase

### 5. Configurar `firebase.js`

Actualiza el archivo `firebase.js` con tu configuración:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  measurementId: "G-XXXXXXXXXX",
};
```

## 📜 Reglas de Firestore

Configura las siguientes reglas en **Firestore Database > Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /mylist/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

Dale publish y listo!!

## 🎬 API de OMDB

### ¿Qué es OMDB API?

[OMDB API](https://www.omdbapi.com) (The Open Movie Database) es un servicio RESTful gratuito que proporciona información completa sobre películas y series de televisión. Es una alternativa gratuita a APIs comerciales como TMDB.

### Características

- ✅ Información detallada de películas y series
- ✅ Búsqueda por título
- ✅ Búsqueda por IMDb ID
- ✅ Posters de películas (requiere suscripción de pago)
- ✅ Límite de 1,000 requests/día en plan gratuito

### Cómo Obtener una API Key

1. Ve a [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)
2. Completa el formulario con:
   - Tu nombre
   - Tu email
   - Tipo de uso (Personal/Free)
3. Verifica tu email
4. Recibirás tu API key por email

### Cómo se Usa en la Aplicación

La aplicación utiliza OMDB API para:

- **Búsqueda de películas**: `searchMovies(query, page)`
- **Detalles de película/serie**: `getMovieById(imdbID)`
- **Películas por género**: `getMoviesByGenre(genre, limit)`
- **Búsqueda de series**: `getSeries(limit)`

### Endpoints Utilizados

```javascript
// Búsqueda
GET https://www.omdbapi.com/?apikey=YOUR_KEY&s=movie&type=movie&page=1


// Por ID
GET https://www.omdbapi.com/?apikey=YOUR_KEY&i=tt1285016&plot=full
```

## 🔑 Variables de Entorno

### Crear archivo `.env`

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Key de OMDB
OMDB_API_KEY=tu_api_key_aqui
```

### Configuración en `nuxt.config.ts`

La API key se configura automáticamente desde `.env`:

```typescript
runtimeConfig: {
  public: {
    omdbApiKey: process.env.OMDB_API_KEY || "demo";
  }
}
```

### ⚠️ Mucho muy importante si alguno/a esta viendo esto

- **NUNCA** subas el archivo `.env` a Git
- Agrega `.env` a `.gitignore`
- Usa `.env.example` como plantilla (sin valores reales)
- Como esto es un challenge vamos a dejar el valor real aparte es una api FREE

## 📦 Instalación

### Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta de Firebase
- API Key de OMDB

### Pasos

1. **Clonar el repositorio:**

```bash
git clone <url-del-repositorio>
cd freemovies
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Configurar variables de entorno:**

```bash
cp .env.example .env
# Edita .env y agrega tu OMDB_API_KEY
```

4. **Configurar Firebase:**

   - Actualiza `firebase.js` con tu configuración
   - Configura las reglas de Firestore

5. **Ejecutar en desarrollo:**

```bash
npm run dev
```

6. **Abrir en el navegador:**

```
http://localhost:3000
```

## 🚀 Uso con Docker

### Construir la Imagen

```bash
docker build -t freemovies:latest .
```

### Ejecutar el Contenedor

```bash
docker run -d --name freemovies-test -p 3000:3000 -e NUXT_PUBLIC_OMDB_API_KEY=2dff02c4 freemovies:latest
```

### Acceder a la Aplicación

Una vez ejecutando, accede a:

```
http://localhost:3000
```

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye la aplicación
npm run preview      # Previsualiza la build de producción
npm run generate     # Genera sitio estático

# Utilidades
npm run postinstall  # Prepara Nuxt (auto-ejecutado)
```

## 📁 Estructura del Proyecto

```
freemovies/
├── app/
│   ├── components/          # Componentes Vue reutilizables
│   │   ├── MovieCard.vue
│   │   ├── MovieCarousel.vue
│   │   ├── MovieSkeleton.vue
│   │   └── SearchBar.vue
│   ├── composables/         # Composables de Nuxt
│   │   ├── useAuth.js
│   │   ├── useMyList.js
│   │   ├── useMovies.js
│   │   └── useOMDB.js
│   ├── layouts/            # Layouts de la aplicación
│   │   └── default.vue
│   ├── middleware/         # Middleware de rutas
│   │   └── auth.ts
│   ├── pages/              # Páginas (rutas)
│   │   ├── home.vue
│   │   ├── index.vue        # Login
│   │   ├── movies/
│   │   ├── series/
│   │   └── my-list/
│   └── app.vue             # Componente raíz
├── plugins/                # Plugins de Nuxt
│   └── auth.client.ts
├── stores/                 # Stores de Pinia
│   ├── auth.js
│   └── movies.js
├── public/                 # Archivos estáticos
├── firebase.js             # Configuración de Firebase
├── nuxt.config.ts          # Configuración de Nuxt
├── package.json
├── Dockerfile
├── docker-compose.yml
└── .env                    # Variables de entorno (no en Git)
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 👨‍💻 Autor

Desarrollado por [marcexl.com.ar](https://marcexl.com.ar)

---

**Nota**: Esta aplicación es solo un challenge y una demostración. Asegúrate de cumplir con los términos de servicio de OMDB API y Firebase.
Si ven algo incorrecto o de malas practicas me pueden decir.
Nos vemos nerds.
