expect.extend({
  toContainObject(received, argument, extraData) {
    const messageAddon = extraData ? `\ngiven data: ${this.utils.printExpected(extraData)}` : '';

    const pass = this.equals(received,
      expect.arrayContaining([
        expect.objectContaining(argument),
      ]));

    if (pass) {
      return {
        message: () => `expected ${this.utils.printReceived(received)} not to contain object ${
          this.utils.printExpected(argument)
        }${messageAddon}`,
        pass: true,
      };
    }

    return {
      message: () => `expected ${this.utils.printReceived(received)} to contain object ${
        this.utils.printExpected(argument)
      }${messageAddon}`,
      pass: false,
    };
  },
});
