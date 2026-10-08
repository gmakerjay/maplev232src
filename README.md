# ⚔️ MapleStory Emulator Server (SwordieMS)

ระบบจำลองเซิร์ฟเวอร์เกม MapleStory พัฒนาด้วยภาษา **Java 21** ร่วมกับ **Kotlin** และ **Netty 4** ออกแบบและปรับแต่งโครงสร้างให้เป็น **True Portable** สามารถคัดลอกไปใช้งานที่เครื่องใดหรือไดรฟ์ใดก็ได้ทันที โดยไม่ต้องติดตั้ง Java, Maven หรือโปรแกรมจัดการฐานข้อมูลภายนอกเพิ่มเติม

---

## 🌟 จุดเด่นของโปรเจกต์ (Key Highlights)

- 🎒 **True Portable**: มี Java Development Kit 21 (`libary/jdk-21`), Apache Maven 3.9 (`libary/apache-maven-*`) และ MariaDB 11 Portable (`libary/mariadb`) ฝังมาในโฟลเดอร์โปรเจกต์
- 📦 **Offline Dependency Cache**: คลังไลบรารี (.jar) ทั้งหมดถูกฝังไว้ล่วงหน้าใน `libary/repository` รันและคอมไพล์ได้ทันทีโดยไม่ต้องต่ออินเทอร์เน็ต
- 🖥️ **All-in-One Control Panel**: มีคอนโซลควบคุม `server.bat` ช่วยจัดการทุกกระบวนการ ทั้งสั่ง Build, รันเซิร์ฟเวอร์, เปิด MariaDB, ตรวจสอบ Log และ Import Database
- ⚡ **Pure Base Game Database**: ฐานข้อมูลเริ่มต้นเป็นข้อมูลเกมบริสุทธิ์ นำเข้าได้อย่างรวดเร็วและเป็นระเบียบ

---

## 📂 โครงสร้างไดเรกทอรีของโปรเจกต์ (Directory Layout)

```
v232_Src_server/
├── SwordieLauncher.exe          # GUI Control Center (หน้าตารันสไตล์ nLite Wizard)
├── server.bat                   # คอนโซลควบคุมระบบหลัก (Control Panel)
├── import_db.bat                # สคริปต์ลัดสำหรับนำเข้าฐานข้อมูล
├── bgasset.jpg                  # รูปภาพพื้นหลัง Cyberpunk สำหรับตัวรัน GUI
├── README.md                    # เอกสารแนะนำและคู่มือการใช้งาน (เอกสารนี้)
├── AGENTS.md                    # กฎและมาตรฐานสำหรับ AI Agent ทุก Session
├── PROGRESS.md                  # บันทึกประวัติการพัฒนาและแก้ไข (แก้ไขครั้งที่ ....)
├── LICENSE.md                   # สัญญาอนุญาตการใช้งานซอฟต์แวร์
├── pom.xml                      # ไฟล์กำหนดโครงสร้างและ Dependency ของ Maven
│
├── launcher/                    # ซอร์สโค้ด GUI Launcher (.NET 10 WPF Desktop)
├── bin/                         # โฟลเดอร์ปลายทางของไฟล์คอมไพล์ (.class, .jar)
├── dat/                         # ข้อมูล Data Cache ของ WZ (Items, Maps, Skills ฯลฯ)
├── data/                        # โฟลเดอร์ข้อมูลรันไทม์
│   └── db/                      # ข้อมูลฐานข้อมูลของ Portable MariaDB
├── docs/                        # เอกสารคู่มือและการเรียนรู้
│   └── tutorials/               # แบบฝึกหัดและบทเรียนการเขียนสคริปต์ Kotlin
├── libary/                      # เครื่องมือและ Dependencies แบบพกพา
│   ├── jdk-21/                  # Portable Java 21 LTS
│   ├── apache-maven-3.9.12/     # Portable Maven Build Tool
│   ├── mariadb/                 # Portable MariaDB Engine
│   └── repository/              # Maven Local Dependencies Repository
├── loadins/                     # ไฟล์ข้อมูลคำต้องห้าม (ForbiddenWords.json)
├── logs/                        # บันทึก Log การทำงานของเซิร์ฟเวอร์
├── resources/                   # ไฟล์คอนฟิกและดาต้าเกม
│   ├── db.properties            # ตั้งค่าการเชื่อมต่อฐานข้อมูล
│   ├── ServerConfig.json        # คอนฟิกค่าหลักของเซิร์ฟเวอร์
│   └── world/                   # คอนฟิก World และ Channel (เช่น Bera.properties)
├── scripts/                     # สคริปต์โต้ตอบในเกม (Python .py และ Kotlin .kts)
│   ├── npc/                     # สคริปต์บทสนทนาและเมนู NPC
│   ├── field/                   # สคริปต์ประจำแผนที่
│   ├── portal/                  # สคริปต์ประตูวาร์ป
│   ├── quest/                   # สคริปต์ภารกิจ
│   └── reactor/                 # สคริปต์วัตถุโต้ตอบในแผนที่
├── sql/                         # ไฟล์สคริปต์ SQL ทั้งหมด
│   ├── InitTables_*.sql         # ไฟล์ตั้งค่าและสร้างตารางหลักของเกม
│   ├── custom/                  # สคริปต์ SQL ส่วนเสริม ไอเทมคัสตอม และดรอปพิเศษ
│   ├── migration/               # สคริปต์ Flyway / ORM Schema Migrations
│   ├── cleanup/                 # สคริปต์ทำความสะอาดข้อมูลส่วนเกิน
│   └── scripts/                 # สคริปต์ยูทิลิตี้สำหรับบำรุงรักษาฐานข้อมูล
├── src/                         # ซอร์สโค้ดหลักของเซิร์ฟเวอร์
│   ├── main/java/               # ซอร์สโค้ด Java
│   ├── main/kotlin/             # ซอร์สโค้ด Kotlin
│   └── main/resources/          # ไฟล์ทรัพยากรการตั้งค่าการทำงาน (log4j2.xml)
└── tools/                       # สคริปต์การทำงานเบื้องหลัง
    ├── _build.bat               # สคริปต์คอมไพล์โปรเจกต์
    ├── _config.bat              # สคริปต์ตรวจสอบสภาพแวดล้อม Java/Maven
    ├── _mariadb.bat             # สคริปต์ควบคุม Portable MariaDB
    ├── _run.bat                 # สคริปต์รันเซิร์ฟเวอร์
    ├── import_db.ps1            # สคริปต์ PowerShell นำเข้าฐานข้อมูล
    └── setup_portable_mariadb.bat / .ps1
```

