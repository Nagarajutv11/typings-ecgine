import { Ecgine } from '../Ecgine'
import { Entity } from '../Entity';
import { Field } from '../Field';
import { Serialization } from '../Serialization';
import { EntityRegistry } from '../EntityRegistry';
import { Serializer, SerializationContext } from '../Serialization';

export class EntitySerializer implements Serializer {

    private serialization: Serialization;

    constructor(serializer: Serialization) {
        this.serialization = serializer;
    }

    toJson(obj: any, context: SerializationContext, expectedType: string): any {
        if (obj == null) {
            return null;
        }
        //This is client serialization. So no need to consider Path.
        var type = obj._type as string;
        if (!type) {
            throw "Type not present";
        }
        let er = Ecgine.get().service("EntityRegistry") as EntityRegistry;
        let entity = er.entity(type);
        let result = {};
        context.write(expectedType, obj, result);
        if (context.isWrittenFully(obj)) {
            this.writeLite(obj, entity, result, context);
            return result;
        }

        context.writingFully(obj);

        let fields = entity.getAllFields();
        let _this = this;
        fields.forEach(function (f) {
            _this.convertProperty(f, obj, result, context);
        });
        return result;
    }

    writeLite(obj: any, entity: Entity, result: any, context: SerializationContext) {
        if (obj.id) {
            result['id'] = obj.id;
        }
        result['displayName'] = obj.displayName;
    }

    convertProperty(field: Field, obj: any, result: any, context: SerializationContext) {
        let key = field.name;
        let value = obj[key];
        if (value == undefined) {
            //result[key]=null;
            return;
        }

        switch (field.type) {
            case 'INT':
            case 'TEXT':
            case 'TEXTAREA':
            case 'RICHTEXT':
            case 'EMAIL':
            case 'URL':
            case 'PHONE':
            case 'PASSWORD':
            case 'IPADDRESS':
            case 'AUTOINCREMENT':
            case 'AGE':
            case 'LONG':
            case 'PERCENT':
            case 'DOUBLE':
            case 'BOOLEAN':
                result[key] = value;
                return;
            case 'PICKLIST':
                result[key] = this.serialization.toJson(value, 'enum', context);
                return;
            case 'AMOUNT':
            case 'BIG_DECIMAL':
            case 'BIG_DEC_PERCENT':
                result[key] = this.serialization.toJson(value, 'bigdecimal', context);
                return;
            case 'BYTE_ARRAY':
                result[key] = this.serialization.toJson(value, 'bytearray', context);
                return;
            case 'DATE':
                result[key] = this.serialization.toJson(value, 'java.time.LocalDate', context);
                return;
            case 'TIME':
                result[key] = this.serialization.toJson(value, 'java.time.LocalTime', context);
                return;
            case 'DATETIME':
                result[key] = this.serialization.toJson(value, 'java.time.LocalDateTime', context);
                return;
            case 'ANYREFERENCE':
            case 'REFERENCE':
                this.writeReferenceValue(field, value, result, context);
                break;
            default:
                throw "Type not supported in serialization:" + field.type;
        }
    }

    writeReferenceValue(field: Field, value: any, result: any, context: SerializationContext) {
        let er = Ecgine.get().service("EntityRegistry") as EntityRegistry;
        var referenceType = field.referenceType;
        let refEntity = er.entity(field.referenceType);
        let isCollection = field.isCollection;
        if (isCollection) {
            let collVal = new Array();
            let collection = value as any[];
            let _this = this;
            collection.forEach(function (e: any) {
                collVal.push(_this.writeReference(field, refEntity, e, context));
            });
            result[field.name] = collVal;
        } else {
            result[field.name] = this.writeReference(field, refEntity, value, context);
        }
    }

    writeReference(field: Field, refEntity: Entity, value: any, context: SerializationContext): any {

        if (field.attachmentType) {
            return;
        }
        let needFull = field.isChild || field.isEmbedded;
        if (field.isMaster && context.isWriteParent()) {
            needFull = true;
        }

        if (needFull) {
            return this.toJson(value, context, refEntity.name);
        }
        let result = {};
        context.write(refEntity ? refEntity.name : 'org.ecgine.db.api.DatabaseObject', value, result);

        this.writeLite(value, refEntity, result, context);
        return result;
    }

    fromJson(json: any, context: SerializationContext, expectedType: string): any {
        return this.fromJsonWithType(json, expectedType, context);
    }

    fromJsonWithType(json: any, type: string, context: SerializationContext): any {
        if (json == null) {
            return null;
        }

        let _this = this;
        let result: { [key: string]: any } = context.read(type, json);
        let er = Ecgine.get().service("EntityRegistry") as EntityRegistry;
        let entity = er.entity(result['_type']);
        for (var property in json) {
            if (json.hasOwnProperty(property)) {
                let field = entity.getOptionalField(property);
                // When got any JSON Object from Rest API then did'nt found any
                // field then adding error
                if (field == null) {
                    continue;
                }

                let key = field.name;
                if (json[key] == null) {
                    result[key] = null;
                    continue;
                }
                result[key] = _this.readField(field, json, context);
            }
        }

        return result;
    }

    readField(field: Field, json: any, context: SerializationContext): any {
        let key = field.name;
        let fieldType = field.type;
        let value = json[key];
        if (value == null) {
            return null;
        }
        switch (field.type) {
            case 'INT':
            case 'TEXT':
            case 'TEXTAREA':
            case 'RICHTEXT':
            case 'EMAIL':
            case 'URL':
            case 'PHONE':
            case 'PASSWORD':
            case 'IPADDRESS':
            case 'AUTOINCREMENT':
            case 'AGE':
            case 'LONG':
            case 'PERCENT':
            case 'DOUBLE':
            case 'BOOLEAN':
                return value;
            case 'PICKLIST':
                return this.serialization.fromJson(value, 'enum', context)
            case 'AMOUNT':
            case 'BIG_DEC_PERCENT':
            case 'BIG_DECIMAL':
                return this.serialization.fromJson(value, 'bigdecimal', context)
            case 'BYTE_ARRAY':
                return this.serialization.fromJson(value, 'bytearray', context)
            case 'DATE':
                return this.serialization.fromJson(value, 'java.time.LocalDate', context)
            case 'TIME':
                return this.serialization.fromJson(value, 'java.time.LocalTime', context)
            case 'DATETIME':
                return this.serialization.fromJson(value, 'java.time.LocalDateTime', context)
            case 'ANYREFERENCE':
            case 'REFERENCE':
                return this.readReferenceValue(field, value, context);
            default:
                throw "Type not supported in serialization:" + field.type;
        }
    }

    readReferenceValue(field: Field, value: any, context: SerializationContext): any {
        let isCollection = field.isCollection;
        var entityName = field.referenceType;
        if (!entityName) {
            entityName = 'org.ecgine.db.api.DatabaseObject'
        }

        if (isCollection) {
            let collection = value as any[];
            let result = new Array();
            let _this = this;
            collection.forEach(function (e) {
                result.push(_this.fromJsonWithType(e, entityName, context));
            });
            return result;
        } else {
            return this.fromJsonWithType(value, entityName, context);
        }
    }
}