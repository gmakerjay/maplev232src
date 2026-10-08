# 🧙‍♂️ Kotlin NPC Scripting: From Zero to Hero (Level 0 - 100)

ยินดีต้อนรับสู่คัมภีร์การเขียน NPC ด้วยภาษา Kotlin สำหรับ SwordieMS
นี่คือคู่มือที่จะพาคุณจาก "เขียนไม่เป็นเลย" ไปจนถึง "เขียนระบบซับซ้อนได้"
เราแบ่งระดับความยากเป็น Level 0 ถึง 100 เพื่อให้คุณค่อยๆ อัปเกรดความรู้ไปทีละขั้น

---

## 📚 สารบัญ (Syllabus)

### **🌱 Novice (Level 0 - 20)**
*   **[Level 0 - 5]**: Hello World & Basic Dialogue
    *   โครงสร้างพื้นฐานของไฟล์ `.kts`
    *   การใช้ `sm.sendSay`, `sm.sendNext`, `sm.sendPrev`, `sm.sendSayOkay`
*   **[Level 6 - 10]**: Decision Making (Yes/No)
    *   การใช้ `sm.sendAskYesNo`, `sm.sendAskAccept`
    *   การเขียนเงื่อนไข `if/else` พื้นฐาน
*   **[Level 11 - 20]**: The Power of Choice (Menus)
    *   การสร้างเมนูตัวเลือกด้วย `sm.sendAskMenu` (หรือ `sendSimple`)
    *   การรับค่า Selection และใช้ `when` (Switch Case) ใน Kotlin

### **💰 Merchant (Level 21 - 40)**
*   **[Level 21 - 30]**: Items & Mesos Management
    *   การเช็ค Item ในตัว `sm.hasItem`
    *   การแจกของ/ลบของ `sm.giveItem`, `sm.consumeItem`
    *   การจัดการเงิน `sm.getMesos`, `sm.deductMesos`
*   **[Level 31 - 40]**: Checking Player Stats
    *   เช็คเลเวล `chr.level`
    *   เช็คอาชีพ, ค่า Stat (STR/DEX), เช็คเพศ
    *   การแจก EXP และ Fame

### **🗺️ Explorer (Level 41 - 60)**
*   **[Level 41 - 50]**: Map & Warp Systems
    *   ย้ายแมพ `sm.warp(mapId)`
    *   ย้ายไปหา Mob หรือ Portal เฉพาะ
*   **[Level 51 - 60]**: Quest Logic (Without Quest Data)
    *   จำลองระบบเควสด้วย Variable
    *   การใช้ Temporary Variables ในการคุยต่อเนื่อง

### **🧙 Archmage (Level 61 - 80)**
*   **[Level 61 - 70]**: Loops & Arrays
    *   การวนลูปแจกของหลายชิ้น
    *   การสุ่มของ (Random Gachapon Logic)
    *   การใช้ List และ Array ใน Kotlin เพื่อจัดการโค้ดให้สั้นลง
*   **[Level 71 - 80]**: Mob & Boss Spawning
    *   เสกมอนสเตอร์ `sm.spawnMob`
    *   เช็คว่ามอนสเตอร์ตายหรือยัง
    *   ระบบดันเจี้ยนเบื้องต้น (Instance)

### **👑 Godlike (Level 81 - 100)**
*   **[Level 81 - 90]**: Server Interaction (Broadcast & Notices)
    *   ประกาศทั้งเซิร์ฟเวอร์
    *   เปลี่ยน BGM, เปลี่ยน Weather Effect
*   **[Level 91 - 99]**: Advanced Logic & Optimization
    *   การเขียนฟังก์ชันแยก (Reusable Functions)
    *   การคุยกับ Java Class โดยตรง
*   **[Level 100]**: The Masterpiece (Ex. Custom System)
    *   สร้างระบบแลกของรางวัลแบบซับซ้อน (Crafting System)

---

## 🛠️ เครื่องมือที่ต้องใช้
*   Notepad++ หรือ VS Code
*   ความรู้เรื่อง Item ID (ใช้คำสั่ง `@search` ในเกมช่วย)

---
*Created by Swordie Architect AI*
