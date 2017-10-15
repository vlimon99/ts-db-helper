import { ModelManager } from '../../managers/model-manager';
import { SerializerError } from '../../errors/serializer.error';
import { QueryResult } from '../../interfaces/query-result.interface';
import { FieldSerializerRules } from './field-serializer-rules';
import { FieldSerializerConfigurator } from './field-serializer.configurator';
import { DbHelperModel } from '../../models/db-helper-model.model';
import { FieldSerializerError } from './field-serializer.error';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import 'rxjs/add/Observable/empty';
import 'rxjs/add/Observable/from';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

export abstract class FieldSerializer {
    public rules = new FieldSerializerRules();
    private partial = false;

    public constructor(
        public fieldName: string,
        public jsonKey: string,
        config?: FieldSerializerConfigurator
    ) {
        if (config) {
            for (const key in config) {
                if (config.hasOwnProperty(key)) {
                    (this.rules as any)[key] = (config as any)[key];
                }
            }
        }
    }

    public isValid(data: any): FieldSerializerError | null {
        if (data.hasOwnProperty(data)) {
            if (this.rules.isReadonly) {
                return new FieldSerializerError(
                    this.jsonKey,
                    'Field is readonly',
                    this.rules
                );
            } else {
                return this.checkFieldRules(data);
            }
        } else {
            if (this.rules.isOptional) {
                return null;
            } else {
                return new FieldSerializerError(
                    this.jsonKey,
                    'Field could be missing or null',
                    this.rules
                );
            }
        }
    }

    protected abstract checkFieldRules(data: any): FieldSerializerError | null;

    public serialize(from: DbHelperModel, to: any): Observable<null> {
        const val = from.getFieldValue(this.fieldName);
        if (!this.rules.isWriteonly && !this.rules.formatter) {
            to[this.jsonKey] = val;
            return Observable.empty();
        } else if (this.rules.formatter) {
            to[this.jsonKey] = this.rules.formatter(from);
            return Observable.empty();
        } else if (this.rules.serializer) {
            return from.getLinked(this.rules.serializer.model).switchMap((qr: QueryResult<DbHelperModel>): Observable<null> => {
                if (this.rules.serializer!.many) {
                    this.rules.serializer!.setInstances(qr.rows.toArray());
                } else if (qr.rows.length) {
                    this.rules.serializer!.setInstance(qr.rows.item(0));
                }
                return this.rules.serializer!.getData().map((data: Object): null => {
                    to[this.jsonKey] = data;
                    return null;
                });
            });
        }
        return Observable.empty();
    }

    public deserialize(from: any, to: DbHelperModel): Observable<FieldSerializerError | null> {
        const error = this.isValid(to);
        if (!error) {
            const val = from[this.jsonKey];
            if (val !== undefined && this.partial) {
                const column = ModelManager.getInstance().getModel(to).fields[this.fieldName];
                if (!to.$$partialWithProjection) {
                    to.$$partialWithProjection = [];
                }
                to.$$partialWithProjection.push(column.name);
            }
            if (val === undefined) {
                if (!this.partial) {
                    if (this.rules.defaultValue !== null && this.rules.defaultValue !== undefined) {
                        to.setFieldValue(this.fieldName, this.rules.defaultValue);
                    } else {
                        to.setFieldValue(this.fieldName, null);
                    }
                }
                return Observable.from([null]);
            } else if (this.rules.serializer) {
                this.rules.serializer.setData(val);
                return this.rules.serializer!.getInstance().map((instance: DbHelperModel) => {
                    to.setFieldValue(this.fieldName, instance);
                    return null;
                }).catch((err: any): Observable<FieldSerializerError | null> => {
                    const fieldError = new FieldSerializerError(
                        this.jsonKey,
                        'Can\'t serialize model "' + this.rules.serializer!.model.name + '"',
                        this.rules
                    );
                    if (err instanceof SerializerError) {
                        fieldError.error = err.fieldErrors;
                    } else {
                        fieldError.error = err;
                    }
                    return Observable.from([fieldError]);
                });
            } else {
                to.setFieldValue(this.fieldName, from[this.jsonKey]);
                return Observable.from([null]);
            }
        }
        return Observable.from([error]);
    }
}
