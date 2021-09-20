<template>
    <div v-if="$systemFunctions.statusTaskLoaded==1">
        <div class="card d-print-none mb-2">
            <div class="card-body">
                <!-- 0=view,1=add,2=edit,3=delete,4=forward,5=print,6=csv,7=filter,8=column header -->

                
                <router-link v-if="$parent.permissions.action_1"  :to="'/'+$parent.base_url+'/add'" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" ><i class="feather icon-plus-circle"></i> {{$systemFunctions.getLabel('action_1')}}</router-link>

                <button type="button" v-if="$parent.permissions.action_5" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" onclick="window.print();"><i class="feather icon-printer"></i> {{$systemFunctions.getLabel('action_5')}}</button>
                <button type="button" v-if="$parent.permissions.action_6" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" onclick="window.print();"><i class="feather icon-download"></i> {{$systemFunctions.getLabel('action_6')}}</button>
                <!-- <button type="button" v-if="$parent.permissions.action_0" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" onclick="window.print();"><i class="feather icon-download"></i> {{$systemFunctions.getLabel('action_refresh')}}</button> -->



                <!-- <router-link  to="/sys_user_group/add" :class="'btn btn-success mr-2 mb-2'" >{{$systemFunctions.getLabel('button_new')}}</router-link>            
                <b-button onclick="window.print();" class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action5" >{{$systemFunctions.getLabel('button_print')}}</b-button>
                <b-button @click="$system_functions.export_csv(get_csv_headers,modified_items)" class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action6" >{{$systemFunctions.getLabel('button_csv')}}</b-button>          
                <b-button class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action7" :pressed.sync="show_fitler_options">{{$systemFunctions.getLabel('button_search')}}</b-button>
                <b-button class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action8" :pressed.sync="show_column_controls">{{$systemFunctions.getLabel('button_column_control')}}</b-button>
                
                <b-button class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action0" @click="$parent.init" >{{$systemFunctions.getLabel('button_refresh')}}</b-button> -->
            </div>
        </div>    
        <div class="card mb-2">
            <div class="card-header d-print-none">
                {{$systemFunctions.getLabel('label_task')}}
            </div>
            <div class="card-body" style='overflow-x:auto'>
                <table class="table table-bordered">
                    <thead class="table-active">
                        <!-- <tr>
                            <th class="cell-nowrap d-print-none">{{$systemFunctions.getLabel('label_action')}}</th>
                            <th v-for="(column,i) in columns.csv" :key="'columnTable'+i">{{$systemFunctions.getLabel(column.label)}}</th>                            
                        </tr> -->
                    </thead>
                    <tbody class="table-striped table-hover">
                        <!-- <tr v-for="item in getFilteredItems" :key="item.id">
                            <td class="col-2 d-print-none">
                                <button class="btn btn-sm bg-gradient-primary dropdown-toggle waves-effect waves-light" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{$systemFunctions.getLabel('label_action')}}</button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);">
                                    <a v-if="permissions.action_2" class="dropdown-item text-info btn-sm" href="javascript:void(0)" @click="editItem(item)" data-toggle="modal" data-target="#modalAddEdit"><i class="feather icon-edit"></i> {{$systemFunctions.getLabel('action_2')}}</a>
                                    <a v-if="permissions.action_2" class="dropdown-item text-info btn-sm" href="javascript:void(0)" @click="assignTask(item)" data-toggle="modal" data-target="#modalAssignTask"><i class="feather icon-check-square"></i> {{$systemFunctions.getLabelTask('action_assign_Task')}}</a>                                    
                                </div>
                            </td>
                            <td class="col-1">{{ item.id }}</td>
                            <td class="col-7">{{ item.name }}</td>
                            <td class="col-1">{{ item.ordering }}</td>
                            <td class="col-2">{{ item.status }}</td>
                        </tr> -->
                    </tbody>
                </table>
                <!-- <Pagination :items = "items" :onChangePageOption="getItems" :pagination="pagination"  /> -->
            </div> 
        </div>    
    </div>
</template>

