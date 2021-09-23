<template>    
    <div v-if="$parent.permissions.action_0 &&($parent.method=='details')">
        <div class="card d-print-none mb-2">
            <div class="card-body">
              <router-link :to="'/'+$parent.base_url" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" ><i class="feather icon-corner-up-left"></i> {{$systemFunctions.getLabel('action_back')}}</router-link>
            </div>
        </div>  
        <div class="card d-print-none mb-2" v-if="'id' in $parent.item">
          <div class="card-header">
            <div >{{$systemFunctions.getLabel('label_details')}} ::{{$parent.item['name']}}</div>            
          </div>
          <div class="card-body col-md-8">
              <div class="row mb-2">
                <div class="col-4">
                    <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_name')}}</label>
                </div>
                <div class="col-lg-4 col-8">
                    {{$parent.item.name}}                    
                </div>
              </div>          
              <div class="row mb-2">
                <div class="col-4">
                    <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_ordering')}}</label>
                </div>
                <div class="col-lg-4 col-8">
                    {{$parent.item.ordering}} 
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
              <div class="row mb-2">
                <div class="col-4">
                    <label class="font-weight-bold float-right">{{$systemFunctions.getLabel('label_created_time')}}</label>
                </div>
                <div class="col-lg-4 col-8">
                    {{$systemFunctions.displayTime($parent.item.created_at)}}
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
