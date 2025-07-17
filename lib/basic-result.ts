import { ErrType, OkType, ResolvedOkResults, Result } from "./types";

export function convertToError(e: unknown) {
    return e instanceof Error ? e : new Error(String(e));
}

export function Ok<TValue>(value: TValue): OkType<TValue> {
    return { ok: true, value };
}

export function Err<TError>(error: TError): ErrType<TError> {
    return { ok: false, error };
}

async function throwOnFailure<T>(value: Promise<Result<T>>): Promise<OkType<T>['value']> {
    const result = await value;

    if (!result.ok) {
        throw result.error;
    }

    return result.value;
}

export async function all<T extends readonly Promise<Result<unknown>>[]>(
    values: T,
): Promise<Result<ResolvedOkResults<T>>> {
    try {
        const result = (
            await Promise.all(values.map((value) => throwOnFailure(value)))) as ResolvedOkResults<T>;
        return Ok(result);
    } catch (e) {
        return Err(convertToError(e));
    }
}

