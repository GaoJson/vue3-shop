
<script setup lang="ts">
import { areaList } from '@vant/area-data';
import { AddressModel } from '@/store/modules/address';
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import router from '@/router';
import { showToast } from 'vant';
import { onActivated } from 'vue';

const route = useRoute()

var addressEdit = new AddressModel();

const searchResult = ref([])

var editFlag = false

function loadData() {
  const id = route.query.id?.toString()
  if (id != undefined) {
    editFlag = true
    addressEdit = AddressModel.getModel(Number.parseInt(id!,0))
  }
}
loadData()
onActivated(()=>{
  console.log("onActivatedonActivated")
  loadData()
})


function onSave(ele:Recordable){
  var model = new AddressModel()
  model.addressDetail = ele.addressDetail
  model.name = ele.name
  model.tel = ele.tel
  model.province = ele.province
  model.city = ele.city
  model.county = ele.county
  model.isDefault = ele.isDefault
  model.address = ele.province + ele.city + ele.county + ele.addressDetail
  if(editFlag) {
    model.id = addressEdit.id
  } else {
    model.id = 0
  }
  AddressModel.saveModel(model)
  showToast("保存成功！")
}

function onDelete() {
  AddressModel.deleteModel(addressEdit)

  router.back()
}

function onChangeDetail() {


}

</script>

<template>
<van-nav-bar  left-arrow @click-left="router.back"  style="position: fixed;width:min(100%,480px);" title="地址"></van-nav-bar>
<div style="height: 15px;"></div>
<van-address-edit style="padding-top:var(--van-nav-bar-height)"
  :area-list="areaList"
  :show-delete="editFlag"
  show-set-default
  show-search-result
  :address-info="editFlag?{
    name:addressEdit.name.toString(),
    tel:addressEdit.tel.toString(),
    addressDetail:addressEdit.addressDetail.toString(),
    province:addressEdit.province.toString(),
    city:addressEdit.city.toString(),
    county:addressEdit.county.toString(),
    isDefault:addressEdit.isDefault
  }:{}"

  :search-result="searchResult"
  :area-columns-placeholder="['请选择', '请选择', '请选择']"
  @save="onSave"
  @delete="onDelete"
  @change-detail="onChangeDetail"
  
/>


</template>