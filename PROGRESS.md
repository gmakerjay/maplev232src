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
  - รัน `tools\_build.bat` คอมไพล์ Java/Kotlin 1,188 ไฟล์ สำเร็จ (BUILD SUCCESS)
  - ตรวจสอบระบบ Netstat และ Port Monitor พร้อมตรวจจับพอร์ตชนและฆ่าโปรเซสได้ถูกต้อง

### แก้ไขครั้งที่ 6 — 2026-10-08
- **ผู้รับผิดชอบ / Session**: Pair Programming AI Assistant (Fix GUI Launcher Startup & Resource Resolution)
- **ปัญหาที่พบ**:
  - เมื่อดับเบิลคลิก `SwordieLauncher.exe` ตัวโปรแกรมไม่แสดงหน้าต่างขึ้นมา (Crash ทันทีขณะเริ่มต้น)
  - สาเหตุที่ 1: ใน `MainWindow.xaml` มีการระบุ `Source="bgasset.jpg"` โดยตรงใน XAML ทำให้ WPF XAML Parser ค้นหา Resource จาก Pack URI แล้วไม่พบ ส่งผลให้เกิด `System.IO.IOException: Cannot locate resource 'bgasset.jpg'` ขณะรัน `InitializeComponent()`
  - สาเหตุที่ 2: การคอมไพล์ด้วยคำสั่ง Publish แบบกำหนด Output ไปที่ Root Directory ทำให้ MSBuild Path คลาดเคลื่อนและข้ามการคอมไพล์ Markup BAML ทำให้ไม่มี `SwordieLauncher.g.resources` บรรจุใน DLL
  - สาเหตุที่ 3: ไฟล์ Executable (.exe) ของ .NET WPF ต้องการ `SwordieLauncher.dll`, `SwordieLauncher.runtimeconfig.json` และ `SwordieLauncher.deps.json` วางคู่กันเพื่อโหลด WindowsDesktop App Framework
- **รายการที่แก้ไข**:
  1. แก้ไข `MainWindow.xaml` โดยตัด `Source="bgasset.jpg"` ออกจาก XAML แล้วให้ฟังก์ชัน `LoadBackgroundImage()` ทำการโหลดภาพจากดิสก์แบบ Dynamic พร้อมระบบ Fallback
  2. จัดระบบคอมไพล์ใหม่ให้สมบูรณ์ โดยคอมไพล์ผ่าน `dotnet build -c Release` เพื่อสร้าง `SwordieLauncher.g.resources` ใน DLL อย่างถูกต้อง 100%
  3. คัดลอกชุดไฟล์รันไทม์หลัก (`SwordieLauncher.exe`, `SwordieLauncher.dll`, `SwordieLauncher.runtimeconfig.json`, `SwordieLauncher.deps.json`) วางคู่กันที่ Root โฟลเดอร์
  4. อัปเดต `DistributionService.cs` ให้คัดลอกไฟล์รันไทม์เหล่านี้ลงในชุดแจกจ่าย `dist_release/` ครบถ้วน
  5. ทดสอบรันและยืนยันการทำงานของ `App.OnStartup`, `InitializeComponent`, `Loaded` และ `ContentRendered` สำเร็จสมบูรณ์ หน้าต่าง GUI แสดงผลได้ถูกต้อง
- **ไฟล์ที่สร้าง / แก้ไข / ลบ**:
  - `launcher/MainWindow.xaml`
  - `launcher/MainWindow.xaml.cs`
  - `launcher/App.xaml`
  - `launcher/App.xaml.cs`
  - `launcher/SwordieLauncher.csproj`
  - `launcher/Services/DistributionService.cs`
  - `SwordieLauncher.exe`
  - `SwordieLauncher.dll`
  - `SwordieLauncher.runtimeconfig.json`
  - `SwordieLauncher.deps.json`
  - `PROGRESS.md`
