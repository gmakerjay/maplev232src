# คู่มือโครงสร้างสภาพแวดล้อมแบบพกพา (Portable Environment Structure Guide)
## สำหรับเซิร์ฟเวอร์ MapleStory v232 Emulator (SwordieMS)

เอกสารนี้อธิบายโครงสร้างไฟล์และรายละเอียดสถาปัตยกรรมแบบพร้อมรัน (Portable) ที่ทำการฝัง Dependencies ทั้งหมดไว้กับตัวโปรเจกต์ เพื่ออำนวยความสะดวกในการเคลื่อนย้ายไปรันที่เครื่องปลายทาง (Client/Target Machine) โดยไม่ต้องติดตั้ง Java, Maven หรือดึงข้อมูลแพ็คเกจผ่านอินเทอร์เน็ตเพิ่มเติม

---

## 📂 1. แผนผังโครงสร้างของสภาพแวดล้อม (Environment Directory Layout)

โครงสร้างโฟลเดอร์หลักที่เกี่ยวข้องกับการประมวลผลและการรันระบบแบบพกพา:

```
ServerRun/
├── server.bat                    # คอนโซลควบคุมหลัก (Control Panel)
├── CLIENT_GUIDE.md               # คู่มือแก้ปัญหากระตุก E-Core สำหรับผู้เล่น
├── PORTABLE_ENVIRONMENT.md       # เอกสารแนะนำโครงสร้างสภาพแวดล้อมนี้
├── pom.xml                       # ไฟล์กำหนดโครงสร้างและ Dependencies ของ Maven
├── resources/                    # ไฟล์ข้อมูลเกม WZ และ Config ของตัวเซิร์ฟเวอร์
│   ├── log4j2.xml                # ตั้งค่าการ Suppress Log ทั่วไป
│   └── world/                    # ตั้งค่า Channel/World เช่น Bera.properties
├── tools/                        # สคริปต์ทำงานเบื้องหลัง
│   ├── _config.bat               # ตรวจหาและตั้งค่า Java/Maven แบบพกพา
│   ├── _build.bat                # คอมไพล์และบีบอัดโปรเจกต์
│   └── _run.bat                  # รันเซิร์ฟเวอร์
└── libary/                       # โฟลเดอร์ที่รวบรวม Dependencies หลัก [สำคัญที่สุด]
    ├── jdk-21/                   # Java Development Kit 21 (Portable)
    ├── apache-maven-3.9.12/      # Apache Maven Build Tool (Portable)
    └── repository/               # คลังจัดเก็บ Maven Dependencies ทั้งหมดของโปรเจกต์
```

---

## 🛠️ 2. การฝัง Dependencies และความสามารถออฟไลน์ (Embedded Dependencies)

ปกติแล้ว Maven จะจัดเก็บไฟล์ไลบรารี (.jar) ไว้ที่โฟลเดอร์ผู้ใช้ของระบบปฏิบัติการ (เช่น `C:\Users\Username\.m2\repository`) ซึ่งหากย้ายไปเครื่องอื่นที่ไม่มีอินเทอร์เน็ต จะไม่สามารถคอมไพล์หรือรันระบบได้

เราได้ทำการแก้ปัญหาโดยการ **ฝังคลังดาวน์โหลด (Dependencies Repository) ไว้ภายในโปรเจกต์โดยตรง** ผ่านออปชัน `-Dmaven.repo.local` ในคำสั่งรันระบบดังนี้:

### สคริปต์การทำคอมไพล์และบีบอัด (`tools\_build.bat`):
```batch
call mvn clean package -DskipTests -Dmaven.repo.local="%PROJECT_ROOT%\libary\repository"
```
*   เมื่อสั่ง Build ระบบจะดึงไฟล์ไลบรารีทั้งหมดมาเก็บไว้ใน `libary\repository`
*   ข้ามขั้นตอนการรัน Unit Test (`-DskipTests`) เพื่อให้คอมไพล์ได้เร็วที่สุด

### สคริปต์การรันเซิร์ฟเวอร์ (`tools\_run.bat`):
```batch
call mvn compile exec:java -Dexec.mainClass="net.swordie.ms.Server" -DlogLevel=%LOG_LEVEL% -Dmaven.repo.local="%PROJECT_ROOT%\libary\repository"
```
*   เมื่อรันเซิร์ฟเวอร์ Maven จะเรียกใช้ Dependencies จากใน `libary\repository` ภายในโปรเจกต์โดยตรง
*   **ไม่ต้องพึ่งพาการดาวน์โหลดผ่านอินเทอร์เน็ตที่เครื่องปลายทาง**

