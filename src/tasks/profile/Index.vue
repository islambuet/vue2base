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
                        <div id="label_qr_code" class="collapse">
                            <div class="card-body">
                                <div id="qr_code_image" class="text-center"></div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header p-1">
                            <a class="btn btn-sm" data-toggle="collapse" href="#label_change_password">{{$systemFunctions.getLabel('label_change_password')}} </a>
                        </div>
                        <div id="label_change_password" class="collapse show">
                            <div v-if="error_section=='change_password'">
                                <ValidationError/>
                            </div>
                            <form :id="formSaveChangePassword">              
                                <input type="hidden" name="save_token" :value="save_token" />
                                <div class="card-body">
                                    <div class="row mb-2">
                                        <div class="col-4">
                                            <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_old_password')}} <span class="text-danger">*</span></label>
                                        </div>
                                        <div class="col-lg-4 col-8">
                                        <div class="input-group">
                                            <div class="input-group-prepend eye_password">
                                            <span class="input-group-text" ><i class="feather icon-eye"></i></span>
                                            </div>
                                            <input type="text" class="form-control" name="item[password_old]" v-model="password_old" required>
                                        </div>
                                        </div>
                                    </div>      
                                    <div class="row mb-2">
                                        <div class="col-4">
                                            <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_new_password')}} <span class="text-danger">*</span></label>
                                        </div>
                                        <div class="col-lg-4 col-8">
                                        <div class="input-group">
                                            <div class="input-group-prepend eye_password">
                                            <span class="input-group-text" ><i class="feather icon-eye"></i></span>
                                            </div>
                                            <input type="text" class="form-control" name="item[password_new]" v-model="password_new" required>
                                        </div>
                                        </div>
                                    </div>                            
                                    
                                    <div class="row mb-2">
                                        <div class="col-4">                                        
                                        </div>
                                        <div class="col-4">    
                                            <button type="button" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" @click="savePassword()"><i class="feather icon-save"></i> {{$systemFunctions.getLabel('button_save')}}</button>
                                            
                                        </div>
                                        <div class="col-4">                                        
                                        </div>                                   
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header p-1">
                            <a class="btn btn-sm" data-toggle="collapse" href="#label_profile_picture">{{$systemFunctions.getLabel('label_profile_picture')}} </a>
                        </div>
                        <div id="label_profile_picture" class="collapse">
                            <div v-if="error_section=='profile_picture'">
                                <ValidationError/>
                            </div>
                            <form :id="formSaveProfilePicture">              
                                <input type="hidden" name="save_token" :value="save_token" />
                                <div class="card-body">
                                    <div class="row mb-2">
                                        <div class="col-4">
                                            <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_profile_picture')}}</label>
                                        </div>
                                        <div class="col-8">
                                            <div class="input-group input-group-sm">
                                                <div class="input-group-prepend">
                                                    <label class="btn btn-sm bg-gradient-primary" style="cursor: pointer;">
                                                        <input id="profile_picture" type="file" class="d-none" data-preview-container="#profile_picture_preview_container" name="profile_picture">
                                                        <i class="bi bi-upload"></i> {{$systemFunctions.getLabel('button_upload_image')}}
                                                    </label>
                                                </div>
                                                <label class="form-control custom-file-name"></label>                                               
                                            </div>
                                        </div>                                                                     
                                    </div>                                    
                                    <div class="row mb-2">
                                        <div class="col-4">                                        
                                        </div>
                                        <div class="col-8" id="profile_picture_preview_container">
                                            <img style="max-width: 100%;max-height:200px" :src="profile_picture">
                                        </div>                                    
                                    </div> 
                                    <div class="row mb-2">
                                        <div class="col-4">                                        
                                        </div>
                                        <div class="col-4">    
                                            <button type="button" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" @click="saveProfilePicture()"><i class="feather icon-save"></i> {{$systemFunctions.getLabel('button_save')}}</button>                                              
                                            <button type="button" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" @click="clearProfilePicture()"><i class="bi bi-brush-fill"></i> {{$systemFunctions.getLabel('button_reset')}}</button>                                              
                                        </div>
                                        <div class="col-4">                                        
                                        </div>                                   
                                    </div>
                                </div>
                            </form>
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
         components: {      
            ValidationError,
        },   
        data (){
            return {
                base_url:'profile',
                save_token: '',
                error_section:'',
                password_old:'',
                password_new:'',
                profile_picture:this.$systemFunctions.baseUrl+'theme/images/no_image.jpg',
                formSaveProfilePicture:'formSaveProfilePicture',            
                formSaveChangePassword:'formSaveChangePassword',            
            }
        }, 
        created(){    
            if(!(this.$systemFunctions.user.id>0)){
                return;
            }        
            this.$systemFunctions.loadLanguageFiles([
                {language:this.$systemFunctions.getLanguage(),file:'tasks/'+this.base_url+'/language.js'},
            ]); 
            this.save_token=this.$systemFunctions.user.id+'_'+new Date().getTime();
            this.profile_picture=this.$systemFunctions.user.profile_picture_url?this.$systemFunctions.user.profile_picture_url:this.$systemFunctions.baseUrl+'theme/images/no_image.jpg';
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
            saveProfilePicture(){
                this.$systemFunctions.statusDataLoaded=0;
                this.$axios.post('/user/profile-picture',new FormData(document.getElementById(this.formSaveProfilePicture)))
                .then(res => {
                    this.$systemFunctions.statusDataLoaded = 1;
                    if(res.data.error==''){
                        this.$systemFunctions.showSuccessMessage(this.$systemFunctions.getLabel('msg_success_saved'));
                        this.$systemFunctions.user.profile_picture_url=res.data.profile_picture_url;
                        this.save_token=this.$systemFunctions.user.id+'_'+new Date().getTime();

                    }
                }).catch(error => {   
                    this.error_section='profile_picture';                   
                    this.$systemFunctions.statusDataLoaded = 1;
                    if (error.response && error.response.data && error.response.data.error) {
                        this.$systemFunctions.showResponseError(error.response.data);            
                    } else {            
                        this.$systemFunctions.showResponseFailure();
                    }                              
                });

            },
            clearProfilePicture(){                
                $('#profile_picture').val('').trigger('change');
                this.profile_picture=this.$systemFunctions.user.profile_picture_url?this.$systemFunctions.user.profile_picture_url:this.$systemFunctions.baseUrl+'theme/images/no_image.jpg';
                let img_tag='<img style="max-width: 100%;max-height:200px" src="'+this.profile_picture+'">';
                $('#profile_picture_preview_container').html(img_tag);
            },
            savePassword(){
                
                this.$systemFunctions.statusDataLoaded=0;
                this.$axios.post('/user/change-password',new FormData(document.getElementById(this.formSaveChangePassword)))
                .then(res => {
                    this.$systemFunctions.statusDataLoaded = 1;
                    if(res.data.error==''){
                        this.$systemFunctions.showSuccessMessage(this.$systemFunctions.getLabel('msg_success_saved'));
                        this.password_old='';
                        this.password_new='';                        
                    }
                }).catch(error => {   
                    this.error_section='change_password';                   
                    this.$systemFunctions.statusDataLoaded = 1;
                    if (error.response && error.response.data && error.response.data.error) {
                        this.$systemFunctions.showResponseError(error.response.data);            
                    } else {            
                        this.$systemFunctions.showResponseFailure();
                    }                              
                });

            },
        }  
    }
</script>