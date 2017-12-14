<template>
    <div>
         <List 
            :name="name"
            :isHttp="isHttp"
            :list="stationList"
            @itemHandle="focusIt"
            @addHandle="addNew"
        ></List>
    </div>
</template>

<script>
import router from '@/router'
import { getMaterial } from '@/service/getData'
import List from '../List'

export default {
    data(){
        return {
            stationList:[],
            isHttp:false,
            name:'站台列表'
        }
    },
    created(){
        this.getList();
    },
    components:{
        List
    },
    methods:{
        async getList(){
            const params = {
                "eventId": this.$route.params.id, //事件id
                "materialType": 2
            }
            this.isHttp = true;
            const stationData = await getMaterial(params)
            if(stationData.result != 0){
                this.$message({
                    message: stationData,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            this.isHttp = false;
            this.stationList = stationData.detail[2];
        },
        goBack(){
            window.history.go(-1);
        },
        addNew(){
            router.push('editStation')
        },
        focusIt(item){  // 选中这条轨迹并进行编辑
            const {id} = item;
            this.$root.eventHub.$emit('foucsIt','station');
            router.push(`editStation?stop=${id}`)
        }
    }
}
</script>