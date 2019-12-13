/**
 * Helper function for readability. Returns the name of the choice that matches given predicate or the first
 *  choice if none match.
 *
 * @param {Array} choices - Choices array.
 * @param {Function} predicate - Function to use in find().
 *
 * @returns {String} - Choice name.
 */
export function getChoiceOrFirst(choices, predicate) {
  return (choices.find(predicate) || choices[0]).name;
}
