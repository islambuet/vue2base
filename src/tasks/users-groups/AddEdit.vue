<template>    
    <div v-if="$parent.permissions.action_1 || $parent.permissions.action_2"  v-show="($systemFunctions.statusDataLoaded==1) &&($parent.method=='add' || $parent.method=='edit')">
        <div class="card d-print-none mb-2">
            <div class="card-body">
              <router-link :to="'/'+$parent.base_url" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" ><i class="feather icon-corner-up-left"></i> {{$systemFunctions.getLabel('action_back')}}</router-link>
              
              <button v-if="'id' in $parent.item" type="button" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" @click="save(false)"><i class="feather icon-save"></i> {{$systemFunctions.getLabel('button_save')}}</button>          
              <button v-if="'id' in $parent.item" type="button" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" @click="save(true)"><i class="feather icon-plus-square"></i> {{$systemFunctions.getLabel('button_save_new')}}</button>          
            </div>
        </div>  
        <div class="card d-print-none mb-2" v-if="'id' in $parent.item">
          <div class="card-header">
            <div v-if="$parent.item.id>0">{{$systemFunctions.getLabel('label_edit')}} ::{{$parent.item['name']}}</div>
            <div v-else>{{$systemFunctions.getLabel('label_new')}}</div>
          </div>
          <div class="card-body col-md-8">
            <ValidationError/>
            <form id="formSaveItem">
              <input type="hidden" name="id" :value="$parent.item.id" />
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">{{$systemFunctions.getLabel('label_name')}}</span>                  
                </div>
                <input type="text" class="form-control" name="item[name]" v-model="$parent.item.name" placeholder="Name" required>
              </div> 
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">{{$systemFunctions.getLabel('label_ordering')}}</span>                  
                </div>
                <input type="number" class="form-control integer_positive" name="item[ordering]" v-model="$parent.item.ordering" placeholder="Ordering" required>
              </div> 
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">{{$systemFunctions.getLabel('label_status')}}</span>                  
                </div>
                <select class="form-control" name="item[status]" v-model="$parent.item.status" required>                                    
                      <option :value="$systemFunctions.dbStatus.ACTIVE">{{$systemFunctions.dbStatus.ACTIVE}}</option>
                      <option :value="$systemFunctions.dbStatus.INACTIVE">{{$systemFunctions.dbStatus.INACTIVE}}</option>                      
                  </select>
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
              this.$parent.itemsLoaded=false;
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

      
      // this.$system_variables.status_data_loaded=0; 
      // var form_data=new FormData(document.getElementById('form_save'));       
      // form_data.append ('token_auth', this.$system_variables.user.token_auth); 
      // this.$axios.post('/sys_user_group/save_item',form_data)
      // .then(response=>{          
      //   this.$system_variables.status_data_loaded=1;
      //   if(response.data.error_type)        
      //   {            
      //     this.$bvToast.toast(this.$system_variables.get_label(response.data.error_type), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});
      //   }
      //   else
      //   {
      //       this.$parent.reload_items=true;
      //       this.$system_variables.status_data_loaded=1;
      //       this.$bvToast.toast(this.$system_variables.get_label("Saved SuccessFully"), {title: this.$system_variables.get_label('label_Success'),variant:'Success',autoHideDelay: 5000,appendToast: false});              
      //       if(save_and_new)
      //       {
      //         this.$router.push("/sys_user_group/add");
      //       }
      //       else
      //       {
      //         this.$router.push("/sys_user_group");
      //       }
      //   }                 
      // })
      // .catch(error => {   
      //   this.$system_variables.status_data_loaded=1;
      //   this.$bvToast.toast(this.$system_variables.get_label("Response Error"), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});   
      // });
    }
  }  
}
</script>