const mongoose = require('mongoose')
const { Schema } = mongoose

//User Schema
const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
})

// Project Schema
const projectSchema = new mongoose.Schema({
    projectID: { type: String, required: true, unique: true },
    projectName: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date }
});

// Task Schema
const taskSchema = new mongoose.Schema({
    taskID: { type: String, required: true, unique: true },
    taskName: { type: String, required: true },
    status: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Comment Schema
const commentSchema = new mongoose.Schema({
    commentID: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    datePosted: { type: Date, default: Date.now }
});

// Commit Schema
const commitSchema = new mongoose.Schema({
    commitID: { type: String, required: true, unique: true },
    commitMessage: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dateCommitted: { type: Date, default: Date.now }
});

// Version Control Schema
const versionControlSchema = new mongoose.Schema({
    repoID: { type: String, required: true, unique: true },
    repoName: { type: String, required: true },
    commitHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commit' }]
});

//team Schema
const TeamSchema = new mongoose.Schema({
    teamID: String,
    teamName: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
});

module.exports = {
    User: mongoose.model('User', userSchema),
    Project: mongoose.model('Project', projectSchema),
    Task: mongoose.model('Task', taskSchema),
    Comment: mongoose.model('Comment', commentSchema),
    Commit: mongoose.model('Commit', commitSchema),
    VersionControl: mongoose.model('VersionControl', versionControlSchema),
    Team: mongoose.model("Team", TeamSchema),
};
// const userModel = mongoose.model('User', userSchema)
// module.exports = userModel