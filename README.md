# Osiris — Frontend

Frontend e-commerce construido en React + TypeScript para el proyecto Osiris. Consume una REST API Spring Boot 3 con autenticación JWT.

## Stack

| Tecnología | Uso |
|---|---|
| React 19 + TypeScript | UI y tipado |
| Vite | Bundler y dev server |
| React Router v6 | Navegación y guards de rutas |
| TanStack Query | Fetching, caché e invalidación |
| Axios | Cliente HTTP con interceptor JWT |
| Zustand | Estado global (auth + carrito) |
| Tailwind CSS v4 | Estilos con diseño glassmorphism |

## Requisitos

- Node.js 18+
- Backend Osiris corriendo (ver sección de configuración del backend)

## Instalación

```bash
npm install
```

## Variables de entorno

Copiá el archivo de ejemplo y configurá la URL del backend:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:8080
```

Cambiá el valor por la IP y puerto donde corre tu backend. Reiniciá el dev server después de cualquier cambio en este archivo.

## Desarrollo

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Build

```bash
npm run build
```

---

## Rutas

### Públicas (sin login)

| Ruta | Descripción |
|---|---|
| `/` | Catálogo de productos con búsqueda y filtro por categoría |
| `/products/:id` | Detalle del producto |
| `/login` | Iniciar sesión |
| `/register` | Crear cuenta |
| `/forgot-password` | Solicitar reset de contraseña |
| `/reset-password?token=...` | Nueva contraseña con token del email |
| `/verify-email?token=...` | Confirmación de email |

### Usuario autenticado

| Ruta | Descripción |
|---|---|
| `/cart` | Carrito con edición de cantidades y checkout |
| `/orders` | Historial de órdenes |
| `/orders/:id` | Detalle de orden (cancelable si está en PENDING) |
| `/profile` | Editar nombre y contraseña |

### Admin (requiere `role: ADMIN`)

| Ruta | Descripción |
|---|---|
| `/admin/products` | CRUD de productos con subida de imágenes |
| `/admin/categories` | CRUD de categorías |
| `/admin/users` | Listado de usuarios y cambio de rol |
| `/admin/orders` | Todas las órdenes con cambio de estado |

---

## Arquitectura

```
src/
├── api/            # Módulos por dominio (auth, products, cart, orders, admin)
│   └── client.ts   # Instancia Axios con interceptor de refresh token
├── components/
│   ├── guards/     # AuthGuard, AdminGuard, GuestGuard
│   ├── AdminLayout.tsx
│   ├── Layout.tsx
│   └── Navbar.tsx
├── hooks/
│   └── useBackendStatus.ts   # Indicador de conexión al backend
├── lib/
│   ├── error.ts    # Extrae mensajes de error de respuestas API
│   └── format.ts   # Formateo de precios, fechas y estados de orden
├── pages/
│   ├── admin/
│   └── ...
├── router/         # Definición de rutas con guards aplicados
├── store/
│   ├── authStore.ts   # Zustand: sesión de usuario
│   └── cartStore.ts   # Zustand: carrito con contador
└── types/          # Tipos TypeScript de todos los contratos del API
```

## Comportamientos clave

### Autenticación JWT
- Al hacer login/register se guardan `accessToken` y `refreshToken` en `localStorage`.
- El interceptor de Axios adjunta el `accessToken` en cada request.
- Si una respuesta devuelve `401`, el interceptor intenta renovar el token con `/auth/refresh`. Si la renovación falla, limpia los tokens y redirige a `/login`.
- Las rutas `/auth/*` están excluidas del interceptor para que los errores de credenciales lleguen correctamente a la UI.

### Guards de rutas
- **AuthGuard**: redirige a `/login` si no hay sesión activa.
- **AdminGuard**: redirige a `/` si el usuario no tiene `role: ADMIN`.
- **GuestGuard**: redirige a `/` si ya hay sesión activa (evita que un usuario logueado vea `/login`).

### Carrito
- El estado del carrito se sincroniza con el backend al iniciar sesión.
- El contador de items en el Navbar se actualiza en tiempo real.
- "Agregar al carrito" sin sesión redirige a `/login`.

### Imágenes de productos
- El formulario de creación/edición acepta archivos de imagen por clic o drag & drop.
- La imagen se convierte a base64 en el navegador y se envía como `imageUrl`.
- No requiere endpoint de subida de archivos en el backend.

### Indicador de estado del backend
- El Navbar muestra un dot de color que indica si el backend está online, offline o conectando.
- Hace ping cada 30 segundos.

---

## Cambios requeridos en el backend

Para que todas las funcionalidades del frontend operen correctamente, el backend necesita los siguientes ajustes:

### 1. CORS — Spring Security

El preflight OPTIONS devuelve 403 si CORS no está configurado en la cadena de seguridad. Agregá esto en tu `SecurityFilterChain`:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        // ... resto de la configuración
    return http.build();
}

@Bean
CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of(
        "http://localhost:5173",
        "http://localhost:3000"
        // Agregá la IP/origen desde donde servis el frontend
    ));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

### 2. Endpoints públicos de productos y categorías

El catálogo se puede navegar sin login, por lo que estos endpoints deben ser accesibles sin token:

```java
.requestMatchers(HttpMethod.GET, "/products", "/products/**", "/categories", "/categories/**").permitAll()
```

### 3. Campo `imageUrl` como TEXT

Las imágenes se guardan como base64, lo que puede superar los 255 caracteres de un `VARCHAR`. Cambiá el tipo de columna:

```sql
ALTER TABLE products MODIFY COLUMN image_url TEXT;
```

---

## Para dar permisos de admin a un usuario

Ejecutá este SQL directamente en la base de datos:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'tu@email.com';
```

Luego el usuario debe hacer logout y login para que el frontend tome el rol actualizado.

Con Docker Compose:

```bash
docker exec -it <nombre-contenedor-mysql> mysql -u root -p
```

```sql
USE <nombre-base-de-datos>;
UPDATE users SET role = 'ADMIN' WHERE email = 'tu@email.com';
```
