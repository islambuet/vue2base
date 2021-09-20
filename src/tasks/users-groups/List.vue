<template>
    <div v-if="$systemFunctions.statusTaskLoaded==1">
        <div class="card d-print-none mb-2">
            <div class="card-body">
                <!-- 0=view,1=add,2=edit,3=delete,4=forward,5=print,6=csv,7=filter,8=column header -->

                
                <router-link v-if="$parent.permissions.action_1"  :to="'/'+$parent.base_url+'/add'" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" ><i class="feather icon-plus-circle"></i> {{$systemFunctions.getLabel('action_1')}}</router-link>

                <button type="button" v-if="$parent.permissions.action_5" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" onclick="window.print();"><i class="feather icon-printer"></i> {{$systemFunctions.getLabel('action_5')}}</button>
                <button type="button" v-if="$parent.permissions.action_6" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" onclick="window.print();"><i class="feather icon-download"></i> {{$systemFunctions.getLabel('action_6')}}</button>

                <button type="button" v-if="$parent.permissions.action_8" class="mr-2 mb-2 btn btn-sm" :class="[show_column_controls?'bg-gradient-success':'bg-gradient-primary']" @click="show_column_controls = !show_column_controls"><i class="feather icon-command"></i> {{$systemFunctions.getLabel('action_8')}}</button>

                <button type="button" v-if="$parent.permissions.action_0" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" @click="$parent.itemsLoaded=false;$parent.init()"><i class="feather icon-rotate-cw"></i> {{$systemFunctions.getLabel('button_refresh')}}</button>

                

                <!-- <button type="button" v-if="$parent.permissions.action_0" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" onclick="window.print();"><i class="feather icon-download"></i> {{$systemFunctions.getLabel('action_refresh')}}</button> -->



                <!-- <router-link  to="/sys_user_group/add" :class="'btn btn-success mr-2 mb-2'" >{{$systemFunctions.getLabel('button_new')}}</router-link>            
                <b-button onclick="window.print();" class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action5" >{{$systemFunctions.getLabel('button_print')}}</b-button>
                <b-button @click="$system_functions.export_csv(get_csv_headers,modified_items)" class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action6" >{{$systemFunctions.getLabel('button_csv')}}</b-button>          
                <b-button class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action7" :pressed.sync="show_fitler_options">{{$systemFunctions.getLabel('button_search')}}</b-button>
                <b-button class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action8" :pressed.sync="show_column_controls">{{$systemFunctions.getLabel('button_column_control')}}</b-button>
                
                <b-button class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action0" @click="$parent.init" >{{$systemFunctions.getLabel('button_refresh')}}</b-button> -->
            </div>
        </div>    
        <div class="card d-print-none mb-2" v-if="show_column_controls">
            <div class="card-body">
                <ColumnControl :controller="'Area'" :method="'list'" :columns="$parent.columns"/>            
            </div>
        </div>
        <div class="card mb-2">
            <div class="card-header d-print-none">
                {{$systemFunctions.getLabel('label_task')}}
            </div>
            <div class="card-body" style='overflow-x:auto'>
                <table class="table table-bordered has-sticky-column">
                    <thead class="table-active">
                        <tr>
                            <th class="cell-nowrap d-print-none">{{$systemFunctions.getLabel('label_action')}}</th>
                            <template v-for="(column,key) in $parent.columns.all">                                 
                                <th v-if="!column.hidden" :key="'th_'+key">     
                                    {{ column.label }}
                                </th> 
                            </template>  
                            
                        </tr>
                        
                    </thead>
                    <tbody class="table-striped table-hover">
                        <tr v-for="item in getFilteredItems" :key="'item_'+item.id">
                            <td class="col-1 d-print-none">
                                <button class="btn btn-sm bg-gradient-primary dropdown-toggle waves-effect waves-light" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{$systemFunctions.getLabel('label_action')}}</button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);">
                                    <router-link v-if="$parent.permissions.action_2"  :to="'/'+$parent.base_url+'/details/'+item.id" class="dropdown-item text-info btn-sm" ><i class="feather icon-camera"></i> {{$systemFunctions.getLabel('action_details')}}</router-link>
                                    <router-link v-if="$parent.permissions.action_2"  :to="'/'+$parent.base_url+'/edit/'+item.id" class="dropdown-item text-info btn-sm" ><i class="feather icon-edit"></i> {{$systemFunctions.getLabel('action_2')}}</router-link>
                                    <router-link v-if="$parent.permissions.action_2"  :to="'/'+$parent.base_url+'/role/'+item.id" class="dropdown-item text-info btn-sm" ><i class="feather icon-check-square"></i> {{$systemFunctions.getLabel('action_assign_Task')}}</router-link>
                                </div>
                            </td>
                            <template v-for="(column,key) in $parent.columns.all">                         
                                <td class="col-1" v-if="!column.hidden" :key="'td_'+key">                        
                                    {{ item[key] }}
                                </td>     
                            </template>     
                            
                        </tr>
                    </tbody>
                </table>
                <Pagination :items = "$parent.items" :onChangePageOption="$parent.reloadItems" :pagination="$parent.pagination"/>
            </div> 
        </div>    
    </div>
</template>

<script>
import ColumnControl from '@/components/ColumnControl.vue'
import Pagination from '@/components/Pagination.vue';
// import ValidationError from '@/components/ValidationError.vue';
    export default {
        components: {
            Pagination,
            // ValidationError,
            ColumnControl
        },
        data:function(){
            return{      
                show_fitler_options:false,
                show_column_controls:false
            }
        },
        methods: {
            
        },
        computed:{   
            getFilteredItems:function(){   
                
                if(this.$parent.itemsLoaded){
                    let items=this.$parent.items;
                    return items.data;
                    //console.log(items.data);
                    //return items.data;
                    // return items.data.filter((item)=>{
                    // // if(this.searchString){
                    // //     if(item['name'].toLowerCase().indexOf(this.searchString.toLowerCase())==-1){
                    // //         return false;
                    // //     } 
                    // // }
                    // return true;
                    // });
                }else{
                    return [];
                }
                
            }, 
        }

    }
</script>