- **ผลการทดสอบ / สถานะ**:
  - ตรวจสอบ Manifest Resources ใน `SwordieLauncher.dll` พบ `SwordieLauncher.g.resources` สมบูรณ์
  - ทดสอบรัน `SwordieLauncher.exe` สามารถเปิดหน้าต่าง WPF Desktop ได้สำเร็จสมบูรณ์

### แก้ไขครั้งที่ 7 — 2026-10-08
- **ผู้รับผิดชอบ / Session**: Pair Programming AI Assistant (WinForms Classic Windows XP Luna Theme & No Emoji Migration)
- **รายการที่ทำ**:
  1. **เปลี่ยนสถาปัตยกรรม GUI จาก WPF เป็น Windows Forms (WinForms)**:
     - ปรับคอนฟิก `launcher/SwordieLauncher.csproj` ให้ใช้งาน `<UseWindowsForms>true</UseWindowsForms>` บน .NET 10 (windows)
     - ลบไฟล์ XAML/BAML ของ WPF ที่ไม่จำเป็นออกทั้งหมด (`App.xaml`, `App.xaml.cs`, `MainWindow.xaml`, `MainWindow.xaml.cs`, `AssemblyInfo.cs`)
     - สร้าง `launcher/Program.cs` สำหรับ Entry Point และ Global Exception Handler บันทึกความผิดพลาดลงไฟล์ log
  2. **ออกแบบ UI สไตล์ Windows XP Classic Luna Wizard (อ้างอิง nLite Task Selection)**:
     - พัฒนา `launcher/MainForm.cs` ด้วยสไตล์ Windows XP Luna ดั้งเดิม สีพื้นหลังกล่องโต้ตอบ `#ECE9D8`
     - แถบหัวด้านบนสีน้ำเงินไล่เฉด Luna Blue Gradient พร้อมชื่อทาสก์ตัวหนาชัดเจน
     - เมนูหมวดหมู่ฝั่งซ้ายแบบบล็อกคลาสสิก (Integrate, Terminal, Setup, Diagnose, Create)
     - ปุ่มเลือกงานหลัก (Task Buttons) แสดงเครื่องหมาย Bullet ทรงกลมแยกตามฟังก์ชัน (Service Pack, Drivers, Hotfixes, Components, Unattended, Options, Tweaks, Bootable ISO)
     - ออกแบบปุ่มกดให้มีขนาดใหญ่ ชัดเจน ไม่เบียดเสียด (ความสูงปุ่ม 36 - 42px) พร้อมใช้ฟอนต์ Tahoma ตัวหนา คมชัด
  3. **บังคับใช้นโยบายห้ามใช้ Emoji โดยเด็ดขาด (Strictly NO Emojis Policy)**:
     - ยกเลิกการใช้ Emoji ทุกจุดในระบบ ทั้งโค้ด, UI, ปุ่มกด, ข้อความแจ้งเตือน, ป้ายกำกับ, Console Log และ Dialog
     - เปลี่ยนมาใช้แท็กข้อความวงเล็บก้ามปูทางการ เช่น `[OK]`, `[ALERT]`, `[CONFLICT]`, `[INFO]`, `[ERROR]`, `[STATUS]`
  4. **คงฟังก์ชันหลักครบถ้วนสมบูรณ์**:
     - ระบบ Real-Time Port Conflict Detection & 1-Click Process Kill (3306, 8484, 8585, 8483, 3000)
     - ระบบ Live Embedded CMD Console สตรีม Log การทำงานของ Server, MariaDB, Maven Build, และ Database Import แบบเรียลไทม์
     - ระบบ In-App Configuration Editor สำหรับอ่านและแก้ไข `resources/db.properties` ในตัวโปรแกรม
     - ระบบ Protected Source Code Distribution สำหรับสร้าง Release Package โดยไม่เปิดเผย `src/` และ `pom.xml`
  5. **บันทึกมาตรฐานลงใน AGENTS.md และ README.md**:
     - เพิ่มข้อกำหนดข้อที่ 7 ใน `AGENTS.md` เรื่องมาตรฐาน GUI Launcher (WinForms, สไตล์ Windows XP และห้ามมี Emoji)
     - อัปเดตรายละเอียดใน `README.md`
