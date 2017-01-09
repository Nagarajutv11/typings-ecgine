import { $e } from './Ecgine';
import { Field } from './Field';
import { DatabaseObject } from './DatabaseObject';
import { Entity } from './Entity';
import { Observable } from 'rx';
import { EntityRegistry } from './EntityRegistry';
import { EntityHelperService } from './EntityHelperService';
import { FormHelper, Computation } from './FormHelper';
import { PropertyProvider } from './PropertyProvider';

export class PropertyProviderInstance {
    watchers: { [key: string]: { [key: string]: (() => void) } } = {};
    instance: any;
    ppd: PropertyProvider
    subs: PropertyProviderInstance[] = []
    parent: PropertyProviderInstance

    constructor(ppd: PropertyProvider, instance: any, isEdit: boolean) {
        this.ppd = ppd;
        if (ppd.parent) {
            this.parent = ppd.parent.pp
        }
        this.instance = instance;
        if (isEdit) {
            this.addAllComputations();
            this.addAllDefaultValues();
            this.addAllReferenceFrom();
        }
        this.addAllExistingCondition();

        for (var p in ppd.staticReferenceFromValues) {
            if (ppd.staticReferenceFromValues.hasOwnProperty(p)) {
                this.instance[p] = ppd.staticReferenceFromValues[p]
            }
        }
    }

    public addAllComputations() {
        let _this1 = this;
        let cc = this.ppd.computations;
        for (var p in cc) {
            if (cc.hasOwnProperty(p)) {
                let paths = cc[p]
                this.addComputation(paths, p);
            }
        }
    }

    private addComputation(paths: string[], p: string) {
        let _this1 = this;
        //RpcCall
        let rpcCalling = function (valueCallback: (v: any) => void) {
            _this1.ppd.ehs.getComputaionValue(_this1.instance, p).map((v: any) => v.value).subscribe(valueCallback);
        }

        //Helper call
        let computation = this.ppd.helper ? this.ppd.helper.getComputations()[p] : undefined;

        this.addWatchers(paths, p, p, rpcCalling, computation)
    }

    public addAllDefaultValues() {
        let cc = this.ppd.defaults;
        for (var p in cc) {
            if (cc.hasOwnProperty(p)) {
                let paths = cc[p]
                this.addDefault(paths, p)
            }
        }
    }

    private addDefault(paths: string[], p: string) {
        let field = this.ppd.entity.getField(p);
        this.instance[p + "_def"] = field.defaultValue;
        let _this1 = this;
        //RpcCall
        let rpcCalling = function (valueCallback: (v: any) => void) {
            _this1.ppd.ehs.getDefaultValue(_this1.instance, p).map((v: any) => v.value).subscribe(valueCallback);
        };

        //Helper call
        let computation = this.ppd.helper ? this.ppd.helper.getDefaultValues()[p] : undefined;

        let valueCallback = (v: any) => {
            _this1.setValue(p, v);
            _this1.instance[p + "_def"] = v;
        };

        let cancall = () => {
            if (field.hasExistancyCondition && !field.useDefaultIfNotExists) {
                if (!_this1.instance[p + "_exist"]) {
                    return false;
                }
            }
            if (field.canOverrideUserValue) {
                return true;
            }

            let def = _this1.instance[p + "_def"];
            let v = _this1.instance[p]
            if (_this1.isEqual(def, v)) {
                return true;
            }

            return false;
        }

        this.addWatchers2(paths, p, p, valueCallback, rpcCalling, computation, cancall)
    }

    private isEqual(a: any, b: any) {
        return a == b;
    }

    public addAllReferenceFrom() {
        let cc = this.ppd.referenceFroms;
        for (var p in cc) {
            if (cc.hasOwnProperty(p)) {
                let paths = cc[p]
                this.addReferenceFrom(paths, p)
            }
        }
    }

