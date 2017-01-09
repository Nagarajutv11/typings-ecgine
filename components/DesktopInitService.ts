import { Observable } from 'rx'
export interface DesktopInitService {
	initializeApp(versionId: string): Observable<DesktopAppInitInfo>;
}

export class DesktopAppInitInfo {
	singletons: any[];
	user: any;
	userMemberships: { [id: number]: any; };
}