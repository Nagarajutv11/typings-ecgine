import { ValidationResult } from '../ValidationResult'
import { FormHandlerContext } from './FormHandlerContext'

export interface FormHandler {

    onValidate(vr: ValidationResult, context: FormHandlerContext): boolean;

    canCreateAction(actionName: string, context: FormHandlerContext): boolean;

    onInit(context: FormHandlerContext): void;

    //onDestroy(IForm form): void;

    //onFinish(ModelPane pane, IForm form): void;
}