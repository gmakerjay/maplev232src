# SwordieMS Deployment Guide

**อัพเดทล่าสุด:** 2026-02-02  
**เวอร์ชัน:** 1.77.3  
**Kotlin:** 1.9.23 | **Java:** 21

---

# 🎮 True Portable - ก็อปไปไหนก็รันได้!

โปรเจกต์นี้ออกแบบมาให้เป็น **True Portable** คือ:

✅ **ก็อปไปไดรฟ์ไหนก็ได้** - D:, E:, F:, USB Drive, External HDD  
✅ **ก็อปไปเครื่องไหนก็ได้** - ไม่ต้องติดตั้งอะไรเพิ่ม  
✅ **ชื่อโฟลเดอร์อะไรก็ได้** - ไม่ผูกกับ path เดิม  
✅ **ไม่ต้องลง Java/Maven แยก** - มีมาให้ใน `libary/` แล้ว  
✅ **ไม่ต้องตั้ง Environment Variables** - ระบบหาให้อัตโนมัติ

### ตัวอย่างการย้าย

```
D:\swordie-232-main\     →  E:\Games\MyServer\
D:\swordie-232-main\     →  F:\maple\
D:\swordie-232-main\     →  USB:\SwordieMS\
```

**แค่ก็อปโฟลเดอร์ทั้งหมด แล้วดับเบิ้ลคลิก `server.bat` ก็จบ!**

---

# เริ่มต้นใช้งาน (Quick Start)

โปรเจกต์นี้ออกแบบมาให้เป็น Portable คือก็อปไปเครื่องไหนก็รันได้เลย ไม่ต้องลง Java หรือ Maven เพิ่ม เพราะมีมาให้ในโฟลเดอร์ `libary/` แล้ว

## ขั้นตอนติดตั้ง

1. ก็อปโฟลเดอร์ทั้งหมดไปเครื่องใหม่
2. Import SQL เข้า MySQL (ดูในโฟลเดอร์ `sql/`)
3. แก้ไข `resources/ServerConfig.json` ถ้าจำเป็น
4. ดับเบิ้ลคลิก `server.bat`
5. กด [1] Build แล้วรอจนเสร็จ
6. กด [3] Run Server

## สิ่งที่ไม่ต้องทำ

- ไม่ต้องลง Java แยก (มีใน `libary/jdk-21/`)
- ไม่ต้องลง Maven แยก (มีใน `libary/apache-maven-*/`)
- ไม่ต้องตั้ง Environment Variables
- ไม่ต้องตั้ง JAVA_HOME หรือ PATH

---

# สิ่งที่ต้องมี

MySQL เป็นอย่างเดียวที่ต้องลงเอง

| โปรแกรม | เวอร์ชัน | ดาวน์โหลด |
|---------|---------|-----------|
| MySQL | 8.0+ | https://dev.mysql.com/downloads/mysql/ |

Java กับ Maven มีให้แล้วในโฟลเดอร์ `libary/`

---

# โครงสร้างโฟลเดอร์

```
swordie-232-main/
├── libary/                      # Portable JDK & Maven
│   ├── jdk-21/                  # Java JDK 21
│   └── apache-maven-3.9.12/     # Apache Maven
├── src/
│   ├── main/java/               # Java source code
│   └── main/kotlin/             # Kotlin source code
├── bin/                         # Compiled output & JAR
├── resources/                   # Server configuration
├── scripts/                     # NPC scripts
├── sql/                         # Database SQL files
├── tools/                       # Build/Run scripts
│   ├── _config.bat
│   ├── _build.bat
│   └── _run.bat
├── .vscode/                     # VS Code settings
├── .idea/                       # IntelliJ IDEA settings
├── server.bat                   # Control Panel หลัก
└── pom.xml                      # Maven configuration
```

---

# server.bat - Control Panel

ดับเบิ้ลคลิก `server.bat` แล้วเลือกเมนู:

```
========================================
  SwordieMS - Control Panel
========================================

  [1] Build Project
  [2] Run Server (Log)
  [3] Run Server
  [4] Build + Run
  [5] Stop Server
  [6] View Logs
  [7] Check Environment
  [8] Kill All Processes
  [0] Exit

========================================
```

## สรุปการใช้งาน

