import { Vue, Component, Prop, Lifecycle } from 'av-ts'
import { DateRangePair } from '../DateRangePair'

@Component
export default class DateRangeField extends Vue {

    @Prop
    value: DateRange;

    customDisable: boolean = false;
    custom: DateRangePair | null = null;

    selectedIndex: number = -1;
    selectedValue: DateRange | null = null;
    ranges: DateRange[] = []

    @Lifecycle
    created() {
        this.customDisable = true
        this.custom = { start: new Date(), end: new Date(), name: 'Custom' };
    }
    @Lifecycle
    mounted() {
        this.prepareDateRanges();
        if (this.value) {
            for (let r of this.ranges) {
                if (r.name == this.value.name) {
                    this.selectedValue = r;
                    this.selectedIndex = this.ranges.indexOf(r)
                    break;
                }
            }
        }
    }

    onDateChange(e: any) {
        let i = parseInt(e.target.value) + 1;
        let v: DateRange | null;
        if (i == 0) {
            v = null;
        } else {
            v = this.ranges[i - 1];
        }
        this.selectedValue = v;
        if (v == null || v.displayName == 'Custom') {
            this.customDisable = false;
        } else {
            this.customDisable = true;
            let pair = this.findPair(v);
            this.$emit('change', pair)
        }
    }

    findPair(range: DateRange): DateRangePair {
        return { start: new Date(), end: new Date(), name: range.name };
    }

    onFromChange(e: any) {
        if (this.custom) {
            this.custom.start = e.target.value
            this.$emit('change', this.custom)
        }
    }

    onToChange(e: any) {
        if (this.custom) {
            this.custom.end = e.target.value
            this.$emit('change', this.custom)
        }
    }

