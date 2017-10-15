import { FieldSerializerConfigurator } from './field-serializer.configurator';
import { StringUtils } from '../../utils/string.utils';
import { FieldSerializer } from './field-serializer';
import { FieldSerializerError } from './field-serializer.error';
import { DbHelperModel } from '../../models/db-helper-model.model';

export class BlobFieldSerializer extends FieldSerializer {

    public constructor(
        fieldName: string,
        jsonKey: string,
        config?: FieldSerializerConfigurator
    ) {
        super(fieldName, jsonKey, config);
        this.rules.type = 'Blob';
    }

    public checkFieldRules(data: any): FieldSerializerError | null {
        const value = data[this.jsonKey];
        if (StringUtils.isString(value)) {
            return null;
        }
        return new FieldSerializerError(
            this.jsonKey,
            'Field should be a byte array encoded in base64 string',
            this.rules
        );
    }

}
