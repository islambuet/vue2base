<template>
    <div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="$systemFunctions.validationErrors">
        <div v-html="$systemFunctions.validationErrors">
        
        </div>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="$systemFunctions.validationErrors=''">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
</template>

<script>
    export default {

    }
</script>

<style  scoped>

</style>
