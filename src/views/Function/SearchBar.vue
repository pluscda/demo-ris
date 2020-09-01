<template>
  <div class="control-section accordion-control-section">
    <b-card no-body class="mx-1">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6">員工管理．查詢作業</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <b-container fluid class="px-1">
          <b-row no-gutters>
            <b-col sm="2" class="px-1">
          <q-input
            class="col-2 q-mr-lg"
            v-model="no"
            label="使用者代碼"
            placeholder="輸入篩選使用者代碼"
            clearable
            @keyup.enter="onFilter"
          />
          <q-input
            class="col-2 q-mr-lg"
            v-model="name"
            label="使用者姓名"
            placeholder="輸入篩選使用者姓名"
            clearable
            @keyup.enter="onFilter"
          />
          <!-- <q-select
            class="col-2 q-mr-lg"
            v-model="role"
            :options="roles"
            option-value="No"
            option-label="Name"
            clearable
            label="授權角色"
          /> -->
          <div class="col-4 q-mt-lg">
            <q-radio v-model="isEnabled" val="true" label="啟用" />
            <q-radio v-model="isEnabled" val="false" label="未啟用" />
            <!-- <q-radio v-model="isEnabled" val label="啟用及未啟用" /> -->
          </div>
          <div class="col q-mt-md">
            <q-btn icon="fas fa-filter" label="篩選" @click="onFilter" />
            <q-btn icon="clear" label="清除" @click="onClear" />
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </div>
</template>
<script>
import Vue from "vue";

export default {
  // props: ["roles"],
  data() {
    return {
      no: null,
      name: null,
      role: null,
      isEnabled: ""
    };
  },
  methods: {
    onFilter: function() {
      this.$emit("filter", this);
    },
    onClear: function() {
      this.no = null;
      this.name = null;
      this.role = null;
      this.isEnabled = "";

      this.$emit("filterClear", this);
    }
  }
};
</script>
