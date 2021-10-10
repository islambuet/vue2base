<template>    
    <div>
        <div class="card d-print-none mb-2">
            <div class="card-header">
                <div>{{$systemFunctions.getLabel('label_welcome')}} {{$systemFunctions.user.name}}</div>            
            </div>
            <div class="card-body">
                <div id="accordion">
                    <div class="card">
                        <div class="card-header p-1">
                            <a class="btn btn-sm" data-toggle="collapse" href="#label_qr_code">{{$systemFunctions.getLabel('label_qr_code')}} </a>
                        </div>
                        <div id="label_qr_code" class="collapse show">
                            <div class="card-body">
                                <div id="qr_code_image" class="text-center"></div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header p-1">
                            <a class="btn btn-sm" data-toggle="collapse" href="#label_profile_picture">{{$systemFunctions.getLabel('label_profile_picture')}} </a>
                        </div>
                        <div id="label_profile_picture" class="collapse show">
                            <div class="card-body">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>  
</template>

<script>
import ValidationError from '@/components/ValidationError.vue';
    export default {
        data (){
            return {
                base_url:'profile',
                save_token: ''                
            }
        }, 
        created(){    
            if(!(this.$systemFunctions.user.id>0)){
                return;
            }        
            this.$systemFunctions.loadLanguageFiles([
                {language:this.$systemFunctions.getLanguage(),file:'tasks/'+this.base_url+'/language.js'},
            ]); 
            this.save_token=this.$systemFunctions.user.id+'_'+new Date().getTime()
            //this.$systemFunctions.loadListData=true;           
            //this.init();
        },
        mounted(){
            $('#qr_code_image').qrcode(
                {
                    size:200,
                    text: this.$systemFunctions.user.name,
                    render	: "image"
                }
            );

        },
        methods:{
            save:function(save_and_new)
            { 
            this.$systemFunctions.statusDataLoaded=0;
            this.$axios.post('/'+this.$parent.base_url+'/save-item',new FormData(document.getElementById('formSaveItem')))
            .then(res => {
                this.$systemFunctions.statusDataLoaded = 1;
                if(res.data.error==''){
                    this.$systemFunctions.showSuccessMessage(this.$systemFunctions.getLabel('msg_success_saved'));
                    this.$systemFunctions.loadListData=true;
                    if(save_and_new){
                        if(this.$route.path=='/'+this.$parent.base_url+'/add'){
                        this.$parent.addItem();
                        }
                        else{
                        this.$router.push('/'+this.$parent.base_url+'/add');
                        }
                    }else{
                        this.$router.push('/'+this.$parent.base_url);
                    }
                }
            }).catch(error => {                      
                this.$systemFunctions.statusDataLoaded = 1;
                if (error.response && error.response.data && error.response.data.error) {
                    this.$systemFunctions.showResponseError(error.response.data);            
                } else {            
                    this.$systemFunctions.showResponseFailure();
                }                              
            });
            }
        }  
    }
</script>