jQuery(function($) {
    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            $('.scrollup').fadeIn();

        } else {
            $('.scrollup').fadeOut();

        }
        if ($(this).scrollTop() < 100) {
            $('.scrolldown').fadeIn();
        } else {
            $('.scrolldown').fadeOut();
        }
    });
    $('.scrollup').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });
});
