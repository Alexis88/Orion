/**
 *	OrionJS
 *
 *	@author		Alexis López Espinoza
 *	@version	3.0
 *	@param		string|HTMLDOMElement	identi
 *	@this		object					La función OrionJS
 *	@return		object					El/los elemento/s bajo el contexto de la función OrionJS
 */

"use strict";

var OrionJS = function(identi){
	if (!(this instanceof $)) return new $(identi);
	this.elem = typeof identi == "string" ? 
		(/<.*>/g.test(identi) ? 
			(function(){
				var last = document.body.lastChild,
					pos = [].indexOf.call(document.body.childNodes, last),
					part = [];
				document.body.insertAdjacentHTML("beforeend", identi);
				for (var i = pos + 1, nodes = document.body.childNodes, l = nodes.length; i < l; part.push(nodes[i]), i++);
				return part;
			})() : 
			document.querySelectorAll(identi)) 
		: identi;
	return this;
}, $ = OrionJS;

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
				$("#foo").css(); //'f' devuelve el conjunto de estilos computados y no permite encadenar
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
			//Array de elementos o lista de nodos
			if (/(NodeList|Array)/.test({}.toString.call(e))){
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
			//Un elemento
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
	            else{
	            	return window.getComputedStyle(el);
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
	},

	adherir: function(){
		var args = arguments,
			fn = function(el){
				for (var i in args){
					if (typeof args[i] == "object"){
						el.appendChild(args[i]);
					}
					else{
						el.insertAdjacentHTML("beforeend", args[i]);	
					}
				}
			};
		return this.verify(this, this.elem, fn, args.length, false);
	},

	clonar: function(){
		var args = arguments,
			fn = function(el){
				return arguments[0] === true ? el.cloneNode(true) : el.cloneNode();
			};
		return this.verify(this, this.elem, fn, args.length, false);
	},

	efecto: function(){
		var args = arguments, props = [], self = this, response, 
			easing = args.length > 2 && typeof args[2] == "string" ? args[2] : "ease",
			callback = (function(){
				switch (args.length){
					case 3:
						response = typeof args[2] == "function" ? args[2] : null;
						break;
					case 4:
						response = typeof args[3] == "function" ? args[3] : null;
						break;
					default:
						response = null;
						break;
				}
				return response;
			})(), transitionProps,
			fn = function(el){
				el.style.transitionProperty = props.join(", ");
				el.style.transitionDuration = (args[1] / 1000) + "s";
				el.style.timingFunction = easing;
				for (var i in args[0]){
					transitionProps = getComputedStyle(el).transitionProperty;
					if ([].indexOf.call(transitionProps, args[0][i]) < 0){
						el.style[i] = args[0][i];
						props.push(i);
					}
				}				
			};

			if (callback){
				setTimeout(function(){
					callback.call(self.elem);
				}, args[1]);
			}
		return this.verify(this, this.elem, fn, args.length, false);
	},

	enfocado: function(){
		var args = arguments,
			fn = function(el){
				el.addEventListener("focus", args[0], false);
			};
		return this.verify(this, this.elem, fn, args.length, false);
	},

	desenfocado: function(){
		var args = arguments,
			fn = function(el){
				el.addEventListener("blur", args[0], false);
			};
		return this.verify(this, this.elem, fn, args.length, false);	
	},

	enfocar: function(){
		var args = arguments,
			fn = function(el){
				el.focus();
			};
		return this.verify(this, this.elem, fn, args.length, false);	
	},

	desenfocar: function(){
		var args = arguments,
			fn = function(el){
				el.blur();
			};
		return this.verify(this, this.elem, fn, args.length, false);	
	},

	mostrar: function(){
		var args = arguments, tiempo,
			fn = function(el){
				if (typeof args[0] === "string" && (isNaN(+args[0]) && !isFinite(+args[0]))){
					switch (args[0]){
						case "rapido":
							tiempo = 150;
							break;

						case "normal":
							tiempo = 500;
							break;

						case "lento":
							tiempo = 750;
							break;
					}					
				}
				else if ((typeof args[0] === "string" && (!isNaN(+args[0]) && isFinite(+args[0]))) || typeof args[0] === "number"){
					tiempo = parseInt(args[0]);
				}
				else{
					tiempo = 400;
				}

				if (!el.offsetHeight || !getComputedStyle(el).opacity){
					el.style.display = el.dataset.display || "block";
					$(el).efecto({
						opacity: 1,
						height: el.dataset.height || "auto"
					}, tiempo, function(){
						if (args[1] && typeof args[1] === "function") args[1].call(el);
						if (typeof args[0] === "function") args[0].call(el);
					});
				}
			};
		return this.verify(this, this.elem, fn, args.length, false);
	},

	ocultar: function(){
		var args = arguments, tiempo, 
			fn = function(el){
				if (typeof args[0] === "string" && (isNaN(+args[0]) && !isFinite(+args[0]))){
					switch (args[0]){
						case "rapido":
							tiempo = 150;
							break;

						case "normal":
							tiempo = 500;
							break;

						case "lento":
							tiempo = 750;
							break;
					}					
				}
				else if ((typeof args[0] === "string" && (!isNaN(+args[0]) && isFinite(+args[0]))) || typeof args[0] === "number"){
					tiempo = parseInt(args[0]);
				}
				else{
					tiempo = 400;
				}

				if (el.offsetHeight || +getComputedStyle(el).opacity){
					if (!el.getAttribute("data-height")){
						el.setAttribute("data-height", el.offsetHeight + "px");
						el.setAttribute("data-display", getComputedStyle(el).display);
					}

					$(el).efecto({
						opacity: 0,
						height: 0,
					}, tiempo, function(){
						el.style.display = "none";
						if (args[1] && typeof args[1] === "function") args[1].call(el);
						if (typeof args[0] === "function") args[0].call(el);
					});
				}
			};
		return this.verify(this, this.elem, fn, args.length, false);
	},

	padre: function(){
		var args = arguments,
			fn = function(el){
				return el.parentNode;
			};
		return this.verify(this, this.elem, fn, args.length, true);	
	},

	padres: function(){
		var args = arguments, ancestros = [], objetivo = [], 
			fn = function(el){
				objetivo = args.length ? 
						   document.querySelectorAll(args[0]) : 
						   document.querySelectorAll("*");				
	            for (var i = el.parentNode; i != document; i = i.parentNode){
	                if ([].indexOf.call(objetivo, i) > -1){ 
	                	ancestros.push(i);
	                }
	            }
	            return ancestros.length > 1 ? ancestros : ancestros[0];
			};
		return this.verify(this, this.elem, fn, args.length, true);
	},

	sigue: function(){
		var args = arguments,
			fn = function(el){
				el.addEventListener("keypress", function(event){
					if (event.keyCode == 13){
						event.preventDefault();
					    if (!this.nextElementSibling || this.nextElementSibling.constructor != this.constructor){
					    	if ($(this).padres("form")){
			                	$(this).padres("form").elements[0].focus();
					    	}
					    }
			            else{
			                this.nextElementSibling.focus();
			            }
			        }
			    }, false);
			};
		return this.verify(this, this.elem, fn, args.length, false);	
	},
};

