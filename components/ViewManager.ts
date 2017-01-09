import { $e } from './Ecgine'
import { IViewInput } from './IViewInput'
import { EcgineUtils } from './EcgineUtils'
import { FormInput } from './FormInput'
import { ReportInput } from './ReportInput'

export class ViewManager {

    private static _instance: ViewManager;

    private dialogs: Dialog[] = []

    constructor() {
        if (ViewManager._instance) {
            throw new Error("Error: Do not create another object. This is singleton");
        }
        ViewManager._instance = this;
    }

    dialogsSize(): number {
        return this.dialogs.length;
    }

    runCommand(id?: string, params?: { [key: string]: string }) {
        if (!id) {
            let lc = $e.getApplication()
            if (lc) {
                id = lc.defaultView;
            }
        }
        if (!id) {
            id = ''
        }
        $e.$router.push({ name: 'home', params: { appid: $e.appName, viewid: id }, query: params })
    }

    openFormView(input: FormInput) {
        let values: { [key: string]: string } = {}
        values['id'] = input.instance.id as any;
        values['isEdit'] = input.isEdit as any;
        this.runCommand('model', values)
    }

    openReportView(reportBuilder: string, filterValues: { [key: string]: string }) {
        filterValues['reportBuilder'] = reportBuilder
        this.runCommand('report', filterValues)
    }

    openViewInDialog(title: string, input: IViewInput) {
        let d = this.dialogs[this.dialogs.length - 1]
        d.show(title, input);
    }

    dialogClosed() {
        this.closeDialog()
        this.dialogs.splice(this.dialogs.length - 1, 1);
    }

    closeDialog() {
        let d = this.dialogs[this.dialogs.length - 2];
        d.close();
    }

    addDialogListener(show: (title: string, input: IViewInput) => void, close: () => void): void {
        this.dialogs.push({ show, close });
    }
}

class Dialog {
    show: (title?: string, input?: IViewInput) => void;
    close: () => void;
}