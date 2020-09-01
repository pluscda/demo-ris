<template>
  <b-card no-body class="mx-1 my-2">
    <b-card-header :class="getBgClass">
      <b-row no-gutters>
        <b-col cols="6">{{ title }}</b-col>
      </b-row>
    </b-card-header>
    <b-card-text class="text-left py-1">
      <b-container v-if="itemInfo.length > 0" fluid class="px-1" style="max-height:520px; overflow-y:auto;">
        <b-row v-for="item in itemInfo" v-bind:key="item.id" no-gutters>
          <b-col sm="12" class="p-1">
            <b-input-group>
              <!-- prepend -->
              <b-input-group-prepend>
                <b-button style="min-width:90px" :variant="item.prependVariant" @click="OnEmit(item)">{{ item.label }}</b-button>
              </b-input-group-prepend>
              <!-- main -->
              <b-input v-if="BtnClick" v-model="item.value" readonly style="min-width:350px;" />
              <b-input v-else v-model="item.value" readonly style="min-width:200px;" />
              <!-- append btn -->
              <b-input-group-append v-show="BtnClick">
                <b-button variant="danger" @click="OnClickBtn(item)">取消</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>

          <!-- <div v-for="item in itemInfo" v-bind:key="item.id" class="row">
            <div class="col q-chip--dense info_lb">{{ item.label }}:&nbsp;</div>
            <div class="col q-chip--dense info_val" v-html="item.value"></div>
          </div> -->
        </b-row>
      </b-container>
      <b-container v-else fluid class="px-1">
        <b-row no-gutters>
          <div class="col q-chip--dense info_center">沒有資訊</div>
        </b-row>
      </b-container>
    </b-card-text>
  </b-card>
</template>

<script>
import Vue from "vue";

export default {
  name: "infoCard",
  props: {
    title: null,
    itemInfo: null,
    colorStyle: null,
    BtnClick: { type: Function, default: null },
    maxHeight: { type: Number, default: 1080 },
    prependVariant: {type: String ,default: "secondary"},
    toEmit: {type: Function, default: null},
  },
  data() {
    return {};
  },
  computed: {
    linkStyle() {
      return {
        maxHeight: 200 + "px",
        overflow: "auto"
      };
    },
    getBgClass() {
      if (this.colorStyle == null || this.colorStyle == "0") return "bg-primary text-white cardHeader";
      else if (this.colorStyle == "1") return "bg-secondary text-white cardHeader";
      else if (this.colorStyle == "3") return "bg-info text-white cardHeader";
      else return "bg-primary text-white cardHeader";
    }
  },
  methods: {
    OnEmit(x){
      if(this.toEmit){
        this.toEmit(x)
      }
    },
    OnClickBtn(x) {
      if (this.BtnClick) {
        this.BtnClick(x);
      }
    }
  },
  mounted() {}
};
</script>

<style scoped>
.info_val {
  text-align: left;
}

.info_lb {
  text-align: right;
}

.info_center {
  text-align: center;
}
</style>
