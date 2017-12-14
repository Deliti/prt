<template>
   <div class="tips-title gray_2 f_origin">
        {{name}} 
    </div>
</template>


<script>
export default {
    props:{
        name:String
    }
}
</script>

<style lang="less" scoped>
@screen-md:1200px;
@screen-lg:1800px;

.tips-title{
    position: absolute;
    left: 0;top:0;
    z-index: 1;
    width: 100%;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    padding-left: 50px;
    border-top: 2px solid #eee;
    border-bottom: 2px solid #eee;
    @media (min-width:@screen-lg) {
        height: 45px;
        line-height: 45px;
    }
}
</style>

