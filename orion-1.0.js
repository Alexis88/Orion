/*!
 * Orion Library
 * ROTADOR DE IMÁGENES
 * Autor: Alexis López (@AlexisThrasher)
 * Fecha de elaboración: 01/03/2014 20:39:28
 * Versión: 1.0
 * Licencia Pública GPLv3
 */
 
var Orion = function(identificador){
    if (identificador) {
        if (window === this)
            return new Orion(identificador);
            
        switch (identificador[0]) {
            case "#": //Tomo al elemento por su Id
                this.objeto = document.getElementById(identificador.substr(1));
                this.tipo = 1;
                break;
            case ".": //Tomo al elemento por su Clase
                this.objeto = document.getElementsByClassName ? 
                        document.getElementsByClassName(identificador.substr(1)) : 
                        document.querySelectorAll ? 
                        document.querySelectorAll(identificador) : 
                        function(identificador){
                            var todos = document.getElementsByTagName("*"),
                                todosTotal = todos.length,
                                obj = [];

                            Array.prototype.forEach.call(todos, function(t){
                                if (t.className == identificador.substr(1))
                                    obj.push(t);
                            });

                            return obj;
                        };
                this.tipo = 2;
                break;        
            default: //Tomo al elemento por su etiqueta
                this.objeto = document.getElementsByTagName(identificador);
                this.tipo = 2;
                break;
        }

        return this;
    }
};
 
Orion.prototype = {
    rotador: function(json){
        var aplicar = function(elObjeto){
            /*
                Tomo a todas las imágenes anexadas, les aplico estilos
                y las añado al elemento de referencia
            */
            for (var j in json.imagenes){
                var img = document.createElement("img");
                img.src = json.imagenes[j];
                img.style.position = "absolute";
                img.style.opacity = 0;
                img.style.width = json.ancho;
                img.style.height = json.alto;
                img.style.borderRadius = json.bordeRedondeado == "si" ? ".4em" : "0";
                elObjeto.appendChild(img);
            }
            
            var velocidad = 1000; //Por defecto, el tiempo de transición será de 1 segundo
            
            //Control de velocidad de transición
            if (json.velocidad)
                switch (json.velocidad) {
                    case "lento":
                        velocidad = 5000;
                        break;
                    case "normal":
                        velocidad = 3000;
                        break;
                    case "rapido":
                        velocidad = 1500;
                        break;
                    default:
                        velocidad = json.velocidad < 0 ? 
                        			json.velocidad * -1000 : 
                        			json.velocidad === 0 ? 
                        			1000 : 
                        			json.velocidad * 1000;
                        break;
                }
            
            var imagenes = elObjeto.getElementsByTagName("img"), //Tomo a todas las imágenes anexadas
                total = imagenes.length, //Calculo el total de imágenes anexadas
                contador = 0; //El contador que nos permitirá rotar a las imágenes
                
            //Mostramos a la primera imagen
            Orion.emerger(imagenes[contador], velocidad);
            
            var show = function(){
                Orion.atenuar(imagenes[contador], velocidad); //Oculto
                contador = contador == total - 1 ? 0 : ++contador; //Actualizo el valor del contador
                Orion.emerger(imagenes[contador], velocidad); //Muestro
            };
            
            setInterval(show, velocidad); //El plugin se ejecutará cada "velocidad" segundos de manera indefinida
        }

        //Aplico el plugin en cada elemento
        switch (this.tipo){
            case 1:
                aplicar(this.objeto);
                break;

            case 2:
                Array.prototype.forEach.call(this.objeto, aplicar);
                break;
        }

        return this; //Retornamos el objeto
    },
    valor: function(){
        switch (this.tipo){
            case 1:
                return this.objeto.value || this.objeto.innerHTML;
                break;

            case 2:
                var valores = [];
                Array.prototype.forEach.call(this.objeto, function(item){
                    valores.push(item.value || item.innerHTML);
                });
                return valores;
                break;
        }
    },
    enfoque: function(funcionFoco, funcionSinFoco){
        var aplicar = function(objeto){
            if (document.addEventListener){
                objeto.addEventListener("focus", funcionFoco, false);
                objeto.addEventListener("blur", funcionSinFoco, false);
            } 
            else{
                objeto.attachEvent("onfocus", funcionFoco);
                objeto.attachEvent("onblur", funcionSinFoco);
            }
        };

        switch (this.tipo){
            case 1:
                aplicar(this.objeto);
                break;

            case 2:
                Array.prototype.forEach.call(this.objeto, aplicar);
                break;
        }

        return this; //Retornamos el objeto
    },
    clic: function(funcion){
    	var aplicar = function(objeto){
            if (document.addEventListener)
                objeto.addEventListener("click", funcion, false);
            else
                objeto.attachEvent("onclick", funcion);
        };

        switch (this.tipo){
            case 1:
                aplicar(this.objeto);
                break;

            case 2:
                Array.prototype.forEach.call(this.objeto, aplicar);
                break;
        }
    }
};

