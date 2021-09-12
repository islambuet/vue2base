/**
 * Created by Shaiful Islam on 14/04/20.
 */
$(document).ready(function ()
{
    $(document).on("click", ".eye_password", function(event)
    {
        var input=$(this).siblings('input');
        if(input.attr('type')=='password')
        {
            $(this).find('i').removeClass('icon-eye').addClass('icon-eye-off');
            input.attr('type','text');
        }
        else
        {
            $(this).find('i').removeClass('icon-eye-off').addClass('icon-eye');
            input.attr('type','password');
        }
    });
    /*number format input box*/
    $(document).on("input", ".float_positive", function(event)
    {
        this.value = this.value.replace(/[^0-9.]/g, '').replace('.', 'x').replace(/\./g,'').replace('x','.');
    });
    $(document).on("input", ".integer_positive", function(event)
    {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    $(document).on("input", ".float_all", function(event)
    {
        this.value = this.value.replace(/[^0-9.-]/g, '').replace('.', 'x').replace(/\./g,'').replace('x','.').replace(/(?!^)-/g, '');
    });
    $(document).on("input", ".integer_all", function(event)
    {
        this.value = this.value.replace(/[^0-9-]/g, '').replace(/(?!^)-/g, '');
    });
    $(document).on("click",'.select_all',function()
    {
        if($(this).is(':checked'))
        {
            $('.'+$(this).attr('data-type')).prop('checked', true);
        }
        else
        {
            $('.'+$(this).attr('data-type')).prop('checked', false);
        }
    });




});