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
    /************
    ####### additional parameter
    ##### for display
     * data-preview-container
     * data-preview-width //has higer priority
     * data-preview-height
    #### for upload
     * data-minimum-size-to-resize//1372022
     * data-resize-width//800
     * data-resize-height//600
        *************** */
    $(document).on("change", ":file", function(event)
    {
        if(($(this).is('[class*="file_external"]')))
        {
            return;
        }
        if(this.files && this.files[0])
        {
            var input_file=$(this);
            var container=$(this).attr('data-preview-container');
            var file=this.files[0];
            var file_type=file.type;
            if(file_type && file_type.substr(0,5)=="image")
            {
                var key=input_file.attr('name');
                var file_name=file.name.replace(/\.[^/.]+$/,"");
                //var file_name=file.name;
                var preview_height=200;
                if($(this).attr('data-preview-height'))
                {
                    preview_height=$(this).attr('data-preview-height');
                }
                var path=URL.createObjectURL(file);
                if(container)
                {
                    var img_tag='';
                    if($(this).attr('data-preview-width'))
                    {
                        var preview_width=$(this).attr('data-preview-width');
                        //img_tag='<img width="'+preview_width+'" src="'+path+'" >';
                        img_tag='<img style="max-height: 100%;max-width:'+preview_width+'px"  src="'+path+'"></img>';
                        $(container).html(img_tag);
                    }
                    else
                    {                        
                        // img_tag='<img height="'+preview_height+'" src="'+path+'" >';
                        img_tag='<img style="max-width: 100%;max-height:'+preview_height+'px"  src="'+path+'"></img>';                        
                        $(container).html(img_tag);
                    }
                }
            }
            else if(container)
            {
                let path='theme/images/not_an_image.jpg';
                var img_tag='<img style="max-width: 100%;max-height:200px"  src="'+path+'"></img>';                        
                $(container).html(img_tag);
                //$(container).html('Not A Picture');
                //or display Picture showing not a picture
            }            
            $(this).closest('.input-group-prepend').next('.custom-file-name').html(file.name);
            // $(this).next('.custom-file-label').html(file.name);//show the file name on label
            //$('.custom-file-name').html(file.name);//show the file name on label            

        }
        else
        {
            console.log('no file attached');
            $(this).closest('.input-group-prepend').next('.custom-file-name').html('');
            //$('.custom-file-name').html('');//show the file name on label
        }
    });
});