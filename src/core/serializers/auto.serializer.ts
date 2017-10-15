import { ModelManager } from '../managers/model-manager';
import { FieldSerializer } from './field-serializers/field-serializer';
import { DbHelperModel } from '../models/db-helper-model.model';
import { Serializer } from './serializer';

export class AutoSerializer<T extends DbHelperModel> extends Serializer<T> {

    public fields = <(FieldSerializer|string)[]>[];

    public constructor(model: {new(): T}, target?: Object | DbHelperModel | boolean, many?: boolean) {
        super(target, many);
        const columns = ModelManager.getInstance().getModel(model).columnList;
        for (const column of columns) {
            this.fields.push(column.name);
        }
    }
}
