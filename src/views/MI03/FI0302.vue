<template>
  <div class="pageContent">
    <b-card no-body>
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6" class="float-left text-left">報告片語維護作業</b-col>
        </b-row>
      </b-card-header>
      <RxP />
    </b-card>
  </div>
</template>

<script>
import RxP from "@/components/CI0302ReportPhrase";

export default {
  name: "FI0302",
  components: { RxP }
};
</script>
<style>
.pageContent {
  box-shadow: 0 -130px 130px black;
}
</style>