| ทำอะไร | กดปุ่ม |
|--------|--------|
| รันครั้งแรก | 1 แล้ว 3 |
| รันปกติ | 3 |
| หยุดเซิร์ฟเวอร์ | 5 |
| หลังแก้โค้ด | 1 แล้ว 3 (หรือ 4) |
| เช็คการติดตั้ง | 7 |
| แก้ปัญหา Port ค้าง | 8 |

---

# Portable Mode

ระบบจะหา Java กับ Maven ตามลำดับนี้

## Java JDK 21

1. `libary/jdk-21/` (ลำดับแรก)
2. `jdk/` (ในโปรเจกต์)
3. `C:\Program Files\Java\jdk-21`
4. `C:\Program Files\Eclipse Adoptium\jdk-21*`
5. `C:\Program Files\Amazon Corretto\jdk21*`
6. System PATH

## Maven

1. `libary/apache-maven-*/` (ลำดับแรก)
2. `maven/` (ในโปรเจกต์)
3. `C:\Program Files\Maven\apache-maven-*`
4. `C:\Program Files\apache-maven-*`
5. System PATH

---

# Kotlin Support

โปรเจกต์รองรับ Kotlin 1.9.23 ร่วมกับ Java 21 แบบ Mixed Mode

## โครงสร้าง Kotlin

```
src/main/kotlin/
└── net/swordie/ms/
    ├── KotlinTest.kt
    └── kotlin/
        ├── KotlinUtils.kt
        └── commands/
            └── KotlinCommands.kt
```

## เรียกใช้ Kotlin จาก Java

```java
import net.swordie.ms.kotlin.KotlinUtils;

// ส่งข้อความ
KotlinUtils.sendMessage(chr, "Hello from Kotlin!");

// ให้ Item
KotlinUtils.giveItem(chr, 2000000, 10);

// ให้ Meso
KotlinUtils.giveMeso(chr, 1000000L);

// ให้ EXP
KotlinUtils.giveExp(chr, 50000L);

// เช็ค Item
boolean hasItem = KotlinUtils.hasItem(chr, 4000000, 5);
```

## ตัวอย่าง Kotlin Code

```kotlin
package net.swordie.ms.kotlin

import net.swordie.ms.client.character.Char
import net.swordie.ms.kotlin.KotlinUtils.notify
import net.swordie.ms.kotlin.KotlinUtils.give

fun processPlayer(chr: Char) {
    chr.notify("Welcome to SwordieMS!")
    chr.give(2000000, 5)
}
```

## Kotlin Commands ในเกม

| Command | คำอธิบาย | ต้องการสิทธิ์ |
|---------|----------|---------------|
| @kotlintest | ทดสอบว่า Kotlin ทำงาน | Player |
| @kgive <id> [qty] | ให้ Item | Tester |
| @kmeso <amount> | ให้ Meso | Tester |
| @kexp <amount> | ให้ EXP | Tester |
| @kinfo | แสดงข้อมูลตัวละคร | Player |
| @khelp | แสดงคำสั่งทั้งหมด | Player |

---

# NPC Scripts - รองรับทั้ง Python และ Kotlin

ระบบ NPC Scripts รองรับการเขียนได้ 2 ภาษา:

| ภาษา | นามสกุลไฟล์ | ตัวอย่าง |
|------|------------|---------|
| Python | `.py` | `9000001.py` |
| Kotlin | `.kts` | `9000001.kts` |

## ลำดับการค้นหา Script

```
1. ค้นหา .py ก่อน (Python)
2. ถ้าไม่เจอ ค้นหา .kts (Kotlin)
3. ถ้าไม่เจอทั้งคู่ ใช้ undefined.py
```

## โฟลเดอร์ Scripts

```
scripts/
├── npc/          # NPC scripts
├── portal/       # Portal scripts
├── quest/        # Quest scripts
├── field/        # Field scripts
├── item/         # Item scripts
├── reactor/      # Reactor scripts
└── SCRIPTING_GUIDE.md   # คู่มือการเขียน Script
```

## ตัวอย่าง Python Script (.py)

```python
# scripts/npc/9000001.py
def showMainMenu():
    choice = sm.sendNext("Welcome!\r\n#L0#Check Stats#l\r\n#L1#Exit#l")
    if choice == 0:
        sm.sendSay("Level: {}".format(chr.getLevel()))
        showMainMenu()

showMainMenu()
```

