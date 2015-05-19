/**
 * Orion Library
 * 
 * @author  Alexis López Espinoza
 * @version 3.0 (under construction)
 */

var $ = function(identi){
	if (!(this instanceof $)) return new $(identi);
	this.elem = typeof identi == "string" ? document.querySelectorAll(identi) : identi;
	return this;
};

$.prototype = {
	verify: function(t, e, f, a, p){
		if (e){
			if (/NodeList/.test({}.toString.call(e))){
				if (e.length === 1){
					if ((a === 1 && p) || !a){
						return f(e[0]);
					}
					else{
						f(e[0]);
						return t;
					}
				}
				else{
					[].forEach.call(e, f);
				}
			}
			else{
				if ((a === 1 && p) || !a){
					return f(e);
				}
				else{
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
							computed = getComputedStyle(el)[args[0]];
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
	}
};
