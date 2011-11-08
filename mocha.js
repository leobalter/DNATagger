jQuery(function($) {
	initialize();
	var viewtabs = $('.viewtabs');
	var menutabs = $('#menu a');
	menutabs.on('click', function(ev) {
		ev.preventDefault();
		var self = $(this);
		var href = self.attr('href');
		var elem = $(href);
		viewtabs.hide();
		menutabs.removeClass('here');
		elem.show();
		self.addClass('here');

		if (href.indexOf('view') > 0) {
			var src = document.getElementById("alignEdit");
            var dest = document.getElementById("viewOutput");
            dest.innerHTML = colorizer.process(src.value);
		}
	});
});