## ตัวอย่าง Kotlin Script (.kts)

```kotlin
// scripts/npc/9000001.kts
import net.swordie.ms.scripts.ScriptManager
import net.swordie.ms.client.character.Char

val sm = bindings["sm"] as ScriptManager
val chr = bindings["chr"] as Char

fun showMainMenu() {
    val choice = sm.sendNext("""
        Welcome!
        #L0#Check Stats#l
        #L1#Exit#l
    """.trimIndent())
    
    when (choice) {
        0 -> {
            sm.sendSay("Level: ${chr.level}")
            showMainMenu()
        }
    }
}

showMainMenu()
```

## Reload Scripts

ใช้คำสั่งในเกม:
```
@reloadscripts
```
หรือ
```
@rs
```

## เปรียบเทียบ Python vs Kotlin

| Feature | Python (.py) | Kotlin (.kts) |
|---------|-------------|---------------|
| ความง่าย | ง่ายกว่า | ซับซ้อนกว่า |
| IDE Support | Basic | Full (autocomplete, type check) |
| Type Safety | ไม่มี | มี compile-time checking |
| String Format | `"{}".format(x)` | `"${x}"` |

**ดูคู่มือเพิ่มเติมที่:** `scripts/SCRIPTING_GUIDE.md`

---

# IDE Setup & Commands

## 📌 IntelliJ IDEA (แนะนำ)

### การติดตั้ง

1. เปิด File > Open
2. เลือกโฟลเดอร์โปรเจกต์
3. รอ IntelliJ sync Maven
4. Kotlin plugin จะเปิดใช้งานอัตโนมัติ

### ไฟล์ Configuration

- `.idea/misc.xml` - Kotlin 1.9.23, JDK 21
- `.idea/kotlinc.xml` - Kotlin compiler settings
- `.idea/compiler.xml` - Java compiler settings

### Commands ใน IntelliJ Terminal

เปิด Terminal ใน IntelliJ: **View > Tool Windows > Terminal** หรือกด `Alt + F12`

```powershell
# ======================================
# 1. SET JAVA_HOME (ต้องทำก่อน Maven commands)
# ======================================
$env:JAVA_HOME = "$PWD\libary\jdk-21"

# ======================================
# 2. BUILD COMMANDS
# ======================================

# Compile Only (เร็ว)
.\libary\apache-maven-3.9.12\bin\mvn.cmd compile

# Clean + Compile
.\libary\apache-maven-3.9.12\bin\mvn.cmd clean compile

# Build JAR (Full Build)
.\libary\apache-maven-3.9.12\bin\mvn.cmd clean package -DskipTests

# ======================================
# 3. RUN SERVER
# ======================================

# รันเซิร์ฟเวอร์ (Development Mode)
.\libary\apache-maven-3.9.12\bin\mvn.cmd exec:java "-Dexec.mainClass=net.swordie.ms.Server"

# รันเซิร์ฟเวอร์จาก JAR (Production Mode)
.\libary\jdk-21\bin\java.exe -jar bin\maplestory-1.77.3.jar

# ======================================
# 4. ONE-LINE COMMANDS (คัดลอกไปวางได้เลย)
# ======================================

# Build + Run (รวมในบรรทัดเดียว)
$env:JAVA_HOME = "$PWD\libary\jdk-21"; .\libary\apache-maven-3.9.12\bin\mvn.cmd compile exec:java "-Dexec.mainClass=net.swordie.ms.Server"

# Clean Build + Run
$env:JAVA_HOME = "$PWD\libary\jdk-21"; .\libary\apache-maven-3.9.12\bin\mvn.cmd clean compile exec:java "-Dexec.mainClass=net.swordie.ms.Server"

# Build Only (พร้อมดู Error)
$env:JAVA_HOME = "$PWD\libary\jdk-21"; .\libary\apache-maven-3.9.12\bin\mvn.cmd compile 2>&1 | Select-String -Pattern "ERROR|BUILD"
```

### Maven Goals ใน IntelliJ

คลิกขวาที่ Maven Tool Window > Run Maven Build:
- `compile` - Compile เฉยๆ
- `package` - Build JAR
- `exec:java` - รันเซิร์ฟเวอร์

