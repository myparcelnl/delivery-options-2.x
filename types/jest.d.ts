// @ts-ignore-next
declare global {
  namespace jest {
    interface Matchers<R> {
      toContainObject(argument: Object, extraData?: any): R;
    }
  }
}
