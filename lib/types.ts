export type Result<TValue, TError = Error> = OkType<TValue> | ErrType<TError>;

export type ErrType<TError = Error> = { ok: false; error: TError };
export type OkType<TValue> = { ok: true; value: TValue };

export type ResolvedOkResults<T> = {
    -readonly [P in keyof T]: Awaited<T[P]> extends Result<infer V> ? OkType<V>['value'] : never;
};