    private addReferenceFrom(paths: string[], p: string) {
        let _this1 = this;
        _this1.setReferenceFromValue(p + "_referenceFrom", []);
        //RpcCall
        let rpcCalling = function (valueCallback: (v: any[]) => void) {
            _this1.ppd.ehs.getReferenceFromValues(_this1.instance, _this1.ppd.entity.name, p).subscribe(valueCallback);
        };

        //Helper call
        let computation = this.ppd.helper ? this.ppd.helper.getReferenceFroms()[p] : undefined;

        this.addWatchers2(paths, p, p + "_referenceFrom", val => {
            _this1.setReferenceFromValue(p + "_referenceFrom", val);
        }, rpcCalling, computation);
    }

    public addAllExistingCondition() {
        let cc = this.ppd.exists;
        for (var p in cc) {
            if (cc.hasOwnProperty(p)) {
                let paths = cc[p]
                this.addExistancy(paths, p)
            }
        }
    }

    private addExistancy(paths: string[], p: string) {
        let field = this.ppd.entity.getField(p);
        let _this1 = this;
        //RpcCall
        let rpcCalling = function (valueCallback: (v: any) => void) {
            _this1.ppd.ehs.getExistancyValue(_this1.instance, p).subscribe(valueCallback);
        };

        //Helper call
        let computation = this.ppd.helper ? this.ppd.helper.getExistancyConditions()[p] : undefined;

        let valueCallback = (v: any) => {
            _this1.setValue(p + "_exist", v);
            if (field.useDefaultIfNotExists && !v) {
                _this1.setValue(p, _this1.instance[p + "_def"])
            }
        }

        this.addWatchers2(paths, p, p + "_exist", valueCallback, rpcCalling, computation)
    }

    public remove() {
        if (this.parent) {
            let i = this.parent.subs.indexOf(this);
            if (i != -1) {
                this.parent.subs.splice(i, 1)
            }
        }
        this.ppd.remove();
    }

    public addSub(provider: PropertyProviderInstance) {
        this.subs.push(provider)
    }

    public addWatchers(paths: string[], field: string, propName: string, rpcCall: (callback: (val: any) => void) => void, computation?: Computation<any, any>): (() => void) {
        let _this1 = this;
        let valueCallback = (v: any[]) => {
            _this1.setValue(propName, v);
        };
        return this.addWatchers2(paths, field, propName, valueCallback, rpcCall, computation);
    }

    public addWatchers2(paths: string[], field: string, desc: string,
        valueCallback: (v: any[]) => void,
        rpcCall: (callback: (val: any) => void) => void,
        computation?: Computation<any, any>,
        cancall?: () => boolean
    ): (() => void) {
        let _this1 = this;
        let helperCalling: (() => void)
        if (computation) {
            helperCalling = () => {
                if (!cancall || cancall()) {
                    computation.compute($e, _this1.instance, valueCallback);
                }
            }
        } else {
            helperCalling = () => {
                if (!cancall || cancall()) {
                    rpcCall(valueCallback);
                }
            }
            paths.forEach(p => { _this1.addWatcher(p, desc, helperCalling) })

            helperCalling();
        }
        return helperCalling;
    }

    public addWatcher(path: string, field: string, callback: () => void) {
        if (!this.watchers[path]) {
            this.watchers[path] = {}
        }
        this.watchers[path][field] = callback;
    }

    setReferenceFromValue(name: string, val: any[]) {
        if (val == null) {
            val = []
        }
        let v = this.instance[name];
        if (v) {
            v.splice(0, v.length);
        } else {
            v = []
            this.instance[name] = v;
        }
        val.forEach(r => v.push(r))
        this.onPropertyChange(name);
    }

    public setValue(propName: string, value: any) {
        if (this.isEqual(this.instance[propName], value)) {
            return;
        }
        this.instance[propName] = value;
        this.onPropertyChange(propName);
    }

    public onPropertyChange(propName: string) {
        this.fireWatchers(propName);
        if (this.parent) {
            this.ppd.onPropertyChange(propName)
        }
    }

    public fireWatchers(path: string) {
        if (this.watchers[path]) {
            let cbs = this.watchers[path];
            for (var f in cbs) {
                if (cbs.hasOwnProperty(f)) {
                    cbs[f]()
                }
            }
        }
        this.subs.forEach(s => s.fireWatchers('$.' + path));
    }
}