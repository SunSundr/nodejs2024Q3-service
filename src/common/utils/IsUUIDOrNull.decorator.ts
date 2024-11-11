import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsUUIDOrNull(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isUUIDOrNull',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value === null) {
            return true;
          }

          if (typeof value !== 'string') {
            return false;
          }

          const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

          return uuidRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid UUID or null`;
        },
      },
    });
  };
}
