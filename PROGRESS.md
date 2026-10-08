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

### แก้ไขครั้งที่ 5 — 2026-10-08
- **ผู้รับผิดชอบ / Session**: Pair Programming AI Assistant (Modern GUI Launcher, Source Code Protection & In-App Management)
- **รายการที่ทำ**:
  1. **สร้างระบบ GUI Launcher สไตล์ nLite Wizard (Desktop Control Center)**:
     - พัฒนาด้วย .NET 10 WPF แบบ Modern Cyberpunk Glassmorphism โดยใช้ภาพพื้นหลัง `bgasset.jpg`
     - จัดเลย์เอาต์ตามต้นแบบ nLite Task Selection มีแถบเมนูด้านซ้าย (Integrate, Remove, Setup, Create) และแถบเลือกงานด้านขวา (Service Pack, MariaDB, Database Setup, Maven Build, Export Distribution Package)
     - มีปุ่มควบคุมล่างหน้าต่าง (Minimize to Tray, Back, Next, Exit, Start All, Stop All)
  2. **ระบบ Live Embedded CMD Console ภายในตัวรัน**:
     - สตรีมข้อความ Log การทำงานของ Server, MariaDB, Database Import และ Maven Build แบบ Real-time ในตัวโปรแกรม
     - มีระบบจำแนกสีข้อความ (Success/เขียว, Warning/ส้ม, Error/แดง, Highlight/ม่วง, Info/เทา) พร้อมปุ่ม Auto Scroll, Clear Log และ Copy to Clipboard
  3. **ระบบตรวจสอบและแจ้งเตือนพอร์ตชน (Port Conflict Detection & 1-Click Fix)**:
     - ตรวจสอบพอร์ตสำคัญ (3306 MariaDB, 8484 Login, 8585 Channel, 8483 API, 3000 Web API) ทุก 2.5 วินาที
     - เมื่อมี Process อื่นมาแย่งพอร์ต จะแสดงแถบแจ้งเตือนสีแดงด้านบนทันที พร้อมระบุเลขพอร์ต, ชื่อโปรเซส และ PID
     - มีปุ่ม "แก้ปัญหาพอร์ตชน (Kill PID)" และ "ปิด Process พอร์ตชนทั้งหมด (Kill All)" ทำงานได้ในคลิกเดียว
  4. **ระบบ In-App Configuration Editor (เชื่อมโยง db.properties)**:
     - หน้าตั้งค่า Database Config (Host, Port, User, Password, DB Name) และ Server Ports
     - อ่านค่าเริ่มต้นจาก `resources/db.properties` อัตโนมัติ
     - เมื่อกดบันทึก ระบบจะแก้ไขไฟล์ `resources/db.properties` ในโฟลเดอร์โปรเจกต์ทันทีโดยไม่ต้องเปิดไฟล์ด้วยตนเอง
  5. **ระบบสร้างชุดแจกจ่ายแบบปกป้องซอร์สโค้ดหลัก (Protected Source Code Distribution)**:
     - มีระบบ Export Release Package ไปยังโฟลเดอร์เป้าหมาย (เช่น `dist_release/`)
     - แยกและตัดโฟลเดอร์ซอร์สโค้ดหลัก `src/` และ `pom.xml` ออก 100% เพื่อไม่เปิดเผย Logic ภายในเซิร์ฟเวอร์
     - คงเหลือไฟล์คอมไพล์สำเร็จรูป (`bin/maplestory-1.77.3.jar`), WZ Data Cache (`dat/`), ชุดเครื่องมือ Portable (`libary/`), คอนฟิก (`resources/`), ไฟล์โครงสร้างและดรอปคัสตอม (`sql/`), สคริปต์เควสและ NPC (`scripts/` .py / .kts) เพื่อให้ผู้รับแจกจ่ายสามารถปรับแต่งเกมได้โดยไม่เห็นซอร์สโค้ดหลัก
  6. **ปรับปรุง `server.bat` และโครงสร้างโปรเจกต์**:
     - เพิ่มเมนูตัวเลือก `[G] Launch Modern GUI Control Center (nLite Style Runner)`
     - รองรับคำสั่งเรียก GUI ผ่าน `server.bat gui` หรือ `server.bat --gui`
     - เพิ่มเมนูตัวเลือก `[X] Export Distribution Package (Protected Source)`
     - สร้างไฟล์ Executable สำเร็จรูป `SwordieLauncher.exe` วางไว้ที่ Root โฟลเดอร์เพื่อความสะดวกในการดับเบิลคลิกรัน
     - ลบไฟล์บีบอัดตกค้าง `src/main/java/net/swordie/ms/jaycustom/JayDynamicBossScaling.rar` ตามกฎความสะอาดของ Repository
- **ไฟล์ที่สร้าง / แก้ไข / ลบ**:
  - `launcher/` (โปรเจกต์ WPF .NET 10, Models, Services, Views)
  - `SwordieLauncher.exe` (ไฟล์รัน GUI ตัวหลัก)
  - `server.bat` (อัปเดตเมนูและพารามิเตอร์รองรับ GUI และ Export)
  - `.gitignore` (เพิ่ม launcher build artifacts และ dist_release/)
  - `src/main/java/net/swordie/ms/jaycustom/JayDynamicBossScaling.rar` (ลบไฟล์ตกค้าง)
  - `PROGRESS.md`
- **ผลการทดสอบ / สถานะ**:
  - รัน `dotnet build launcher/SwordieLauncher.csproj` ผ่าน 0 Errors, 0 Warnings
  - รัน `dotnet publish` ได้ไฟล์ `SwordieLauncher.exe` แบบ Single File ทำงานได้สมบูรณ์
  - รัน `tools\_build.bat` คอมไพล์ Java/Kotlin 1,188 ไฟล์ สำเร็จ (BUILD SUCCESS)
  - ตรวจสอบระบบ Netstat และ Port Monitor พร้อมตรวจจับพอร์ตชนและฆ่าโปรเซสได้ถูกต้อง




