export type Result<TValue, TError = Error> = Ok<TValue> | Err<TError>;

export type Err<TError = Error> = { ok: false; error: TError };
export type Ok<TValue> = { ok: true; value: TValue };

export type ResolvedOkResults<T> = {
    -readonly [P in keyof T]: Awaited<T[P]> extends Result<infer V> ? Ok<V>['value'] : never;
};
