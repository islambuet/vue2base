<template>    
    <div v-if="($parent.permissions.action_1) &&($parent.method=='add')">
        <div class="card d-print-none mb-2">
            <div class="card-body">
              <router-link :to="'/'+$parent.base_url" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" ><i class="feather icon-corner-up-left"></i> {{$systemFunctions.getLabel('action_back')}}</router-link>
              
              <button v-if="'id' in $parent.item" type="button" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" @click="save(false)"><i class="feather icon-save"></i> {{$systemFunctions.getLabel('button_save')}}</button>          
              <button v-if="'id' in $parent.item" type="button" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" @click="save(true)"><i class="feather icon-plus-square"></i> {{$systemFunctions.getLabel('button_save_new')}}</button>          
            </div>
        </div>  
        <div class="card d-print-none mb-2" v-if="'id' in $parent.item">
          <div class="card-header">            
            <div>{{$systemFunctions.getLabel('label_new')}}</div>
          </div>
          <div class="card-body col-md-8">
            <ValidationError/>            
            <form id="formSaveItem">
              <input type="hidden" name="id" :value="$parent.item.id" />
              <input type="hidden" name="save_token" :value="$systemFunctions.user.id+'_'+new Date().getTime()" />
              <div class="row mb-2" v-for="(language,i) in $systemFunctions.language_available" :key="'language_'+i">
                <div class="col-4">
                   <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_name_'+language)}} <span class="text-danger">*</span></label>
                </div>
                <div class="col-lg-4 col-8">
                    <input type="text" class="form-control" :name="'item[name]['+language+']'" v-model="$parent.item['name_'+language]" required>
                </div>
              </div>              
              <div class="row mb-2">
                <div class="col-4">
                    <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_username')}} <span class="text-danger">*</span></label>
                </div>
                <div class="col-lg-4 col-8">
                    <input type="text" class="form-control" name="item[username]" v-model="$parent.item.username" required>
                </div>
              </div>  
              <div class="row mb-2">
                <div class="col-4">
                    <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_password')}} <span class="text-danger">*</span></label>
                </div>
                <div class="col-lg-4 col-8">
                  <div class="input-group">
                    <div class="input-group-prepend eye_password">
                      <span class="input-group-text" ><i class="feather icon-eye"></i></span>
                    </div>
                    <input type="text" class="form-control" name="item[password]" required>
                  </div>
                </div>
              </div>
              <div class="row mb-2">
                <div class="col-4">
                    <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_user_group_name')}} <span class="text-danger">*</span></label>
                </div>
                <div class="col-lg-4 col-8">
                  <select class="form-control" name="item[user_group_id]"  v-model="$parent.item.user_group_id">  
                    <option value="">{{$systemFunctions.getLabel('label_select')}}</option>
                    <option v-for="(option, i) in $parent.users_groups" :key="'ug_'+i" :value="option.id">
                      {{ option.name }}
                    </option>                                  
                  </select>                                   
                </div>
              </div>    
              <div class="row mb-2">
                <div class="col-4">
                    <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_email')}}</label>
                </div>
                <div class="col-lg-4 col-8">
                  <input type="text" class="form-control" name="item[email]" v-model="$parent.item.email">                    
                </div>
              </div>  
              <div class="row mb-2">
                <div class="col-4">
                    <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_mobile_no')}}</label>
                </div>
                <div class="col-lg-4 col-8">
                  <input type="text" class="form-control" name="item[mobile_no]" v-model="$parent.item.mobile_no" required>     
                </div>
              </div>                       
              <div class="row mb-2">
                <div class="col-4">
                    <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_status')}}</label>
                </div>
                <div class="col-lg-4 col-8">
                  <select class="form-control" name="item[status]" v-model="$parent.item.status" required>                                    
                    <option :value="$systemFunctions.dbStatus.ACTIVE">{{$systemFunctions.dbStatus.ACTIVE}}</option>
                    <option :value="$systemFunctions.dbStatus.INACTIVE">{{$systemFunctions.dbStatus.INACTIVE}}</option>                      
                  </select>
                </div>
              </div>      
            </form>
          </div>          
        </div>  
        <div class="card d-print-none mb-2" v-else>
            <div class="card-body"> 
              {{$systemFunctions.getLabel('msg_item_not_found')}}
            </div>
        </div>        
    </div>  
</template>

<script>
import ValidationError from '@/components/ValidationError.vue';
export default {
  name: 'AddEdit',  
   components: {      
      ValidationError,
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