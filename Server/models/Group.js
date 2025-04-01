import mongoose from 'mongoose';

// Схема для Спеціальності
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

// Схема для Курсів
const CourseSchema = new mongoose.Schema({
  courseNumber: {
    type: Number,
    enum: [1, 2, 3, 4], // 1, 2, 3 або 4 курс
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

// Схема для Груп
const GroupSchema = new mongoose.Schema({
  groupNumber: {
    type: Number,
    enum: [1, 2, 3, 4], // 1, 2, 3 або 4 група
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

// Схема для Підгруп
const SubGroupSchema = new mongoose.Schema({
  subgroupNumber: {
    type: Number,
    enum: [1, 2], // 1 або 2 підгрупа
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