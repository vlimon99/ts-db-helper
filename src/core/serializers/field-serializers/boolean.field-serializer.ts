import { FieldSerializerConfigurator } from './field-serializer.configurator';
import { FieldSerializerError } from './field-serializer.error';
import { FieldSerializer } from './field-serializer';

export class BooleanFieldSerializer extends FieldSerializer {

    public constructor(
        fieldName: string,
        jsonKey: string,
        config?: FieldSerializerConfigurator
    ) {
        super(fieldName, jsonKey, config);
        this.rules.type = 'Boolean';
    }

    public checkFieldRules(data: any): FieldSerializerError | null {
        const value = data[this.jsonKey];
        if (value !== true && value !== false) {
            return new FieldSerializerError(
                this.jsonKey,
                'Field is not boolean',
                this.rules
            );
        } else {
            return null;
        }
    }
}