---

## 🚀 ขั้นตอนการเริ่มต้นใช้งานอย่างรวดเร็ว (Quick Start)

### 1. เริ่มการทำงานของฐานข้อมูล
ดับเบิ้ลคลิกเปิด **`server.bat`** จากนั้นเลือกเมนู:
- กด **`[D]`** เพื่อเข้าสู่ **Portable MariaDB Controller**
- กด **`[1]`** เพื่อเปิดใช้งานบริการฐานข้อมูล MariaDB แบบพกพา (พอร์ต 3306)

### 2. นำเข้าฐานข้อมูล (Import Database)
กลับสู่เมนูหลักใน `server.bat`:
- กด **`[9]`** หรือดับเบิ้ลคลิก **`import_db.bat`**
- ระบบจะค้นหา MariaDB อัตโนมัติ สร้างฐานข้อมูล `swordie232` และนำเข้าตารางข้อมูลเริ่มต้น (Base Game) ให้ครบถ้วน
- ระบบจะทำการซิงค์ค่าการเชื่อมต่อลงใน `resources/db.properties` ให้อัตโนมัติ

### 3. คอมไพล์โปรเจกต์ (Build)
- ในหน้าเมนู `server.bat` กด **`[1]`** เพื่อทำการ Build Project
- ระบบจะเรียกใช้ Maven และไลบรารีใน `libary/repository` มาคอมไพล์โค้ด Java และ Kotlin

### 4. เปิดใช้งานเซิร์ฟเวอร์ (Run Server)
- กด **`[2]`** เพื่อรันเซิร์ฟเวอร์พร้อมหน้าต่างแสดง Log สดแบบเรียลไทม์ (แนะนำ)
- หรือกด **`[3]`** เพื่อรันเซิร์ฟเวอร์แบบเงียบ (Silent Mode)

---

## 🎮 ฟังก์ชันในแผงควบคุมหลัก (`server.bat`)

