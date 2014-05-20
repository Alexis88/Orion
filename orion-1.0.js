/*!
 * Orion Library
 * Autor: Alexis López (@AlexisThrasher)
 * Fecha de elaboración: 06/05/2014 04:01:24
 * Versión: 1.0
 * Licencia Pública GPLv3
 */
 
var $ = O = Orion = function(identificador){
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
                            var obj = [];

                            Array.prototype.forEach.call(document.getElementsByTagName("*"), function(item){
                                if (item.className == identificador.substr(1))
                                    obj.push(item);
                            });

                            return obj;
                        };
                this.tipo = 2;
                break;        
            default: //Tomo al elemento por su etiqueta
                this.objeto = document.getElementsByTagName(identificador);
                this.tipo = 2;
                if (!this.objeto.length){
                    var iden = identificador.tagName || identificador,
                        lista = document.getElementsByTagName(iden.toLowerCase()),
                        total = lista.length;
                    for (i = 0; i < total; i++)
                        if (lista[i] === identificador){
                            this.objeto = lista[i];
                            this.tipo = 1;
                            break;
                        }
                }
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
                        if (valor > 1){
                            clearInterval(intervalo); 
                            objeto.style.display = "block";
                        }
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
        var query = "";
            aplicar = function(objeto){
                if (objeto.tagName == "FORM"){
                    Array.prototype.forEach.call(objeto.elements, function(elemento){
                        query += query.length ? "&" + elemento.name + "=" + elemento.value : elemento.name + "=" + elemento.value;
                    });
                    return query;
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
                return /\s(?=[a-zA-ZÁÉÍÓÚáéíóúÑñÜü]+)/g.test(objeto.value) && objeto.value.length;
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
                return /^[\w\._-]+@[\w\.-]+\.[\w\.-]{2,3}(\.[\w\.-]{2,3})?$/.test(objeto.value.toLowerCase()) && objeto.value.length;
            };

        switch (this.tipo){
            case 1:
                return aplicar(this.objeto);
                break;

            case 2:
                return Array.prototype.map.call(this.objeto, aplicar).indexOf(false) == -1;
                break;
        }
        return respuesta;
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

    adherir: function(elementos){
        var aplicar = function(objeto){
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

    uri = metodo.toUpperCase() == "GET" ? uri + "?" + datos : uri;
    datos = metodo.toUpperCase() == "GET" ? null : datos;

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

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(datos);
};

//ARRAYS
Orion.primero = function(array){
    return array[0];
};

Orion.ultimo = function(array){
    return array[array.length - 1];
};

Orion.agregar = function(array, elementos){
    if (elementos)
        if (typeof elementos !== "object")
            array.push(elementos);
        else
            for (var i in elementos)
                array.push(elementos[i]);  

    return array;
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

Orion.combinar = function(array, arrays){
    return array.concat((function(){
        var retorno = [];
        for (var i in arrays)
            for (var j in arrays[i])
                retorno.push(arrays[i][j]);
        return retorno;
    })());
};
