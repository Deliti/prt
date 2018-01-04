<template>
    <div>
        <div class="key-wrap">
            <div class="speed-box" :class="!show?'speed-hide':''" @click="toggle">
                <div class="speed-selected">{{seleted.text}}</div>
                <ul class="opts-box" v-if="showOption">
                    <li v-for="(item,index) in option"
                        class="speed-selected"
                        :key="index"
                        @click.stop="change(item)"
                        >
                        {{item.text}}    
                    </li>
                </ul>
            </div>
            <p class="lebel">倍速调节</p>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            seleted:this.option[0],
            showOption:false
        }
    },
    props:{
        option:{
            type:Array,
            required:true
        },
        show:{
            type:Boolean,
            required:true
        }
    },
    watch:{
        show:function(){
            this.seleted = this.option[0];
        }
    }, 
    methods:{
        toggle(){
            if(!this.show) return;
            this.showOption = !this.showOption;
        },
        change(item){
            this.seleted = item;
            this.showOption = false;
            this.$emit('change',item.k)
        }
    }
}
</script>

<style lang="less" scoped>
@screen-md:1200px;
@screen-lg:1800px;

.key-wrap{
    float: left;
    width: 100px;
    @media (min-width:@screen-lg) {
        width: 150px;
    }
    .speed-box{
        border:1px solid #000;
        box-sizing: border-box;
        padding:5px 5px 5px 35px;
        background: #3a3e46 url('../img/kspeed.png') no-repeat 10px center;
        background-size: 20px 10px;
        position: relative;
        cursor: pointer;
        @media (min-width:@screen-lg) {
            padding-left: 40px;
            background-size: 30px 15px;
        }
        .speed-selected{
            background: #FCB415;
            width: 60px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            color: #3a3e46;
            @media (min-width:@screen-lg) {
                width: 110px; 
                height: 30px;
                line-height: 30px;
            }
        } 
        .opts-box{
            position: absolute;
            right: 3px;top: 30px;
            li{
                margin-bottom: 2px;
            }
        }
    } 
    .speed-hide{
        background-image: url('../img/kspeed-disabled.png');
    }
}
</style>
