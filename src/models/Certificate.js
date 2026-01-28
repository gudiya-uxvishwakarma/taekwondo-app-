/**
 * Certificate Model
 * Handles certificate data structure and business logic
 */

export class Certificate {
  constructor(data) {
    this.id = data.id;
    this.type = data.type;
    this.title = data.title;
    this.student = data.student;
    this.studentId = data.studentId;
    this.beltLevel = data.beltLevel;
    this.promotion = data.promotion;
    this.achievement = data.achievement;
    this.course = data.course;
    this.duration = data.duration;
    this.category = data.category;
    this.instructor = data.instructor;
    this.instructorSignature = data.instructorSignature;
    this.issueDate = data.issueDate;
    this.status = data.status;
    this.availability = data.availability;
    this.icon = data.icon;
    this.color = data.color;
    this.description = data.description;
    this.filePath = data.filePath;
    this.imageUrl = data.imageUrl;
    this.verificationCode = data.verificationCode;
    this.year = data.year || new Date(data.issueDate).getFullYear();
    this.isExpired = data.isExpired || false;
  }

  // Getters for computed properties
  get isAvailable() {
    return this.availability === 'Available';
  }

  get isIssued() {
    return this.status === 'Issued';
  }

  get isPending() {
    return this.status === 'Pending';
  }

  get formattedIssueDate() {
    return new Date(this.issueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Generate certificate text for sharing/downloading
  generateCertificateText() {
    return `
╔════════════════════════════════════════════════════╗
║    COMBAT WARRIOR TAEKWONDO ACADEMY                ║
║    ${this.type.toUpperCase()}                      ║
╚════════════════════════════════════════════════════╝

CERTIFICATE OF ACHIEVEMENT

Student Name: ${this.student}
Student ID: ${this.studentId}
Certificate Title: ${this.title}
Belt/Level: ${this.beltLevel}
${this.promotion ? `Promotion: ${this.promotion}` : ''}
${this.achievement ? `Achievement: ${this.achievement}` : ''}
${this.course ? `Course: ${this.course}` : ''}
Instructor: ${this.instructor}
Issue Date: ${this.formattedIssueDate}
Certificate ID: ${this.id}
Status: ${this.status}

${this.description}

${this.instructorSignature}
_______________________
Academy Director

Verification Code: ${this.verificationCode || 'N/A'}
`;
  }

  // Generate share text
  generateShareText() {
    return `🏆 ${this.title}\n\nStudent: ${this.student}\nBelt/Level: ${this.beltLevel}\nCertificate ID: ${this.id}\nIssue Date: ${this.formattedIssueDate}\n\nCombat Warrior Taekwondo Academy`;
  }
}

// Certificate Types
export const CERTIFICATE_TYPES = {
  ALL: 'All Types',
  BELT_PROMOTION: 'Belt Promotion',
  TOURNAMENT: 'Tournament',
  COURSE_COMPLETION: 'Course Completion',
  ACHIEVEMENT: 'Achievement',
};

// Certificate Status
export const CERTIFICATE_STATUS = {
  ISSUED: 'Issued',
  PENDING: 'Pending',
  PROCESSING: 'Processing',
};

// Certificate Availability
export const CERTIFICATE_AVAILABILITY = {
  AVAILABLE: 'Available',
  NOT_AVAILABLE: 'Not Available',
};