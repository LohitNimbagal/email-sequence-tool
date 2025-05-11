import mongoose from 'mongoose';

interface Position {
    x: number;
    y: number;
}

interface NodeData {
    [key: string]: any;
}

interface Node {
    id: string;
    position: Position;
    type?: string;
    data: NodeData;
    style?: Record<string, any>;
    measured?: Record<string, any>;
}

interface Edge {
    id: string;
    source: string;
    target: string;
    type: string;
}

const SequenceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    nodes: [{
        id: { type: String, required: true },
        position: {
            x: { type: Number, required: true },
            y: { type: Number, required: true }
        },
        type: { type: String },
        data: { type: mongoose.Schema.Types.Mixed },
        style: { type: mongoose.Schema.Types.Mixed },
        measured: { type: mongoose.Schema.Types.Mixed }
    }],

    edges: [{
        id: { type: String, required: true },
        source: { type: String, required: true },
        target: { type: String, required: true },
        type: { type: String, required: true }
    }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const SequenceModel = mongoose.model('Sequence', SequenceSchema);

export const getSequences = (userId: string) => SequenceModel.find({ userId });
export const getSequenceById = (id: string, userId: string) => SequenceModel.findOne({ _id: id, userId });
export const createSequence = (values: Record<string, any>) => new SequenceModel(values).save().then(seq => seq.toObject());
export const deleteSequenceById = (id: string, userId: string) => SequenceModel.findOneAndDelete({ _id: id, userId });
export const updateSequenceById = (id: string, userId: string, values: Record<string, any>) =>
    SequenceModel.findOneAndUpdate({ _id: id, userId }, values, { new: true });
