import Vue from 'vue'
var systemHtmlElementsAction= new Vue(
    {    
      methods:{
        click_handler_left_sidebar:function (event,param)
        {   
          $('#system_left_sidebar').toggleClass('inactive');
          $('#system_content').toggleClass('inactive_left_sidebar');            
        },
        click_handler_right_sidebar:function (event,param)
        {
          $('#system_right_sidebar').toggleClass('inactive');
          $('#system_content').toggleClass('inactive_right_sidebar');            
        },        
        click_task_links:function (event)
        {  
          $('#system_left_sidebar').removeClass('inactive');
          $('#system_content').removeClass('inactive_left_sidebar');
          $('#system_right_sidebar').removeClass('inactive');
          $('#system_content').removeClass('inactive_right_sidebar');  
        },          
        /************
         * data-minimum-size-to-resize//1372022
         * data-resize-width//800
         * data-resize-height//600
        *************** */
        get_form_data_with_image_resize:async function(formid)
        {
          var inputs = document.getElementById(formid).getElementsByTagName('input');
          var formData=new FormData();
          for(var i=0;i<inputs.length;i++)
          {            
            if(inputs[i]['name'])
            {
              if(inputs[i]['type']=='file')
              {
                if(inputs[i].files[0])
                {
                  var resizedImage=null;                  
                  var file=inputs[i].files[0];
                  var file_type=file.type;
                  if(file_type && file_type.substr(0,5)=="image")
                  { 
                    var minimum_size_to_resize=1372022;//1372022=1.3mb,409600=400KB
                    if(inputs[i].hasAttribute('data-minimum-size-to-resize'))
                    {                      
                      minimum_size_to_resize=inputs[i].getAttribute('data-minimum-size-to-resize');                      
                    }
                    if(file.size>minimum_size_to_resize)
                    {
                      var resize_width = 800;;
                      if(inputs[i].hasAttribute('data-resize-width'))                      
                      {
                        resize_width=inputs[i].getAttribute('data-resize-width');   
                      }
                      var resize_height = 600;
                      if(inputs[i].hasAttribute('data-resize-height'))                      
                      {
                        resize_height=inputs[i].getAttribute('data-resize-height');   
                      }   
                      var img=new Image(); 
                      img.src=URL.createObjectURL(file);  
                      var width = img.naturalWidth;
                      var height = img.naturalHeight; 
                      if((width>resize_width)||(height>resize_height))
                      {
                        if((width/height)>(resize_width/resize_height))
                        {
                            height *= resize_width / width;
                            width = resize_width;
                        }
                        else
                        {
                            width *= resize_height / height;
                            height = resize_height;
                        }
                        var canvas = document.createElement("canvas");
                        canvas.width = width;
                        canvas.height = height;
                        var context = canvas.getContext("2d");
                        context.drawImage(img, 0, 0, width, height);
                        resizedImage=await new Promise(resolve => {
                            canvas.toBlob(function(blob)
                            {
                              resolve(blob);
                            });
                          });
                      }

                    }
                  }
                  if(resizedImage)
                  {
                    formData.set(inputs[i]['name'], resizedImage, file.name+'.png');                     
                  }
                  else
                  {
                    formData.set(inputs[i]['name'], file, file.name); 
                  }
                }
                
              }
              else
              {
                formData.set(inputs[i]['name'],inputs[i]['value']); 
              }
            }
          }          
          return  Promise.resolve(formData);
        }
      }
    }
  );
  export default systemHtmlElementsAction
  //Vue.prototype.$systemHtmlElementsAction=systemHtmlElementsAction