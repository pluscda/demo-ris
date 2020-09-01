<template>
  <b-input-group :prepend="title" :style="[{ '--wth': `${labelWth}` }]" class="group m-0">
    <slot></slot>
    <!-- <p>llll</p> -->
  </b-input-group>
</template>
<script>
export default {
  props: {
    label: { type: String, default: "" },
    labelWth: { type: String, default: "95px" }
  },
  data() {
    return {
      title: ""
    };
  },

  created() {
    this.title = this.label;
  }
};
</script>
<style lang="scss" scoped>
.input-group {
  .form-control {
    height: auto;
  }
}

.input-group {
  height: 40px;
}
</style>
