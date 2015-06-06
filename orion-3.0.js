/**
 *	Orion JS
 *
 *	@author		Alexis López Espinoza
 *	@version	3.0
 *	@param		string|HTMLDOMElement	identi
 *	@this		object					La función OrionJS
 *	@return		object					El/los elemento/s bajo el contexto de la función OrionJS
 */

var $ = OrionJS = function(identi){
	if (!(this instanceof $)) return new $(identi);
	this.elem = typeof identi == "string" ? document.querySelectorAll(identi) : identi;
	return this;
};

$.prototype = {
	verify: function(t, e, f, a, p){
		/**
		 * @param	object			t 	($ object)
		 * @param	Node|NodeList	e 	(element or elements collection)
		 * @param	function 		f 	(function to execute)
		 * @param	number			a 	(total of method's arguments)
		 * @param	boolean			p 	(chaining) [see the notes]
		 */

		 /*
			NOTES:

			Método .css(): [p = true]

			- Sin argumentos: (1)
				$("#foo").css(); //'f' no devuelve valores y no permite encadenar
			- Con un argumento: (1)
				$("#foo").css("height"); //'f' retorna el valor de 'height' y no permite encadenar
			- Con más de un argumento: (2.2)
				$("#foo").css("height", 200); //'f' establece el valor para 'height' y permite encadenar

			Método .val(): [p = false]

			- Sin argumentos: (1)
				$("#foo").val(); //'f' retorna el valor del elemento y no permite encadenar
			- Con un argumento: (2.3)
				$("#foo").val("bar"); //'f' establece el valor 'bar' para el elemento y permite encadenar

			Método .on(): [p = false]
					
			- Sin argumentos: (1)
				$("#foo").on(); //'f' no devuelve valores y no permite encadenar
			- Con argumentos: (2.4)
				$("#foo").on("click", function(){}); //'f' delega la función al elemento y permite encadenar
		 */

		if (e){
			if (/NodeList/.test({}.toString.call(e))){
				if (e.length === 1){
					/*	1
					
						Si el método recibió un argumento y 'p' es true o si no hay argumentos
					*/
					if ((a === 1 && p) || !a){
						return f(e[0]);
					}
					/*	2

						2.1. Si el método no recibió argumentos y 'p' es true o si hay uno o más argumentos.
						2.2. Si el método recibió más de un argumento y 'p' es true o si hay uno o más argumentos.
						2.3. Si el método no recibió argumentos y 'p' es false o si hay uno o más argumentos.
						2.4. Si el método recibió más de un argumento y 'p' es false o si hay uno o más argumentos
					*/
					else if (
								((a === 0 && p) || a) || 	//2.1
								((a > 1 && p) || a) || 		//2.2
								((a === 0 && !p) || a) || 	//2.3
								((a > 1 && !p) || a)		//2.4
							){
						f(e[0]);
						return t;
					}
				}
				else{ //Si es un conjunto de elementos, no se retornan valores
					[].forEach.call(e, f);
				}
			}
			else{
				if ((a === 1 && p) || !a){ 	//1
					return f(e);
				}
				else{						//2
					f(e);
					return t;
				}
			}
		}
	},
	
	css: function(){
		var args = arguments,
			computed,
			fn = function(el){
				if (args.length){			
		            if (typeof args[0] != "object"){
				        if (args.length > 1){
	                        el.style[args[0]] = args[1];
		    		    }
		                else{
							computed = window.getComputedStyle(el)[args[0]];
			                return /\d/.test(computed) ? parseInt(computed) : computed;
		                }	
		            }		
		            else{
				        for (var prop in args[0]){
                            el.style[prop] = args[0][prop];
				        }
		            }
	            }
			};
		return this.verify(this, this.elem, fn, args.length, true);
	},
	
	val: function(){
		var args = arguments,
		    fn = function(el){
		        if (args.length){
		            if ("value" in el){
      			        el.value = args[0];
	    			}
		    		else{
			    	    el.innerHTML = args[0];
				    }
		        }
		        else{
				    return "value" in el ? el.value : el.innerHTML;	
				}
		    };
		return this.verify(this, this.elem, fn, args.length, false);
	},
	
	on: function(){
		var args = arguments,
			fn = function(el){
				el.addEventListener(args[0], args[1], false);
			};
		return this.verify(this, this.elem, fn, args.length, false);
	},

	prop: function(){
		var args = arguments,
			fn = function(el){
				return args[1] ? el.setAttribute(args[0], args[1]) : el.getAttribute(args[0]);
			};
		return this.verify(this, this.elem, fn, args.length, true);	
	},

	serialize: function(){
		var args = arguments, query = [],
			fn = function(el){
				[].forEach.call(el.elements, function(elem){
					if (elem.value.length) query.push(elem.name + "=" + elem.value);
				});
				return query.join("&");
			};
		return this.verify(this, this.elem, fn, args.length, false);	
	}
};