<script>
// import Pagination from '@/components/Pagination.vue';
// import ValidationError from '@/components/ValidationError.vue';
    export default {
        components: {
            // Pagination,
            // ValidationError,
        },

        data (){
            return {                
            }
        },
        mounted (){
                   
        },
        
        methods: {
            init(){
                

            },
            // setColumnCsv() {
            //     this.columns.csv=[];                
            //     this.columns.csv.push({
            //         label: this.$systemFunctions.getLabel('label_id'),
            //         key: 'id'
            //     });
            //     this.columns.csv.push({
            //         label: this.$systemFunctions.getLabel('label_name'),
            //         key: 'name'
            //     });
            //     this.columns.csv.push({
            //         label: this.$systemFunctions.getLabel('label_ordering'),
            //         key: 'ordering'
            //     });
            //     this.columns.csv.push({
            //         label: this.$systemFunctions.getLabel('label_status'),
            //         key: 'status'
            //     });
            // },
            // getItems(pagination){
            //     this.$systemFunctions.statusDataLoaded=0;
            //     this.$axios.get('/users-groups/get-items?page='+ pagination.current_page+'&perPage='+ pagination.per_page)
            //     .then(res => {
            //         this.$systemFunctions.statusDataLoaded = 1;
            //         if(res.data.error==''){
            //             this.items=res.data.items;                                                
            //         }
            //     }).catch(error => {                      
            //         this.$systemFunctions.statusDataLoaded = 1;
            //         if (error.response && error.response.data && error.response.data.error) {
            //             this.$systemFunctions.showResponseError(error.response.data);            
            //         } else {            
            //             this.$systemFunctions.showResponseFailure();
            //         }                              
            //     });
            // },            
            // addItem(){
            //     this.$systemFunctions.validationErrors='';
            //     this.item={};
            //     Object.assign(this.item, this.itemDefault);                
            // },
            // editItem(item){
            //     this.$systemFunctions.validationErrors='';
            //     this.item={};
            //     Object.assign(this.item, item);                            
            // },
            // assignTask(item){
            //     this.$systemFunctions.validationErrors='';
            //     this.refreshRole=false;
            //     let $this=this;
            //     //settimeout for rerender the div
            //     setTimeout(() => {
            //         $this.refreshRole=true;
            //         $this.item={};
            //         Object.assign($this.item, item);                
            //      }, 1);
                
            // },            
            // saveItem(){
                
            //     this.$systemFunctions.statusDataLoaded=0;
            //     this.$axios.post('/users-groups/save-item',new FormData(document.getElementById('formSave')))
            //     .then(res => {
            //         this.$systemFunctions.statusDataLoaded = 1;
            //         if(res.data.error==''){
            //             this.$systemFunctions.showSuccessMessage(this.$systemFunctions.getLabel('msg_success_saved'));
            //             $('#modalAddEdit').modal('hide');
            //             this.getItems(this.pagination);
            //         }
            //     }).catch(error => {                      
            //         this.$systemFunctions.statusDataLoaded = 1;
            //         if (error.response && error.response.data && error.response.data.error) {
            //             this.$systemFunctions.showResponseError(error.response.data);            
            //         } else {            
            //             this.$systemFunctions.showResponseFailure();
            //         }                              
            //     });
            // },
            // saveRole(form_id){
            //     this.$systemFunctions.statusDataLoaded=0;
            //     this.$axios.post('/users-groups/save-role/'+this.item.id,new FormData(document.getElementById(form_id)))
            //     .then(res => {
            //         this.$systemFunctions.statusDataLoaded = 1;
            //         if(res.data.error==''){                        
            //             this.$systemFunctions.showSuccessMessage(this.$systemFunctions.getLabel('msg_success_saved'));
            //             $('#modalAssignTask').modal('hide');
            //             this.getItems(this.pagination);
            //         }
            //     }).catch(error => {                      
            //         this.$systemFunctions.statusDataLoaded = 1;
            //         if (error.response && error.response.data && error.response.data.error) {
            //             this.$systemFunctions.showResponseError(error.response.data);            
            //         } else {            
            //             this.$systemFunctions.showResponseFailure();
            //         }                              
            //     });

            // },
            
        }

    }
</script>

<style  scoped>

</style>
