/**
 * Views
 * --
 *
 * - id
 * - entry_id
 * - user_ip
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const viewSchema = new Schema({
    _entry: { type: Schema.Types.ObjectId, ref: 'Entry' },
    user_ip: {type: String, required: true },
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: true, default: Date.now }
});

viewSchema.index({ user_ip: 1, _entry: 1 }, { unique: true });

module.exports = mongoose.model('View', viewSchema);
