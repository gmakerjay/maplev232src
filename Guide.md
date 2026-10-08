# ⚔️ SwordieMS Architect: The Ultimate Code Anatomy Guide
*A 200-Chapter Roadmap to Mastery*

---

## 📖 สารบัญ (Table of Contents)

### **Phase 1: รากฐานของโลก (The Foundation)**
*   **Chapter 001**: Introduction to Swordie Architecture (โครงสร้างโปรเจค)
*   **Chapter 002**: Java Basics for Emulation (Inheritance & Polymorphism)
*   **Chapter 003**: The Packet System (InPacket & OutPacket)
*   **Chapter 004**: Database & Hibernate (ORM Mapping)
*   **Chapter 005**: GameConstants & ServerConstants (ค่าคงที่จักรวาล)
*   **Chapter 006**: Enums Explained (MsgType, InvType, etc.)
*   **Chapter 007**: The Server Loop (Netty & EventManager)
*   **Chapter 008**: Script Manager (Javascript Engine)
*   **Chapter 009**: WZ Data Loading (Providers & Templates)
*   **Chapter 010**: StringPool & Caching

### **Phase 2: ผู้เล่นและตัวละคร (Char.java Deep Dive)**
*   **Chapter 021**: The `Char` Class Anatomy (ศูนย์กลางจักรวาล)
*   **Chapter 022**: Inventory System (การจัดการช่องเก็บของ)
*   **Chapter 023**: Stats Calculation (Basic & Temporary Stats)
*   **Chapter 024**: Skills & Cooldowns Management
*   **Chapter 025**: Quest Logic (Started, Completed, Data)
*   **Chapter 026**: Keymaps & Macros
*   **Chapter 027**: Guild & Social Systems
*   **Chapter 028**: Pets & Familiars Integration
*   **Chapter 029**: Damage Skins & Androids
*   **Chapter 030**: Saving Data (flush & DB writes)

### **Phase 3: โลกและการมองเห็น (Field.java Deep Dive)**
*   **Chapter 041**: `Field` vs `FieldInstance` (Map คืออะไร?)
*   **Chapter 042**: Life Management (The `lifes` Map)
*   **Chapter 043**: Controllers (ใครคุมมอนสเตอร์?)
*   **Chapter 044**: ObjectIDs (ระบบบัตรประชาชน Field)
*   **Chapter 045**: Split/Packet Broadcast (ใครเห็นใครบ้าง?)
*   **Chapter 046**: Portals & Map Transitions
*   **Chapter 047**: Map Reactables (Runes, Herbs, Veins)
*   **Chapter 048**: Drops System (DropPool & Ownership)
*   **Chapter 049**: Field Scripting
*   **Chapter 050**: Instance Dungeons

### **Phase 4: สิ่งมีชีวิตและ AI (Mob.java Deep Dive)**
*   **Chapter 061**: `Mob` Class Hierarchy (Life -> Mob)
*   **Chapter 062**: Mob Stats (HP, MP, Level, EXP)
*   **Chapter 063**: Mob Skills & Attacks
*   **Chapter 064**: Aggro System (Targeting Players)
*   **Chapter 065**: Status Effects (Burn, Freeze, Stun)
*   **Chapter 066**: The Damage Loop (`damageBySkill`)
*   **Chapter 067**: The Death Sequence (`die` & `dropDrops`)
*   **Chapter 068**: Boss Mechanics (Phases & Body Parts)
*   **Chapter 069**: Reviving & Respons (MobGen)
*   **Chapter 070**: Global Mob Handling

### **Phase 5: ไอเทมและอุปกรณ์ (Equip.java Deep Dive)**
*   **Chapter 081**: `Item` vs `Equip` (Inheritance in Action)
*   **Chapter 082**: The `Equip` Structure (Stats, Sockets, Flames)
*   **Chapter 083**: Encoding Packets (ส่งค่าดาบให้ Client เห็น)
*   **Chapter 084**: Starforce Logic (`recalcEnchantmentStats`)
*   **Chapter 085**: Potentials & Cubing
*   **Chapter 086**: Flames (Rebirth Flames Logic)
*   **Chapter 087**: Durability & Repair
*   **Chapter 088**: Set Effects (Joker & Regular Sets)
*   **Chapter 089**: Cash Items & CS Logic
*   **Chapter 090**: Inventory Operations (Add, Remove, Move)