Orion.atenuar = function(objeto, velocidad){
    var valor = 1, 
        delta = velocidad == "rapido" ? 0.1 : 0.01,
        tiempo = velocidad == "rapido" ? 10 : 1,
        intervalo = setInterval(function(){ 
            valor -= delta; 
            objeto.style.opacity = valor;
            if (valor < 0){
                clearInterval(intervalo); 
                objeto.style.display = "none";
            }
    }, tiempo);
};

Orion.emerger = function(objeto, velocidad){
	if (objeto.style.opacity.length && Math.round(objeto.style.opacity) === 0){
        objeto.style.display = "block";
        var valor = 0, 
        	delta = velocidad == "rapido" ? 0.1 : 0.01,
            tiempo = velocidad == "rapido" ? 10 : 1,
            intervalo = setInterval(function(){ 
                valor += delta; 
                objeto.style.opacity = valor;
                if (valor > 1) clearInterval(intervalo); 
    		}, tiempo);
    }
};

Orion.ajax = function(objeto){
    var xhr = window.XMLHttpRequest ? 
              new XMLHttpRequest() : 
              new ActiveXObject("Microsoft.XMLHTTP") || 
              new ActiveXObject("Msxml2.XMLHTTP"),
        salidaOpcional = document.createElement("p");

    var url = objeto.url,
        datos = objeto.datos,
        cargando = objeto.cargando,
        metodo = objeto.metodo,
        salida = objeto.salida;

    url = metodo == "GET" ? url + "?" + datos : url;
    datos = metodo == "GET" ? null : datos;

    xhr.open(metodo || "GET", url, true);
    xhr.onreadystatechange = function(){
        if (xhr.readyState < 4){            
            if (salida){
            	if (cargando){
            		Orion.atenuar(salida, "lento");
            		Orion.emerger(cargando, "lento");
            	}
                else
                	salida.innerHTML = "Cargando...";
            }
            else{
            	if (cargando){
            		Orion.atenuar(salidaOpcional, "lento");
            		Orion.emerger(cargando, "lento");
            	}
                else
                	salidaOpcional.innerHTML = "Cargando...";

                document.body.appendChild(salidaOpcional);
            }           
        }
        else{
            setTimeout(function(){
            	if (cargando) Orion.atenuar(cargando, "lento");
                var respuesta = xhr.status == 200 ? xhr.responseText : xhr.status == 404 ? "La dirección brindada no existe" : "Error: " + xhr.status;

                if (salida){
                	Orion.emerger(salida, "lento");
                    salida.innerHTML = respuesta;
                }
                else{
                	Orion.emerger(salidaOpcional, "lento");
                    salidaOpcional.innerHTML = respuesta;
                }
            }, 2000);
        }
    };

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(datos);
};
