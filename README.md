# Integración de Vintom para Videos Personalizados

## Tabla de Contenidos

- [Integración de Vintom para Videos Personalizados](#integración-de-vintom-para-videos-personalizados)
  - [Tabla de Contenidos](#tabla-de-contenidos)
- [📋 Requisitos](#-requisitos)
- [🔧 Configuración del Proyecto](#-configuración-del-proyecto)
  - [⚡ Instalación de Dependencias](#-instalación-de-dependencias)
  - [💻 Ejecución del Proyecto](#-ejecución-del-proyecto)
- [🎬 Sobre Vintom](#-sobre-vintom)
  - [Modos de Integración](#modos-de-integración)
- [🎮 Uso del Componente](#-uso-del-componente)
  - [Parámetros Configurables](#parámetros-configurables)
- [📝 Estructura del Proyecto](#-estructura-del-proyecto)
- [🔍 Solución de Problemas](#-solución-de-problemas)

# 📋 Requisitos

- Node.js 16.x o superior
- Angular 19.x
- Navegadores modernos (Chrome, Firefox, Safari)

# 🔧 Configuración del Proyecto

## ⚡ Instalación de Dependencias

```shell
npm install
```

## 💻 Ejecución del Proyecto

```shell
ng serve
```

> Abre <http://localhost:4200/> en tu navegador para ver la aplicación.

# 🎬 Sobre Vintom

Vintom es una plataforma para la creación y reproducción de videos personalizados. Este proyecto implementa una integración con Vintom que permite mostrar videos personalizados en una aplicación Angular.

## Modos de Integración

La integración con Vintom ofrece diferentes modos de arquitectura según las necesidades:

- **Data in Client's Infrastructure**: Todos los datos se envían directamente al reproductor para máxima seguridad. No se envía información personal a servidores externos. Este es el modo implementado en este proyecto.

- **Hybrid Infrastructure**: Los datos se renderizan primero en los servidores de Vintom y luego se envía la información restante al reproductor. Este modo no está habilitado en la implementación actual.

# 🎮 Uso del Componente

El componente principal `VintomPlayerComponent` permite configurar y mostrar un video personalizado utilizando el modo "Data in Client's Infrastructure".

Para inicializar el reproductor:

1. Completa el formulario con los datos de personalización
2. Haz clic en el botón "Initialize Player"
3. El video se generará y mostrará utilizando los datos ingresados

## Parámetros Configurables

| Parámetro   | Descripción                             | Valores Permitidos                         |
| ----------- | --------------------------------------- | ------------------------------------------ |
| name        | Nombre que aparecerá en el video        | Lista predefinida (ver componente)         |
| data_source | Fuente de datos                         | "API" (valor requerido)                    |
| language    | Idioma para los subtítulos              | "ENG", "ES", "PL"                          |
| image       | Imagen que se mostrará en el video      | "flower", "fish", "car", "house", "family" |
| colour      | Color utilizado en el video             | "blue", "yellow", "green", "purple", "red" |
| percent     | Número porcentual utilizado en el video | 0-100                                      |
| chart       | Tipo de gráfico mostrado                | "pie-chart", "bar chart"                   |
| cta_url     | URL para el call-to-action              | Cualquier URL válida                       |

# 📝 Estructura del Proyecto

- **VintomPlayerComponent**: Componente principal que maneja la interacción con el reproductor Vintom.
- **VintomService**: Servicio encargado de procesar y preparar los datos para el reproductor.
- **Archivos de Script**: Incluidos como referencias en el index.html para cargar las bibliotecas de Vintom.

# 🔍 Solución de Problemas

- **Error AbortError en reproducción**: Este es un error común relacionado con la reproducción del video. Se ha implementado un manejador global de errores para suprimir estos mensajes.
- **El video no se muestra**: Asegúrate de que todos los scripts se carguen correctamente y que el contenedor del reproductor tenga el ID correcto ("playerElementId").
- **Datos no válidos**: Comprueba que estás usando valores permitidos para todos los campos, especialmente para el campo "name" que debe coincidir con la lista predefinida.
