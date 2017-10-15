import { FieldSerializerRules } from './field-serializer-rules';

export class FieldSerializerError {
    public error?: any;

    public constructor(
        public jsonKey: string,
        public reason: string,
        public fieldRules: FieldSerializerRules
    ) {}
}
