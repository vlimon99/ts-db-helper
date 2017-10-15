import { Serializer } from '../serializer';
import { DbHelperModel } from '../../models/db-helper-model.model';

export class FieldSerializerRules {
    public isOptional = false;
    public defaultValue = null;
    public isReadonly = false;
    public isWriteonly = false;
    public type = 'String';
    public formatter?: (instance: DbHelperModel) => any;
    public serializer?: Serializer<DbHelperModel>;
}