### **Phase 6: Advanced Mechanics & Reverse Engineering**
*   **Chapter 101**: Tracing a Helper Packet (Client -> Server)
*   **Chapter 102**: Tracing a Handler (Server -> Client)
*   **Chapter 103**: Debugging "Why did this drop?"
*   **Chapter 104**: Creating Custom Skills
*   **Chapter 105**: Implementing a New Boss
*   **Chapter 106**: Fixing Packet Leaks
*   **Chapter 107**: Performance Optimization (Loop Handling)
*   **Chapter 108**: Anti-Cheat Basics
*   **Chapter 109**: Thread Safety in Fields
*   **Chapter 110**: The Future of Swordie

---

# 📘 Content Deep Dive: Core Systems

## 🎓 Chapter 006: Enums Explained (The DNA of Logic)
Enums ใน Swordie ไม่ใช่แค่ตัวเลข แต่คือ **"ประเภท"** ที่กำหนดพฤติกรรมของ Object

### **Case Study: `InvType.java`**
ทำไมต้องมี Enum นี้? เพราะ Server ต้องรู้ว่า "Item นี้อยู่กระเป๋าช่องไหน"
*   `EQUIP (1)`: อุปกรณ์สวมใส่
*   `CONSUME (2)`: ยา/อาหาร
*   `ETC (4)`: ขยะ/ของเควส
*   **Trick**: ค่าพวกนี้ตรงกับค่าที่ส่งใน Packet เป๊ะๆ ถ้าแก้มั่ว Client จะเปิดกระเป๋าแล้ว Error ทันที

---

## 🎓 Chapter 021: `Char.java` (The God Object)
`Char.java` คือคลาสที่ใหญ่ที่สุด เป็นตัวแทนของผู้เล่น 1 คน

### **Key Components (เจาะลึกตัวแปรสำคัญ):**
1.  **`id` vs `userId`**:
    *   `id`: คือ Character ID (เช่น 10001) ไม่ซ้ำใน Server
    *   `userId`: คือ Account ID (Login ID) **สำคัญมาก** เวลาเช็คว่าใครเป็นเจ้าของ Char นี้
2.  **`Inventory` Arrays**:
    *   `equippedInventory`: ของที่ใส่อยู่ (เสื้อ, กางเกง) - `InvType.EQUIPPED`
    *   `equipInventory`: ของในกระเป๋าช่องแรก - `InvType.EQUIP`
    *   **Logic**: เวลาใส่ของ Server จะย้าย Object `Item` จาก `equipInventory` -> `equippedInventory`
3.  **`TemporaryStatManager` (TSM)**:
    *   จัดการ Buff ทั้งหมด! (Haste, Sharp Eyes)
    *   ถ้า Buff หายก่อนเวลา -> เช็คที่ Class นี้ดูว่า `schedule` มันทำงานถูกไหม

---

## 🎓 Chapter 041-043: `Field.java` Logic (Controller System)
ทำไมมอนสเตอร์เดินได้? ทำไมบางทียืนนิ่ง? ความลับอยู่ที่ **"Controller"**

### **The Controller Concept:**
Server ไม่มีตา มัน "ไม่เห็น" ว่ามอนสเตอร์เดินไปไหน
1.  **Assign**: Server เลือกผู้เล่น 1 คนในแมพเป็น **Controller** ของมอนตัวนั้น
2.  **Report**: ผู้เล่นคนนั้น (Client) จะคำนวณ Physic การเดิน แล้วส่ง Packet กลับมาบอก Server ว่า "มอนตัวนี้เดินไปทางขวานะ"
3.  **Broadcast**: Server รับข้อมูล -> ส่งต่อให้ผู้เล่น **คนอื่น** เห็น

### **Code Analysis (`Field.java`):**
```java
public void spawnLife(Life life, Char onlyChar) {
    addLife(life); // 1. เอาเข้าแมพ
    if (getChars().size() > 0) {
        determineNewLifeControllerIfAbsent(life); // 2. หาคนคุม
        life.broadcastSpawnPacket(onlyChar); // 3. บอกให้คนอื่นเห็น
    }
}
```
*   **Reverse Logic**: ถ้ามอนสเตอร์ไม่เดิน หรือเดินทะลุกำแพง -> แปลว่า **Controller** มีปัญหา หรือ Client ของ Controller ส่งข้อมูลผิด (Lag/Hack)

