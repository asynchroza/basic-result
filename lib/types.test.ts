import { expectTypeOf } from 'vitest'
import { all, Err, Ok } from './basic-result';
import { OkType, ErrType } from './types';

describe("correct types are returned", () => {
    test('correct OkType is returned from Ok call', () => {
        const ok = Ok(69)
        expectTypeOf(ok).toMatchObjectType<OkType<number>>();
    })

    test('correct ErrType is returned from Err call', () => {
        const ok = Err(new Error("World has gone mad!"))
        expectTypeOf(ok).toMatchObjectType<ErrType>();
    })

    test('all resolves the sequence of types correctly', async () => {
        const p1 = Promise.resolve(Ok(1));
        const p2 = Promise.resolve(Ok("hello world"));

        const result = await all([p1, p2]);
        assert(result.ok);

        const [ p1Value, p2Value ] = result.value;

        expectTypeOf(p1Value).toBeNumber();
        expectTypeOf(p2Value).toBeString();
    })
})

