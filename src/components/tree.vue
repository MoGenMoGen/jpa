<template>
  <div class="tree-menu">
    <ul v-for="(item,index) in data" :key="index">
      <tree-item :data="item"></tree-item>
    </ul>
  </div>
</template>

<script>
  import TreeItem from "./treeItem";
  export default {
    props: {
      data: {
        type: [Object, Array],
        required: true
      }
    },
    components: {
      TreeItem,
    }
  }
</script>
