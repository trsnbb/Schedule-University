import mongoose from 'mongoose';

const SpecializationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
});

const Specialization = mongoose.model('Specialization', SpecializationSchema);

const CourseSchema = new mongoose.Schema({
  courseNumber: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true,
  },
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  }],
  specializationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specialization',
    required: true,
  },
});

const Course = mongoose.model('Course', CourseSchema);

const GroupSchema = new mongoose.Schema({
  groupNumber: {
    type: Number,
    enum: [1, 2, 3, 4], 
    required: true,
  },
  subgroups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubGroup',
  }],
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
});

const Group = mongoose.model('Group', GroupSchema);

const SubGroupSchema = new mongoose.Schema({
  subgroupNumber: {
    type: Number,
    enum: [1, 2], 
    required: true,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
});

const SubGroup = mongoose.model('SubGroup', SubGroupSchema);

export { Specialization, Course, Group, SubGroup };