/////////////////////////////////////////// DOM ///////////////////////////////////////////

//Método para ejecutar la función pasada como parámetro cuando haya cargado el DOM
$.ready = function(fn){
	document.addEventListener("DOMContentLoaded", fn, false);
};

/////////////////////////////////////////// AJAX ///////////////////////////////////////////

$.ajax = function(obj){
	if (!(this instanceof $.ajax)) return new $.ajax(obj);
	var self = this;
	this.xhr = new XMLHttpRequest();
	this.url = obj.url;
	this.data = obj.data || null;
	this.type = obj.type ? obj.type.toUpperCase() : "GET";
	this.async = obj.async || true;
	this.dataType = obj.dataType ? obj.dataType.toUpperCase() : "HTML";
	this.header = obj.header || "application/x-www-form-urlencoded";
	this.response = null;
	if (this.type == "GET"){
		if (typeof this.data == "string"){
			this.url += "?" + this.data;				
		}
		else if (typeof this.data == "object"){
			aux = [];
			for (var prop in this.data){
				aux.push(prop + "=" + this.data[prop]);
			}
			this.url += "?" + aux.join("&");
		}			
		this.data = null;
	}
	else{
		if (typeof this.data == "object"){
			aux = [];
			for (var prop in this.data){
				aux.push(prop + "=" + this.data[prop]);
			}
			this.data = aux.join("&");
		}
	}
	this.promise = new Promise(function(resolve, reject){
		self.xhr.open(self.type, self.url, self.async);
		self.xhr.setRequestHeader("Content-Type", self.header);
		self.xhr.addEventListener("load", function(){
			if (self.xhr.status == 200){
				switch (self.xhr){
					case "JSON":
						self.response = JSON.parse(self.xhr.responseText);
						break;
					case "XML":
						self.response = self.xhr.responseXML;
						break;
					case "HTML": default:
						self.response = self.xhr.responseText;
						break;						
				}
				resolve(self.response);
			}
			else{
				self.response = "Has ocurred an error: " + self.xhr.statusText;
				reject(self.response);
			}
		}, false);
		self.xhr.send(self.data);
	});

	return this;	
};

//Prototipo del método Ajax
$.ajax.prototype = {
	done: function(fn){
		this.promise.then(function(response){
			fn(response);
		});
		return this;
	},

	fail: function(fn){
		this.promise.catch(function(error){
			fn(error);
		});
		return this;
	}
};

/////////////////////////////////////////// ARRAYS ///////////////////////////////////////////

$.primero = function(array){
    return Array.isArray(array) ? array[0] : false;
};

$.ultimo = function(array){
    return Array.isArray(array) ? array[array.length - 1] : false;
};

$.agregar = function(){
    var array = [].slice.call(arguments)[0];
    return [].reduce.call(arguments, function(previo, actual){
        if (typeof actual !== "object"){
            return array.push(actual);
        }
        return array.concat(actual);
    });
};

$.quitar = function(array, viejos, nuevos){  
    if (Array.isArray(array)){
    	var pos;

        if (viejos){
            if (typeof viejos !== "object"){
                pos = array.indexOf(viejos);
                if (pos > -1){
                    array.splice(pos, 1);
                }
            }
            else{
                for (var i in viejos){
                	pos = array.indexOf(viejos[i]);
                    if (pos > -1){
                        array.splice(pos, 1);
                    }
                }
            }
        }

        if (nuevos){
            if (typeof nuevos !== "object"){
                array.push(nuevos);
            }
            else{
                for (var i in nuevos){
                    array.push(nuevos[i]);
                }
            }
        }
                    
        return array;
    }
    return false;
};

$.quitarPrimero = function(array){
    if (Array.isArray(array)){
        array.shift();
        return array;
    }
    return false;
};

$.quitarUltimo = function(array){
    if (Array.isArray(array)){
        array.pop()
        return array;
    }
    return false;
};

$.copiar = function(array, inicial, final){
    if (Array.isArray(array)){
        var i = array.indexOf(inicial),
            f = array.indexOf(final);

        if (i > -1 && f > -1){
            return array.slice(array.indexOf(inicial), array.indexOf(final) + 1);
        }
        else if (i > -1 && f == -1 || !final || arguments.length == 2){
            return array.slice(array.indexOf(inicial));
        }
        else{
            return array.slice();
        }
    }
    return false;
};