    prepareDateRanges() {
        let ranges: DateRange[] = []
        ranges.push({ name: 'ThisWeek', id: 0, displayName: 'This Week' })
        ranges.push({ name: 'ThisMonth', id: 1, displayName: 'This Month' })
        ranges.push({ name: 'ThisFiscalYear', id: 2, displayName: 'This Fiscal Year' })
        ranges.push({ name: 'ThisFiscalQuarter', id: 3, displayName: 'This Fiscal Quarter' })
        ranges.push({ name: 'NextWeek', id: 4, displayName: 'Next Week' })
        ranges.push({ name: 'NextMonth', id: 5, displayName: 'Next Month' })
        ranges.push({ name: 'NextFiscalYear', id: 6, displayName: 'Next Fiscal Year' })
        ranges.push({ name: 'NextFiscalQuarter', id: 7, displayName: 'Next Fiscal Quarter' })
        ranges.push({ name: 'LastFiscalQuarterTwoFiscalYearsAgo', id: 8, displayName: 'Last Fiscal Quarter Two Fiscal Years Ago' })
        ranges.push({ name: 'PreviousMonthsLastFiscalYear', id: 9, displayName: 'Previous Months Last Fiscal Year' })
        ranges.push({ name: 'FiscalYearBeforeLastToDate', id: 10, displayName: 'Fiscal Year Before Last To Date' })
        ranges.push({ name: 'SameMonthLastFiscalQuarterToDate', id: 11, displayName: 'Same Month Last Fiscal Quarter To Date' })
        ranges.push({ name: 'ThisYear', id: 12, displayName: 'This Year' })
        ranges.push({ name: 'SameDayWeekBeforeLast', id: 13, displayName: 'Same Day Week Before Last' })
        ranges.push({ name: 'ThisFiscalQuarterToDate', id: 14, displayName: 'This Fiscal Quarter To Date' })
        ranges.push({ name: 'NextOneYear', id: 15, displayName: 'Next One Year' })
        ranges.push({ name: 'ThisWeekToDate', id: 16, displayName: 'This Week To Date' })
        ranges.push({ name: 'NextOneHalf', id: 17, displayName: 'Next One Half' })
        ranges.push({ name: 'NextOneMonth', id: 18, displayName: 'Next One Month' })
        ranges.push({ name: 'FiveDaysFromNow', id: 19, displayName: 'Five Days From Now' })
        ranges.push({ name: 'TenDaysAgo', id: 20, displayName: 'Ten Days Ago' })
        ranges.push({ name: 'LastWeek', id: 21, displayName: 'Last Week' })
        ranges.push({ name: 'PreviousOneWeek', id: 22, displayName: 'Previous One Week' })
        ranges.push({ name: 'ThisRollingYear', id: 23, displayName: 'This Rolling Year' })
        ranges.push({ name: 'LastMonth', id: 24, displayName: 'Last Month' })
        ranges.push({ name: 'ThisMonthToDate', id: 25, displayName: 'This Month To Date' })
        ranges.push({ name: 'PreviousOneDay', id: 26, displayName: 'Previous One Day' })
        ranges.push({ name: 'PreviousMonthsThisFiscalHalf', id: 27, displayName: 'Previous Months This Fiscal Half' })
        ranges.push({ name: 'SameDayLastFiscalYear', id: 28, displayName: 'Same Day Last Fiscal Year' })
        ranges.push({ name: 'SameDayLastFiscalQuarter', id: 29, displayName: 'Same Day Last Fiscal Quarter' })
        ranges.push({ name: 'SameDayMonthBeforeLast', id: 30, displayName: 'Same Day Month Before Last' })
        ranges.push({ name: 'Tomorrow', id: 31, displayName: 'Tomorrow' })
        ranges.push({ name: 'PreviousFiscalQuartersThisFiscalYear', id: 32, displayName: 'Previous Fiscal Quarters This Fiscal Year' })
        ranges.push({ name: 'ThisBusinessWeek', id: 33, displayName: 'This Business Week' })
        ranges.push({ name: 'NextFourWeeks', id: 34, displayName: 'Next Four Weeks' })
        ranges.push({ name: 'ThreeMonthsAgoToDate', id: 35, displayName: 'Three Months Ago To Date' })
        ranges.push({ name: 'FiscalHalfBeforeLastToDate', id: 36, displayName: 'Fiscal Half Before Last To Date' })
        ranges.push({ name: 'FiscalHalfBeforeLast', id: 37, displayName: 'Fiscal Half Before Last' })
        ranges.push({ name: 'TwoDaysFromNow', id: 38, displayName: 'Two Days From Now' })
        ranges.push({ name: 'WeekAfterNextToDate', id: 39, displayName: 'Week after Next To Date' })
        ranges.push({ name: 'LastFiscalQuarterOneFiscalYearAgo', id: 40, displayName: 'Last Fiscal Quarter One Fiscal Year Ago' })
        ranges.push({ name: 'SameDayFiscalYearBeforeLast', id: 41, displayName: 'Same Day Fiscal Year Before Last' })
        ranges.push({ name: 'FourDaysFromNow', id: 42, displayName: 'Four Days From Now' })
        ranges.push({ name: 'PreviousMonthsSameFiscalQuarterLastFiscalYear', id: 43, displayName: 'Previous Months Same Fiscal Quarter Last Fiscal Year' })
        ranges.push({ name: 'PreviousOneMonth', id: 44, displayName: 'Previous One Month' })
        ranges.push({ name: 'ThisFiscalHalfToDate', id: 45, displayName: 'This Fiscal Half To Date' })
        ranges.push({ name: 'PreviousOneQuarter', id: 46, displayName: 'Previous One Quarter' })
        ranges.push({ name: 'SameWeekFiscalYearBeforeLast', id: 47, displayName: 'Same Week Fiscal Year Before Last' })
        ranges.push({ name: 'WeekBeforeLastToDate', id: 48, displayName: 'Week Before Last To Date' })
        ranges.push({ name: 'SameFiscalHalfLastFiscalYearToDate', id: 49, displayName: 'Same Fiscal Half Last Fiscal Year To Date' })
        ranges.push({ name: 'NinetyDaysAgo', id: 50, displayName: 'Ninety Days Ago' })
        ranges.push({ name: 'ThreeFiscalYearsAgoToDate', id: 51, displayName: 'Three Fiscal Years Ago To Date' })
        ranges.push({ name: 'SixtyDaysFromNow', id: 52, displayName: 'Sixty Days From Now' })
        ranges.push({ name: 'FiscalQuarterBeforeLastToDate', id: 53, displayName: 'Fiscal Quarter Before Last To Date' })
        ranges.push({ name: 'FiscalQuarterBeforeLast', id: 54, displayName: 'Fiscal Quarter Before Last' })
        ranges.push({ name: 'SameDayFiscalQuarterBeforeLast', id: 55, displayName: 'Same Day Fiscal Quarter Before Last' })
        ranges.push({ name: 'Custom', id: 56, displayName: 'Custom' })
        ranges.push({ name: 'ThreeMonthsAgo', id: 57, displayName: 'Three Months Ago' })
        ranges.push({ name: 'TwoDaysAgo', id: 58, displayName: 'Two Days Ago' })
        ranges.push({ name: 'FourDaysAgo', id: 59, displayName: 'Four Days Ago' })
        ranges.push({ name: 'LastFiscalQuarter', id: 60, displayName: 'Last Fiscal Quarter' })
        ranges.push({ name: 'ThirtyDaysAgo', id: 61, displayName: 'Thirty Days Ago' })
        ranges.push({ name: 'LastMonthOneFiscalYearAgo', id: 62, displayName: 'Last Month One Fiscal Year Ago' })
        ranges.push({ name: 'ThreeDaysFromNow', id: 63, displayName: 'Three Days From Now' })
        ranges.push({ name: 'PreviousFiscalQuartersLastFiscalYear', id: 64, displayName: 'Previous Fiscal Quarters Last Fiscal Year' })
        ranges.push({ name: 'WeekAfterNext', id: 65, displayName: 'Week after Next' })
        ranges.push({ name: 'SameMonthLastFiscalQuarter', id: 66, displayName: 'Same Month Last Fiscal Quarter' })
        ranges.push({ name: 'YesterDay', id: 67, displayName: 'YesterDay' })
        ranges.push({ name: 'ThreeFiscalYearsAgo', id: 68, displayName: 'Three Fiscal Years Ago' })
        ranges.push({ name: 'LastMonthTwoFiscalYearAgo', id: 69, displayName: 'Last Month Two Fiscal Year Ago' })
        ranges.push({ name: 'FourWeeksStartingThisWeek', id: 70, displayName: 'Four Weeks Starting This Week' })
        ranges.push({ name: 'SameFiscalQuarterFiscalYearBeforeLast', id: 71, displayName: 'Same Fiscal Quarter Fiscal Year Before Last' })
        ranges.push({ name: 'FiscalYearBeforeLast', id: 72, displayName: 'Fiscal Year Before Last' })
        ranges.push({ name: 'LastMonthTwoFiscalQuartersAgo', id: 73, displayName: 'Last Month Two Fiscal Quarters Ago' })
        ranges.push({ name: 'NextBusinessWeek', id: 74, displayName: 'Next Business Week' })
        ranges.push({ name: 'NinetyDaysFromNow', id: 75, displayName: 'Ninety Days From Now' })
        ranges.push({ name: 'LastBusinessWeek', id: 76, displayName: 'Last Business Week' })
        ranges.push({ name: 'SameMonthLastFiscalYearToDate', id: 77, displayName: 'Same Month Last Fiscal Year To Date' })
        ranges.push({ name: 'LastFiscalYearToDate', id: 78, displayName: 'Last Fiscal Year To Date' })
        ranges.push({ name: 'TenDaysFromNow', id: 79, displayName: 'Ten Days From Now' })
        ranges.push({ name: 'LastFiscalYear', id: 80, displayName: 'Last Fiscal Year' })
        ranges.push({ name: 'FiveDaysAgo', id: 81, displayName: 'Five Days Ago' })
        ranges.push({ name: 'NextFiscalHalf', id: 82, displayName: 'Next Fiscal Half' })
        ranges.push({ name: 'SameMonthFiscalQuarterBeforeLast', id: 83, displayName: 'Same Month Fiscal Quarter Before Last' })
        ranges.push({ name: 'ThreeFiscalQuartersAgo', id: 84, displayName: 'Three Fiscal Quarters Ago' })
        ranges.push({ name: 'ThreeDaysAgo', id: 85, displayName: 'Three Days Ago' })
        ranges.push({ name: 'WeekBeforeLast', id: 86, displayName: 'Week Before Last' })
        ranges.push({ name: 'MonthBeforeLast', id: 87, displayName: 'Month Before Last' })
        ranges.push({ name: 'PreviousMonthsThisFiscalQuarter', id: 88, displayName: 'Previous Months This Fiscal Quarter' })
        ranges.push({ name: 'MonthBeforeLastToDate', id: 89, displayName: 'Month Before Last To Date' })
        ranges.push({ name: 'SameWeekLastFiscalYear', id: 90, displayName: 'Same Week Last Fiscal Year' })
        ranges.push({ name: 'SixtyDaysAgo', id: 91, displayName: 'Sixty Days Ago' })
        ranges.push({ name: 'SameFiscalQuarterLastFiscalYear', id: 92, displayName: 'Same Fiscal Quarter Last Fiscal Year' })
        ranges.push({ name: 'SameDayLastFiscalMonth', id: 93, displayName: 'Same Day Last Month' })
        ranges.push({ name: 'PreviousMonthsSameFiscalHalfLastFiscalYear', id: 94, displayName: 'Previous Months Same Fiscal Half Last Fiscal Year' })
        ranges.push({ name: 'MonthAfterNextToDate', id: 95, displayName: 'Month After Next To Date' })
        ranges.push({ name: 'PreviousRollingYear', id: 96, displayName: 'Previous Rolling Year' })
        ranges.push({ name: 'LastWeekToDate', id: 97, displayName: 'Last Week To Date' })
        ranges.push({ name: 'PreviousRollingHalf', id: 98, displayName: 'Previous Rolling Half' })
        ranges.push({ name: 'LastFiscalHalf', id: 99, displayName: 'Last Fiscal Half' })
        ranges.push({ name: 'ThisRollingQuarter', id: 100, displayName: 'This Rolling Quarter' })
        ranges.push({ name: 'PreviousMonthsLastFiscalQuarter', id: 101, displayName: 'Previous Months Last Fiscal Quarter' })
        ranges.push({ name: 'ThisFiscalYearToDate', id: 102, displayName: 'This Fiscal Year To Date' })
        ranges.push({ name: 'PreviousOneHalf', id: 103, displayName: 'Previous One Half' })
        ranges.push({ name: 'LastMonthOneFiscalQuarterAgo', id: 104, displayName: 'Last Month One Fiscal Quarter Ago' })
        ranges.push({ name: 'SameMonthLastFiscalYear', id: 105, displayName: 'Same Month Last Fiscal Year' })
        ranges.push({ name: 'NextOneWeek', id: 106, displayName: 'Next One Week ' })
        ranges.push({ name: 'PreviousOneYear', id: 107, displayName: 'Previous One Year' })
        ranges.push({ name: 'LastFiscalQuarterToDate', id: 108, displayName: 'Last Fiscal Quarter To Date' })
        ranges.push({ name: 'SameFiscalQuarterLastFiscalYearToDate', id: 109, displayName: 'Same Fiscal Quarter Last Fiscal Year To Date' })
        ranges.push({ name: 'SameDayLastFiscalWeek', id: 110, displayName: 'Same Day Last Week' })
        ranges.push({ name: 'PreviousMonthsThisFiscalYear', id: 111, displayName: 'Previous Months This Fiscal Year' })
        ranges.push({ name: 'ThirtyDaysFromNow', id: 112, displayName: 'Thirty Days From Now' })
        ranges.push({ name: 'ThisFiscalHalf', id: 113, displayName: 'This Fiscal Half' })
        ranges.push({ name: 'PreviousRollingQuarter', id: 114, displayName: 'Previous Rolling Quarter' })
        ranges.push({ name: 'LastFiscalHalfToDate', id: 115, displayName: 'Last Fiscal Half To Date' })
        ranges.push({ name: 'LastFiscalHalfOneFiscalYearAgo', id: 116, displayName: 'Last Fiscal Half One Fiscal Year Ago' })
        ranges.push({ name: 'OneYearBeforeLast', id: 117, displayName: 'One Year Before Last' })
        ranges.push({ name: 'SameFiscalHalfLastFiscalYear', id: 118, displayName: 'Same Fiscal Half Last Fiscal Year' })
        ranges.push({ name: 'ThreeFiscalQuartersAgoToDate', id: 119, displayName: 'Three Fiscal Quarters Ago To Date' })
        ranges.push({ name: 'LastRollingHalf', id: 120, displayName: 'Last Rolling Half' })
        ranges.push({ name: 'LastRollingQuarter', id: 121, displayName: 'Last Rolling Quarter' })
        ranges.push({ name: 'MonthAfterNext', id: 122, displayName: 'Month After Next' })
        ranges.push({ name: 'ThisRollingHalf', id: 123, displayName: 'This Rolling Half' })
        ranges.push({ name: 'Today', id: 124, displayName: 'Today' })
        ranges.push({ name: 'NextOneQuarter', id: 125, displayName: 'Next One Quarter' })
        ranges.push({ name: 'LastRollingYear', id: 126, displayName: 'Last Rolling Year' });
        this.ranges = ranges;
    }
}
export class DateRange {
    id: number;
    name: string
    displayName: string
}