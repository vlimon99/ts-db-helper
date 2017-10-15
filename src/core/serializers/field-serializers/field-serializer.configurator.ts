import { Serializer } from '../serializer';
import { DbHelperModel } from '../../models/db-helper-model.model';

export class FieldSerializerConfigurator {
    public isOptional?: boolean;
    public defaultValue?: any;
    public isReadonly?: boolean;
    public isWriteonly?: boolean;
    public formatter?: (instance: DbHelperModel) => any;
    public serializer?: Serializer<DbHelperModel>;
}
