(function($) {
	$.fn.roller = function(options) {
		var o = $.extend({
			speed: 300,
			delay: 2000,
			item: 5,
			indicator: false,
			isAuto: true
		}, options || {});
		return this.each(function() {
			var $t = $(this),
				prev = $t.find('.prev'),
				next = $t.find('.next'),
				$wrapper = $t.find('.wrapper'),
				$roller = $wrapper.children(),
				$item = $roller.children(),
				len = $item.length,
				iWidth = $item.outerWidth(true),
				wWidth = iWidth * o.item,
				rWidth = iWidth * len,
				sWidth = iWidth * (len % o.item),
				minLeft = -(rWidth - wWidth);
			var isRolling = false,
				isNextRolling = true,
				DISABLED = 'disabled',
				ul = $('<ul>'),
				li,
				play,
				resized;

			$wrapper.width(wWidth);
			$roller.width(rWidth);

			if(o.indicator && len > 1) {
				for(var i = 0; i < len; i++) {
					li = $('<li>').appendTo(ul);
					if(i == 0) {
						li.addClass('chose');
					}
				}
				ul = ul.appendTo($t);
			}

			if(rWidth <= wWidth) {
				prev.addClass(DISABLED);
				next.addClass(DISABLED);
			}

			function roll(ra) {
				if(!isRolling) {
					var mLeft = parseInt($roller.css('margin-left'), 10);
					if(ra === 'prev') {
						var aniWidth = (-mLeft >= wWidth) ? wWidth : sWidth;
						if(mLeft < 0) {
							isRolling = true;
							if(next.hasClass(DISABLED)) {
								next.removeClass(DISABLED);
							}
							$roller.animate({'margin-left': mLeft + aniWidth}, o.speed, function() {
								isNextRolling = false;
								var ml = parseInt($roller.css('margin-left'), 10);
								if(o.indicator && len > 1) {
									ul.children('li').eq(Math.abs(ml/iWidth)).addClass('chose').siblings().removeClass('chose');
								}
								if(ml === 0) {
									prev.addClass(DISABLED);
									isNextRolling = true;
								}
								isRolling = false;
							});
						}
					}else if(ra === 'next') {
						var aniWidth = (mLeft - minLeft >= wWidth) ? wWidth : sWidth;
						if(mLeft > minLeft) {
							isRolling = true;
							if(prev.hasClass(DISABLED)) {
								prev.removeClass(DISABLED);
							}
							$roller.animate({'margin-left': mLeft - aniWidth}, o.speed, function() {
								isNextRolling = true;
								var ml = parseInt($roller.css('margin-left'), 10);
								if(o.indicator && len > 1) {
									ul.children('li').eq(Math.abs(ml/iWidth)).addClass('chose').siblings().removeClass('chose');
								}
								if(ml <= minLeft) {
									next.addClass(DISABLED);
									isNextRolling = false;
								}
								isRolling = false;
							});
						}
					}
				}
			}

			prev.bind({
				'click': function() {
					roll('prev');
					return false;
				}
			});
			next.bind({
				'click': function() {
					roll('next');
					return false;
				}
			});

			function reizeAd() {
				clearInterval(play);
				iWidth = $item.outerWidth(true);
				wWidth = iWidth * o.item;
				rWidth = iWidth * len;
				sWidth = iWidth * (len % o.item);
				minLeft = -(rWidth - wWidth);
				$wrapper.width(wWidth);
				$roller.width(rWidth);
				$roller.css('margin-left', 0);
				ul.find('li').eq(0).addClass('chose').siblings().removeClass('chose');
				isRolling = false;
				isNextRolling = true;
				play = setInterval(autoRoll, o.delay);
			}

			reizeAd();

			$(window).bind('resize', function() {
				clearTimeout(resized);
				resized = setTimeout(function() {
					reizeAd();
				}, 10);
			});

			$t.bind('mousedown', function() {
				clearInterval(play);
			}).bind('mouseup', function() {
				play = setInterval(autoRoll, o.delay);
			}).bind('touchstart', function() {
				clearInterval(play);
			}).bind('touchend', function() {
				play = setInterval(autoRoll, o.delay);
			});

			// $(window).bind('touchstart', function() {
			// 	clearTimeout(resized);
			// });

			// $(window).bind('touchend', function() {
			// 	resized = setTimeout(function() {
			// 		reizeAd();
			// 	}, 10);
			// });

			function autoRoll() {
				if(!isRolling) {
					(isNextRolling) ? next.click() : prev.click();
				}
			}
			if(o.isAuto) {
				clearInterval(play);
				play = setInterval(autoRoll, o.delay);
			}
		});
	};
})(jQuery);