///////////////////////////////////////////// DOM /////////////////////////////////////////////

//Método para ejecutar la función pasada como parámetro cuando haya cargado el DOM
$.ready = function(fn){
	document.addEventListener("DOMContentLoaded", fn, false);
};

///////////////////////////////////// MÓDULO DE EXTENSIÓN /////////////////////////////////////

$.extender = function(params){
	for (var i in params){
		$.prototype[i] = params[i];
	}
}

///////////////////////////////////////////// AJAX /////////////////////////////////////////////

$.ajax = function(obj){
	if (!(this instanceof $.ajax)) return new $.ajax(obj);
	var self = this, aux;
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
		else if ({}.toString.call(this.data) === "[object Object]"){
			aux = [];
			for (var prop in this.data){
				aux.push(prop + "=" + this.data[prop]);
			}
			this.url += "?" + aux.join("&");
		}			
		this.data = null;
	}
	else{
		if ({}.toString.call(this.data) === "[object Object]"){
			aux = [];
			for (var prop in this.data){
				aux.push(prop + "=" + this.data[prop]);
			}
			this.data = aux.join("&");
		}
	}

	if (window.Promise){
		this.promise = new Promise(function(resolve, reject){
			self.cross(resolve, reject);
		});	
	}
	else{
		self.cross();
	}	

	return this;	
};

