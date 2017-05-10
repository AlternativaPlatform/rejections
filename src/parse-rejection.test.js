import parseRejection from './parse-rejection';

test('parses well-formated rejection', () => {
  const withoutPayload = parseRejection({ type: 'without-payload' });
  const withPayload = parseRejection({ type: 'with-payload', payload: 'A payload' });

  expect(withoutPayload).toBeInstanceOf(Error);
  expect(withPayload).toBeInstanceOf(Error);
  expect(withPayload.type).toBe('with-payload');
  expect(withoutPayload.type).toBe('without-payload');
  expect(JSON.stringify(withPayload)).toBe('{"type":"with-payload","payload":"A payload"}');
  expect(JSON.stringify(withoutPayload)).toBe('{"type":"without-payload"}');
});

test('parses malformed rejection', () => {
  const rejection = parseRejection({ result: 'success', paylod: 'A payload' });
  expect(rejection).toBeInstanceOf(Error);
  expect(rejection.type).toBe('unknown');
  expect(JSON.stringify(rejection)).toBe('{"type":"unknown","payload":{"result":"success","paylod":"A payload"}}');
});
  

test('parses null data', () => {
  const rejection = parseRejection(null);
  expect(rejection).toBeInstanceOf(Error);
  expect(rejection.type).toBe('unknown');
  expect(JSON.stringify(rejection)).toBe('{"type":"unknown","payload":null}');
});

test('parses undefined data', () => {
  const rejection = parseRejection();
  expect(rejection).toBeInstanceOf(Error);
  expect(rejection.type).toBe('unknown');
  expect(JSON.stringify(rejection)).toBe('{"type":"unknown"}');
});
  
