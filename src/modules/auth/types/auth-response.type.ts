import { Tokens } from './tokens.type';

export interface AuthResponse extends Tokens {
    userId: string;
}
