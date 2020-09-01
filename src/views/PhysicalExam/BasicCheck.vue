<template>
  <div class="b-measure">
    <div class="grid">
      <h4>基本檢測</h4>
      <InputGroup :label="label[0]" :labelWth="'150px'"></InputGroup>
      <InputGroup :label="label[1]" :labelWth="'150px'"></InputGroup>
      <InputGroup :label="label[2]" :labelWth="'150px'"></InputGroup>
      <InputGroup :label="label[3]" :labelWth="'150px'"></InputGroup>
      <InputGroup :label="label[4]" :labelWth="'150px'"></InputGroup>
    </div>
  </div>
</template>
<script>
import { basicMeasuremnt } from "@/views/PhysicalExam/PhysicalList.js";
import InputGroup from "@/components/BSComps/InputGroup.vue";
export default {
  components: { InputGroup },
  data() {
    return {
      label: [],
    };
  },
  created() {
    this.label = basicMeasuremnt;
  },
};
</script>
<style lang="scss" scoped>
.b-measure {
  border-radius: 5px;
}
.grid {
  display: grid;
  grid-template-columns: 90px repeat(3, 1fr);
  grid-gap: 5px;
  padding: 5px;
  h4 {
    grid-row: 1 / 3;
    padding: 10px;
    border: 1px solid #ddd;
  }
}
</style>