//Prototipo del método Ajax
$.ajax.prototype = {
	done: function(fn){
		if (window.Promise){
			this.promise.then(function(response){
				fn(response);
			});	
		}
		else{
			var self = this;
			this.xhr.addEventListener("load", function(){
				if (this.status == 200){
					switch (self.dataType){
						case "JSON":
							self.response = JSON.parse(this.responseText);
							break;
						case "XML":
							self.response = this.responseXML;
							break;
						case "HTML": default:
							self.response = this.responseText;
							break;						
					}
				}
				else{
					self.response = this.statusText;					
				}
				fn(self.response);
			}, false);
		}
		return this;
	},

	fail: function(fn){
		var self = this;
		if (window.Promise){
			this.promise.catch(function(error){
				fn(error);
			});
		}
		else{
			this.xhr.addEventListener("error", function(){
				self.response = this.statusText;
				fn(self.response);	
			}, false);
		}
		return this;
	},

	cross: function(resolve, reject){
		var self = this;
		self.xhr.open(self.type, self.url, self.async);
		self.xhr.setRequestHeader("Content-Type", self.header);
		self.xhr.addEventListener("load", function(){
			if (this.status == 200){
				switch (self.dataType){
					case "JSON":
						self.response = JSON.parse(this.responseText);
						break;
					case "XML":
						self.response = this.responseXML;
						break;
					case "HTML": default:
						self.response = this.responseText;
						break;						
				}
				if (window.Promise) resolve(self.response);
			}
			else{
				self.response = "An error has occurred: " + this.statusText;
				if (window.Promise) reject(self.response);
			}
		}, false);
		self.xhr.addEventListener("error", function(){
			self.response = "Has ocurred an error: " + this.statusText;
			if (window.Promise) reject(self.response);
		}, false);
		self.xhr.send(self.data);
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

$.impArray = function(array, out, cont){
	var s = "<br />", j = 0, type = {}.toString.call(array), 
        aux = array ? array.length || Object.keys(array).length : 0;

    cont = cont || 0;
    type = type.split(" ")[1].substr(0, type.split(" ")[1].length - 1);

	if (!cont){
		out = "innerHTML" in out ? $(out) : out;
		out.val(type + s + tab(cont) + "(" + s);
	}

    for (var i in array){
    	type = {}.toString.call(array[i]);
        type = type.split(" ")[1].substr(0, type.split(" ")[1].length - 1);
		if (/Object|Array/.test(type)){
			out.val(out.val() + tab(cont + 1) + "[" + i + "] => " + type + s + tab(cont + 1) + "(" + s);
			$.impArray(array[i], out, cont + 1);
			if (j++ == aux - 1){
				out.val(out.val() + tab(cont) + ")" + s);
			}
		}
        else{
			out.val(out.val() + tab(cont + 1) + "[" + i + "] => " + array[i] + s);
			if (j++ == aux - 1){
				out.val(out.val() + tab(cont) + ")" + s);
			}
		}
	}

	if (!aux){
		out.val(out.val() + tab(cont) + ")" + s);
	}

	function tab(n){
		for (var j = 0, f = "", t = "&emsp;&emsp;"; j < n; f += t, j++);
		return f;
	}
}

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
