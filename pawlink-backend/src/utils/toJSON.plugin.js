/**
 * Mongoose schema plugin - applied to every model so that API responses
 * consistently expose `id` (string) instead of `_id` (ObjectId), and never
 * leak the internal `__v` version key. Frontend code can then just use
 * `item.id` everywhere instead of juggling `_id`.
 */
module.exports = function toJSONPlugin(schema) {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
  });
};
