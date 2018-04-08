<template>
    <div>
        <List 
            :name="name"
            :isHttp="isHttp"
            :list="lineList"
            @itemHandle="focusLine"
            @addHandle="addNew"
        ></List>
    </div>
</template>

<script>
import router from '@/router'
import {mapState,mapMutations} from 'vuex';
import { getMaterial,getMaterialV2,addTrack,editTrack } from '@/service/getData'
import List from '../List'

export default {
    data(){
        return {
            lineList:[],
            isHttp:false,
            name:'轨道列表'
        }
    },
    computed:{
        ...mapState(['mapFlag'])
    },
    created(){
        this.getList();
        this.$root.eventHub.$on('addCountLine',this.addCountLine);
    },
    components:{
        List
    },
    methods:{
        async getList(){
            const params = {
                "eventId": this.$route.params.id, //事件id
                "materialType": 1
            }
            this.isHttp = true;
            const trackList = await getMaterialV2(params)
            if(trackList.result != 0){
                this.$message({
                        message: trackList.message,
                        type: 'warning',
                        duration: 2000
                })
                return false;
            }
            this.isHttp = false;
            this.lineList = trackList.detail[1].edgeList;
        },
        addNew(){
            this.$message('请在地图上绘制轨道');
            this.$root.eventHub.$emit('openDrawer');
        },
        focusLine(item){  // 选中这条轨迹并进行编辑 
            this.$root.eventHub.$emit('foucsIt',{
                type:'line',
                id:item.edgeId
            });
            router.push(`editLine?track=${item.edgeId}`)
        },
        addCountLine(lines){
            this.getList(); 
        }
    }
}
</script>

