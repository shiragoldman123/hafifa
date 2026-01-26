import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationGuard implements CanActivate {
  constructor(private schema: Joi.ObjectSchema) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { error, value: valueAfterTransform } = this.schema.unknown().validate(request, { abortEarly: false, allowUnknown: false });
    if (error) {
      throw new BadRequestException(error.message);
    }

    request.body = valueAfterTransform.body;
    request.query = valueAfterTransform.query;
    request.params = valueAfterTransform.params;

    return true;
  }
}
