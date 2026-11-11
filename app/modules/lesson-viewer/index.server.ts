/**
 * Reads and writes behind the lesson page: the course and its curriculum,
 * the Student's progress, the discussion thread and quiz attempts.
 */
export {
  getCourseWithDetails,
  getLessonById,
  getModuleById,
  getUserById,
  flattenCourseLessons,
} from "./lib/course.server";
export {
  getLessonProgress,
  getLessonProgressForCourse,
  markLessonComplete,
  markLessonInProgress,
  getLastWatchPosition,
  calculateWatchProgress,
} from "./lib/progress.server";
export {
  getCommentById,
  getLessonThread,
  renderThread,
} from "./lib/thread.server";
export {
  getQuizByLessonId,
  getQuizWithQuestions,
  getBestAttempt,
  computeResult,
} from "./lib/quiz.server";
