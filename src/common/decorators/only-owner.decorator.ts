import { SetMetadata } from '@nestjs/common';

export const OnlyOwner = () => SetMetadata('isOnlyOwner', true);
