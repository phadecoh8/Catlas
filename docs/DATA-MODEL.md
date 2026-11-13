# Catlas Data Model and Retention

Draft; confirm before building. Staff fields (such as `staff_id`) arrive with the future Staff role.

Student credentials and verified email addresses live in Supabase Auth. `StudentProfile` (role, school_id, faculty_id, department_id, level, surname, first_name, phone, jamb_reg_no, matric_no, avatar_url, consented_at) references `auth.users` by ID. The Supabase SQL in `apps/web/supabase/schema.sql` also defines the public school, faculty and department choices used during sign-up. The app PostgreSQL database contains `User` for admin accounts (role, scope, status, must_change_password, two_factor_enabled, two_factor_secret (encrypted), backup_codes (hashed)), `RefreshToken`, `VerificationRecord`, `AcademicSession` (school_id, name, ends_on, next_starts_on, status), `GraduationBatch` and `GraduationBatchStudent` (status, recommended_at, decided_by, decided_at, grace_until), `Building` (name, description, photo, lat, lng, opening_hours), `Location` (building_id, name, category, description, photo, lat, lng, visitor_accessible), `IndoorPlace` (building_id, floor, name, type, description, photo), `ClassUpdate` (status: scheduled, cancelled or moved; previous_time and previous_location_id when moved), `Assignment` (department_id, level, course_code, title, deadline_at, submission_location_id, notes, posted_by), `Announcement`, `Event`, `Bookmark` (user_id, location_id), `RecentSearch`, `Notification`, `Report` (school_id, type, location_id, note, status, reporter_id), `Feedback` (school_id, user_id, message, status), `BulkImport` (school_id, kind, status, row_errors, created_by), and `AuditLog`. Supabase also stores `WaitlistEntry` (name, school, faculty, department, level, email, consented_at, created_at). Catlas does not use a username field.

Images are stored on Cloudinary; keep the `public_id` and URL in the database.

**Data retention (30 days by default).** A scheduled `retention-cleanup` job removes:
- recent searches older than 30 days
- read notifications older than 30 days
- closed reports older than 30 days
- accounts whose email was never verified, after 30 days
- newsletter signups never confirmed, after 7 days
- accounts deactivated by an admin, 30 days after deactivation (graduation purges keep the 7-day recovery window in `docs/PRODUCT.md`, Academic session; self-deleted accounts are removed at once)

Waitlist entries are kept until launch plus 6 months, or until the person asks to be removed. Newsletter subscribers are kept until they unsubscribe.

Audit logs are an exception: keep them for 12 months (decided), because they are needed to investigate security problems. When a user deletes their account, their audit-log entries keep only an anonymised ID, with no name, email, phone number or matric number.
