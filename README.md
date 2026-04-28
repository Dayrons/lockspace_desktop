# Lockspace Desktop

Aplicación de escritorio para la gestión segura de contraseñas, construida con Electron, React y SQLite. Esta aplicación permite la sincronización con la versión móvil a través de un servidor FTP local y utiliza cifrado de grado militar para proteger tus datos.

## 🚀 Características Principales

- **Gestión de Contraseñas:** Almacenamiento local seguro utilizando SQLite y Sequelize.
- **Cifrado Avanzado:** Implementación de tokens Fernet con claves derivadas del hardware del PC (Machine ID).
- **Sincronización:** Servidor FTP integrado para recibir datos desde la aplicación móvil.
- **Seguridad:** Autenticación local con bcrypt y protección de integridad de datos.
- **Interfaz Moderna:** Construida con React, Material UI y Redux Toolkit para una experiencia fluida.

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (Versión 14 o superior recomendada)
- [npm](https://www.npmjs.com/) (Viene con Node.js)
- Herramientas de compilación para C++ (necesarias para `sqlite3` y otros módulos nativos):
  - **Windows:** `npm install --global windows-build-tools` o instalar Visual Studio con "Desktop development with C++".
  - **Linux:** `sudo apt-get install build-essential`

## 📦 Instalación

1. Clona el repositorio o descarga el código.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Reconstruye los módulos nativos para Electron:
   ```bash
   npm run postinstall
   ```

## 🛠️ Configuración de Desarrollo

Para ejecutar la aplicación en modo desarrollo:

1. Inicia Webpack en modo escucha (abre una terminal):
   ```bash
   npm run dev
   ```
2. Inicia la aplicación Electron (abre otra terminal):
   ```bash
   npm start
   ```

## 🏗️ Compilación y Empaquetado

### Para Windows (.exe)
Genera un instalador ejecutable para Windows x64:
```bash
npm run build
npm run dist:win
```

### Para Linux (.AppImage / .deb)
Genera paquetes para distribuciones basadas en Debian y AppImage genérico:
```bash
npm run build
npm run dist:linux
```

Los archivos generados se encontrarán en la carpeta `dist/`.

## 📂 Estructura del Proyecto

- `src/main/`: Lógica del proceso principal de Electron (Base de datos, Controladores, Modelos, Servidor FTP).
- `src/render/`: Lógica del proceso de renderizado (React, Redux, Componentes, Estilos).
- `src/assets/`: Recursos estáticos como logos e imágenes.
- `public/`: Punto de entrada HTML.

## 🔒 Seguridad y Cifrado

La aplicación utiliza un esquema de seguridad de doble capa:
1. **Acceso:** Las contraseñas del usuario se hashean con `bcrypt`.
2. **Almacenamiento:** Los datos sensibles se cifran localmente usando `fernet` con una clave única generada a partir del `machine-id` de tu ordenador, asegurando que la base de datos no pueda ser leída en otro equipo.

---
Desarrollado por **Softplus** 🔐
