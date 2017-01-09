import { Vue, Component, Prop, Lifecycle } from 'av-ts'
import { FormAction } from './FormAction';
import { UIBaseDatabaseService } from '../UIBaseDatabaseService'
import { DatabaseObject } from '../DatabaseObject'
import { DBResult } from '../DBResult'
import { Entity } from '../Entity'
import { ValidationResult, Message } from '../ValidationResult'
import { ViewManager } from '../ViewManager'
import { FormHandler } from './FormHandler'
import { FormHandlerContext } from './FormHandlerContext'
import { $e } from '../Ecgine'

@Component
export default class FormActionsPanel extends Vue {

	@Prop
	actions: FormAction[];

	@Prop
	isEdit: boolean

	@Prop
	db: UIBaseDatabaseService;

	@Prop
	ins: DatabaseObject;

	@Prop
	entity: Entity

	@Prop
	handler: FormHandler

	@Prop
	context: FormHandlerContext

	dialogVisible = false;

	errors: string[] = []

	@Lifecycle
	created() {

	}

	prepareActions(): FormAction[] {
		let availableActions: FormAction[] = []
		if (this.isEdit) {
			if ($e.subject().canRead(this.entity)) {
				// If not in view mode then show SaveAndClose, SaveAndNew buttons
				availableActions.push(this.createFormAction('saveAndClose'));
				// save and new
				availableActions.push(this.createFormAction('saveAndNew'));
			}
		} else {
			// In view mode show Edit button
			if (this.canEdit()) {
				if ($e.subject().canEdit(this.entity)) {
					availableActions.push(this.createFormAction('edit'));
				}
			}
		}

		// cancel button
		availableActions.push(this.createFormAction('cancel'));

		// delete button
		if (!this.entity.isSingleton && this.ins.id != 0) {
			if ($e.subject().canDelete(this.entity)) {
				availableActions.push(this.createFormAction('delete'));
			}
		}

		if ((this.ins.id == 0 || this.ins.objStatus == 'DRAFT') && this.entity.isAllowDrafts
			&& this.isEdit) {
			availableActions.push(this.createFormAction('saveAsDraft'));
		}

		let _this = this;
		return availableActions.filter(a => {
			if (!a.show) {
				return false;
			}
			if (_this.entity.isSingleton && a.actionType == 'saveAndNew') {
				return false;
			}

			if (_this.handler) {
				return _this.handler.canCreateAction(a.actionType, _this.context)
			}

			return true
		});
	}

	canEdit(): boolean {
		if (this.entity.editCriteria) {
			let i = this.ins as any
			return i[this.entity.editCriteria];
		} else {
			return true;
		}
	}

	createFormAction(actionId: string): FormAction {
		let res: FormAction | undefined = undefined;
		// Find the action of this type
		this.actions.forEach(a => {
			if (a.actionType == actionId) {
				res = a;
			}
		})

		// If not given then create our own action
		if (res) {
			return res;
		}
		return this.createSystemAction(actionId);
	}

	createSystemAction(actionId: string): FormAction {
		return { identity: '', actionType: actionId, show: true }
	}

	displayText(action: FormAction) {
		if (action.label) {
			return action.label;
		}
		switch (action.actionType) {
			case 'cancel':
				return 'Cancel';
			case 'saveAndNew':
				return 'Save And New';
			case 'saveAsDraft':
				return 'Save As Draft';
			case 'saveAndClose':
				return 'Save And Close';
			case 'edit':
				return 'Edit';
			case 'delete':
				return 'Delete';
			default:
				return 'Unknown'
		}
	}
	onClick(action: FormAction) {
		switch (action.actionType) {
			case 'cancel':
				this.$emit("close")
				return;
			case 'saveAndNew':
				this.save(true)
				return;
			case 'saveAndClose':
				this.save(false)
				return;
			case 'saveAsDraft':
				this.db.saveAsDraft(this.ins).subscribe(r => { });
				return;
			case 'edit':
				this.$emit("edit")
				return;
			case 'delete':
				//TODO
				return;
			default:
				return 'Unknown'
		}
	}

	save(showNew: boolean) {
		//TODO actionsPane.setDisable(true);
		//TODO ClientValidationResult result = new ClientValidationResult(instance);
		//TODO mp.validate(result);
		//TODO onValidate(result, showNew);
		this.doSave(showNew);
	}

	doSave(showNew: boolean) {
		let _this = this;
		this.db.upsert(this.ins).subscribe(r => _this.onSaveResult(r, showNew))
	}

	onSaveResult(result: DBResult, showNew: boolean) {
		let _this = this;
		//TODO actionsPane.setDisable(false);
		if (!_this.isSuccess(result)) {
			_this.onValidation(result, showNew);
			return;
		}

		this.$emit('saved', result.obj)
		if (showNew) {
			_this.$emit("new")
		} else {
			_this.$emit("close")
		}
	}

	isSuccess(result: DBResult) {
		return (!result.errors || result.errors.length == 0)
			&& (!result.warnings || result.warnings.length == 0)
			&& (!result.infos || result.infos.length == 0)
	}

	onValidation(result: ValidationResult, showNew: boolean) {
		let _this = this;
		//TODO actionsPane.setDisable(false);
		let errorMessage = _this.prepareErrorMessage(result, 'ERROR');
		if (errorMessage) {
			_this.showDialog(errorMessage, "Error");
		} else {
			errorMessage = _this.prepareErrorMessage(result, 'WARNING');
			if (errorMessage) {
				_this.showDialog(errorMessage, "Warning", () => _this.doSave(showNew));
			} else {
				errorMessage = _this.prepareErrorMessage(result, 'INFO');
				if (errorMessage) {
					_this.showDialog(errorMessage, "Information", () => _this.doSave(showNew));
				}
			}
		}
	}

	prepareErrorMessage(errors: ValidationResult, type: string): string[] {
		let msg: string[] = [];
		switch (type) {
			case 'ERROR':
				msg = this.toMessagesString(errors.errors);
				break;
			case 'WARNING':
				msg = this.toMessagesString(errors.warnings);
				break;
			case 'INFO':
				msg = this.toMessagesString(errors.infos);
				break;
		}
		return msg
	}

	toMessagesString(messages: Message[]): string[] {
		if (messages) {
			return messages.map(a => {
				return (a.field ? a.field + ": " : "") + a.message
			})
		}
		return [];
	}

	showDialog(message: string[], alertType: string, callback?: () => void): void {
		this.errors = message;
		this.dialogVisible = true;
	}
}