import { FieldSerializerError } from '../serializers/field-serializers/field-serializer.error';

export class SerializerError implements Error {
    public name = 'Data is invalid';

    public constructor(public message: string, public fieldErrors: FieldSerializerError[]) {}
}
