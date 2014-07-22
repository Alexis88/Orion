/*!
 * Orion Library
 * Autor: Alexis López (@AlexisThrasher)
 * Fecha de elaboración: 17/06/2014 23:05:40
 * Versión: 2.0
 * Licencia Pública GPLv3
 */
 
var $ = O = Orion = function(identificador){
    if (identificador){
        if (window === this)
            return new Orion(identificador);

        if (typeof identificador === "string")
            if (String.prototype.trim) identificador.trim();
            else identificador.replace(/^\s+|\s+$/g, "");

        var porId = function(id){
                return {
                    objeto: document.getElementById(id.substr(1)),
                    tipo: 1
                };
            },
            porClase = function(clase){
                return {
                    objeto: document.getElementsByClassName ? 
                            document.getElementsByClassName(clase.substr(1)) : 
                            document.querySelectorAll ? 
                            document.querySelectorAll(clase) : 
                            function(clase){
                                var obj = [];
                                if (Array.prototype.forEach)
                                    Array.prototype.forEach.call(document.getElementsByTagName("*"), function(item){
                                        if (item.className == clase.substr(1))
                                            obj.push(item);
                                    });
                                else{
                                    var elementos = document.getElementsByTagName("*"),
                                        total = elementos.length;
                                    for (var i = 0; i < total; i++)
                                        if (elementos[i].className == clase.substr(1))
                                            obj.push(elementos[i]);
                                }
                                return obj;
                            },
                    tipo: 2
                };
            },
            porElemento = function(elemento){
                var objeto = document.getElementsByTagName(elemento), 
                    tipo = 2;
                if (!objeto.length){
                    var elementos = document.getElementsByTagName("*"),
                        total = elementos.length;
                    for (var i = 0; i < total; i++)
                        if (elementos[i] == elemento){
                            objeto = elementos[i];
                            tipo = 1;
                            break;
                        }
                }
                return {
                    objeto: objeto,
                    tipo: tipo
                };
            };
        
        if (/\s|\[/.test(identificador) && typeof identificador === "string"){
            var idPos = identificador.substr(identificador.lastIndexOf(" ") + 1);
            if (idPos.search("#") > -1){
                this.objeto = document.querySelector(identificador);
                this.tipo = 1;
            }                
            else{
                this.objeto = document.querySelectorAll(identificador);
                this.tipo = 2;
            }
        }
        else{
            var atributos;
            switch (identificador[0]){
                case "#": //Tomo al elemento por su Id
                    atributos = porId(identificador);
                    break;
                case ".": //Tomo al elemento por su Clase
                    atributos = porClase(identificador);
                    break;        
                default: //Tomo al elemento por su etiqueta
                    atributos = porElemento(identificador);
                    break;
            }
            this.objeto = atributos.objeto;
            this.tipo = atributos.tipo;
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

    valor: function(valor){
        switch (this.tipo){
            case 1:
                if (valor)
                    if (/INPUT|TEXTAREA|SELECT-ONE/.test(this.objeto.tagName)) 
                        this.objeto.value = valor;
                    else
                        this.objeto.innerHTML = valor;
                return this.objeto.value || this.objeto.innerHTML || this.objeto.innerText;
                break;

            case 2:
                var valores = [];
                Array.prototype.forEach.call(this.objeto, function(item){
                    if (valor)
                        if (/INPUT|TEXTAREA|SELECT-ONE/.test(item.tagName)) 
                            item.value = valor;
                        else
                            item.innerHTML = valor;
                    else
                        valores.push(item.value || item.innerHTML || item.innerText);
                });
                return valores.length ? valores : this;
                break;
        }
    },

    enfoque: function(funcion){
        var aplicar = function(objeto){
            if (document.addEventListener)
                objeto.addEventListener("focus", funcion, false);
            else if (document.attachEvent)
                objeto.attachEvent("onfocus", funcion);
            else
                objeto.onfocus = funcion;
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

    sinEnfoque: function(funcion){
        var aplicar = function(objeto){
            if (document.addEventListener)
                objeto.addEventListener("blur", funcion, false);
            else if (document.attachEvent)
                objeto.attachEvent("onblur", funcion);
            else
                objeto.onblur = funcion;
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
            else if (document.attachEvent)
                objeto.attachEvent("onclick", funcion);
            else
                objeto.onclick = funcion;
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

    atenuar: function(velocidad){
        var aplicar = function(objeto){
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

    emerger: function(velocidad){
        var aplicar = function(objeto){
            if (objeto.style.display == "none" || (objeto.style.opacity.length && Math.round(objeto.style.opacity) === 0)){
                objeto.style.display = "block";
                var valor = 0, 
                    delta = velocidad == "rapido" ? 0.1 : 0.01,
                    tiempo = velocidad == "rapido" ? 10 : 1,
                    intervalo = setInterval(function(){ 
                        valor += delta; 
                        objeto.style.opacity = valor;
                        if (valor > 1)
                            clearInterval(intervalo);
                    }, tiempo);
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

    prop: function(propiedad, valor){
        var aplicar = function(objeto){
                return valor ? objeto.setAttribute(propiedad, valor) : objeto.getAttribute(propiedad);
            };

        switch (this.tipo){
            case 1:
                return aplicar(this.objeto);
                break;

            case 2:
                return Array.prototype.forEach.call(this.objeto, aplicar);
                break;
        }
    },

    serializar: function(){
        var aplicar = function(objeto){
                if (objeto.tagName == "FORM"){
                    for (var i = 0,
                             elementos = objeto.elements, 
                             serializado = [], 
                             l = elementos.length; 
                             i < l; 
                             serializado.push(elementos[i].name + "=" + elementos[i].value), i++);
                    return serializado.join("&");
                }
                else
                    return objeto.name + "=" + objeto.value;
            };

        switch (this.tipo){
            case 1:
                return aplicar(this.objeto);
                break;

            case 2:
                return Array.prototype.forEach.call(this.objeto, aplicar);
                break;
        }
    },

    enviar: function(callback){
        var aplicar = function(objeto){
            objeto.addEventListener("submit", callback, false);
        };

        switch (this.tipo){
            case 1:
                aplicar(this.objeto);
                break;

            case 2:
                Array.prototype.forEach.call(this.objeto, aplicar);
                break;
        }

        return this;
    },

    esNumerico: function(){
        var aplicar = function(objeto){
                return !isNaN(parseFloat(objeto.value)) && isFinite(objeto.value);
            };

        switch (this.tipo){
            case 1:
                return aplicar(this.objeto);
                break;

            case 2:
                return Array.prototype.map.call(this.objeto, aplicar).indexOf(false) == -1;
                break;
        }
    },

    esTexto: function(){
        var aplicar = function(objeto){
                return /^[a-zA-ZÁÉÍÓÚáéíóúÑñÜü\s]+$/g.test(objeto.value) && objeto.value.length;
            };

        switch (this.tipo){
            case 1:
                return aplicar(this.objeto);
                break;

            case 2:
                return Array.prototype.map.call(this.objeto, aplicar).indexOf(false) == -1;
                break;
        }
    },

    email: function(){
        var aplicar = function(objeto){
                return /^[\w\.\-_]+@[\w\.\-_]+\.[\w\.\-_]{2,6}(\.[\w\.\-_]{2,6})?$/.test(objeto.value.toLowerCase()) && objeto.value.length;
            };

        switch (this.tipo){
            case 1:
                return aplicar(this.objeto);
                break;

            case 2:
                return Array.prototype.map.call(this.objeto, aplicar).indexOf(false) == -1;
                break;
        }
    },

    encima: function(entrada, salida){
        var aplicar = function(objeto){
            if (document.addEventListener){
                objeto.addEventListener("mouseover", entrada, false);
                objeto.addEventListener("mouseout", salida, false);
            }
            else if (document.attachEvent){
                objeto.attachEvent("onmouseover", entrada);
                objeto.attachEvent("onmouseout", salida);
            }
            else{
                objeto.onmouseover = entrada;
                objeto.onmouseout = salida;
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

    mouseEncima: function(funcion){
        var aplicar = function(objeto){
            if (document.addEventListener)
                objeto.addEventListener("mouseover", funcion, false);
            else if (document.attachEvent)
                objeto.attachEvent("onmouseover", funcion);
            else
                objeto.onmouseover = funcion;
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

    mouseFuera: function(funcion){
        var aplicar = function(objeto){
            if (document.addEventListener)
                objeto.addEventListener("mouseout", funcion, false);
            else if (document.attachEvent)
                objeto.attachEvent("onmouseout", funcion);
            else
                objeto.onmouseout = funcion;
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

    css: function(json){
        var aplicar = function(objeto){
            for (var i in json){
                var propiedad = i.indexOf("-") > -1 ? function(){
                    var vieja = "-" + 
                                i.substring(
                                    i.search("-") + 1, 
                                    i.search("-") + 2
                                ),
                        nueva = i.substr(i.search("-") + 1).toUpperCase();
                    return i.replace(vieja, nueva);
                } : i;
                objeto.style[propiedad] = json[i];
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

    clase: function(nombreClase){
        var aplicar = function(objeto){
            if (!nombreClase) 
                return objeto.className || false;
            return objeto.className = nombreClase;
        };

        switch (this.tipo){
            case 1:
                return aplicar(this.objeto);
                break;

            case 2:
                return Array.prototype.forEach.call(this.objeto, aplicar);
                break;
        }
    },

    adherir: function(){
        var elementos = Array.prototype.slice.call(arguments),
            aplicar = function(objeto){
            for (var i in elementos)
                objeto.appendChild(elementos[i]);
        };

        switch (this.tipo){
            case 1:
                aplicar(this.objeto);
                break;

            case 2:
                Array.prototype.forEach.call(this.objeto, aplicar);
                break;
        }

        return this;
    },

    clonar: function(profundidad){
        var aplicar = function(objeto){
            return objeto.cloneNode(profundidad);
        };

        switch (this.tipo){
            case 1:
                return aplicar(this.objeto);
                break;

            case 2:
                return aplicar(this.objeto[0]);
                break;
        }
    }
};

//AJAX
Orion.ajax = function(json){
    var xhr = window.XMLHttpRequest ? 
              new XMLHttpRequest() : 
              new ActiveXObject("Microsoft.XMLHTTP") || 
              new ActiveXObject("Msxml2.XMLHTTP"),
        uri = json.uri,
        datos = json.datos,
        metodo = json.metodo,
        tipo = json.tipo,
        espera = json.espera,
        exito = json.exito,
        error = json.error;

    if (metodo.toUpperCase() == "GET"){
        uri += "?" + datos;
        datos = null;
    }

    xhr.open(metodo || "GET", uri, true);

    xhr.onreadystatechange = function(){
        if (xhr.readyState < 4){
            if (espera) espera();
        }
        else{
            var retorno = function(){
                switch (xhr.status){
                    case 200:
                        exito(/HTML|JSON/.test(tipo) || !tipo ? xhr.responseText : xhr.responseXML);
                        break;
                    case 404:
                        error("La dirección brindada no existe");
                        break;
                    default:
                        error("Error: " + xhr.status); 
                        break;
                }
            };
            if (espera) setTimeout(retorno, 2000);
            else retorno();
        }
    };

    if (metodo.toUpperCase() == "POST") xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(datos);
};

//ARRAYS
Orion.primero = function(array){
    return array[0];
};

Orion.ultimo = function(array){
    return array[array.length - 1];
};

Orion.agregar = function(){
    var array = Array.prototype.slice.call(arguments)[0];
    return Array.prototype.reduce.call(arguments, function(previo, actual){
        if (typeof actual !== "object")
            return array.push(actual);
        return array.concat(actual);
    });
};

Orion.quitar = function(array, viejos, nuevos){  
    if (viejos)
        if (typeof viejos !== "object"){
            var pos = array.indexOf(viejos);
            if (pos > -1)
                array.splice(pos, 1);
        }
        else
            for (var i in viejos)
                while (array.indexOf(viejos[i]) > -1){
                    var pos = array.indexOf(viejos[i]);
                    if (pos > -1)
                        array.splice(pos, 1);
                }

    if (nuevos)
        if (typeof nuevos !== "object")
            array.push(nuevos);
        else
            for (var i in nuevos)
                array.push(nuevos[i]);
                
    return array;
};

Orion.quitarPrimero = function(array){
    array.shift();
    return array;
};

Orion.quitarUltimo = function(array){
    array.pop()
    return array;
};

Orion.copiar = function(array, inicial, final){
    var i = array.indexOf(inicial),
        f = array.indexOf(final);

    if (i > -1 && f > -1)
        return array.slice(array.indexOf(inicial), array.indexOf(final) + 1);
    else if (i > -1 && f == -1 || !final)
        return array.slice(array.indexOf(inicial));
    else
        return array.slice();
};

Orion.ordenarAsc = function(array){
    return array.sort();
};

Orion.ordenarDesc = function(array){
    return array.sort(function(a, b){
        return b - a;
    });
};

Orion.juntar = function(array, union){
    return union ? array.join(union) : array.join();
};

Orion.separar = function(array, union){
    return union ? array.split(union) : array;  
};

Orion.combinar = function(){
    return Array.prototype.reduce.call(arguments, function(previo, actual){
        return previo.concat(actual);
    });
};

Orion.rango = function(inicio, fin, pasos){
    Orion.rango.array = Orion.rango.array || [];
        
    if (typeof inicio !== typeof fin){
        inicio = !isNaN(Number(inicio)) && isFinite(Number(inicio)) ? Number(inicio) : 0;
        fin = !isNaN(Number(fin)) && isFinite(Number(fin)) ? Number(fin) : 0;
    }

    if (typeof inicio === "string") 
        inicio = !isNaN(Number(inicio)) && isFinite(Number(inicio)) ? Number(inicio) : inicio[0].toLowerCase();
    if (typeof fin === "string")
        fin = !isNaN(Number(fin)) && isFinite(Number(fin)) ? Number(fin) : fin[0].toLowerCase();

    Orion.rango.array.push(inicio);

    if (!isNaN(pasos) && isFinite(pasos))
        pasos = inicio > fin ? 
                Number(pasos > 0 ? -pasos || -1 : pasos || -1) : 
                Number(pasos < 0 ? -pasos || 1 : pasos || 1);
    else
        pasos = inicio > fin ? -1 : 1;

    inicio = typeof inicio === "string" ? 
             String.fromCharCode(inicio.charCodeAt(0) + pasos) : 
             inicio += pasos;

    return (pasos > 0 && inicio <= fin) || (pasos < 0 && inicio >= fin) ? 
            this.rango(inicio, fin, pasos) : (function(){
                var aux = Orion.rango.array;
                Orion.rango.array = [];
                return aux;
            })();
};

Orion.partir = function(array, partes){
    for (var i = 0, l = array.length, nuevo = []; i < l; nuevo.push(array.slice(i, i += (partes || 1))));
    return nuevo;
};

Orion.unico = function(array){
    var array_filtrado = [];
    if (!Array.prototype.forEach){
        var total = array.length;
        for (var i = 0; i < total; i++)
            if (!Array.prototype.indexOf){
                var repeticiones = false;
                for (var j = i + 1; j < total; j++)
                    if (array[i] == array[j]){
                        repeticiones = true;
                        break;
                    }
                if (repeticiones)
                    array_filtrado.push(array[i]);
            }
            else
                if (array_filtrado.indexOf(array[i]) == -1)
                    array_filtrado.push(array[i]);
    }
    else
        array.forEach(function(valor){
            if (array_filtrado.indexOf(valor) == -1)
                array_filtrado.push(valor);
        });
    return array_filtrado;
};

Orion.enArray = function(dato, array, estricto){
    var respuesta = false;
  
    estricto = estricto === true ? true : false;
  
    if (Object.prototype.toString.call(array) === "[object Array]"){
        var i = 0,
            total = array.length;
      
        if (!Array.prototype.indexOf){
            for (; i < total;){
                if (estricto){
                    if (dato === array[i]){
                        respuesta = true;
                        break;
                    }
                }
                else{
                    if (dato == array[i]){
                        respuesta = true;
                        break;
                    }
                }
            }
        }
        else{
            if (estricto){
                if (array.indexOf(dato) > -1) respuesta = true;
            }
            else{
                for (; i < total;){
                    if (dato == array[i]){
                        respuesta = true;
                        break;
                    }
                }
            }
        }
    }
  
    return respuesta;
};
