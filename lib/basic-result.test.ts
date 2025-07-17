import { all, convertToError, Err, Ok } from './basic-result';
import type { Result } from './types';

describe('convertToError', () => {
    it('should return the same error if input is an Error', () => {
        const err = new Error('Something went wrong');
        expect(convertToError(err)).toBe(err);
    });

    it('should convert non-Error to Error', () => {
        const input = 'oops';
        const error = convertToError(input);
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('oops');
    });

    it('should convert unknown object to Error', () => {
        const input = { message: 'fail' };
        const error = convertToError(input);
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('[object Object]');
    });
});

describe('Ok', () => {
    it('should create an Ok result', () => {
        const result = Ok(42);
        expect(result).toEqual({ ok: true, value: 42 });
    });
});

describe('Err', () => {
    it('should create an Err result', () => {
        const error = new Error('Failure');
        const result = Err(error);
        expect(result).toEqual({ ok: false, error });
    });
});

describe('all', () => {
    it('should resolve to Ok with values if all promises succeed', async () => {
        const p1: Promise<Result<number>> = Promise.resolve(Ok(1));
        const p2: Promise<Result<string>> = Promise.resolve(Ok('two'));
        const result = await all([p1, p2] as const);
        expect(result).toEqual(Ok([1, 'two']));
    });

    it('should resolve to Err if any promise fails', async () => {
        const p1: Promise<Result<number>> = Promise.resolve(Ok(1));
        const error = new Error('fail');
        const p2: Promise<Result<number>> = Promise.resolve(Err(error));

        const result = await all([p1, p2] as const);
        expect(result.ok).toBe(false);
        expect(result).toEqual({ ok: false, error });
    });


    it('should not evaluate all promises if one fails early (fail fast behavior)', async () => {
        const p1: Promise<Result<number>> = Promise.resolve(Err(new Error('early fail')));

        const p2: Promise<Result<number>> = new Promise((resolve) => {
                setTimeout(() => {
                // This should not be called if fail-fast works
                resolve(Ok(2));
            }, 100);
        });

        const result = await all([p1, p2] as const);

        // Confirm that we got the early error
        expect(result.ok).toBe(false);
        assert(!result.ok, "Result should've failed")

        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('early fail');
    });
});