$.ordenarAsc = function(array, precision){
    return Array.isArray(array) ? array.sort(precision ? function(a, b){
    	return a - b;
    } : null) : false;
};

$.ordenarDesc = function(array){
    if (Array.isArray(array))
        return array.sort(function(a, b){
            return b - a;
        });
    return false
};

$.juntar = function(array, union){
    if (Array.isArray(array)){
        return union ? array.join(union) : array.join();
    }
    return false;
};

$.separar = function(array, union){
	if (Array.isArray(array)){
    	return union ? array.split(union) : array;
    }
    return false;
};

$.combinar = function(){
    return [].reduce.call(arguments, function(previo, actual){
        return previo.concat(actual);
    });
};

$.rango = function(inicio, fin, pasos){
    $.rango.array = $.rango.array || [];
        
    if (typeof inicio !== typeof fin){
        inicio = !isNaN(Number(inicio)) && isFinite(Number(inicio)) ? Number(inicio) : 0;
        fin = !isNaN(Number(fin)) && isFinite(Number(fin)) ? Number(fin) : 0;
    }

    if (typeof inicio === "string"){
        inicio = !isNaN(Number(inicio)) && isFinite(Number(inicio)) ? Number(inicio) : inicio[0].toLowerCase();
    }
    if (typeof fin === "string"){
        fin = !isNaN(Number(fin)) && isFinite(Number(fin)) ? Number(fin) : fin[0].toLowerCase();
    }

    $.rango.array.push(inicio);

    if (!isNaN(pasos) && isFinite(pasos)){
        pasos = inicio > fin ? 
                Number(pasos > 0 ? -pasos || -1 : pasos || -1) : 
                Number(pasos < 0 ? -pasos || 1 : pasos || 1);
    }
    else{
        pasos = inicio > fin ? -1 : 1;
    }

    inicio = typeof inicio === "string" ? 
             String.fromCharCode(inicio.charCodeAt(0) + pasos) : 
             inicio += pasos;

    return (pasos > 0 && inicio <= fin) || (pasos < 0 && inicio >= fin) ? 
            this.rango(inicio, fin, pasos) : (function(){
                var aux = $.rango.array;
                $.rango.array = [];
                return aux;
            })();
};

$.partir = function(array, partes){
    if (Array.isArray(array)){
        for (var i = 0, l = array.length, nuevo = []; i < l; nuevo.push(array.slice(i, i += (partes || 1))));
        return nuevo;
    }
    return false;
};

$.unico = function(array){
    if (Array.isArray(array)){
        return array.filter(function(valor, indice, self){
        	return self.indexOf(valor) == indice;
        });
    }
    return false;
};

$.enArray = function(dato, array, estricto){
    var respuesta = false;
  
    estricto = estricto || false;
  
    if (Array.isArray(array)){
        if (estricto){
            if (array.indexOf(dato) > -1) respuesta = true;
        }
        else{
            for (var i = 0, total = array.length; i < total; i++){
                if (dato == array[i]){
                    respuesta = true;
                    break;
                }
            }
        }
    }
  
    return respuesta;
};

$.barajar = function(array){
    if (Array.isArray(array)){
        for (var i = 0, total = array.length, aleatorio, aux; i < total; i++){
            aleatorio = Math.floor(Math.random() * total);
            aux = array[i];
            array[i] = array[aleatorio];
            array[aleatorio] = aux;
        }
    }
    return array;
};

$.filtrar = function(array, funcion){
    var aux = [] || new Array();
    for (var i = 0, total = array.length; i < total; i++)
        if (funcion){
            if (funcion(array[i])) aux[i] = array[i];
        }
        else if (array[i]) aux[i] = array[i];
    return aux;
};

/////////////////////////////////////////// CADENAS ///////////////////////////////////////////

$.contarPalabras = function(){
    var args = [].slice.call(arguments),
        cadena = args[0].trim() || null,
        formato = args[1] || 0,
        listaCaracteres = args[2] || null,
        palabras = "[^a-z'",
        regexp = listaCaracteres ? 
                 new RegExp(palabras + listaCaracteres + "]+", "gi") : 
                 new RegExp(palabras + "]+", "gi"),
        array = cadena.replace(regexp, " ").trim().split(" "),
        respuesta = false;
    
    if (cadena && typeof cadena === "string"){
        switch (formato){
            case 1:
                respuesta = array;
                break;
            
            case 2:
                respuesta = {};
                for (var i = 0, l = array.length; i < l; respuesta[args[0].indexOf(array[i])] = array[i], i++);
                break;
            
            default:
                respuesta = array.length;
                break;
        }
    }
  
    return respuesta;
};
