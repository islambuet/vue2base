<template>
    <div  v-show="$parent.method=='list'">
        <div class="card d-print-none mb-2">
            <div class="card-body">
                <!-- 0=view,1=add,2=edit,3=delete,4=forward,5=print,6=csv,7=filter,8=column header -->

                
                <router-link v-if="$parent.permissions.action_1"  :to="'/'+$parent.base_url+'/add'" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" ><i class="feather icon-plus-circle"></i> {{$systemFunctions.getLabel('action_1')}}</router-link>

                <button type="button" v-if="$parent.permissions.action_5" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" onclick="window.print();"><i class="feather icon-printer"></i> {{$systemFunctions.getLabel('action_5')}}</button>
                <button type="button" v-if="$parent.permissions.action_6" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" @click="$systemFunctions.exportCsv($parent.columns,$parent.itemsFiltered,$parent.base_url+'.csv')"><i class="feather icon-download"></i> {{$systemFunctions.getLabel('action_6')}}</button>
                
                <button type="button" v-if="$parent.permissions.action_0" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" @click="$systemFunctions.loadListData=true;$parent.init()"><i class="feather icon-rotate-cw"></i> {{$systemFunctions.getLabel('button_refresh')}}</button>
            </div>
        </div>            
        <div class="card mb-2">
            <div class="card-header d-print-none">
                {{$systemFunctions.getLabel('label_task')}}
            </div>
            <div class="card-body" style='overflow-x:auto;min-height:250px;'>
                <table class="table table-bordered">
                    <thead class="table-active">
                        <tr>
                            <th class="position-relative align-middle d-print-none">{{$systemFunctions.getLabel('label_action')}}</th>
                            <template v-for="(column,key) in $parent.columns.all">                                 
                                <th class="position-relative align-middle" v-if="$parent.columns.hidden.indexOf(key)>=0?false:true" :key="'th_'+key">
                                        <div class=" text-center " style="width:calc(100% - 33px);margin-left:17px">                                            
                                            {{ column.label }}
                                        </div>
                                </th> 
                            </template>
                        </tr>
                    </thead>
                    <tbody class="table-striped table-hover">
                        <tr v-for="item in $parent.itemsFiltered" :key="'item_'+item.id">
                            <td class="col-1 d-print-none">
                                <button class="btn btn-sm bg-gradient-primary dropdown-toggle waves-effect waves-light" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{$systemFunctions.getLabel('label_action')}}</button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);">
                                    <router-link v-if="$parent.permissions.action_2"  :to="'/'+$parent.base_url+'/details/'+item.id" class="dropdown-item text-info btn-sm" ><i class="feather icon-camera"></i> {{$systemFunctions.getLabel('action_details')}}</router-link>
                                    <router-link v-if="$parent.permissions.action_2"  :to="'/'+$parent.base_url+'/edit/'+item.id" class="dropdown-item text-info btn-sm" ><i class="feather icon-edit"></i> {{$systemFunctions.getLabel('action_2')}}</router-link>                                    
                                </div>
                            </td>
                            <template v-for="(column,key) in $parent.columns.all">                         
                                <td class="col-1" :class="(['id','ordering'].indexOf(key) != -1)?'text-right':''" v-if="$parent.columns.hidden.indexOf(key)>=0?false:true" :key="'td_'+key">                                                           
                                    {{ item[key] }}
                                </td>     
                            </template>     
                            
                        </tr>
                    </tbody>
                </table>                
            </div> 
        </div>    
    </div>
</template>

<script>

    export default {
        data:function(){
            return{                      
                
            }
        },
        methods: {
        },
        computed:{   
            
        }

    }
</script>
