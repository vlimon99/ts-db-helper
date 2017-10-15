import { FieldSerializerConfigurator } from './field-serializer.configurator';
import { FieldSerializerError } from './field-serializer.error';
import { FieldSerializer } from './field-serializer';

export class ComputedFieldSerializer extends FieldSerializer {

    public constructor(
        fieldName: string,
        jsonKey: string,
        config?: FieldSerializerConfigurator
    ) {
        super(fieldName, jsonKey, config);
        this.rules.isReadonly = true;
    }

    public checkFieldRules(data: any): FieldSerializerError | null {
        return null;
    }

}
