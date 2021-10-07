<template>    
    <div v-if="($parent.permissions.action_1 || $parent.permissions.action_2) &&($parent.method=='add' || $parent.method=='edit')">
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
              <input type="hidden" name="save_token" :value="$systemFunctions.user.id+'_'+new Date().getTime()" />
              <div class="row mb-2">
                <div class="col-4">
                    <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_name')}} <span class="text-danger">*</span></label>
                </div>
                <div class="col-lg-4 col-8">
                    <input type="text" class="form-control" name="item[name]" v-model="$parent.item.name" required>
                </div>
              </div>          
              <div class="row mb-2">
                <div class="col-4">
                    <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_prefix')}} <span class="text-danger">*</span></label>
                </div>
                <div class="col-lg-4 col-8">
                  <input type="text" class="form-control" name="item[prefix]" v-model="$parent.item.prefix" required>                    
                </div>
              </div>  
              <div class="row mb-2">
                <div class="col-4">
                    <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_ordering')}} <span class="text-danger">*</span></label>
                </div>
                <div class="col-lg-4 col-8">
                  <input type="text" class="form-control integer_positive" name="item[ordering]" v-model="$parent.item.ordering" required>     
                </div>
              </div>                       
              <div class="row mb-2">
                <div class="col-4">
                    <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_status')}} <span class="text-danger">*</span></label>
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