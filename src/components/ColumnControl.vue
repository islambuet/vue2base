<template>
    <div class="card d-print-none mb-2">
        <div class="card-body">            
            <div class="row">
                <template v-for="(column, key) in columns.all">
                    <div class="col-sm-6 col-md-3" :key="'cc_'+key" v-if="column.hideable">                                                
                        <label><input type="checkbox" :value="key" :checked="columns.hidden.indexOf(key)>=0?false:true" @change="toggleControlColumns($event)" > {{column.label}}</label>
                    </div>
                </template>
            </div>
            <div class="text-center" v-if="allow_save">
                <button type="button" class="btn btn-sm bg-gradient-primary" onclick="window.print();"><i class="feather icon-save"></i> {{$systemFunctions.getLabel('button_save_column_controls')}}</button>
            </div>
        </div>
    </div>
</template>

<script>
export default { 
    name: "ColumnControl",    
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
    }, 
    methods:{
        toggleControlColumns:function (event)
        {
            let key=event.srcElement.value;            
            if(event.srcElement.checked)
            { 
                //this.columns.hidden.splice(this.columns.hidden.indexOf(key), 1);                                  
                this.columns.hidden=this.columns.hidden.filter(function(value) {return value !== key});
            }else
            {
                this.columns.hidden.push(key);
            } 
            console.log(this.columns.hidden);            
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
