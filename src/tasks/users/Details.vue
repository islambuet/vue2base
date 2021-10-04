<template>    
    <div v-if="$parent.permissions.action_0 &&($parent.method=='details')">
        <div class="card d-print-none mb-2">
            <div class="card-body">
              <router-link :to="'/'+$parent.base_url" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" ><i class="feather icon-corner-up-left"></i> {{$systemFunctions.getLabel('action_back')}}</router-link>
            </div>
        </div>  
        <div class="card d-print-none mb-2" v-if="'id' in $parent.item">
          <div class="card-header">
            <div >{{$systemFunctions.getLabel('label_details')}} ::{{$parent.item['name_'+this.$systemFunctions.getLanguage()]}}</div>       
          </div>
          <div class="card-body col-md-8">
            <div id="accordion">
                <div class="card">
                    <div class="card-header p-1">
                        <a class="btn btn-sm" data-toggle="collapse" href="#title_identification">{{$systemFunctions.getLabel('label_title_identification')}} </a>
                    </div>
                    <div id="title_identification" class="collapse show">
                        <div class="card-body">
                            <div class="row mb-2" v-for="(language,i) in $systemFunctions.language_available" :key="'language_'+i">
                              <div class="col-4">
                                <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_name_'+language)}}</label>
                              </div>
                              <div class="col-lg-4 col-8">
                                  {{$parent.item['name_'+language]}}
                              </div>
                            </div>
                            <div class="row mb-2">
                              <div class="col-4">
                                  <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_user_group_name')}}</label>
                              </div>
                              <div class="col-lg-4 col-8">
                                {{$parent.item.user_group_name}}
                                
                              </div>
                            </div> 
                            <div class="row mb-2">
                              <div class="col-4">
                                  <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_email')}}</label>
                              </div>
                              <div class="col-lg-4 col-8">
                                {{$parent.item.email}}                                                  
                              </div>
                            </div>  
                            <div class="row mb-2">
                              <div class="col-4">
                                  <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_mobile_no')}}</label>
                              </div>
                              <div class="col-lg-4 col-8">
                                {{$parent.item.mobile_no}}                                    
                              </div>
                            </div> 
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header p-1">
                        <a class="btn btn-sm" data-toggle="collapse" href="#title_authentication">{{$systemFunctions.getLabel('label_title_authentication')}} </a>
                    </div>
                    <div id="title_authentication" class="collapse show">
                        <div class="card-body">
                            <div class="row mb-2">
                              <div class="col-4">
                                  <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_username')}}</label>
                              </div>
                              <div class="col-lg-4 col-8">
                                {{$parent.item.username}}                                  
                              </div>
                            </div>                              
                            <div class="row mb-2">
                              <div class="col-4">
                                  <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_status')}}</label>
                              </div>
                              <div class="col-lg-4 col-8">
                                {{$parent.item.status}}
                              </div>
                            </div> 
                        </div>
                    </div>
                </div>
              </div>
          </div>          
        </div>  
        <div class="card d-print-none mb-2" v-else>
            <div class="card-body"> 
              {{$systemFunctions.getLabel('msg_item_not_found')}}
            </div>
        </div>        
    </div>  
</template>