- **ไฟล์ที่สร้าง / แก้ไข / ลบ**:
  - `launcher/SwordieLauncher.csproj` (แก้ไขเป็น WinForms)
  - `launcher/Program.cs` (สร้างใหม่)
  - `launcher/MainForm.cs` (สร้างใหม่)
  - `launcher/App.xaml` (ลบ)
  - `launcher/App.xaml.cs` (ลบ)
  - `launcher/MainWindow.xaml` (ลบ)
  - `launcher/MainWindow.xaml.cs` (ลบ)
  - `launcher/AssemblyInfo.cs` (ลบ)
  - `launcher/Services/DistributionService.cs` (แก้ไขการคัดลอกไฟล์รันไทม์)
  - `SwordieLauncher.exe` (คอมไพล์และอัปเดตไฟล์รันไทม์)
  - `SwordieLauncher.dll` (อัปเดต)
  - `AGENTS.md` (เพิ่มข้อ 7)
  - `README.md` (อัปเดตคำอธิบาย WinForms Classic)
  - `PROGRESS.md`
- **ผลการทดสอบ / สถานะ**:
  - คอมไพล์ `dotnet build launcher/SwordieLauncher.csproj -c Release` ผ่าน 0 Warnings, 0 Errors
  - ทดสอบรัน `SwordieLauncher.exe` ทำงานได้สมบูรณ์ หน้าต่าง WinForms สไตล์คลาสสิกเปิดขึ้นมาได้ทันทีโดยไม่มี Crash

