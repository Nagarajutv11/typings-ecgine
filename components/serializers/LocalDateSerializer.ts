import { Ecgine } from '../Ecgine'
import { Serialization } from '../Serialization';
import { Serializer, SerializationContext } from '../Serialization';

export class LocalDateSerializer implements Serializer {


	/**
     * The number of days in a 400 year cycle.
     */
	private static DAYS_PER_CYCLE = 146097;
    /**
     * The number of days from year zero to year 1970.
     * There are five 400 year cycles from year zero to 2000.
     * There are 7 leap years from 1970 to 2000.
     */
	private static DAYS_0000_TO_1970 = (LocalDateSerializer.DAYS_PER_CYCLE * 5) - (30 * 365 + 7);

	toJson(obj: any, context: SerializationContext): any {
		if (!obj) {
			return null;
		}
		let dt = obj;
		let y = dt.getYear() + 1900;
		let m = dt.getMonth() + 1;
		let total = 0;
		total += 365 * y;
		if (y >= 0) {
			total += Math.floor((y + 3) / 4) - Math.floor((y + 99) / 100) + Math.floor((y + 399) / 400);
		} else {
			total -= Math.floor(y / -4) - Math.floor(y / -100) + Math.floor(y / -400);
		}
		total += Math.floor((367 * m - 362) / 12);
		total += dt.getDate() - 1;
		if (m > 2) {
			total--;
			if (this.isLeapYear(y) == false) {
				total--;
			}
		}
		return total - LocalDateSerializer.DAYS_0000_TO_1970;
	}
	isLeapYear(prolepticYear: number): boolean {
		return ((prolepticYear & 3) == 0) && ((prolepticYear % 100) != 0 || (prolepticYear % 400) == 0);
	}

	fromJson(json: any, context: SerializationContext): any {
		if (!json) {
			return null;
		}
		let epochDay = json as number;
		let zeroDay = epochDay + LocalDateSerializer.DAYS_0000_TO_1970;
		// find the march-based year
		zeroDay -= 60;  // adjust to 0000-03-01 so leap day is at end of four year cycle
		let adjust = 0;
		if (zeroDay < 0) {
			// adjust negative years to positive for calculation
			let adjustCycles = Math.floor((zeroDay + 1) / LocalDateSerializer.DAYS_PER_CYCLE - 1);
			adjust = adjustCycles * 400;
			zeroDay += -adjustCycles * LocalDateSerializer.DAYS_PER_CYCLE;
		}
		let yearEst = Math.floor((400 * zeroDay + 591) / LocalDateSerializer.DAYS_PER_CYCLE);
		let doyEst = zeroDay - (365 * yearEst + Math.floor(yearEst / 4) - Math.floor(yearEst / 100) + Math.floor(yearEst / 400));
		if (doyEst < 0) {
			// fix estimate
			yearEst--;
			doyEst = zeroDay - (365 * yearEst + Math.floor(yearEst / 4) - Math.floor(yearEst / 100) + Math.floor(yearEst / 400));
		}
		yearEst += adjust;  // reset any negative year
		let marchDoy0 = doyEst;

		// convert march-based values back to january-based
		let marchMonth0 = Math.floor((marchDoy0 * 5 + 2) / 153);
		let month = (marchMonth0 + 2) % 12 + 1;
		let dom = marchDoy0 - Math.floor((marchMonth0 * 306 + 5) / 10) + 1;
		yearEst += Math.floor(marchMonth0 / 10);

		// check year now we are certain it is correct
		let finalDate = new Date() as any;
		finalDate.setYear(yearEst);
		finalDate.setMonth(month - 1);
		finalDate.setDate(dom)
		return finalDate;
	}
}