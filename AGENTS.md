# 🤖 AGENTS.md - กฎและมาตรฐานการทำงานสำหรับ AI Agent

เอกสารฉบับนี้เป็นแนวทางปฏิบัติและข้อกำหนดบังคับ (Strict Instructions) สำหรับ AI Agent ทุกตัวในทุก Session ที่เข้ามาทำงาน พัฒนา หรือแก้ไขโค้ดในโปรเจกต์นี้ เพื่อให้การทำงานมีทิศทางเดียวกัน สม่ำเสมอ และรักษามาตรฐานความเสถียรของระบบ

---

## ⛔ 1. กฎเหล็ก: ห้ามใส่เลขเวอร์ชันกำกับ (No Versioning Policy)

1. **ห้ามใส่เลขเวอร์ชันใดๆ เด็ดขาด** (เช่น `v1.0.0`, `1.77.3`, `v232-patch1` เป็นต้น)
2. ทุกครั้งที่มีการแก้ไข ปรับปรุง หรือเพิ่มฟีเจอร์ ให้ระบุเป็น **"แก้ไขครั้งที่ [N]"** เท่านั้น
   - ตัวอย่าง: `แก้ไขครั้งที่ 1`, `แก้ไขครั้งที่ 2`, `แก้ไขครั้งที่ 3`
3. ใน Git Commit, PR, Documentation, Comment หรือ Log ให้ใช้รูปแบบ:
   ```
   แก้ไขครั้งที่ [N]: [รายละเอียดการแก้ไขโดยสรุป]
   ```

---

## 📝 2. การบันทึก Progress ทุกครั้ง (Mandatory Progress Logging)

1. **ทุก Session หรือทุก Task ที่มีการเปลี่ยนแปลงโค้ด/โครงสร้างโปรเจกต์ ต้องบันทึกลงในไฟล์ `PROGRESS.md` เสมอ**
2. บันทึกให้อยู่ในรูปแบบ:
   ```markdown
   ### แก้ไขครั้งที่ [N] — [วันที่และเวลา]
   - **ผู้รับผิดชอบ / Session**: [ชื่อหรือหัวข้อ Session]
   - **รายการที่ทำ**:
     - [รายละเอียดสิ่งที่ทำ]
   - **ไฟล์ที่สร้าง / แก้ไข / ลบ**:
     - [ชื่อไฟล์]
   - **ผลการทดสอบ / สถานะ**: [เช่น Build ผ่าน, Compile ผ่าน, ทดสอบสำเร็จ]
   ```
3. ห้ามข้ามการบันทึก `PROGRESS.md` แม้จะเป็นการแก้ไขเพียงเล็กน้อย

---

## 🏗️ 3. สถาปัตยกรรมและเทคโนโลยีหลัก (Core Architecture)

โปรเจกต์นี้คือ **MapleStory Emulator Server (SwordieMS)** พัฒนาบนพื้นฐาน:
- **Language**: Java 21 (LTS) และ Kotlin 1.9.23
- **Network Framework**: Netty 4.1.x
- **Build System**: Apache Maven 3.9.x
- **Database**: MariaDB / MySQL 8.0+ (UTF-8 / utf8mb4)
- **Scripting Engine**:
  - Python (Jython 2.7) — นามสกุล `.py`
  - Kotlin Script — นามสกุล `.kts`
  - ⚠️ **ห้ามใช้ JavaScript (.js / Rhino) ในสคริปต์เซิร์ฟเวอร์นี้เด็ดขาด** (ไม่รองรับ)

---

## 🎒 4. ระบบ True Portable (สภาพแวดล้อมพร้อมรัน)

โปรเจกต์นี้ได้รับการตั้งค่าให้สามารถพกพาและรันแบบออฟไลน์ได้ (True Portable):
1. **JDK & Maven**: ฝังอยู่ใน `libary/jdk-21` และ `libary/apache-maven-3.9.12`
2. **Local Maven Repository**: Dependencies ทั้งหมดฝังอยู่ใน `libary/repository`
   - เมื่อคอมไพล์หรือรัน ต้องระบุ `-Dmaven.repo.local="%PROJECT_ROOT%\libary\repository"` เสมอ
