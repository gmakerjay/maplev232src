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

### แก้ไขครั้งที่ 3 — 2026-10-08
- **ผู้รับผิดชอบ / Session**: Pair Programming AI Assistant (Self-Healing Portable Database & Path Sync)
- **รายการที่ทำ**:
  - เพิ่มระบบ `:sync_ini` ใน `tools/_mariadb.bat` ซิงค์ไดเรกทอรีใน `my.ini` แบบ Dynamic อัตโนมัติ ป้องกันปัญหา Path คลาดเคลื่อนเมื่อย้ายโฟลเดอร์หรือก๊อปปี้ไปเครื่องอื่น
  - เพิ่มระบบ Auto-initialize System Tables ด้วย `mariadb-install-db.exe` อัตโนมัติเมื่อตรวจไม่พบโฟลเดอร์ระบบ
  - เพิ่มระบบตรวจสอบตารางเกม `swordie232` และ Auto-import ฐานข้อมูลอัตโนมัติทั้งใน `tools/_mariadb.bat` และ `tools/_run.bat`
  - ปรับปรุงการตรวจสอบสถานะฐานข้อมูล (`:status`) ให้แม่นยำทั้งกรณี MariaDB เปิดอยู่และปิดอยู่ พร้อมแก้ปัญหา Escape อักขระในโหมด DelayedExpansion
- **ไฟล์ที่สร้าง / แก้ไข / ลบ**:
  - `tools/_mariadb.bat`
  - `tools/_run.bat`
  - `PROGRESS.md`
- **ผลการทดสอบ / สถานะ**:
  - รัน `tools\_build.bat` ผ่านสมบูรณ์ (BUILD SUCCESS)
  - ทดสอบคำสั่ง `_mariadb.bat status` แสดงผลถูกต้องและตรวจสอบฐานข้อมูลแม่นยำ

### แก้ไขครั้งที่ 4 — 2026-10-08
- **ผู้รับผิดชอบ / Session**: Pair Programming AI Assistant (Port Listening Detection & Ini Optimization)
- **รายการที่ทำ**:
  - แก้ไขปัญหา Netstat Pipeline Detection ใน `tools/_mariadb.bat` และ `tools/_run.bat` ที่พบสถานะ TIME_WAIT แล้วเข้าใจผิดว่าพอร์ตกำลัง LISTEN โดยเปลี่ยนมาใช้คำสั่งตรวจสอบสถานะ Listen ที่แม่นยำ
  - ตัดการสร้างไฟล์คอนฟิกซ้ำซ้อน `data/db/my.ini` ออก เพื่อให้ MariaDB อิงคอนฟิกหลักจาก `libary/mariadb/my.ini` เพียงจุดเดียว
  - ทดสอบระบบเปิด-ปิด Portable MariaDB และคำสั่งตรวจสอบสถานะ (`_mariadb.bat status`) ให้รายงาน PID ถูกต้องแม่นยำ
- **ไฟล์ที่สร้าง / แก้ไข / ลบ**:
  - `tools/_mariadb.bat`
  - `tools/_run.bat`
  - `PROGRESS.md`
- **ผลการทดสอบ / สถานะ**:
  - ตรวจสอบ `_mariadb.bat status` แสดงสถานะ [OK] Database Server is ACTIVE on port 3306 และ [OK] Game Database: 'swordie232' is READY สมบูรณ์



