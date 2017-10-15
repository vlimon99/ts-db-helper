import { ModelManager } from '../managers/model-manager';
import { FieldSerializerConfigurator } from './field-serializers/field-serializer.configurator';
import { SerializerError } from '../errors/serializer.error';
import { FieldSerializerError } from './field-serializers/field-serializer.error';
import { BooleanFieldSerializer } from './field-serializers/boolean.field-serializer';
import { StringFieldSerializer } from './field-serializers/string.field-serializer';
import { RealFieldSerializer } from './field-serializers/real.field-serializer';
import { IntegerFieldSerializer } from './field-serializers/integer.field-serializer';
import { FieldSerializer } from './field-serializers/field-serializer';
import { DbHelperModel } from '../models/db-helper-model.model';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

export abstract class Serializer<T extends DbHelperModel> {
    private data: Object;
    public model: {new(): T};
    private instance: T;
    private instances: T[];
    private serializers: Array<Serializer<T>>;
    private partial = false;

    protected abstract fields: Array<string | FieldSerializer>;

    public constructor(target?: T | Object | boolean, public many?: boolean) {
        if (target instanceof this.model) {
            this.instance = target;
        } else if (Array.isArray(target) && target[0] instanceof this.model) {
            this.many = true;
            this.instances = target;
        } else if (target) {
            this.data = target;
        } else if (target !== undefined && (target === true || target === false)) {
            this.many = target as boolean;
        }
    }

    public setData(data: Object) {
        this.data = data;
    }

    public setInstance(instance: T) {
        this.instance = instance;
    }

    public setInstances(instances: T[]) {
        this.instances = instances;
    }

    public setPartialParse(partial: boolean) {
        this.partial = partial;
    }

    public getData(): Observable<Object> {
        if (this.data) {
            return Observable.create((observer: Observer<Object>) => {
                observer.next(this.data);
                observer.complete();
            });
        } else {
            const observables = <Observable<any>[]>[];
            if (this.many) {
                this.data = [];
                const construct = this.constructor as {new(target: T | Object, many?: boolean): Serializer<T>};
                for (const instance of this.instances) {
                    const serializer = new construct(instance);
                    observables.push(serializer.getData());
                }
                return Observable.combineLatest().map((results: Object[]) => {
                    this.data = results;
                    return this.data;
                });
            } else {
                this.data = {};
                for (const field of this.fields) {
                    let fieldSerializer: FieldSerializer;
                    if (field instanceof FieldSerializer) {
                        fieldSerializer = field;
                    } else {
                        switch (this.instance.getCommonFieldType(field).toLocaleLowerCase()) {
                            case 'integer':
                            fieldSerializer = new IntegerFieldSerializer(field, field, this.getFieldConfig(field));
                            break;
                            case 'number':
                            case 'real':
                            case 'double':
                            case 'float':
                            case 'decimal':
                            fieldSerializer = new RealFieldSerializer(field, field, this.getFieldConfig(field));
                            break;
                            case 'string':
                            case 'text':
                            case 'varchar': // should be contains
                            fieldSerializer = new StringFieldSerializer(field, field, this.getFieldConfig(field));
                            break;
                            case 'boolean':
                            fieldSerializer = new BooleanFieldSerializer(field, field, this.getFieldConfig(field));
                            break;
                            default:
                            fieldSerializer = new StringFieldSerializer(field, field, this.getFieldConfig(field));
                        }
                    }
                    observables.push(fieldSerializer.serialize(this.instance, this.data));
                }
                return Observable.combineLatest().map(() => {
                    return this.data;
                });
            }
        }
    }

    public getInstance(): Observable<T|T[]|null> {
        if (this.instance || this.instances) {
            return Observable.create((observer: Observer<T|T[]>) => {
                observer.next(this.instance || this.instances);
                observer.complete();
            });
        } else if (!this.data) {
            return Observable.create((observer: Observer<null>) => {
                observer.next(null);
                observer.complete();
            });
        } else {
            if (this.many && Array.isArray(this.data)) {
                const observables = <Observable<T|T[]|null>[]>[];
                this.instances = <T[]>[];
                const construct = this.constructor as {new(target: T | Object, many?: boolean): Serializer<T>};
                for (const data of this.data) {
                    const serializer = new construct(data);
                    observables.push(serializer.getInstance());
                }
                return Observable.combineLatest().map((results: T[]) => {
                    this.instances = results;
                    return this.instances;
                });
            } else if (!this.many && !Array.isArray(this.data)) {
                const observables = <Observable<FieldSerializerError|null>[]>[];
                this.instance = new this.model();
                for (const field of this.fields) {
                    let fieldSerializer: FieldSerializer;
                    if (field instanceof FieldSerializer) {
                        fieldSerializer = field;
                    } else {
                        switch (this.instance.getCommonFieldType(field).toLocaleLowerCase()) {
                            case 'integer':
                            fieldSerializer = new IntegerFieldSerializer(field, field);
                            break;
                            case 'number':
                            case 'real':
                            case 'double':
                            case 'float':
                            case 'decimal':
                            fieldSerializer = new RealFieldSerializer(field, field);
                            break;
                            case 'string':
                            case 'text':
                            case 'varchar': // should be contains
                            fieldSerializer = new StringFieldSerializer(field, field);
                            break;
                            case 'boolean':
                            fieldSerializer = new BooleanFieldSerializer(field, field);
                            break;
                            default:
                            fieldSerializer = new StringFieldSerializer(field, field);
                        }
                    }
                    observables.push(fieldSerializer.deserialize(this.data, this.instance));
                }
                return Observable.combineLatest().map((errs: any[]) => {
                    const errors = <FieldSerializerError[]>[];
                    for (const error of errs) {
                        if (error) {
                            errors.push(error);
                        }
                    }
                    if (errors.length) {
                        throw new SerializerError('Deserialization failed', errors);
                    }
                    return this.instance;
                });
            } else {
                return Observable.create((observer: Observer<null>) => {
                    observer.next(null);
                    observer.complete();
                });
            }
        }
    }

    private getFieldConfig(field: string): FieldSerializerConfigurator {
        const column = ModelManager.getInstance().getModel(this.model).fields[field];
        if (!column) {
            throw new Error('Model "' + this.model.name + '" has no field "' + field +
                '" but is declared in Serializer "' + this.constructor.name + '"');
        }
        const config = new FieldSerializerConfigurator();
        if (column.primaryKey) {config.isOptional = false; }
        if (column.defaultValue) {config.defaultValue = column.defaultValue; }
        return config;
    }

    public isValid(): Object | null {
        return null;
    }
}
