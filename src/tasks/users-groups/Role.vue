<template>    
    <div v-if="$parent.permissions.action_2 && $parent.method=='role'">
        <div class="card d-print-none mb-2">
            <div class="card-body">
              <router-link :to="'/'+$parent.base_url" class="mr-2 mb-2 btn btn-sm bg-gradient-primary" ><i class="feather icon-corner-up-left"></i> {{$systemFunctions.getLabel('action_back')}}</router-link>
            </div>
        </div>  
        <div class="accordion mb-2" v-if="'id' in $parent.item">
            <div class="card" v-for="(modules_tasks_gropus, id) in get_modules_tasks_tree" :key="id">
                <div class="card-header p-1">
                    <a class="btn btn-sm" data-toggle="collapse" :href="'#root_module_'+id">{{modules_tasks_gropus.name}}</a>                    
                </div>
                <div :id="'root_module_'+id" class="collapse">
                    <div class="card-body" style='overflow-x:auto'>
                        <form :id="'form_save_task_'+id">
                            <table class="table table-sm table-bordered">
                               <thead class="table-active">
                                    <tr>
                                        <th :colspan="modules_tasks_gropus.max_level"><small>{{$systemFunctions.getLabel('label_module_task_name')}}</small></th>
                                        <th v-for="(j,i) in $parent.module_task_max_action" :key="'th'+i">
                                            <label><input type="checkbox" :data-type="'header_action_'+i+'_'+id" class="header_action"><small>{{$systemFunctions.getLabel('action_'+i)}}</small></label>
                                        </th>                            
                                    </tr>
                                </thead>
                                <tbody class="table-striped table-hover">
                                    <tr v-for="(module_task) in modules_tasks_gropus.modules_tasks" :key="module_task.id"> 
                                        <td v-for="(j, i) in modules_tasks_gropus.max_level" :key="'td'+i">                            
                                            <label v-if="module_task.level==j">
                                                <input type="hidden" :name="'tasks['+module_task.id+'][task_id]'" :value="module_task.id" v-if="module_task.type=='TASK'" />
                                                <input type="checkbox" :data-id="module_task.id"  :class="'task_action '+module_task.parent_class" />
                                                <small> {{module_task.name_en}}</small>
                                            </label>
                                        </td>
                                        <td v-for="(j, i) in $parent.module_task_max_action" :key="'td_action'+i" >                                            
                                            <label v-if="module_task.type=='TASK'">                                                            
                                                <input type="checkbox" 
                                                :class="'header_action_'+i+' header_action_'+i+'_'+id+' '+module_task.parent_class+' '+'parent_'+module_task.id" 
                                                v-model="module_task['action_'+i]"
                                                value="1"
                                                :name="'tasks['+module_task.id+'][actions]['+i+']'"
                                                :title="$systemFunctions.getLabel('action_'+i)"
                                                />                              
                                            </label> 
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="15" class="text-center">
                                            <button @click="saveRole('form_save_task_'+id)" type="button" class="btn btn-sm bg-gradient-success">{{$systemFunctions.getLabel('button_save')}}</button>                            
                                        </td>
                                    </tr>
                                    
                                </tfoot>
                            </table>
                        </form>
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

<script>
export default {
  name: 'Role',    
    mounted (){
        $(document).ready(function()
        {
            $(document).off("click", ".header_action");
            $(document).on("click",'.header_action',function()
            {
                if($(this).is(':checked'))
                {
                    $('.'+$(this).attr('data-type')).prop('checked', true);
                }
                else
                {
                $('.'+$(this).attr('data-type')).prop('checked', false);
                }
            });
            $(document).off("click", ".task_action");
            $(document).on("click",'.task_action',function()
            {

                if($(this).is(':checked'))
                {
                    //$('.parent_'+$(this).attr('data-id')+':not(.header_action_3)').prop('checked', true);
                    $('.parent_'+$(this).attr('data-id')+':not(.header_action_3,.header_action_7,.header_action_8)').prop('checked', true);
                }
                else
                {
                    $('.parent_'+$(this).attr('data-id')).prop('checked', false);
                }
            });
        });      
    },
    data(){
        return {
            modules_tasks_tree:{}
        }
    },
    created(){

    },
    computed:{
        get_modules_tasks_tree:function(){ 
            let items={};
            let modules_tasks=this.$parent.modules_tasks.tree;
            let userGroup=this.$parent.item;
            let module_task_max_action=this.$parent.module_task_max_action;

            for(let i=0;i< modules_tasks.length;i++)
            {
                if(modules_tasks[i].level==1)
                {
                    console.log();
                    let name=JSON.parse(modules_tasks[i].module_task.name);
                    items[modules_tasks[i].module_task.id]={name:name[this.$systemFunctions.getLanguage()]?name[this.$systemFunctions.getLanguage()]:'EMPTY_MENU',modules_tasks:[],max_level:1};
                    for(let j=i;j< modules_tasks.length;j++)
                    {
                        let item={};
                        console.log(modules_tasks[j].module_task);
                        Object.assign(item,modules_tasks[j].module_task);
                        item.level=modules_tasks[j].level;
                        item.parent_class=modules_tasks[j].parent_class;
                        items[modules_tasks[i].module_task.id].modules_tasks.push(item);
                        if(item.level>items[modules_tasks[i].module_task.id].max_level)
                        {
                            items[modules_tasks[i].module_task.id].max_level=item.level;              
                        }                        
                        for(let k=0;k<module_task_max_action;k++){
                            if(userGroup['action_'+k].indexOf(','+item.id+',')>=0)
                            {
                                item['action_'+k]=true;
                            }
                            else
                            {
                                item['action_'+k]=false;
                            }                            
                        }
                        if(((j+1)==modules_tasks.length)||(modules_tasks[j+1].level==1))            
                        {
                            i=j;              
                            break;
                        }
                    }
                            
                }
            }
            //console.log(items);
            return items;
        }           
    },
    methods:{
        saveRole(form_id){
            this.$systemFunctions.statusDataLoaded=0;
            this.$axios.post('/users-groups/save-role/'+this.$parent.item.id,new FormData(document.getElementById(form_id)))
            .then(res => {
                this.$systemFunctions.statusDataLoaded = 1;
                this.$systemFunctions.showSuccessMessage(this.$systemFunctions.getLabel('msg_success_saved'));
                this.$systemFunctions.loadListData=true;
            }).catch(error => {                      
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