### Run Configuration

สร้าง Run Configuration ใหม่:
1. Run > Edit Configurations
2. คลิก `+` > Application
3. ตั้งค่า:
   - **Name:** SwordieMS Server
   - **Main class:** `net.swordie.ms.Server`
   - **Working directory:** `$MODULE_DIR$`
   - **Use classpath of module:** maplestory

---

## 📌 VS Code

### การติดตั้ง

1. เปิด File > Open Folder
2. เลือกโฟลเดอร์โปรเจกต์
3. ติดตั้ง Extensions ที่แนะนำ (Popup จะขึ้นมา)

### Extensions ที่ต้องติดตั้ง

```
fwcd.kotlin              - Kotlin Language Server
redhat.java              - Java Language Support
vscjava.vscode-java-pack - Java Extension Pack
vscjava.vscode-maven     - Maven Support
```

ติดตั้งง่ายๆ: เปิด Extensions (`Ctrl+Shift+X`) แล้วค้นหาติดตั้ง

### ไฟล์ Configuration

- `.vscode/settings.json` - Kotlin + Java settings
- `.vscode/extensions.json` - Recommended extensions
- `.vscode/launch.json` - Run/Debug configurations

### Commands ใน VS Code Terminal

เปิด Terminal: **Terminal > New Terminal** หรือกด `` Ctrl + ` ``

```powershell
# ======================================
# 1. SET JAVA_HOME (ต้องทำก่อน Maven commands)
# ======================================
$env:JAVA_HOME = "$PWD\libary\jdk-21"

# ======================================
# 2. BUILD COMMANDS
# ======================================

# Compile Only (เร็ว)
.\libary\apache-maven-3.9.12\bin\mvn.cmd compile

# Clean + Compile
.\libary\apache-maven-3.9.12\bin\mvn.cmd clean compile

# Build JAR (Full Build)
.\libary\apache-maven-3.9.12\bin\mvn.cmd clean package -DskipTests

# ======================================
# 3. RUN SERVER
# ======================================

# รันเซิร์ฟเวอร์ (Development Mode)
.\libary\apache-maven-3.9.12\bin\mvn.cmd exec:java "-Dexec.mainClass=net.swordie.ms.Server"

# รันเซิร์ฟเวอร์จาก JAR (Production Mode)
.\libary\jdk-21\bin\java.exe -jar bin\maplestory-1.77.3.jar

# ======================================
# 4. ONE-LINE COMMANDS (คัดลอกไปวางได้เลย)
# ======================================

# Build + Run (รวมในบรรทัดเดียว)
$env:JAVA_HOME = "$PWD\libary\jdk-21"; .\libary\apache-maven-3.9.12\bin\mvn.cmd compile exec:java "-Dexec.mainClass=net.swordie.ms.Server"

# Clean Build + Run
$env:JAVA_HOME = "$PWD\libary\jdk-21"; .\libary\apache-maven-3.9.12\bin\mvn.cmd clean compile exec:java "-Dexec.mainClass=net.swordie.ms.Server"

# Build Only (พร้อมดู Error)
$env:JAVA_HOME = "$PWD\libary\jdk-21"; .\libary\apache-maven-3.9.12\bin\mvn.cmd compile 2>&1 | Select-String -Pattern "ERROR|BUILD"

# ======================================
# 5. STOP SERVER
# ======================================

# หยุด Java Processes ทั้งหมด
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force
```

### VS Code Tasks (กด F1 > Tasks: Run Task)

สร้าง `.vscode/tasks.json`:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Build",
            "type": "shell",
            "command": "$env:JAVA_HOME = '${workspaceFolder}/libary/jdk-21'; ./libary/apache-maven-3.9.12/bin/mvn.cmd compile",
            "group": "build"
        },
        {
            "label": "Run Server",
            "type": "shell",
            "command": "$env:JAVA_HOME = '${workspaceFolder}/libary/jdk-21'; ./libary/apache-maven-3.9.12/bin/mvn.cmd exec:java '-Dexec.mainClass=net.swordie.ms.Server'",
            "group": "none"
        }
    ]
}
```

### Launch Configuration (กด F5 เพื่อ Debug)

