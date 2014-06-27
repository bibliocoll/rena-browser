/*!
 * jQuery rena.js 
 * Actions for querying the MPG.ReNa server
 *
 * Time-stamp: "2014-06-27 17:43:19 zimmel"
 * 
 * @author Daniel Zimmel <zimmel@coll.mpg.de>
 * @copyright 2014 MPI for Research on Collective Goods, Library
 * @license http://www.gnu.org/licenses/gpl.html GPL version 3 or higher
 */

$(document).ready(function() {
		
		/* quick escape to avoid JSON problems */
		function htmlEscape(str) {
				return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
		}
		
		
		/* get content from click on browse */
		function getContentFromBrowse(event, myclass) {
				event.preventDefault();
				$('#response').children().remove();
				
				$('#content-box').children().fadeOut('fast');
				$('#main-content-switcher').fadeIn('slow');
				var myID = $(myclass).attr('id').trim(); 
				
				$('#main-content .preloader').fadeIn();
				
				$.ajax({
						url: 'http://vufind-demo.mpdl.mpg.de/vufind/Search/Results?lookfor=&type=AllFields&view=jsonp&callback=fische&filter%5B%5D=inst_txtF_mv%3A%22MBRG%22&filter%5B%5D=predef_txtF_mv%3A%22MBRG%3ACollective+Goods%27+Selection%22&filter%5B%5D=subject_txtF_mv%3A%22'+myID+'%22',
						dataType: 'jsonp',
						jsonp: false,
						jsonpCallback: "fische",
						data: {'myID' : myID}
				}).done(function(returnData) {
						$('#main-content .preloader').fadeOut();
						
						$.each(returnData, function (index, value) {
								var desc = htmlEscape(value.description);
								if (!desc || desc == 'undefined') desc = "no description available!";
								$('#response').append('<a class="button radius" href="'+value.naturl_str_mv+'" title="'+desc+'">'+value.title.substr(0, 60)+'</a>').fadeIn();
						});
				})
						.fail(function() {
								$('#response').append('<div class="error">there was an error!</div>');
						});
		}

		/* get content from form submit */
		function getContentFromSearch(event) {
				event.preventDefault();
				$('#responseFromSearchBox').children('p, div.error').remove();
				var terms = $("input#terms").val();
				$('#responseFromSearchBox').foundation('reveal', 'open');				
				$('#responseFromSearchBox .preloader').fadeIn();
				
				$.ajax({
						url: 'http://vufind-demo.mpdl.mpg.de/vufind/Search/Results?lookfor='+terms+'&type=AllFields&view=jsonp&callback=searchbox',
						dataType: 'jsonp',
						jsonp: false,
						jsonpCallback: "searchbox",
						data: {'terms' : terms}
				}).done(function(returnData) {
						if (returnData.length < 5) {
								$('#responseFromSearchBox').append('<div class="error">No results!</div>');
						} else {
						$.each(returnData, function (index, value) {
								var desc = htmlEscape(value.description).replace(/##/g,'<br/>');
								if (!desc || desc == 'undefined') desc = "no description available!";
								$('#responseFromSearchBox').append('<p><a class="button radius" href="'+value.naturl_str_mv+'">'+value.title.substr(0, 60)+'</a><br/>'+desc+'</p>').fadeIn();
						});
						}
						
						$('#responseFromSearchBox .preloader').fadeOut();

				})
						.fail(function() {
								$('#responseFromSearchBox').append('<div class="error">there was an error!</div>');
						});
		}

		/* get content from click */
		$('.getContent').click(function(event) {
				getContentFromBrowse(event, this);
		});


		/* submit by button */
		$('a#submit').click(function(event) {
				getContentFromSearch(event);
		});


		/* submit by other methdod ("enter") */
		$("#searchform").submit(function(event) {
				getContentFromSearch(event);
		});

		$(document).on('click','#response a',function() {
				event.preventDefault();
				$('#responseDescription').children('span, a.goto, br').remove();
				$('#responseDescription').append('<span>'+$(this).attr('title').replace(/##/g,'<br/>')+'</span><br/><br/><a class="goto button radius large" href="'+$(this).attr('href')+'">go to database</a>');
				$('#responseDescription').foundation('reveal', 'open');
		});
		
		
		$('#main-content-switcher').click(function() {
				$('#response').children().remove();
				$('#content-box').children().fadeIn('slow');
				$('#main-content-switcher').fadeOut('slow');
		});

//jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('.page-scroll a').bind('click', function(event) {
   //     var $anchor = $(this);
        $('html, body').stop().animate({
        //    scrollTop: $($anchor.attr('href')).offset().top
						scrollTop: $('#main-content').offset().top 
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});


});