3. **Portable MariaDB**: ติดตั้งไว้ใน `libary/mariadb` พร้อมข้อมูลใน `data/db`
   - ควบคุม เปิด-ปิด ตรวจสถานะ ผ่านสคริปต์ `tools\_mariadb.bat`
4. **ตัวควบคุมหลัก**:
   - `server.bat`: คอนโซลควบคุมแบบรวมศูนย์ (Build, Run, Stop, DB, MariaDB)
   - `import_db.bat`: ตัวนำเข้าฐานข้อมูลอัตโนมัติ (เรียก `tools\import_db.ps1`)

---

## 📂 5. โครงสร้างโฟลเดอร์และข้อจำกัดการใช้งาน

| โฟลเดอร์ | หน้าที่ | ข้อจำกัดและข้อควรระวัง |
|----------|---------|-------------------------|
| `src/` | Source code หลัก (Java / Kotlin) | รักษา Code style, ตรวจสอบ thread-safety |
| `dat/` | ข้อมูล Data Cache ของ WZ | **ห้ามลบ** เป็นไฟล์ binary ที่เซิร์ฟเวอร์ต้องโหลดตอนเปิด |
| `loadins/` | `ForbiddenWords.json` | **ห้ามลบ** โค้ด `ServerConstants` และ `ForbiddenWordsData` บังคับใช้ |
| `resources/` | คอนฟิก (`db.properties`, `ServerConfig.json`, `world/`) | คอนฟิกการเชื่อมต่อและโลกในเกม |
| `scripts/` | สคริปต์ในเกม (`npc/`, `field/`, `portal/`, `quest/`, `reactor/`) | ใช้เฉพาะ `.py` หรือ `.kts` เท่านั้น |
| `sql/` | ไฟล์สร้างฐานข้อมูลหลัก 10 ไฟล์ (Base Game) | ไฟล์ตั้งต้นสำหรับสร้างโครงสร้างตาราง |
| `sql/custom/` | ไฟล์ SQL ส่วนเสริม คัสตอม ดรอป และไอเทมพิเศษ | เก็บแยกจากไฟล์หลักเพื่อไม่ให้สับสน |
| `sql/migration/` | Flyway / ORM Schema Migrations (V1-V79) | ฐานข้อมูลภายในระบบ ORM |
| `tools/` | สคริปต์เบื้องหลัง (`_build.bat`, `_run.bat`, `_config.bat`, `_mariadb.bat`) | ใช้สำหรับอำนวยความสะดวกรันและคอมไพล์ |
| `libary/` | Portable Tools (JDK, Maven, MariaDB, Repository) | **ห้ามลบ** จำเป็นต่อการรันแบบ Portable |
| `docs/` | เอกสารคู่มือเพิ่มเติม และแบบฝึกหัด | เช่น `docs/tutorials/` |
| `logs/` | บันทึก Log การทำงานของเซิร์ฟเวอร์ | ไฟล์ Log ชั่วคราว ไม่ต้อง Commit |

---

## 🧼 6. ความสะอาดและความเป็นระเบียบ (Repository Cleanliness)

1. **ห้ามปล่อยไฟล์ขยะตกค้าง**:
   - ห้ามเก็บไฟล์บีบอัดขนาดใหญ่ (`.rar`, `.zip`, `.7z`) ในโฟลเดอร์โปรเจกต์
   - ห้ามทิ้งไฟล์ script ชั่วคราว หรือ scratch scripts ไว้นอกพื้นที่กำหนด
   - ห้าม Commit โฟลเดอร์ `bin/`, `data/db/`, `logs/`, `.venv/`
2. **การตั้งชื่อไฟล์**:
   - ภาษาอังกฤษ ใช้ `snake_case` หรือ `camelCase` ตามแบบแผนเดิม
   - โฟลเดอร์ห้ามมี Space เว้นแต่จำเป็นยิ่งยวด (จัดเก็บหมวดหมู่ให้ชัดเจน)
3. **การทดสอบ Build ก่อนส่งมอบงาน**:
   - ก่อนจะจบ Session ต้องรันคำสั่งตรวจสอบว่าโค้ดยังคงคอมไพล์ผ่าน:
     ```powershell
     .\tools\_build.bat
     ```
     หรือ
     ```powershell
     mvn compile -DskipTests
     ```
