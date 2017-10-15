import { FieldSerializerConfigurator } from './field-serializer.configurator';
import { FieldSerializerError } from './field-serializer.error';
import { FieldSerializer } from './field-serializer';

export class StringFieldSerializer extends FieldSerializer {
    public constructor(
        fieldName: string,
        jsonKey: string,
        config?: FieldSerializerConfigurator
    ) {
        super(fieldName, jsonKey, config);
        this.rules.type = 'String';
    }

    public checkFieldRules(data: any): FieldSerializerError | null {
        return null;
    }
}
