/*
 * hexson
 */

;
(function(w){
	'use strict';


	function Hoslider(elem, config){
		if (!(this instanceof Hoslider)) return new Hoslider(elem, config);
		
		var defaults = {
			direction: 'horizontal',
			partition: 0,
			duration: 300,
			loop: false,
			touchEndCallback: function(){},
			endCallback: function(){}
		};
		config = config || {};
		var extendConfig = {};
		for (var con in config){
			extendConfig[con] = config[con]
		}
		for (var def in defaults){
			if (typeof config[def] === 'undefined'){
				extendConfig[def] = defaults[def]
			}
		}
		var h = this;
		h.extendConfig = extendConfig;
		var slider = {
			touch: ('ontouchstart' in w) || w.DocumentTouch && document instanceof DocumentTouch,
			elem: document.getElementById(elem),
			events: {
				elem: document.getElementById(elem),
				handleEvent: function(event){
					var self = this;
					if (event.type == 'touchstart'){
						self.start(event);
					}else if (event.type == 'touchmove'){
						self.move(event);
					}else if (event.type == 'touchend'){
						self.end(event);
					}
				},
				start: function(event){
					var touch = event.targetTouches[0];
					this.startOb = {
						x: touch.pageX,
						y: touch.pageY,
						t: +new Date,
						s: 0
					};
					this.elem.addEventListener('touchmove', this, false);
					this.elem.addEventListener('touchend', this, false);
				},
				move: function(event){
					if (event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
					var touch = event.targetTouches[0];
					this.endOb = {
						x: touch.pageX - this.startOb.x,
						y: touch.pageY - this.startOb.y
					};
					// 0: horizontal, 1: vertical
					this.startOb.s = Math.abs(this.endOb.x) < Math.abs(this.endOb.y) ? 1 : 0;
					if (this.startOb.s === 0){
						event.preventDefault();
						this.elem.style.transitionDuration = '0ms';
						var x = slider.X + this.endOb.x;
						if (slider.X== 0&&this.endOb.x> 0){
							x -= this.endOb.x*0.95;
							x = Math.abs(x) >= parseInt(slider.iW[0]/2) ? parseInt(slider.iW[0]/2)-1 : x;
						}
						if (slider.X < 0 && x >= 0){
							x = this.endOb.x-this.endOb.x*0.95;
						}
						if (slider.totalWidth > slider.conWidth && x <= -slider.totalWidth + slider.conWidth){
							x = -slider.totalWidth + slider.conWidth + -(Math.abs(this.endOb.x)-Math.abs(this.endOb.x)*0.95);
						}
						if (slider.totalWidth <= slider.conWidth && x < 0){
							x = 0 - (Math.abs(this.endOb.x)-Math.abs(this.endOb.x)*0.95);
						}
						this.elem.style.transform = 'translate3d('+ x +'px,0,0)';
						this.endX = x;
					}
				},
				end: function(event){
					var duration = +new Date - this.startOb.t;
					var x = slider.position(this.endX);
					if (this.startOb.s === 0){
						if (parseInt(duration) > 10){
							this.elem.style.transitionDuration = h.extendConfig.duration/1000 + 's';
							if (this.endOb){
								if (slider.totalWidth > slider.conWidth && x < -slider.totalWidth + slider.conWidth){
									x = - (slider.totalWidth - slider.conWidth);
									this.elem.style.transform = 'translate3d('+ x +'px,0,0)';
									typeof h.extendConfig.endCallback === 'function' && h.extendConfig.endCallback();
								}else if (slider.totalWidth <= slider.conWidth){
									x = 0;
									this.elem.style.transform = 'translate3d('+ x +'px,0,0)';
								}else if ((slider.totalWidth - slider.conWidth - Math.abs(x) <= slider.iW[slider.iW.length-1]) && x > this.endX){
									x = - (slider.totalWidth - slider.conWidth);
									this.elem.style.transform = 'translate3d('+ x +'px,0,0)';
									typeof h.extendConfig.endCallback === 'function' && h.extendConfig.endCallback();
								}else {
									this.elem.style.transform = 'translate3d('+ x +'px,0,0)';
								}
							}
						}
					}
					slider.X = x;
					// console.log('end: '+x)
					this.elem.removeEventListener('touchmove', this, false);
					this.elem.removeEventListener('touchend', this, false);
					typeof h.extendConfig.touchEndCallback === 'function' && h.extendConfig.touchEndCallback();
				}
			},
			position: function(x){
				var e = this.iW;
				var p = h.extendConfig.partition;
				var w = [];
				var total = 0;
				x = Math.abs(x);
				for (var i= 0; i< e.length; i++){
					var d = total + e[i] + (i == e.length - 1 ? 0 : p);
					if (total < x && x <= d){
						if ((x - total) < parseInt(e[i]/2)) return -total;
						else return -d;
					}
					total += e[i] + p;
				}
				return 0;
			},
			initStyle: function(){
				this.iW = [];
				this.child = [];
				this.totalWidth = 0;
				for (var i= 0; i< this.elem.childNodes.length; i++){
					if (this.elem.childNodes[i].nodeType== 1){
						var child = this.elem.childNodes[i],
						width = child.offsetWidth;
						child.style.marginRight = h.extendConfig.partition + 'px';
						this.child.push(child);
						if (i&&(this.iW[this.iW.length-1] - width)== 1){
							width = this.iW[this.iW.length-1];
						}
						this.iW.push(width);
						child.style.width = width + 'px';
						this.totalWidth += parseInt(width);
					}
				}
				this.totalWidth = (this.totalWidth+(this.child.length-1)*parseInt(h.extendConfig.partition));
				if (this.child.length) this.child[this.child.length-1].style.marginRight = '0px';
				this.elem.style.width = this.totalWidth + 'px';
				this.elem.style.minWidth = '100%';
				h.widthArray = this.iW;
				h.totalWidth = this.totalWidth;
			},
			init: function(){
				this.X = 0;
				this.initStyle();
				this.conWidth = this.elem.parentNode.offsetWidth;

				var self = this;
				if (!!self.touch) self.elem.addEventListener('touchstart', self.events, false);
			}
		};
		// init function
		slider.init();
	}

	// to global
	w.Hoslider = Hoslider;
})(window);
// commonJs and AMD
if (typeof(module) !== 'undefined'){module.exports = window.Hoslider}
else if (typeof define === 'function' && define.amd){
	define([], function(){
		'use strict';
		return window.Hoslider;
	})
}