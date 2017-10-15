import { FieldSerializerConfigurator } from './field-serializer.configurator';
import { DbHelperModel } from '../../models/db-helper-model.model';
import { FieldSerializerError } from './field-serializer.error';
import { FieldSerializer } from './field-serializer';

export class ForeignModelFieldSerializer extends FieldSerializer {

    public constructor(
        fieldName: string,
        jsonKey: string,
        model: {new(): DbHelperModel},
        config?: FieldSerializerConfigurator
    ) {
        super(fieldName, jsonKey, config);
        this.rules.type = model.name;
    }

    public checkFieldRules(data: any): FieldSerializerError | null {
        return null;
    }

}
