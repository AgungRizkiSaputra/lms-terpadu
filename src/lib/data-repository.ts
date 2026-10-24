"use client";

import {
  Profile,
  School,
  AcademicYear,
  ClassRoom,
  Subject,
  LearningMaterial,
  Assignment,
  Submission,
  Exam,
  ExamQuestion,
  Announcement,
  NotificationItem,
  SchoolEvent,
  ClassSchedule,
  UserRole,
} from "@/types/database";
import {
  initialSchool,
  initialAcademicYear,
  initialProfiles,
  initialClasses,
  initialSubjects,
  initialMaterials,
  initialAssignments,
  initialSubmissions,
  initialExams,
  initialExamQuestions,
  initialAnnouncements,
  initialNotifications,
  initialEvents,
  initialSchedules,
} from "./mock-data";

// Helper localStorage persistence
function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(`lms_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`lms_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save lms_${key}`, e);
  }
}

export const DataRepository = {
  // Sesi pengguna aktif saat ini
  getCurrentUser(): Profile {
    const fallback = initialProfiles[0]; // Admin by default
    return getStorage<Profile>("current_user", fallback);
  },

  setCurrentUser(profile: Profile): void {
    setStorage("current_user", profile);
    if (typeof window !== "undefined") {
      // Trigger update event
      window.dispatchEvent(new Event("lms_auth_changed"));
    }
  },

  logout(): void {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("lms_current_user");
      window.dispatchEvent(new Event("lms_auth_changed"));
    }
  },

  loginAsRole(role: UserRole): Profile {
    const target = initialProfiles.find((p) => p.role === role) || initialProfiles[0];
    this.setCurrentUser(target);
    return target;
  },

  // 1. Profil & Pengguna
  getProfiles(): Profile[] {
    const list = getStorage<Profile[]>("profiles", initialProfiles);
    const existingIds = new Set(list.map((p) => p.id));
    const missing = initialProfiles.filter((p) => !existingIds.has(p.id));
    if (missing.length > 0) {
      const merged = [...list, ...missing];
      setStorage("profiles", merged);
      return merged;
    }
    return list;
  },

  addProfile(profile: Omit<Profile, "id" | "created_at">): Profile {
    const list = this.getProfiles();
    const newProfile: Profile = {
      ...profile,
      id: "usr-" + Date.now(),
      created_at: new Date().toISOString(),
    };
    list.unshift(newProfile);
    setStorage("profiles", list);
    return newProfile;
  },

  updateProfile(id: string, updates: Partial<Profile>): Profile | null {
    const list = this.getProfiles();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
    setStorage("profiles", list);

    // Jika yang diupdate adalah user aktif, update juga current_user
    const current = this.getCurrentUser();
    if (current.id === id) {
      this.setCurrentUser(list[idx]);
    }
    return list[idx];
  },

  deleteProfile(id: string): boolean {
    const list = this.getProfiles().filter((p) => p.id !== id);
    setStorage("profiles", list);
    return true;
  },

  resetUserPassword(id: string): { success: boolean; message: string; defaultPassword?: string } {
    const list = this.getProfiles();
    const user = list.find((p) => p.id === id);
    if (!user) return { success: false, message: "Pengguna tidak ditemukan." };
    const defaultPassword = "Sekolah2026!";
    user.updated_at = new Date().toISOString();
    setStorage("profiles", list);
    return {
      success: true,
      message: `Kata sandi untuk ${user.full_name} berhasil direset menjadi: ${defaultPassword}`,
      defaultPassword,
    };
  },

  // 2. Sekolah & Tahun Ajaran
  getSchool(): School {
    const current = getStorage<School>("school", initialSchool);
    if (!current || !current.name || current.name.includes("Harapan Bangsa")) {
      setStorage("school", initialSchool);
      return initialSchool;
    }
    return current;
  },

  updateSchool(updates: Partial<School>): School {
    const school = { ...this.getSchool(), ...updates };
    setStorage("school", school);
    return school;
  },

  getAcademicYears(): AcademicYear[] {
    return getStorage<AcademicYear[]>("academic_years", [initialAcademicYear]);
  },

  // 3. Kelas & Mapel
  getClasses(): ClassRoom[] {
    const list = getStorage<ClassRoom[]>("classes", initialClasses);
    const existingIds = new Set(list.map((c) => c.id));
    const missing = initialClasses.filter((c) => !existingIds.has(c.id));
    if (missing.length > 0) {
      const merged = [...list, ...missing];
      setStorage("classes", merged);
      return merged;
    }
    return list;
  },

  addClass(cls: Omit<ClassRoom, "id" | "school_id" | "academic_year_id">): ClassRoom {
    const list = this.getClasses();
    const newClass: ClassRoom = {
      ...cls,
      id: "cls-" + Date.now(),
      school_id: initialSchool.id,
      academic_year_id: initialAcademicYear.id,
      total_students: 0,
      created_at: new Date().toISOString(),
    };
    list.push(newClass);
    setStorage("classes", list);
    return newClass;
  },

  updateClass(id: string, updates: Partial<ClassRoom>): ClassRoom | null {
    const list = this.getClasses();
    const idx = list.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    setStorage("classes", list);
    return list[idx];
  },

  deleteClass(id: string): boolean {
    const list = this.getClasses().filter((c) => c.id !== id);
    setStorage("classes", list);
    return true;
  },

  getSubjects(): Subject[] {
    const list = getStorage<Subject[]>("subjects", initialSubjects);
    const existingIds = new Set(list.map((s) => s.id));
    const missing = initialSubjects.filter((s) => !existingIds.has(s.id));
    if (missing.length > 0) {
      const merged = [...list, ...missing];
      setStorage("subjects", merged);
      return merged;
    }
    return list;
  },

  addSubject(subject: Omit<Subject, "id" | "school_id">): Subject {
    const list = this.getSubjects();
    const newSubject: Subject = {
      ...subject,
      id: "sbj-" + Date.now(),
      school_id: initialSchool.id,
      created_at: new Date().toISOString(),
    };
    list.push(newSubject);
    setStorage("subjects", list);
    return newSubject;
  },

  updateSubject(id: string, updates: Partial<Subject>): Subject | null {
    const list = this.getSubjects();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    setStorage("subjects", list);
    return list[idx];
  },

  deleteSubject(id: string): boolean {
    const list = this.getSubjects().filter((s) => s.id !== id);
    setStorage("subjects", list);
    return true;
  },

  // 4. Materi Pembelajaran
  getMaterials(): LearningMaterial[] {
    const list = getStorage<LearningMaterial[]>("materials", initialMaterials);
    const existingIds = new Set(list.map((m) => m.id));
    const missing = initialMaterials.filter((m) => !existingIds.has(m.id));
    if (missing.length > 0) {
      const merged = [...list, ...missing];
      setStorage("materials", merged);
      return merged;
    }
    return list;
  },

  addMaterial(data: Omit<LearningMaterial, "id" | "created_at" | "updated_at">): LearningMaterial {
    const list = this.getMaterials();
    const newMat: LearningMaterial = {
      ...data,
      id: "mat-" + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    list.unshift(newMat);
    setStorage("materials", list);
    return newMat;
  },

  updateMaterial(id: string, updates: Partial<LearningMaterial>): LearningMaterial | null {
    const list = this.getMaterials();
    const idx = list.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
    setStorage("materials", list);
    return list[idx];
  },

  deleteMaterial(id: string): boolean {
    const list = this.getMaterials().filter((m) => m.id !== id);
    setStorage("materials", list);
    return true;
  },

  // 5. Tugas & Pengumpulan (Assignments & Submissions)
  getAssignments(): Assignment[] {
    return getStorage<Assignment[]>("assignments", initialAssignments);
  },

  addAssignment(data: Omit<Assignment, "id" | "created_at" | "submissions_count">): Assignment {
    const list = this.getAssignments();
    const newAsg: Assignment = {
      ...data,
      id: "asg-" + Date.now(),
      created_at: new Date().toISOString(),
      submissions_count: 0,
    };
    list.unshift(newAsg);
    setStorage("assignments", list);
    return newAsg;
  },

  getSubmissions(): Submission[] {
    return getStorage<Submission[]>("submissions", initialSubmissions);
  },

  submitAssignment(data: {
    assignment_id: string;
    student_id: string;
    text_answer: string;
    file_name?: string;
  }): Submission {
    const list = this.getSubmissions();
    const existingIdx = list.findIndex(
      (s) => s.assignment_id === data.assignment_id && s.student_id === data.student_id
    );

    const submission: Submission = {
      id: existingIdx >= 0 ? list[existingIdx].id : "sub-" + Date.now(),
      assignment_id: data.assignment_id,
      student_id: data.student_id,
      submitted_at: new Date().toISOString(),
      text_answer: data.text_answer,
      status: "submitted",
      files: data.file_name
        ? [
          {
            id: "file-" + Date.now(),
            submission_id: existingIdx >= 0 ? list[existingIdx].id : "sub-" + Date.now(),
            file_name: data.file_name,
            file_path: `/submissions/${data.file_name}`,
            uploaded_at: new Date().toISOString(),
          },
        ]
        : [],
    };

    if (existingIdx >= 0) {
      list[existingIdx] = submission;
    } else {
      list.push(submission);
    }
    setStorage("submissions", list);

    // Update submission count di assignment
    const asgs = this.getAssignments();
    const asg = asgs.find((a) => a.id === data.assignment_id);
    if (asg) {
      asg.submissions_count = (asg.submissions_count || 0) + 1;
      setStorage("assignments", asgs);
    }

    return submission;
  },

  gradeSubmission(id: string, score: number, feedback: string, graderId: string): Submission | null {
    const list = this.getSubmissions();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    list[idx] = {
      ...list[idx],
      score,
      feedback,
      status: "graded",
      graded_by: graderId,
      graded_at: new Date().toISOString(),
    };
    setStorage("submissions", list);
    return list[idx];
  },

  updateAssignment(id: string, updates: Partial<Assignment>): Assignment | null {
    const list = this.getAssignments();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    setStorage("assignments", list);
    return list[idx];
  },

  deleteAssignment(id: string): boolean {
    const list = this.getAssignments().filter((a) => a.id !== id);
    setStorage("assignments", list);
    return true;
  },

  // 6. Ujian (Exams)
  getExams(): Exam[] {
    return getStorage<Exam[]>("exams", initialExams);
  },

  addExam(data: Omit<Exam, "id" | "created_at" | "attempts_count">): Exam {
    const list = this.getExams();
    const newExam: Exam = {
      ...data,
      id: "exm-" + Date.now(),
      created_at: new Date().toISOString(),
      attempts_count: 0,
    };
    list.unshift(newExam);
    setStorage("exams", list);
    return newExam;
  },

  updateExam(id: string, updates: Partial<Exam>): Exam | null {
    const list = this.getExams();
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    setStorage("exams", list);
    return list[idx];
  },

  deleteExam(id: string): boolean {
    const list = this.getExams().filter((e) => e.id !== id);
    setStorage("exams", list);
    return true;
  },

  getExamQuestions(examId?: string): ExamQuestion[] {
    const allQuestions = getStorage<ExamQuestion[]>("exam_questions", initialExamQuestions);
    if (examId) {
      return allQuestions.filter((q) => q.exam_id === examId);
    }
    return allQuestions;
  },

  addExamQuestion(question: Omit<ExamQuestion, "id">): ExamQuestion {
    const list = this.getExamQuestions();
    const newQuestion: ExamQuestion = {
      ...question,
      id: "qst-" + Date.now() + Math.random().toString(36).substring(2, 6),
      order_index: question.order_index || list.length + 1,
    };
    list.push(newQuestion);
    setStorage("exam_questions", list);
    return newQuestion;
  },

  updateExamQuestion(id: string, updates: Partial<ExamQuestion>): ExamQuestion | null {
    const list = this.getExamQuestions();
    const idx = list.findIndex((q) => q.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    setStorage("exam_questions", list);
    return list[idx];
  },

  deleteExamQuestion(id: string): boolean {
    const list = this.getExamQuestions().filter((q) => q.id !== id);
    setStorage("exam_questions", list);
    return true;
  },

  // 7. Pengumuman & Notifikasi
  getAnnouncements(): Announcement[] {
    return getStorage<Announcement[]>("announcements", initialAnnouncements);
  },

  addAnnouncement(data: Omit<Announcement, "id" | "published_at">): Announcement {
    const list = this.getAnnouncements();
    const newAnn: Announcement = {
      ...data,
      id: "ann-" + Date.now(),
      published_at: new Date().toISOString(),
    };
    list.unshift(newAnn);
    setStorage("announcements", list);
    return newAnn;
  },

  getNotifications(): NotificationItem[] {
    return getStorage<NotificationItem[]>("notifications", initialNotifications);
  },

  markNotificationAsRead(id: string): void {
    const list = this.getNotifications();
    const item = list.find((n) => n.id === id);
    if (item) {
      item.is_read = true;
      setStorage("notifications", list);
    }
  },

  // 8. Kalender & Jadwal
  getEvents(): SchoolEvent[] {
    return getStorage<SchoolEvent[]>("events", initialEvents);
  },

  addEvent(event: Omit<SchoolEvent, "id">): SchoolEvent {
    const list = this.getEvents();
    const newEvent: SchoolEvent = {
      ...event,
      id: "evt-" + Date.now(),
    };
    list.push(newEvent);
    setStorage("events", list);
    return newEvent;
  },

  getSchedules(): ClassSchedule[] {
    const list = getStorage<ClassSchedule[]>("schedules", initialSchedules);
    const existingIds = new Set(list.map((s) => s.id));
    const missing = initialSchedules.filter((s) => !existingIds.has(s.id));
    if (missing.length > 0) {
      const merged = [...list, ...missing];
      setStorage("schedules", merged);
      return merged;
    }
    return list;
  },

  addSchedule(sched: Omit<ClassSchedule, "id">): ClassSchedule {
    const list = this.getSchedules();
    const newSched: ClassSchedule = {
      ...sched,
      id: "sched-" + Date.now(),
      status: sched.status || "aktif",
    };
    list.push(newSched);
    setStorage("schedules", list);
    return newSched;
  },

  updateSchedule(id: string, updates: Partial<ClassSchedule>): ClassSchedule | null {
    const list = this.getSchedules();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    setStorage("schedules", list);
    return list[idx];
  },

  deleteSchedule(id: string): boolean {
    const list = this.getSchedules().filter((s) => s.id !== id);
    setStorage("schedules", list);
    return true;
  },
};
