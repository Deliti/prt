<template>
    <ul class="munu-list">
        <!-- <li class="item">保存导轨设计</li>
        <li class="item">
            <a class="f_origin" @click="download($event)">另存导轨设计</a></li>
        <li class="item">
            <input type="file" id="uploadInput" class="hide" @change="importData">
            <label for="uploadInput">导入导轨设计</label>
        </li> -->
        <li class="item"
            @click="goback">
            退出
        </li>
    </ul>
</template>

<script>
import router from '@/router'
import { downLoadFile } from '@/config/mUtils'
import { mapState,mapMutations } from 'vuex'
import { saveTrack,importTrack } from '@/service/getData'

export default {
    computed:{
        ...mapState(['lineData'])
    },
    methods:{
        ...mapMutations(['SETMAPFLAG']),
        async download(event){
            const eventId = this.$route.params.id;
            const allTrack = await saveTrack({eventId});
            if(allTrack.result != 0){
                this.$message({
                    message: allTrack,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            const content = allTrack.detail
            downLoadFile(event.target,'line.json',content);
        },
        importData(event){
            const fread = new FileReader();
            const file = event.target.files[0];
            fread.onload = async res => {
                let jsonStr = res.currentTarget.result;
                jsonStr = JSON.parse(jsonStr);
                const eventId = this.$route.params.id;
                const lineData = await importTrack(eventId,jsonStr);
                if(lineData.result != 0){
                    this.$message({
                        message: lineData,
                        type: 'warning',
                        duration: 2000
                    })
                    return false;
                }
                lineData.detail.map(item => {
                    this.$root.eventHub.$emit('insertLine',item,true)
                })
            }
            fread.readAsText(file)
        },
        goback(){
           this.SETMAPFLAG(false);
           router.push('/'); 
        }
    }
}
</script>

<style lang="less" scoped>
.munu-list{
    position: absolute;
    z-index: 1;
    left: 0;
    top:45px;
    background: rgba(255, 255, 255, .9);
    border:1px solid rgba(0, 0, 0, .5);
    border-radius: 0 0 8px 8px;
    .item{
        width: 100px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-bottom: 1px solid rgba(0, 0, 0, .5);
        &:hover,&:active{
            background:rgba(0, 0, 0, .5); 
        }
        a{
            &:hover,&:active{
                color: #FCB415;
            }
        }
    }
    .item:last-child{
        border-bottom: none
    }
}
</style>
