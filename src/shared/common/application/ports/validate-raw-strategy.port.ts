export abstract class ValidateRawstrategyPort{
    abstract validateRaw(rawBody: Buffer, headers: Record<string, unknown>, secret?: string):boolean
}