ใช้ไฟล์ `.vscode/launch.json` ที่มีอยู่แล้ว

---

## 📌 Command Line (CMD / PowerShell)

### Windows CMD

```cmd
@REM ======================================
@REM SET JAVA_HOME
@REM ======================================
set JAVA_HOME=%CD%\libary\jdk-21

@REM ======================================
@REM BUILD COMMANDS
@REM ======================================

@REM Compile Only
%CD%\libary\apache-maven-3.9.12\bin\mvn.cmd compile

@REM Clean + Compile
%CD%\libary\apache-maven-3.9.12\bin\mvn.cmd clean compile

@REM Build JAR
%CD%\libary\apache-maven-3.9.12\bin\mvn.cmd clean package -DskipTests

@REM ======================================
@REM RUN SERVER
@REM ======================================
%CD%\libary\apache-maven-3.9.12\bin\mvn.cmd exec:java -Dexec.mainClass="net.swordie.ms.Server"

@REM ======================================
@REM ONE-LINE COMMAND
@REM ======================================
set JAVA_HOME=%CD%\libary\jdk-21 && %CD%\libary\apache-maven-3.9.12\bin\mvn.cmd compile exec:java -Dexec.mainClass="net.swordie.ms.Server"
```

### Windows PowerShell

```powershell
# ======================================
# SET JAVA_HOME
# ======================================
$env:JAVA_HOME = "$PWD\libary\jdk-21"

# ======================================
# BUILD COMMANDS
# ======================================

# Compile Only
.\libary\apache-maven-3.9.12\bin\mvn.cmd compile

# Clean + Compile
.\libary\apache-maven-3.9.12\bin\mvn.cmd clean compile

# Build JAR
.\libary\apache-maven-3.9.12\bin\mvn.cmd clean package -DskipTests

# ======================================
# RUN SERVER
# ======================================
.\libary\apache-maven-3.9.12\bin\mvn.cmd exec:java "-Dexec.mainClass=net.swordie.ms.Server"

# ======================================
# ONE-LINE COMMAND (คัดลอกไปวางได้เลย)
# ======================================
$env:JAVA_HOME = "$PWD\libary\jdk-21"; .\libary\apache-maven-3.9.12\bin\mvn.cmd compile exec:java "-Dexec.mainClass=net.swordie.ms.Server"
```

---

## 📌 สรุป Commands ที่ใช้บ่อย

| ทำอะไร | Command (PowerShell) |
|--------|---------------------|
| Set JAVA_HOME | `$env:JAVA_HOME = "$PWD\libary\jdk-21"` |
| Compile | `.\libary\apache-maven-3.9.12\bin\mvn.cmd compile` |
| Clean Compile | `.\libary\apache-maven-3.9.12\bin\mvn.cmd clean compile` |
| Build JAR | `.\libary\apache-maven-3.9.12\bin\mvn.cmd package -DskipTests` |
| Run Server | `.\libary\apache-maven-3.9.12\bin\mvn.cmd exec:java "-Dexec.mainClass=net.swordie.ms.Server"` |
| Stop Server | `Get-Process -Name "java" \| Stop-Process -Force` |

### One-Line คัดลอกไปวางได้เลย

**Build + Run:**
```powershell
$env:JAVA_HOME = "$PWD\libary\jdk-21"; .\libary\apache-maven-3.9.12\bin\mvn.cmd compile exec:java "-Dexec.mainClass=net.swordie.ms.Server"
```

**Clean Build + Run:**
```powershell
$env:JAVA_HOME = "$PWD\libary\jdk-21"; .\libary\apache-maven-3.9.12\bin\mvn.cmd clean compile exec:java "-Dexec.mainClass=net.swordie.ms.Server"
```

---

# Build & Run (วิธีง่ายๆ)

## Build

**ผ่าน server.bat:**
```
ดับเบิ้ลคลิก server.bat แล้วกด [1]
```

**Output:**
```
bin/
├── classes/                    # Compiled .class files
└── maplestory-1.77.3.jar      # Shaded JAR
```

## Run

**ผ่าน server.bat:**
```
ดับเบิ้ลคลิก server.bat แล้วกด [3]
```

---

# Server Configuration

## resources/ServerConfig.json

