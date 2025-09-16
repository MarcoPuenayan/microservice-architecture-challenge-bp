# MF Template

Este proyecto represta un template para constuir una aplicacion shell para el uso de microfrontends

## Requerimientos

* [Node v12.14.1 o superior]()

* Configurar el el .npmrc con la siguiente configuracion

```bash
@pichincha:registry=https://pkgs.dev.azure.com/BancoPichinchaEC/
```

Nota: Esta configuracion es provisional

## Instalación

Ingresar a la raiz de la carpeta y ejecutar el siguiente comando:

```sh
yarn install
```

## Modo de desarrollo

Para poder correr el proyecto localmente es necesario ejecutar el siguiente comando:
```sh
yarn start
```

La aplicacion estara corriendo el puerto 4200, por ende abrir el navegador con la siguiente direccion `http://localhost:4200/` y veremos la aplicacion corriendo.

## Estructura de carpetas

* directives: Carpeta para incluir las directivas que se usaran en el proyecto shell.
* pipes: Carpeta para incluir los pipes que se usaran en el proyecto shell.
* services: Carpeta para incluir los servicios a usar en el proyecto shell.
* components: Carpeta para incluir componentes que son de tipo de UI
* views: Carpeta para incluir componentes que tienen logica y son integradores con los componentes presentes en la carpeta components
* types: Carpeta para incluir todos los types para funciones, request, etc.
* layouts: Carpeta para crear layouts que permitan integrar los microfrontend.
* guard: Carpeta para incluir los guards necesarios que tendran los layouts o las rutas propias del shell.

## Compilación

La compilacion puede ser ejecutado para diferentes ambientes, si se quiere compilar para el ambiente produccion se puede ejecutar el siguiente comando:
```sh
yarn build:prod
```

Revisar el package.json para conocer el listado de los comandos

## Test unitarios

Para correr los test unitarios de la aplicacion, se debe ejecutar el siguiente comando:

```sh
yarn test
```
## Revisión de estilo de código

Para realizar la revision del estilo de codigo se debe ejecutar el siguiente comando:
```sh
yarn lint
```
## Generar documentación

Para obtener una documentación del proyecto se debe ejecutar este comando:
```sh
yarn docs:build-and-serve
```
