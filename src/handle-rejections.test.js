import createRejection from './create-rejection';
import handleRejections from './handle-rejections';

const r1 = createRejection('r1');
const r2 = createRejection('r2');

test('throws when rejections map is not provided', () => {
  expect(() => handleRejections())
    .toThrow();
});

test('throws if default handler is no a function', () => {
  expect(() => handleRejections({}, {}))
    .toThrow();
});

test('throws if one of handlers is no a function', () => {
  expect(() => handleRejections({ [r1]: () => {}, [r2]: 'ouch' }))
    .toThrow();
});

test('throws if one of handlers is null', () => {
  expect(() => handleRejections({ [r1]: null }))
    .toThrow();
});

test('invokes handlers', () => {
  const r1Handler = jest.fn(() => {});
  const handler = handleRejections({
    [r1]: r1Handler,
  });

  const rejection = r1();
  
  handler(rejection);

  expect(r1Handler).toBeCalledWith(rejection);
});

test('returns handler result', () => {
  const handler = handleRejections({
    [r1]: () => 'result',
  });

  expect(handler(r1())).toBe('result');
});

test('re-rejects unhandled if default handler is missing', () => {
  const handler = handleRejections({
    [r1]: () => {},
  });
  const rejection = r2();
  
  return handler(rejection)
    .catch(rej => expect(rej).toBe(rejection));
});

test('invokes default handler if unhandled', () => {
  const defaultHandler = jest.fn(() => 'result');
  const handler = handleRejections({
    [r1]: () => {},
  }, defaultHandler);
  const rejection = r2();
  
  expect(handler(rejection)).toBe('result');
  expect(defaultHandler).toBeCalledWith(rejection);
});

