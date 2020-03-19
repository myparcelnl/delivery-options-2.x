import uniqueId from 'lodash-es/uniqueId';

export const uniqueIdMixin = {
  data() {
    return {
      uniqueId: uniqueId(),
      createUniqueId: uniqueId,
    };
  },
};
