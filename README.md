# Plantilla Open Layers - React Hooks

Karen Milena Buitrago López
Bogotá, Colombia
kmbuitragol@dane.gov.co

Jonatan Velasquez Vargas
Bogotá, Colombia
jvelasquezv@dane.gov.co

Diego Fernando Rodriguez Lamus
Bogotá, Colombia
dfrodriguezl@dane.gov.co

## 00 Instalacion

Esta plantilla funciona bajo el empaquetamiento de webpack, para correr el visor necesita hacer la siguiente instalación.

## Dependencias

Paso 1: Instalar las dependencias del proyecto.

```
$ npm install
```

```
npm install --save-dev
```

## Compilar

Paso 2: Compile primero para implementación local web app .

```
npm run start
```


Paso 3: Si va a compilar el backend (port 3000).

```
npm run nodemon
```

Paso 4: Para minificar archivos.

```
npm run build
```

Una vez usted termine de hacer el proyecto, se requiere que suba los archivos minificados.

## 01 Estructuración del Proyecto

En esta seccion se dara la explicacion de la estructuración del proyecto y configuracion de este, el cual esta dividido en los archivos para la descripción y 3 carpetas: app, backend y dist

### 001 Estructuración html

La composición del html lo pueden encontrar dentro de la carpeta **/app/html.** Tiene un único archivo en el que se llamaran los "cascarones" principales de estructuración del proyecto. 

### 002 Estructuración img

La composición del img lo pueden encontrar dentro de la carpeta **/app/img.** Contiene imagenes locales que sean propias del geovisor

### 003 Estructuración json

La composición del json lo pueden encontrar dentro de la carpeta **/app/json.** Contiene los archivos geográficos tipo json que requiera el geovisor para la visualización de mapas

### 004 Estructuración scripts

La composición del json lo pueden encontrar dentro de la carpeta **/app/scripts.** Contiene los componentes que combinan maquetacion y comportamiento de cada uno de los componentes del proyecto.  Esta se compone de las siguientes:

#### 004-01 Base

Contiene un request y variables. Dentro de **variables.js** encontrara la declaración de variables globales para el proyecto, o bien, que se repiten en varios archivos del mismo de forma que no se tengan que configurar en cada uno. 

#### 004-02 Layouts

Contiene los archivos principales de la maquetacion junto a su funcionalidad del proyecto 

#### 004-03 Components

Contiene los componentes que serán llamados por los layouts dependiendo de las funcionalidades requeridas

#### 004-04 olsv

Configuraciones adcionales de OpenLayers. 

### 005 Styles

La composición del styles lo pueden encontrar dentro de la carpeta **/app/styles.** Contiene los estilos gráficos de cada uno de los elementos del proyecto. Cuenta con un archivo **main.scss** donde podrá llamar los estilos independientes que agregue en su proyecto



## Contribuciones
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

DANE - COLOMBIA

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Autores / créditos
* **Karen Buitrago** - *Implementación plantilla Geovisores Open Layers - Dane
* **Jonatan Velasquez** - *Implementación plantilla Geovisores Open Layers - Dane
* **Diego Rodriguez** - *Implementación plantilla Geovisores Open Layers - Dane