### แก้ไขครั้งที่ 8 — 2026-10-08
- **ผู้รับผิดชอบ / Session**: Pair Programming AI Assistant (Enhance Background Clarity & Seamless Canvas Rendering)
- **รายการที่ทำ**:
  1. **ปรับความชัดเจนของภาพพื้นหลัง (bgasset.jpg)**:
     - แก้ไขปัญหาภาพพื้นหลังจางหรือถูกบดบังด้วยสีพื้นหลังทึบของคอนโทรลเดิม (#F8F9FA)
     - พัฒนาคลาส `LunaCanvasPanel` ทำหน้าที่วาดภาพพื้นหลังจาก `_cachedBgBitmap` โดยจับคู่พิกัดพื้นที่บนหน้าต่าง Form แม่นยำแบบ Seamless
     - ปรับลดความทึบของเลเยอร์เคลือบ (Overlay Tint) ลงเหลือเพียง ~14% - 16% (alpha 35-40 จาก 255) ทำให้รายละเอียด กราฟิก และสีสันของภาพพื้นหลัง `bgasset.jpg` แสดงผลได้ชัดเจนและโดดเด่นสมบูรณ์ (84% - 86% clarity)
  2. **ประสานเลย์เอาต์พื้นหลังแบบไร้รอยต่อ (Seamless Coordinate Mapping)**:
     - แถบเมนูด้านซ้าย (Sidebar): แสดงภาพพื้นหลังผ่านการเคลือบโทนสี Luna คลาสสิกแบบ Frosted Glass (#ECE9D8 alpha 120)
     - แถบหัวด้านบน (Header) และแถบล่าง (Footer): ผสานภาพพื้นหลังเข้ากับ Luna Blue Gradient และเส้นคั่นวินโดวส์ XP ดั้งเดิม
     - พื้นที่งานและปุ่มกด (Task Selection, Console, Config, Diagnostics, Distribution): วาดพื้นหลังสอดคล้องกันทั่วทั้งหน้าต่าง
  3. **รักษาความคมชัดและการอ่านง่ายของปุ่มและข้อความ**:
     - ปุ่มทาสก์หลัก (Task Buttons) ยังคงเป็นปุ่มนูน 3D ขนาดใหญ่ ชัดเจน (ความสูง 42px) พร้อมสัญลักษณ์ Bullet วงกลมหลากสี
     - ปรับสีข้อความหัวข้อในทุก View ให้เป็นสีขาว คอนทราสต์สูง อ่านง่าย ไม่กลืนไปกับพื้นหลัง
     - จัดกล่องข้อความอธิบายและช่องกรอกข้อมูลใน Config/Distribution ให้อยู่บนการ์ดคอนเทนเนอร์สีสว่างที่อ่านได้ชัดเจน
  4. **คอมไพล์และทดสอบรัน**:
     - คอมไพล์ `dotnet build launcher/SwordieLauncher.csproj -c Release` ผ่านสมบูรณ์ 0 Errors, 0 Warnings
     - ทดสอบรันและทดสอบการเปิด-ปิดหน้าต่างสำเร็จ
- **ไฟล์ที่สร้าง / แก้ไข / ลบ**:
  - `launcher/MainForm.cs` (เพิ่มระบบแคชภาพ, วาด Canvas Background และคลาส LunaCanvasPanel)
  - `SwordieLauncher.exe` (อัปเดตไฟล์รันไทม์)
  - `SwordieLauncher.dll` (อัปเดต)
  - `PROGRESS.md` (บันทึกประวัติการแก้ไขครั้งที่ 8)
- **ผลการทดสอบ / สถานะ**:
  - ภาพพื้นหลังแสดงผลได้อย่างคมชัด สีสันสดใส ชัดเจนตามความต้องการของผู้ใช้
  - ตัวหนังสือและปุ่มกดทุกตำแหน่งยังคงอ่านง่าย ชัดเจน 100%

### แก้ไขครั้งที่ 9 — 2026-10-08
- **ผู้รับผิดชอบ / Session**: Pair Programming AI Assistant (Background Softening & Contrast Balance)
- **รายการที่ทำ**:
  1. **ปรับลดความเข้มของภาพพื้นหลังลงประมาณ 20% (Softer Background Tint)**:
     - ปรับเพิ่มระดับ Overlay Tint ของพื้นที่แสดงผลงาน (`_pnlContentArea`, `_viewTasks`, `_viewConsole`, `_viewConfig`, `_viewDiagnostics`, `_viewDistribution`) จากเดิม alpha 35-40 เป็น alpha 95-100 (~37% - 39% tint)
     - ช่วยลดความสว่างจ้าและเส้นสายกราฟิกที่ซับซ้อนของ `bgasset.jpg` ทำให้มองสบายตาขึ้น ไม่ดึงสายตา หรือทำให้ตาลาย
     - ปรับเลเยอร์แถบด้านข้าง (Sidebar) เป็น alpha 155 โทนสี Luna Classic (#ECE9D8) นุ่มนวล กลมกลืน
  2. **ความสมดุลของภาพและตัวอักษร**:
     - ภาพพื้นหลังยังคงมองเห็นได้อย่างชัดเจน เป็นฉากเกมมิ่งและมอนิเตอร์ที่สวยงาม
     - ปุ่มกดทาสก์ 3D ขนาดใหญ่ และข้อความทั้งหมดอ่านได้ง่าย ชัดเจน สบายตา ไร้อาการตาลาย
  3. **คอมไพล์และทดสอบ**:
     - คอมไพล์ `dotnet build launcher/SwordieLauncher.csproj -c Release` ผ่านสมบูรณ์ (0 Warnings, 0 Errors)
     - อัปเดตชุดไฟล์รันไทม์หลักที่ Root Directory
- **ไฟล์ที่สร้าง / แก้ไข / ลบ**:
  - `launcher/MainForm.cs` (ปรับค่า overlayAlpha และโทนสีการเคลือบ)
  - `SwordieLauncher.exe` (อัปเดต)
  - `SwordieLauncher.dll` (อัปเดต)
  - `PROGRESS.md`
- **ผลการทดสอบ / สถานะ**:
  - พื้นหลังจางลงประมาณ 20% สบายตาตามที่ต้องการ ปุ่มและข้อความชัดเจน ไม่ตาลาย








