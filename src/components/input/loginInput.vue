<script setup lang="ts">

const props = defineProps(
    {   
        modelValue:{type:String},
        placeholder:{data:String,default:"请输入"},
        inputType:{type:String,default:"text"}
    }
)

</script>

<template>

<div class="input">
    <input
    @input="$emit('update:modelValue', ($event.target as any).value )"
    :placeholder="placeholder" :type="inputType"/>
    
</div>


</template>

<style scoped lang="less">

.input{
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    height: 40px;
   
 input{
    padding-left: 20px;
    border-radius: 40px;
    background-color: #f2f1f1;
    border: 0;
    width: 100%;
    height: 100%;
 }

}


</style>