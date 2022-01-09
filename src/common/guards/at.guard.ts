import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TokensService } from 'src/modules/auth/token-pairs.service';
import { TokensEnum } from 'src/modules/auth/types/tokens.type';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector, private tokensService: TokensService) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        const isOnlyOwner = this.reflector.getAllAndOverride('isOnlyOwner', [
            context.getHandler(),
            context.getClass(),
        ]);

        const isValid = super.canActivate(context);

        if (isValid) {
            if (isOnlyOwner) {
                const req = context.switchToHttp().getRequest();

                const accessToken = req.headers.authorization.replace('Bearer', '').trim();
                const userId = req.params.userId;

                return this.tokensService.compareTokens(
                    userId,
                    accessToken,
                    TokensEnum.accessToken
                );
            }

            return isValid;
        }

        return false;
    }
}