---

## ⚙️ 3. การทำงานของระบบตรวจจับสภาพแวดล้อมอัตโนมัติ (`tools\_config.bat`)

ตัวสคริปต์มีตรรกะการตรวจสอบลำดับความสำคัญ (Priority Order) เพื่อค้นหา Java และ Maven ดังนี้:

1.  **ระดับที่ 1 (Portable First):** ค้นหา JDK 21 ในโฟลเดอร์ `libary\jdk-21` และ Maven ใน `libary\apache-maven-*` ก่อนเสมอ
2.  **ระดับที่ 2 (System Path):** หากไม่พบใน `libary` จะสแกนหาตัวโปรแกรมติดตั้งมาตรฐานในระบบปฏิบัติการ เช่น `C:\Program Files\Java\jdk-21`
3.  **ระดับที่ 3 (Environment Variable PATH):** ดึงค่าจากตัวแปร Windows หากตรวจจับพบระบบจะอัปเดตตัวแปรสภาพแวดล้อมเฉพาะการทำงานรอบนั้นๆ ทันที

เมื่อพบแล้ว จะทำการแทรกพาธเข้าสู่สตรีมการรันเฉพาะกิจชั่วคราว:
```batch
if defined JAVA_HOME set "PATH=%JAVA_HOME%\bin;%PATH%"
if defined MAVEN_HOME set "PATH=%MAVEN_HOME%\bin;%PATH%"
```

---

## ⚡ 4. การจัดการ IP และฐานข้อมูล (Database & IP Configuration)

เพื่อให้ระบบทำงานร่วมกันได้ทันทีบนเครื่องปลายทาง:
1.  **IP Address:** ถูกจำกัดตายตัวให้ผูกเข้ากับวงภายในเครื่องที่ `127.0.0.1` (localhost) ภายในตัวโค้ดหลักของ [Server.java](file:///c:/Users/admin/Documents/ServerRun/src/main/java/net/swordie/ms/Server.java) เพื่อป้องกันความสับสนเรื่องเลขไอพี
2.  **Database Connection:** จัดการการเชื่อมต่อผ่าน HikariPool ในไฟล์ [HikariCPDataSource.java](file:///c:/Users/admin/Documents/ServerRun/src/main/java/net/swordie/orm/connection/HikariCPDataSource.java) โดยชี้ไปที่:
    *   **Host:** `127.0.0.1:3306`
    *   **DB Name:** `swordie232`
    *   **User/Pass:** `root` / `root`

---

## 🚀 5. วิธีรันเซิร์ฟเวอร์ที่เครื่องปลายทาง

เมื่อทำการคัดลอกโฟลเดอร์โปรเจกต์ทั้งหมดไปยังเครื่องปลายทางแล้ว สามารถทำงานได้ทันทีตามขั้นตอนดังนี้:
1. เปิดโปรแกรมฐานข้อมูล MySQL Server (เช่น XAMPP, Laragon หรือ MySQL Service) ให้ทำงานปกติ
2. ดับเบิลคลิกไฟล์ `server.bat` ที่อยู่ด้านนอกสุดของโปรเจกต์
3. เลือกตัวเลือกเมนู:
    * กด `[9]` เพื่อนำเข้าฐานข้อมูลอัตโนมัติ (ระบบจะทำการค้นหา `mysql.exe` สร้างฐานข้อมูล `swordie232` และนำเข้าไฟล์ SQL ทั้ง 13 ไฟล์หลัก ร่วมกับสคริปต์ใน `SQL CUSTOM` ให้โดยอัตโนมัติ รวมถึงจัดการชื่อไฟล์ภาษาไทยเช่น `ยาบัพ.sql` ให้เสร็จสรรพ)
    * กด `[1]` เพื่อทำความสะอาดและ Build แพ็คเกจ (ใช้กรณีปรับปรุงโค้ดเพิ่มเติม)
    * กด `[2]` หรือ `[3]` เพื่อเปิดการทำงานของเซิร์ฟเวอร์เกม
    * กด `[7]` เพื่อตรวจสอบสภาพแวดล้อมระบบ (ระบบจะตรวจสอบ Java, Maven, พอร์ตเกม และสถานะการทำงานของฐานข้อมูล MySQL บนพอร์ต 3306 / 33060 ให้โดยอัตโนมัติ)
