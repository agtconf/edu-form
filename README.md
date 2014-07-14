#edu-form
##Introducci&oacute;n
edu-form es un formulario de datos desarrollado en [AngularJS](http://angularjs.org/) que permite la creación de formularios.



##Dependencias
edu-form est&aacute; construido utilizando varias librer&iacute;as javascript:
    
- [AngularJS](http://angularjs.org/)
Framework utilizado para desarrollar el componente.
- [Bootstrap](http://getbootstrap.com/)
Framework en el que se basa el aspecto del grid.
- [Angular-resource](https://docs.angularjs.org/api/ngResource)
Una factoria que crea un recurso que permite interactuar con fuentes de datos RESTful.
- [jQuery](http://jquery.com/)
Dependencia de Bootstrap
- [Angular-sanitize](https://docs.angularjs.org/api/ngSanitize)
Módulo que provee las funcionalidades para sanitize HTML.

***

##Utilizaci&oacute;n
####Importar el c&oacute;digo
Lo primero que hay que hacer es importar en la p&aacute;gina los ficheros javascript forman el componente

    <style href="edu-form.js"></style>
    
    <script src="edu-form.js"></script>
####options
Como se ha escrito previamente, uno de los objetivos de edu-field es permitir el uso del componente sin tener que desarrollar
ning&uacute;n tipo de c&oacute;digo javascript, el uso m&aacute;s simple posible ser&aacute; utilizar el tag html <div edu-form /> junto con las opciones
donde parametrizaremos el componente.

    <div edu-form options={ ....} />

####edu-form options
Lo ideal es indicar los parámetros utilizando para ello el atributo options que contendr&aacute; un objeto json con la lista de propiedades necesarias para la correcta configuración del componente:
....
....
....
....



      
##Desarrollo
```bash
# Clone this repo (or your fork).
git clone https://github.com/educarm/edu-form.git
cd edu-form

# Install all the dev dependencies
$ npm install
# Install bower components
$ bower install

# run the local server and the file watcher
$ grunt dev
```
##Distribución
```bash
# Build component
$ grunt build
```
##Demo
[edu-form demo](https://raw.githack.com/educarm/edu-form/master/src/demo-dev.html)