| ตัวเลือก | ฟังก์ชัน | คำอธิบาย |
|:-------:|:--------|:---------|
| **[G]** | Launch GUI Control Center | เปิดคอนโซลแบบกราฟิก (WPF Modern Glassmorphism สไตล์ nLite Wizard) |
| **[1]** | Build Project | คอมไพล์ซอร์สโค้ดทั้งหมดด้วย Maven แบบออฟไลน์ |
| **[2]** | Run Server (with Log Window) | สตาร์ทเซิร์ฟเวอร์พร้อมเปิดหน้าต่าง Live Log แบบเรียลไทม์ |
| **[3]** | Run Server (silent) | สตาร์ทเซิร์ฟเวอร์ในหน้าต่างเดียว ไม่เปิดหน้าต่างเสริม |
| **[4]** | Build + Run | สั่งคอมไพล์และเปิดเซิร์ฟเวอร์ต่อเนื่องทันที |
| **[5]** | Stop Server | ปิดการทำงานของเซิร์ฟเวอร์อย่างปลอดภัย |
| **[6]** | View Logs | เปิดดูไฟล์บันทึกประวัติการรันล่าสุด |
| **[7]** | Check Environment | ตรวจสอบสถานะการตรวจพบ JDK, Maven, Database และพอร์ตการเชื่อมต่อ |
| **[8]** | Kill All Processes (Force) | บังคับปิดโปรเซส Java และเซิร์ฟเวอร์ทั้งหมดทันที |
| **[9]** | Import Database (SQL) | รันระบบนำเข้าฐานข้อมูลอัตโนมัติ |
| **[D]** | Portable MariaDB Controller | แผงควบคุมเปิด-ปิด MariaDB แบบพกพา |
| **[X]** | Export Distribution Package | สร้างชุดโฟลเดอร์สำหรับแจกจ่ายโดยตัดซอร์สโค้ดหลัก (`src/`) ออกเพื่อความปลอดภัย |
| **[0]** | Exit | ออกจากแผงควบคุม |

---

## ⚙️ การตั้งค่าที่สำคัญ (Configuration)

### 1. การเชื่อมต่อฐานข้อมูล (`resources/db.properties`)
```properties
db.host=127.0.0.1
db.port=3306
db.user=root
db.password=root
db.name=swordie232
```

### 2. การตั้งค่า World และ Channel (`resources/world/`)
สามารถปรับแต่งการตั้งค่าแชนแนล อัตราคูณ EXP, Drop, Meso หรือชื่อ World ได้ที่ไฟล์ `.properties` ภายในโฟลเดอร์นี้ (เช่น `Bera.properties`)

---

## 📜 การพัฒนาสคริปต์ในเกม (Scripting Development)

ระบบรองรับการเขียนสคริปต์ NPC และ Event ใน 2 ภาษา:
1. **Python (Jython 2.7)**: บันทึกเป็นไฟล์ `.py` ไว้ในโฟลเดอร์ `scripts/npc/{npcId}.py`
2. **Kotlin Script**: บันทึกเป็นไฟล์ `.kts` ไว้ในโฟลเดอร์ `scripts/npc/{npcId}.kts`
3. 📖 สามารถศึกษาคู่มือและแบบฝึกหัดการเขียนสคริปต์ตั้งแต่พื้นฐานจนถึงระดับสูงได้ที่ [docs/tutorials/README.md](file:///c:/Users/admin/Documents/v232_Src_server/docs/tutorials/README.md)

---

## 🤖 นโยบายการพัฒนาและการทำงานร่วมกับ AI (Development & Agent Policy)

เพื่อให้การพัฒนาในทุก Session เป็นไปในทิศทางเดียวกันและเป็นระเบียบเรียบร้อย:
1. **ห้ามใส่เลขเวอร์ชันกำกับใดๆ เด็ดขาด**: ทุกครั้งที่มีการแก้ไขหรืออัปเดต ให้บันทึกเป็น **"แก้ไขครั้งที่ ...."** (เช่น แก้ไขครั้งที่ 1, แก้ไขครั้งที่ 2)
2. **การบันทึกประวัติการพัฒนา**: ทุกครั้งที่มีการแก้ไขโค้ดหรือปรับปรุงระบบ จะต้องบันทึกลงใน [PROGRESS.md](file:///c:/Users/admin/Documents/v232_Src_server/PROGRESS.md) ทุกครั้ง
3. **แนวทางการปฏิบัติของ AI Agent**: ศึกษากฎเหล็ก ข้อจำกัด และมาตรฐานโครงสร้างได้ที่ [AGENTS.md](file:///c:/Users/admin/Documents/v232_Src_server/AGENTS.md)

---

## 📄 สัญญาอนุญาต (License)

โปรเจกต์นี้เผยแพร่ภายใต้เงื่อนไขของ **MIT License** ดูรายละเอียดเพิ่มเติมได้ที่ [LICENSE.md](file:///c:/Users/admin/Documents/v232_Src_server/LICENSE.md)