---

## 🎓 Chapter 066-067: `Mob.java` (Damage & Death)
กระบวนการ "ตาย" ของมอนสเตอร์ ไม่ใช่เรื่องบังเอิญ มันคือลำดับขั้นตอนที่เคร่งครัด

### **The Death Sequence (`die` method):**
1.  **Exp Distribution**: คำนวณ Exp ตาม Damage (บรรทัด `damageDone`)
2.  **Quest Check**: เช็คว่าคนตีมีเควส "ล่ามอน" ตัวนี้ไหม (`QuestManagerHandler`)
3.  **Drop Generation**: เรียก `dropDrops()`
    *   ดึงข้อมูล Drop จาก `MobData`
    *   คำนวณ Rate (คูณ Drop Rate, Check Item Drop, etc.)
    *   **Loop**: วนลูปสร้าง Object `Drop` แล้วโยนลง `Field.spawnLife()`

### **Advanced Analysis: `addDamage`**
```java
public void addDamage(Char damageDealer, long damage) {
    // เก็บว่าใครตีไปเท่าไหร่ เพื่อหาร Exp ตอนตาย
    getDamageDone().put(damageDealer, current + damage);
}
```
*   **Bug Spot**: ถ้าตีแล้ว Exp ไม่ขึ้น หรือของไม่ดรอปเข้าตัว -> เช็ค Map `damageDone` ว่ามันถูกเคลียร์หายไปตอนไหนหรือไม่ (เช่น หลุดแมพแล้วกลับมาใหม่)

---

## 🎓 Chapter 081-084: `Equip.java` (Stat Encoding)
ทำไมไอเทมบางชิ้นส่องแล้วหลุด? หรือค่า Stat ไม่ตรง?

### **The Masking System (`encode`):**
Server ไม่ส่งค่า Stat ทุกตัวเพื่อประหยัด Data มันใช้ **Mask**:
```java
int mask = getStatMask(0);
if (mask & STR) encode(STR);
if (mask & DEX) encode(DEX);
```
*   **Critical Rule**: ลำดับการ `encode` **ต้องตรงกับ Client 100%**
*   **Reverse Engineering**: ถ้าอัปเดตเวอร์ชันเกมแล้วหลุดตอนส่องของ -> แปลว่า Nexon "แทรก" Stat ใหม่เข้ามาในลำดับ (เช่น `Stat X` มาคั่นกลางระหว่าง `STR` กับ `DEX`) หน้าที่ Dev คือต้องหาจุดนั้นให้เจอ

### **Starforce Calculation (`recalcEnchantmentStats`):**
นี่คือ "โรงงานผลิตดาบเทพ"
*   โค้ดจะวนลูป `chuc` (จำนวนดาว)
*   แต่ละรอบจะบวกค่า Stat เข้าไปใน Map `enchantStats`
*   **สูตรลับ**: อยู่ใน `GameConstants.getEnchantmentValByChuc` ถ้าอยากปรับให้ตีบวกแล้วโหดขึ้น ก็แก้ที่นี่ที่เดียว จบ!

---

## 🎓 Chapter 101: การทำ Reverse Engineer (Workshop)
**Scenario: อยากรู้ว่าสกิล "Sharp Eyes" ทำงานยังไง?**

1.  **Find ID**: หา Skill ID ใน WZ/Internet (สมมติ 3121002)
2.  **Search Usage**: ค้นหา `3121002` ในโปรเจค
3.  **Trace**:
    *   เจอใน `Job.java` -> (การกดใช้สกิล)
    *   เจอใน `CharacterTemporaryStat.java` -> (Enum ที่บอกว่าเป็น Buff)
    *   เจอใน `TemporaryStatManager.java` -> (Logic การเพิ่ม Stat คริติคอล)
4.  **Connect**:
    *   `Char` กดใช้ -> `JobHandler` รับเรื่อง -> เช็ค MP/Cooldown -> สั่ง `TSM` ให้แปะ Buff -> `TSM` ส่ง Packet บอก Client -> จบ

นี่คือวิธีการไล่โค้ดที่ถูกต้องครับ! ขอให้สนุกกับการผ่าตัด Swordie! 🩺
