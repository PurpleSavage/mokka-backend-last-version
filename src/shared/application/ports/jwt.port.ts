export type ExpirationValue = number | `${number}${'s' | 'm' | 'h' | 'd'}`;

export abstract class JwtPort{
    abstract generateToken(payload: object, duration:ExpirationValue ): Promise<string | null>
    abstract validateToken<T extends object>(token: string): Promise<T | null>
}