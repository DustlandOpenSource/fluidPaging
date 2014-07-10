(function($){
	/**
	 * Given a list of paging buttons (<li><button></li>)
	 * Show hide the buttons based on the screen size and page position
	 *
	 *Alternative - pass in the number of pages and give the active index
	 *
	 */
	$.fn.fluidPaging = function(options){

		//make into settings object
		var	paging = function(el){
				this.$el = null;
				this.$children = null;

				this.init(el);
			},
			settings = $.extend(true, {
				nextArrowClass: 'pagination-next',
				prevArrowClass: 'pagination-prev',
				arrowTemplate: function(type){
					if(type === 'prev'){
						return '<li class="' + settings.prevArrowClass +'"><button type="button">&lt;</button></li>';
					} else{
						return '<li class="' + settings.nextArrowClass +'"><button type="button">&gt;</button></li>';
					}
				},
				activeClass: 'active',
				dotClass: 'dots',
				dotTemplate: function(width){
					return '<li style="width: '+ width +'px" class="'+ settings.dotClass +'">...</li>';
				},
				fitContainer: true, //distribute the remaining px among the visible page elements
				generatePages: false, //generate the paging buttons
				activePageNumber: 0, //only used if generatePages is true. The active page number (0 index)
				generateArrows: true, //only used if generatePages is true. Generate the previous and next arrows.
				numPages: 0, //only used if generatePages is true
				pageTemplate: function(pageNumber){
					return '<li><button type="button" title="page '+ (pageNumber + 1) +' ">' + (pageNumber + 1) + '</button></li>'
				},
				onPageChange: function(e, el, pageNumber){
				}
			}, options);

		paging.prototype = {
			containerWidth: 0,
			arrowsWidth: 0,
			childrenWidth: 0,
			curNextIndex: 0,
			curPrevIndex: 0,
			nextArrow: [],
			prevArrow: [],
			areHiddenChildren: false,
			widthMap: {},
			timer: null,
			activeIndex: 0,
			remainder: 0,
			init: function(el){
				var self = this;

				self.$el = $(el);

				if(settings.generatePages){
					self.createPages();
				}

				self.$children = self.$el.children(':not(.'+ settings.nextArrowClass +',.'+ settings.prevArrowClass +')');
				window.child = self.$children;

				self.prevArrow = self.$el.children('.' + settings.prevArrowClass);
				self.nextArrow = self.$el.children('.' + settings.nextArrowClass);

				//using find as the active class may be on child elements
				self.activeIndex = self.$children.filter('.' + settings.activeClass).index() - self.$el.children('.' + settings.prevArrowClass).length;

				self.setOnPageClick()
					.setActivePage();

				//on resize reset the paging
				$(window).on('resize', function() {
					self.setPaging();
				});
			},
			setPaging: function(){
				var self = this;
				clearTimeout(self.timer);
				self.timer = setTimeout(function(){
					self.render();
				}, 100);
			},
			/**
			 * When clicking the page lis change to the given page
			 */
			setOnPageClick: function(){
				var self = this;
				self.$children.on('click', function(e){
					//assume that the only text in the element is the page number
					settings.activePageNumber = parseInt($(this).text());
					self.setActivePage();
					settings.onPageChange(e, this, settings.activePageNumber);
				});
				return self;
			},
			/**
			 * Determine how wide our container is
			 * if we need a next symbol or previous symbol
			 * if we need an etc symbol or not
			 * @return {void}
			 */
			render: function(){
				var self = this;
				self.$el.children('.' + settings.dotClass).remove();
				self.$el.children().removeAttr('style').show();

				self.setArrowsWidth()
					.setContainerWidth()
					.setChildrenWidth()
					.setButtonsVisible()
					.distributeRemainder()
					.renderDots()
					.setArrowsOnClick();
			},
			setActivePage: function(){
				if(settings.generatePages){
					this.$el.find('.' + settings.activeClass).removeClass(settings.activeClass);
					this.$children.eq(settings.activePageNumber - 1).addClass(settings.activeClass);
				}

				this.render();

				return this;
			},
			setButtonsVisible: function(){
				//start with the active index and go to the left and right one
				var self = this,
					widthLeft = self.containerWidth - self.arrowsWidth,
					childrenLen = self.$children.length - 1;

				self.curPrevIndex = 0;
				self.curNextIndex = 0;
				self.areHiddenChildren = widthLeft < self.childrenWidth;

				if(self.areHiddenChildren){
					//remove the width of the active index button as it should always be shown
					widthLeft -= self.widthMap[self.activeIndex];

					while(widthLeft > 0){
						var nextIndex = self.curNextIndex + 1,
							prevIndex = self.curPrevIndex + 1;

						if(nextIndex + self.activeIndex <= childrenLen){
							if(widthLeft - self.widthMap[self.activeIndex + nextIndex] >= 0){
								widthLeft -= self.widthMap[self.activeIndex + (self.curNextIndex = nextIndex)];
							} else {
								self.remainder = widthLeft;
								widthLeft = 0;
								break;
							}
						}

						if(self.activeIndex - prevIndex >= 0){
							if(widthLeft - self.widthMap[self.activeIndex - prevIndex] >= 0){
								widthLeft -= self.widthMap[self.activeIndex - (self.curPrevIndex = prevIndex)];
							} else {
								self.remainder = widthLeft;
								widthLeft = 0;
							}
						}
					}

					//hide everything from the 0 to curPrevIndex (assuming curPrev > 0)
					if(self.activeIndex - self.curPrevIndex > 0){
						//also want to add in the dots and set the width of the dots equal to the item removed
						self.$children.slice(0, self.activeIndex - self.curPrevIndex).hide();
					}

					if(self.activeIndex + self.curNextIndex < childrenLen){
						self.$children.slice(self.activeIndex + self.curNextIndex + 1).hide();
					}
				} else {
					self.remainder = widthLeft - self.childrenWidth;
				}

				return this;
			},
			/**
			 * Distribute the remainder of the space between the page arrows
			 * @return {[type]} [description]
			 */
			distributeRemainder: function(){
				if(settings.fitContainer && this.remainder > 0){
					//distribute the remainder over all of the visible elements
					var $visibleChildren = this.$el.children(':visible'),
						len = $visibleChildren.length, //number of visible children
						widthToAdd = Math.floor(this.remainder/len),
						mod = this.remainder % len;

					for(var i = len - 1; i >= 0; i--){
						var toAdd = widthToAdd;
						if(mod > 0){
							toAdd++;
							mod--;
						}

						$visibleChildren.eq(i).width($visibleChildren.eq(i).width() + toAdd);
					}
				}

				return this;
			},
			/**
			 * Return whichever outerwidth is greater
			 * @return {[type]} [description]
			 */
			elementWidth: function(el){
				if(!$(el).is(':visible')){ return 0; }

				var ow = $(el).outerWidth(),
					owT = $(el).outerWidth(true);

				return ow >= owT ? ow : owT;
			},
			setContainerWidth: function(){
				this.containerWidth = this.$el.width();

				return this;
			},
			setArrowsWidth: function(){
				this.arrowsWidth = 0;

				if(this.nextArrow.length){
					(settings.generatePages && settings.activePageNumber == settings.numPages) ? this.nextArrow.hide() : this.nextArrow.show();
					this.arrowsWidth += this.elementWidth(this.nextArrow);
				}

				if(this.prevArrow.length){
					(settings.generatePages && settings.activePageNumber === 1) ? this.prevArrow.hide() : this.prevArrow.show();
					this.arrowsWidth += this.elementWidth(this.prevArrow);
				}

				return this;
			},
			setChildrenWidth: function(){
				var self = this;
				self.childrenWidth = 0;
				self.widthMap = {};

				for(var i = 0; i < self.$children.length; i++){
					self.childrenWidth += (self.widthMap[i] = self.elementWidth(self.$children[i]));
				}

				return this;
			},
			renderDots: function(){
				if(this.areHiddenChildren){
					// if the next index is less than the length of the dots then replace the next index content with dots
					if(this.curNextIndex < this.$children.length -1){
						this.addDot(this.activeIndex + this.curNextIndex);
					}

					if(this.activeIndex - this.curPrevIndex > 0){
						this.addDot(this.activeIndex - this.curPrevIndex);
					}
				}

				return this;
			},
			addDot: function(index){
				this.$children.eq(index).hide().after(settings.dotTemplate(this.$children.eq(index).width()));
			},
			createPages: function(){
				var pages = [];

				if(settings.generateArrows && settings.activePageNumber > 1){
					pages.push(settings.arrowTemplate('prev'));
				}

				for(var i = 0; i < settings.numPages; i++){
					pages.push(settings.pageTemplate(i));
				}

				if(settings.generateArrows){
					pages.push(settings.arrowTemplate('next'));
				}

				this.$el.html(pages.join(''));

				return this;
			},
			setArrowsOnClick: function(){
				var self = this;

				$('.' + settings.nextArrowClass).on('click', function(e){
					settings.activePageNumber += 1;
					self.setActivePage();
					settings.onPageChange(e, this, settings.activePageNumber);
				});

				$('.' + settings.prevArrowClass).on('click', function(e){
					settings.activePageNumber -= 1;
					self.setActivePage();
					settings.onPageChange(e, this, settings.activePageNumber);
				});

				return self;
			}
		};

		return this.each(function(){
			var o = new paging(this);
		});
	};
})(jQuery);