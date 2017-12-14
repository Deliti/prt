<template>
    <section>
        <List 
            :name="name"
            :isHttp="isHttp"
            :list="saveList"
            @itemHandle="focusIt"
            @addHandle="addNew"
        ></List>
    </section>
</template>

<script>
import router from '@/router'
import {mapState,mapMutations} from 'vuex';
import { getMaterial } from '@/service/getData'
import List from '../List'

export default {
    data(){
        return {
            saveList:[],
            isHttp:false,
            name:'车辆存储列表'
        }
    },
    computed:{
         ...mapState(['mapFlag'])
    },
    created(){
        this.getList();
    },
    components:{
        List
    },
    methods:{
        ...mapMutations(['SETSAVEEDITID']),
        async getList(){
            const params = {
                "eventId": this.$route.params.id, //事件id
                "materialType": 3
            }
            this.isHttp = true;
            const saveList = await getMaterial(params)
            if(saveList.result != 0){
                this.$message({
                    message: saveList,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            this.isHttp = false;
            this.saveList = saveList.detail[3];
        },
        goBack(){
            window.history.go(-1);
        },
        addNew(){
            this.SETSAVEEDITID('add');
            router.push('editSave')
        },
        focusIt(item){  // 选中这条轨迹并进行编辑
            const {id} = item;
            this.SETSAVEEDITID(id);
            this.$root.eventHub.$emit('foucsIt','save');
            router.push(`editSave?save=${id}`)
        }
    }
}
</script>


// <style lang="less" scoped>
// @screen-md:1200px;
// @screen-lg:1800px;

// .aside-menu-box{
//     box-sizing: border-box;
//     padding: 20px 40px 0;
//     ul{
//         overflow: hidden;
//         li{
//             width: 80px;
//             height: 80px;
//             margin-bottom:20px; 
//             @media (min-width:@screen-lg) {
//                  width: 150px;
//                  height: 150px;
//                  line-height: 150px;
//             }
//             &:nth-child(even){
//                 float:right;
//             }
//             &:nth-child(odd){
//                 float: left;;
//             }
//         }
//         .text{
//             text-align: center;
//             line-height: 80px;
//         }
//         .add{
//             background: url('../img/add.png') no-repeat center center;
//             background-size: 50% 50%;
//             cursor: pointer;
//         }
//     }
// }
// </style>

