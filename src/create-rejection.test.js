import createRejection from './create-rejection';

test('throws when type is not provided', () => {
  expect(() => createRejection())
    .toThrow();
});

test('creator.toString returns type', () => {
  expect(createRejection('type').toString())
    .toBe('type');
});

test('creates rejection with string payload', () => {
  const r = createRejection('type')('payload');

  expect(r).toBeInstanceOf(Error);
  expect(r.type).toBe('type');
  expect(r.payload).toBe('payload');
  expect(JSON.stringify(r)).toBe('{"type":"type","payload":"payload"}');
});

test('creates rejection with empty payload', () => {
  const r = createRejection('type')();

  expect(r).toBeInstanceOf(Error);
  expect(r.type).toBe('type');
  expect(r.payload).toBe(undefined);
  expect(JSON.stringify(r)).toBe('{"type":"type"}');
});

test('creates rejection with object as payload', () => {
  const r = createRejection('type')({ field: 'value' });

  expect(r).toBeInstanceOf(Error);
  expect(r.type).toBe('type');
  expect(r.payload).toMatchObject({ field: 'value' });
  expect(JSON.stringify(r)).toBe('{"type":"type","payload":{"field":"value"}}');
});

