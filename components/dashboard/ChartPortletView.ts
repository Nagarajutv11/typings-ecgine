import { Vue, Component, Prop, Lifecycle } from 'av-ts'
import { DashboardInput } from './DashboardInput'
import { Dashboard } from './Dashboard'
import { $e } from '../Ecgine'
import { EntityRegistry } from '../EntityRegistry'
import { DatabaseObject } from '../DatabaseObject'
import { Portlet } from './Portlet'
import { DashboardService } from './DashboardService'
import { ListOfMapOfObjects } from '../SavedSearch'
import { ReportInput } from '../ReportInput';
import * as portlet from './PortletView.vue'

@Component({ components: { portlet } })
export default class ChartPortletView extends Vue {

    @Prop
    input: any

    type: string = ''
    chartData: any = undefined
    chartOptions: any = undefined

    xColumn: string = ''
    yColumn: string = ''
    groupBy: string = ''

    @Lifecycle
    mounted() {
        let ins = this.input.portlet.input;
        let rvi: ReportInput;
        if (ins.reportBuilder) {
            rvi = { isPortlet: true, filterValues: {}, reportBuilder: '' }
        } else {
            rvi = { isPortlet: true, filterValues: {}, reportBuilder: ins.searchBuilder }
        }
        this.xColumn = this.input.portlet.xColumn
        this.yColumn = this.input.portlet.yColumn
        this.groupBy = this.input.portlet.groupBy
        //We run this report and        
    }

    createChart(data: ListOfMapOfObjects) {
        switch (this.input.portlet.chartType) {
            case 'PieChart':
                this.createPieChart(data);
                break;
            case 'LineChart':
                break;
            case 'AreaChart':
                break;
            case 'StackedAreaChart':
                break;
            case 'BubbleChart':
                break;
            case 'ScatterChart':
                break;
            case 'BarChart':
                break;
            case 'StackedBarChart':
                break;
        }
    }

    createPieChart(data: ListOfMapOfObjects) {
        //Pie chart
        this.type = 'Pie'
        let labels: string[] = [];
        let series: number[] = [];
        this.chartData = {
            labels,
            series,
        }

        data.value.forEach(record => {
            let xValue = record[this.xColumn];
            if (!xValue) {
                xValue = "";
            }
            let num = record[this.yColumn];
            if (!num) {
                num = 0;
            }
            labels.push(xValue);
            series.push(num);
        });

        this.chartOptions = {
            lineSmooth: false
        }
    }

    createLineChart(data: ListOfMapOfObjects) {
        //Line chart
        this.type = 'Line'
        this.chartData = this.getChartData(data)

        this.chartOptions = {
            //TODO LegendPosition
            chartPadding: { right: 40 }
        }
    }

    getChartData(data: ListOfMapOfObjects): { labels: string[], series: any[][] } {
        let labels: string[] = []
        let series: any[][] = []

        let seriesGroups: { [key: string]: any[] } = {}

        data.value.forEach(record => {
            let groupBy = record[this.groupBy];
            let ser = seriesGroups[groupBy];
            if (groupBy && !ser) {
                ser = [];
                series.push(ser);
                seriesGroups[groupBy] = ser;
            }
            if (!ser) {
                ser = [];
            }

            let xValue = record[this.xColumn];
            if (!xValue) {
                xValue = "";
            }


            let yValue = record[this.yColumn];
            if (!yValue) {
                yValue = 0;
            }
            labels.push(xValue);
            series.push(yValue);
        });
        return { labels, series }
    }

    createAreaChart(data: ListOfMapOfObjects) {

    }

    createStackedAreaChart(data: ListOfMapOfObjects) {

    }

    createBubbleChart(data: ListOfMapOfObjects) {

    }

    createScatterChart(data: ListOfMapOfObjects) {

    }
    createBarChart(data: ListOfMapOfObjects) {
        //Line chart
        this.type = 'Bar'
        this.chartData = this.getChartData(data)
        this.chartOptions = {
            stackBars: true
        }
    }

    createStackedBarChart(data: ListOfMapOfObjects) {

    }
}