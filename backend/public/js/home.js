


$(document).ready(function(){
    $('#apps-tab-content1').show(400);

    $('#apps-tablink1').click(() => {
        $('#apps-tablink1').addClass('active');
        $('#apps-tablink2').removeClass('active');
        $('#apps-tablink3').removeClass('active');
        $('#apps-tablink4').removeClass('active');
        $('#apps-tab-content1').show(400);
        $('#apps-tab-content2').hide(400);
        $('#apps-tab-content3').hide(400);
        $('#apps-tab-content4').hide(400);
    });
    $('#apps-tablink2').click(() => {
        $('#apps-tablink1').removeClass('active');
        $('#apps-tablink2').addClass('active');
        $('#apps-tablink3').removeClass('active');
        $('#apps-tablink4').removeClass('active');
        $('#apps-tab-content1').hide(400);
        $('#apps-tab-content2').show(400);
        $('#apps-tab-content3').hide(400);
        $('#apps-tab-content4').hide(400);
    });
    $('#apps-tablink3').click(() => {
        $('#apps-tablink1').removeClass('active');
        $('#apps-tablink2').removeClass('active');
        $('#apps-tablink3').addClass('active');
        $('#apps-tablink4').removeClass('active');
        $('#apps-tab-content1').hide(400);
        $('#apps-tab-content2').hide(400);
        $('#apps-tab-content3').show(400);
        $('#apps-tab-content4').hide(400);
    });
    $('#apps-tablink4').click(() => {
        $('#apps-tablink1').removeClass('active');
        $('#apps-tablink2').removeClass('active');
        $('#apps-tablink3').removeClass('active');
        $('#apps-tablink4').addClass('active');
        $('#apps-tab-content1').hide(400);
        $('#apps-tab-content2').hide(400);
        $('#apps-tab-content3').hide(400);
        $('#apps-tab-content4').show(400);
    });
    
});



