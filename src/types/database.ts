export type UserRole = "admin" | "guru" | "siswa";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  role: UserRole;
  school_id?: string | null;
  nip_nisn?: string | null;
  phone?: string | null;
  bio?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface School {
  id: string;
  name: string;
  npsn?: string | null;
  level: "SMP" | "SMA" | "SMK";
  logo_url?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  config?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface AcademicYear {
  id: string;
  school_id: string;
  name: string;
  semester: "Ganjil" | "Genap";
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at?: string;
}

export interface ClassRoom {
  id: string;
  school_id: string;
  academic_year_id: string;
  grade_level: string;
  name: string;
  homeroom_teacher_id?: string | null;
  capacity: number;
  homeroom_teacher?: Profile | null;
  total_students?: number;
  created_at?: string;
}

export interface Subject {
  id: string;
  school_id: string;
  code: string;
  name: string;
  description?: string | null;
  category: string;
  passing_grade: number;
  created_at?: string;
}

export interface LearningMaterial {
  id: string;
  class_id: string;
  subject_id: string;
  author_id: string;
  title: string;
  description?: string | null;
  content: string;
  order_index: number;
  video_url?: string | null;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
  author?: Profile;
  class?: ClassRoom;
  subject?: Subject;
  attachments?: MaterialAttachment[];
}

export interface MaterialAttachment {
  id: string;
  material_id: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  file_type?: string;
  created_at?: string;
}

export interface Assignment {
  id: string;
  class_id: string;
  subject_id: string;
  author_id: string;
  title: string;
  instructions: string;
  start_date: string;
  due_date: string;
  max_score: number;
  allow_late_submission: boolean;
  submission_type: "text" | "file" | "all";
  status: "draft" | "published" | "closed";
  created_at: string;
  author?: Profile;
  class?: ClassRoom;
  subject?: Subject;
  submissions_count?: number;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  submitted_at: string;
  text_answer?: string | null;
  status: "draft" | "submitted" | "graded" | "revision_requested" | "late";
  score?: number | null;
  feedback?: string | null;
  graded_by?: string | null;
  graded_at?: string | null;
  student?: Profile;
  assignment?: Assignment;
  files?: SubmissionFile[];
}

export interface SubmissionFile {
  id: string;
  submission_id: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  file_type?: string;
  uploaded_at: string;
}

export interface Exam {
  id: string;
  class_id: string;
  subject_id: string;
  author_id: string;
  title: string;
  description?: string | null;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  is_published: boolean;
  show_result_immediately: boolean;
  passing_score: number;
  created_at: string;
  author?: Profile;
  class?: ClassRoom;
  subject?: Subject;
  questions?: ExamQuestion[];
  attempts_count?: number;
}

export interface ExamQuestion {
  id: string;
  exam_id: string;
  question_text: string;
  question_type: "multiple_choice" | "true_false" | "essay";
  points: number;
  order_index: number;
  options?: ExamQuestionOption[];
}

export interface ExamQuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct?: boolean; // Disembunyikan dari siswa saat ujian
  order_index: number;
}

export interface ExamAttempt {
  id: string;
  exam_id: string;
  student_id: string;
  started_at: string;
  submitted_at?: string | null;
  total_score?: number | null;
  is_graded: boolean;
  status: "in_progress" | "submitted" | "timed_out" | "graded";
  exam?: Exam;
  student?: Profile;
  answers?: ExamAnswer[];
}

export interface ExamAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_option_id?: string | null;
  essay_answer?: string | null;
  score?: number | null;
  feedback?: string | null;
}

export interface Announcement {
  id: string;
  school_id: string;
  author_id: string;
  title: string;
  content: string;
  target_role: "all" | "admin" | "guru" | "siswa";
  is_published: boolean;
  priority: "low" | "normal" | "high" | "urgent";
  published_at: string;
  author?: Profile;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: "materi" | "tugas" | "ujian" | "nilai" | "pengumuman" | "sistem";
  link?: string | null;
  is_read: boolean;
  created_at: string;
}

export interface SchoolEvent {
  id: string;
  school_id: string;
  title: string;
  description?: string | null;
  start_time: string;
  end_time: string;
  event_type: "libur" | "ujian" | "kegiatan" | "rapat" | "akademik";
  is_public: boolean;
}

export interface ClassSchedule {
  id: string;
  class_id: string;
  subject_id: string;
  teacher_id: string;
  day_of_week: number; // 1-7 (1=Senin, 2=Selasa, etc.)
  start_time: string;
  end_time: string;
  room?: string | null;
  status?: "aktif" | "libur" | "pengganti";
  class?: ClassRoom;
  subject?: Subject;
  teacher?: Profile;
}

