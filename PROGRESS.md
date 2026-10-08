# 📋 PROGRESS.md - บันทึกประวัติการปรับปรุงและพัฒนา

เอกสารนี้ใช้สำหรับบันทึกประวัติการพัฒนา แก้ไข และปรับปรุงระบบในทุก Session โดยไม่มีการระบุเลขเวอร์ชันใดๆ ทั้งสิ้น ตามนโยบายการทำงานของโปรเจกต์

---

## 🕒 ประวัติการแก้ไข (Revision History)

### แก้ไขครั้งที่ 1 — 2026-10-08
- **ผู้รับผิดชอบ / Session**: Pair Programming AI Assistant (Session Clean Up & Restructure)
- **วัตถุประสงค์**: ล้างไฟล์ขยะที่ไม่เกี่ยวข้อง จัดระเบียบโครงสร้างไดเรกทอรีใหม่ วางระบบเอกสาร README และข้อกำหนด AGENTS
- **รายการที่ทำ**:
  1. **ลบไฟล์ที่ไม่ใช้งานและขยะในโปรเจกต์**:
     - ลบไฟล์บีบอัดขนาดใหญ่ `swordie-232-main.rar` (368 MB)
     - ลบโฟลเดอร์ `npckms` ที่บรรจุไฟล์สคริปต์ JavaScript (.js) เก่าจากระบบ OdinMS/KMS ที่ระบบ SwordieMS ไม่ได้ใช้งาน
     - ลบเอกสาร Markdown เก่าที่ซ้ำซ้อนและกระจัดกระจาย (`CLIENT_GUIDE.md`, `Guide.md`, `ORIGINAL_REQUEST.md`, `PORTABLE_ENVIRONMENT.md`, `PROJECT.md`, `README_DEPLOYMENT.md`)
     - ลบไฟล์ Artifact ตกค้าง: `dependency-reduced-pom.xml`, `.gitlab-ci.yml`, โฟลเดอร์ `.venv` และ `scratch/`
  2. **จัดระเบียบโครงสร้างไดเรกทอรีใหม่**:
     - ย้ายโฟลเดอร์แบบฝึกหัด `KotlinNPCTutorials` เข้าสู่ `docs/tutorials/`
     - ย้ายไฟล์ SQL ส่วนเสริมจาก `SQL CUSTOM/` และไฟล์ Drop เพิ่มเติม (`-12 -13 -14.sql`, `drop acc emblem badge.sql`, `scrolldrop -14.sql`) เข้าสู่โฟลเดอร์ `sql/custom/` อย่างเป็นระเบียบ
  3. **วางระบบมาตรฐานสำหรับ AI Agent และการพัฒนา**:
     - สร้าง `AGENTS.md` บังคับใช้กฎห้ามใส่เวอร์ชัน และบังคับบันทึกความคืบหน้าทุกครั้ง
     - สร้าง `PROGRESS.md` สำหรับบันทึกความคืบหน้านี้
     - สร้าง `README.md` ฉบับใหม่ที่รวบรวมโครงสร้างโปรเจกต์และวิธีการรันแบบ Portable อย่างชัดเจน
  4. **ปรับปรุง `.gitignore`**:
     - เพิ่มกฎคุ้มครองไฟล์ขยะและระเบียบใหม่
- **ผลการทดสอบ / สถานะ**:
  - โครงสร้างโปรเจกต์สะอาดและเป็นระเบียบเรียบร้อย
  - ทดสอบสคริปต์และโฟลเดอร์พร้อมใช้งาน

### แก้ไขครั้งที่ 2 — 2026-10-08
- **ผู้รับผิดชอบ / Session**: Pair Programming AI Assistant (Portable MariaDB Integration & Test)
- **รายการที่ทำ**:
  - ทดสอบลบฐานข้อมูลเดิมออกจากเครื่อง และหยุดการทำงานของ MySQL Service เพื่อยืนยันระบบ Portable อิสระ
  - ติดตั้งและตั้งค่า MariaDB แบบ Portable ลงใน `libary/mariadb` พร้อมไดเรกทอรีข้อมูล `data/db/`
  - ปรับปรุง `tools/setup_portable_mariadb.ps1` ให้สร้าง `my.ini` แบบ UTF-8 (No BOM) และรองรับโหมดอัตโนมัติ
  - ปรับปรุง `tools/_mariadb.bat` และ `tools/import_db.ps1` ให้ค้นพบและเรียกใช้งาน MariaDB แบบ Portable ก่อนเสมอ
  - นำเข้าฐานข้อมูลเกมหลัก 10 ไฟล์เข้าสู่ Portable MariaDB สำเร็จครบ 90 ตาราง
  - รันเซิร์ฟเวอร์เกมเชื่อมต่อฐานข้อมูล Portable สำเร็จ พร้อมเปิดรับพอร์ต 8484 (Login), 8585 (Channel), 8483 (API), 3000 (Web API)
- **ไฟล์ที่สร้าง / แก้ไข / ลบ**:
  - `tools/_mariadb.bat`
  - `tools/setup_portable_mariadb.ps1`
  - `tools/import_db.ps1`
  - `.gitignore`
  - `PROGRESS.md`
- **ผลการทดสอบ / สถานะ**:
  - Compile และ Build ผ่านเรียบร้อย
  - Portable MariaDB และเซิร์ฟเวอร์เกมทดสอบรันสำเร็จสมบูรณ์

