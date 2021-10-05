<template>
    <div>
        <section id="description" class="card">
            <div class="card-header">
                <h4 class="card-title">Welcome</h4>
            </div>
            <div class="card-content">
                <div class="card-body">
                    <div class="card-text">
                      {{$systemFunctions.user.name}}
                    </div>
                </div>
            </div>
        </section>
        <!--/ Description -->
    </div>
</template>

<script>

    export default {
    }
</script>

<style  scoped>

</style>