```json
{
    "DB_HOST": "localhost",
    "DB_PORT": 3306,
    "DB_NAME": "swordie",
    "DB_USER": "root",
    "DB_PASS": "your_password",
    "LOGIN_PORT": 8484,
    "CHANNEL_PORT": 8483
}
```

## World Config

ไฟล์ใน `resources/world/` แต่ละไฟล์คือ 1 World

---

# Ports

| Service | Port |
|---------|------|
| Login Server | 8484 |
| Channel Server | 8483+ |
| Web API | 3000 |

---

# Database Setup

สร้าง Database:
```sql
CREATE DATABASE swordie CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Import SQL:
```bash
mysql -u root -p swordie < sql/1_database.sql
mysql -u root -p swordie < sql/2_tables.sql
```

---

# Troubleshooting

| ปัญหา | วิธีแก้ |
|-------|--------|
| Java NOT FOUND | เช็คว่า `libary/jdk-21/` มีอยู่ |
| Maven NOT FOUND | เช็คว่า `libary/apache-maven-*/` มีอยู่ |
| เข้าเกมไม่ได้ | กด 5 หยุด แล้วกด 3 รันใหม่ |
| Port ค้าง | กด 8 แล้วเลือก Kill |
| Build Failed | ลบ `bin/` แล้ว Build ใหม่ |
| Kotlin Error | เช็คว่าไฟล์อยู่ใน `src/main/kotlin/` |

---

# ย้ายไปเครื่องอื่น

1. ก็อปโฟลเดอร์โปรเจคทั้งหมด (รวม `libary/`)
2. ลง MySQL แล้ว Import SQL
3. แก้ไข `resources/ServerConfig.json`
4. ดับเบิลคลิก `server.bat` กด 1 Build แล้วกด 3 Run

ไม่ต้องตั้ง Environment Variable

---

# Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.77.3 | 2026-02-02 | Kotlin 1.9.23 support |
| 1.77.3 | 2026-02-02 | Portable Mode |
| 1.77.3 | 2026-02-02 | VS Code & IntelliJ configs |
| 1.77.3 | 2026-02-01 | Initial deployment scripts |

---

---

# English Version

# SwordieMS Deployment Guide

**Last Updated:** 2026-02-02  
**Version:** 1.77.3  
**Kotlin:** 1.9.23 | **Java:** 21

---

# Getting Started

This project is designed to be portable. Just copy the folder to any machine and run it. No need to install Java or Maven separately - they're included in the `libary/` folder.

## Installation Steps

1. Copy the entire folder to the new machine
2. Import SQL files into MySQL (see `sql/` folder)
3. Edit `resources/ServerConfig.json` if needed
4. Double-click `server.bat`
5. Press [1] Build and wait
6. Press [3] Run Server

## What You Don't Need

- No separate Java installation (included in `libary/jdk-21/`)
- No separate Maven installation (included in `libary/apache-maven-*/`)
- No Environment Variables setup
- No JAVA_HOME or PATH configuration

---

# Requirements

MySQL is the only thing you need to install.

| Software | Version | Download |
|----------|---------|----------|
| MySQL | 8.0+ | https://dev.mysql.com/downloads/mysql/ |

Java and Maven are already included in `libary/` folder.

---

# Folder Structure

```
swordie-232-main/
├── libary/                      # Portable JDK & Maven
│   ├── jdk-21/
│   └── apache-maven-3.9.12/
├── src/
│   ├── main/java/               # Java source
│   └── main/kotlin/             # Kotlin source
├── bin/                         # Compiled output
├── resources/                   # Server config
├── scripts/                     # NPC scripts
├── sql/                         # Database files
├── tools/                       # Build/Run scripts
├── server.bat                   # Main Control Panel
└── pom.xml                      # Maven config
```

---

# server.bat - Control Panel

Double-click `server.bat` and select from menu:

```
========================================
  SwordieMS - Control Panel
========================================

  [1] Build Project
  [2] Run Server (Log)
  [3] Run Server
  [4] Build + Run
  [5] Stop Server
  [6] View Logs
  [7] Check Environment
  [8] Kill All Processes
  [0] Exit

