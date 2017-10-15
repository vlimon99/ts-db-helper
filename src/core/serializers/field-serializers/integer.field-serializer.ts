import { FieldSerializerConfigurator } from './field-serializer.configurator';
import { FieldSerializerError } from './field-serializer.error';
import { FieldSerializer } from './field-serializer';

export class IntegerFieldSerializer extends FieldSerializer {
    public constructor(
        fieldName: string,
        jsonKey: string,
        config?: FieldSerializerConfigurator
    ) {
        super(fieldName, jsonKey, config);
        this.rules.type = 'Interger';
    }

    public checkFieldRules(data: any): FieldSerializerError | null {
        return null;
    }
}
