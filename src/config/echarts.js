const roadStatusOptions = (yData) => {
    return {
        title: {
            text: '道路拥堵程度分布',
            textStyle: {
                color: 'rgb(248, 188, 56)'
            }
        },
        tooltip: {},
        xAxis: {
            data: ['畅通','基本畅通','轻度拥堵','中度拥堵','严重拥堵'],
            axisLabel: {
                interval:0,
                rotate:40
            }
        },
        yAxis: {},
        series: [{
            name: '路况',
            type: 'bar',
            data: yData,
            itemStyle: {
                color: 'skyblue'
            }
        }]
    }
}

const roadSpeedOptions = (xData, yData) => {
    return {
        title: {
            text: '道路车流均速排行',
            textStyle: {
                color: 'rgb(248, 188, 56)'
            }
        },
        tooltip: {},
        xAxis: {
            data: xData,
            axisLabel: {
                interval:0,
                rotate:40
            }
        },
        yAxis: {},
        series: [{
            name: '车速',
            type: 'bar',
            data: yData,
            itemStyle: {
                color: 'skyblue'
            }
        }]
    }
}

const roadCarOptions = (xData, yData) => {
    return {
        title: {
            text: '车流量排行',
            textStyle: {
                color: 'rgb(248, 188, 56)'
            }
        },
        tooltip: {},
        xAxis: {
            data: xData,
            axisLabel: {
                interval:0,
                rotate:40
            }
        },
        yAxis: {},
        series: [{
            name: '车辆数量',
            type: 'bar',
            data: yData,
            itemStyle: {
                color: 'skyblue'
            }
        }]
    }
}

const carSpeedOptions = (xData, yData) => {
    return {
        title : {
            text: '车速占比扇形图',
            subtext: '（80-100占比，60-80占比，40-60占比，20-40占比，0-20占比）',
            textStyle: {
                color: 'rgb(248, 188, 56)'
            }
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            left: 'center',
            top : '20%',
            data: xData
        },
        series : [
            {
                name: '车速',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data: yData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }
}

module.exports = {
    roadStatusOptions,
    roadSpeedOptions,
    roadCarOptions,
    carSpeedOptions
}