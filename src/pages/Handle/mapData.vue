<template>
   <section class="parent aotu">
        <div class="tips-title gray_2 f_origin">
            可视范围轨道数据
        </div>
        <table class="f_origin">
            <tr v-for="(listItem,index) in tableData"
                :key="index"
                class="toptr">
                <td class="leveltitle" colspan="3">{{listItem.text}}</td>
                <td colspan="2">{{levelData[listItem.key]?listItem.rule(levelData[listItem.key]):0}}</td>
            </tr>
            <tr>
                <td rowspan="6" colspan="1">拥堵级别</td>
            </tr>
            <tr v-for="(roadItem,index) in roadStatus"
                :key="index">
                <td class="leveltitle" colspan="1">{{roadItem.text}}</td>
                <td colspan="3">{{levelData['roadStatus']?getCount(levelData['roadStatus'][roadItem.key]):0}}</td>
            </tr>
        </table>
    </section>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data(){
        return {
            tableData:[{
                text: '可视范围内车辆总数',
                key: 'carCount',
                rule: val => val
            },{
                text: '可视范围内车速均值',
                key: 'carSpeedAve',
                rule: val => val.toFixed(2)
            }],
            roadStatus:[{
                text: '畅通',
                key: '1'
            },{
                text: '基本畅通',
                key: '2'
            },{
                text: '轻度拥堵',
                key: '3'
            },{
                text: '中度拥堵',
                key: '4'
            },{
                text: '严重拥堵',
                key: '5'
            }]
        }
    },
    computed: {
        ...mapState(['levelData'])
    },
    methods: {
        getCount(arr){
            return arr.length
            let nameStr = '';
            arr.map(item => {
                nameStr += `${item.name}、`
            })
            return nameStr
        }
    }
}
</script>

<style lang="less" scoped>
.aotu{
    height: 600px;
    overflow-y: scroll;
}
table{
    width: 100%;
    .toptr{
       
    }
}
</style>


