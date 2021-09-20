<template>
    <div>
        <form :id="'form_column_control'">
            <!-- <input type="hidden" name="controller" :value="controller">
            <input type="hidden" name="method" :value="method"> -->
            
            <div class="row">
                <template v-for="(column, key) in columns.all">
                    <div class="col-sm-6 col-md-3" :key="'cc_'+key" v-if="column.hideable">                    
                        <!-- <label><input type="checkbox" :value="key" name="hidden_columns[]" :checked="column.hidden" @change="toggle_control_columns($event,column)"> {{column.label}}</label> -->
                        <label><input type="checkbox" :value="key" name="hidden_columns[]" v-model="column.hidden" @change="toggle_control_columns($event,column)"> {{column.label}}</label>
                    </div>
                </template>
            </div>
              <div class="text-center" v-if="allow_save">
                  <button type="button" class="btn btn-sm bg-gradient-primary" onclick="window.print();"><i class="feather icon-save"></i> {{$systemFunctions.getLabel('button_save_column_controls')}}</button>
              </div>
        </form>
    </div>
</template>

<script>
export default { 
    name: "ColumnControl",
    data(){
        return {
            checked:true,
        }
    },
    props: {
        columns: {
            type: Object,
            required: true
        },
        allow_save:{
            type: Boolean,
            default:true
        },
        // controller: {
        //     type: String,
        //     required: true
        // },
        // method: {
        //     type: String,
        //     required: true
        // },
        // control_columns: {
        //     type: Array,
        //     required: true
        // },
        // hidden_columns: {
        //     type: Array,
        //     required: true
        // },
        // on_change_control: {
        //     type: Function,
        //     default: ()=> (console.log('default on change called'))            
        // },
    }, 
    methods:{
        toggle_control_columns:function (event,item)
        {
            console.log(this.columns);
            // setTimeout(() => {
            //     if(!item.selected)
            //     {   
            //         this.hidden_columns.splice(this.hidden_columns.indexOf(item.value), 1);
            //     }
            //     else
            //     {
            //         this.hidden_columns.push(item.value);
            //     }
            //     this.on_change_control();            
            // }, 0);
        },
        save_hidden_columns:function()
        {
            this.$system_variables.status_data_loaded=0; 
            var form_data=new FormData(document.getElementById('form_column_control'));       
            form_data.append ('token_auth', this.$system_variables.user.token_auth); 
            this.$axios.post('/column_control/save',form_data)
            .then(response=>{          
                this.$system_variables.status_data_loaded=1;
                if(response.data.error_type)        
                {            
                    this.$bvToast.toast(this.$system_variables.get_label(response.data.error_type), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});
                }
                else
                {
                    this.$bvToast.toast(this.$system_variables.get_label("Saved SuccessFully"), {title: this.$system_variables.get_label('label_Success'),variant:'Success',autoHideDelay: 5000,appendToast: false});              
                }                 
            })
            .catch(error => {   
                this.$system_variables.status_data_loaded=1;
                this.$bvToast.toast(this.$system_variables.get_label("Response Error"), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});   
            });
        }
    }

};
</script>
