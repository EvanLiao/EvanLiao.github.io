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
    var rule_loaded = false;
    $(".agree-rule").click(function () {
        if (!rule_loaded) {
            $('#rule').load(rule_url);
            rule_loaded = true;
        }
        $(".rule-info").slideToggle("fast");
    });
    $("#close1").click(function () {
        $(".rule-info").slideUp("fast");
    });
});
