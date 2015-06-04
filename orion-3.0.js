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

//STATIC METHODS

//Ajax
$.ajax = function(obj){
	if (!(this instanceof $.ajax)) return new $.ajax(obj);
	self = this;
	this.xhr = new XMLHttpRequest();
	this.url = obj.url;
	this.data = obj.data || null;
	this.type = obj.type || "GET";
	this.async = obj.async || true;
	this.dataType = obj.dataType ? obj.dataType.toUpperCase() : "HTML";
	this.header = obj.header || "application/x-www-form-urlencoded";
	this.response = null;
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
	},

	prepare: function(){
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
	}
};

//Método para ejecutar la función pasada como parámetro cuando haya cargado el DOM
$.ready = function(fn){
	document.addEventListener("DOMContentLoaded", fn, false);
};