========================================
```

## Quick Reference

| Action | Key |
|--------|-----|
| First run | 1 then 3 |
| Normal run | 3 |
| Stop server | 5 |
| After code changes | 1 then 3 (or 4) |
| Check installation | 7 |
| Fix port issues | 8 |

---

# Portable Mode

The system searches for Java and Maven in this order.

## Java JDK 21

1. `libary/jdk-21/` (first priority)
2. `jdk/` (project folder)
3. `C:\Program Files\Java\jdk-21`
4. `C:\Program Files\Eclipse Adoptium\jdk-21*`
5. `C:\Program Files\Amazon Corretto\jdk21*`
6. System PATH

## Maven

1. `libary/apache-maven-*/` (first priority)
2. `maven/` (project folder)
3. `C:\Program Files\Maven\apache-maven-*`
4. `C:\Program Files\apache-maven-*`
5. System PATH

---

# Kotlin Support

This project supports Kotlin 1.9.23 alongside Java 21 in Mixed Mode.

## Kotlin Structure

```
src/main/kotlin/
└── net/swordie/ms/
    ├── KotlinTest.kt
    └── kotlin/
        ├── KotlinUtils.kt
        └── commands/
            └── KotlinCommands.kt
```

## Calling Kotlin from Java

```java
import net.swordie.ms.kotlin.KotlinUtils;

KotlinUtils.sendMessage(chr, "Hello from Kotlin!");
KotlinUtils.giveItem(chr, 2000000, 10);
KotlinUtils.giveMeso(chr, 1000000L);
KotlinUtils.giveExp(chr, 50000L);
boolean hasItem = KotlinUtils.hasItem(chr, 4000000, 5);
```

## In-Game Kotlin Commands

| Command | Description | Required |
|---------|-------------|----------|
| @kotlintest | Test Kotlin | Player |
| @kgive <id> [qty] | Give Item | Tester |
| @kmeso <amount> | Give Meso | Tester |
| @kexp <amount> | Give EXP | Tester |
| @kinfo | Show character info | Player |
| @khelp | Show all commands | Player |

---

# IDE Setup

## IntelliJ IDEA (Recommended)

1. Open File > Open
2. Select project folder
3. Wait for Maven sync
4. Kotlin plugin activates automatically

## VS Code

Install Extensions:
- `fwcd.kotlin` - Kotlin Language Server
- `redhat.java` - Java Language Support
- `vscjava.vscode-java-pack` - Java Extension Pack
- `vscjava.vscode-maven` - Maven Support

---

# Build & Run

## Build

Via server.bat:
```
Double-click server.bat, press [1]
```

Via Command Line:
```bash
cmd /c "tools\_build.bat"
mvn clean package -DskipTests
```

## Run

Via server.bat:
```
Double-click server.bat, press [3]
```

Via Command Line:
```bash
mvn compile exec:java -Dexec.mainClass="net.swordie.ms.Server"
java -jar bin/maplestory-1.77.3.jar
```

---

# Configuration

## resources/ServerConfig.json

```json
{
    "DB_HOST": "localhost",
    "DB_PORT": 3306,
    "DB_NAME": "swordie",
    "DB_USER": "root",
    "DB_PASS": "your_password",
    "LOGIN_PORT": 8484,
    "CHANNEL_PORT": 8483
}
```

---

# Ports

| Service | Port |
|---------|------|
| Login Server | 8484 |
| Channel Server | 8483+ |
| Web API | 3000 |

---

# Database Setup

Create Database:
```sql
CREATE DATABASE swordie CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Import SQL:
```bash
mysql -u root -p swordie < sql/1_database.sql
mysql -u root -p swordie < sql/2_tables.sql
```

---

# Troubleshooting

| Problem | Solution |
|---------|----------|
| Java NOT FOUND | Check `libary/jdk-21/` exists |
| Maven NOT FOUND | Check `libary/apache-maven-*/` exists |
| Can't connect | Press 5 to stop, then 3 to restart |
| Port stuck | Press 8 and select Kill |
| Build Failed | Delete `bin/` and rebuild |
| Kotlin Error | Ensure files are in `src/main/kotlin/` |

---

# Moving to Another Machine

1. Copy entire project folder (including `libary/`)
2. Install MySQL and import SQL
3. Edit `resources/ServerConfig.json`
4. Double-click `server.bat`, press 1 to Build, press 3 to Run

No Environment Variables needed.

---

*SwordieMS Deployment System*
