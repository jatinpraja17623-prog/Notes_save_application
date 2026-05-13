const mongoose = require('mongoose')

const noteSchema = mongoose.Schema({
    title :{
        type: String,
        required: true
    },
    content:{
        type:String,
        default:""
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
    },{ timestamps: true })

    const noteModel = mongoose.model("note", noteSchema);

    module.exports = noteModel;