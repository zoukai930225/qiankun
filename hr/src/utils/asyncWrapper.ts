const asyncWrapper = <T>(
  promise: Promise<T>, 
  onFinally: () => void = () => {}
): Promise<[T, null] | [null, any]> => {
  return promise
    .then((data: T): [T, null] => [data, null])
    .catch((error: any): [null, any] => {
      return [null, error];
    })
    .finally(onFinally);
};

export default asyncWrapper;