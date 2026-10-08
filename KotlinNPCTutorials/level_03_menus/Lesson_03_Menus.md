# 🎓 Level 3: เมนูอาหารตามสั่ง (Selections)

การถามแค่ ใช่/ไม่ มันตื้นเขินเกินไป! ชีวิตจริงมันต้องมีเมนู! วันนี้เราจะมาทำเมนูเลือกเส้นทางกันครับ

## 📜 ภารกิจที่ 4: เมนูพื้นฐาน (Basic Menu)
เราจะใช้ `sm.sendAskMenu` (หรือบาง Emulator ใช้ `sendSimple` ก็ได้ แต่ Swordie ใช้ `sendAskMenu`)

โครงสร้างเมนูใน Maple มันใช้ระบบ **Selection ID**
*   `#L[ตัวเลข]#` = เปิดบรรทัดเลือก (Link)
*   `#l` (ตัว L เล็ก) = ปิดบรรทัดเลือก (เฉพาะเวอร์ชันเก่า, Swordie ไม่ต้องใช้ก็ได้แค่ขึ้น `#L` ใหม่)

### **Code ตัวอย่าง (Menu.kts)**
```kotlin
// สร้างข้อความเมนู
// \r\n คือการขึ้นบรรทัดใหม่
val menu = "สวัสดีจ้า วันนี้อยากไปไหนดี?\r\n" +
           "#L0# ไปเมือง Henesys#l\r\n" +
           "#L1# ไปเมือง Perion#l\r\n" +
           "#L2# ไปเมือง Kerning City#l"

// รับค่าที่เลือก (เป็นตัวเลข int)
val selection = sm.sendAskMenu(menu)

// ตรวจสอบค่าที่เลือก (ใช้ when แทน switch-case)
when (selection) {
    0 -> sm.sendSayOkay("ยินดีต้อนรับสู่หมู่บ้านเห็ด Henesys!")
    1 -> sm.sendSayOkay("ระวังตัวด้วยนะ Perion มันเถื่อน")
    2 -> sm.sendSayOkay("ระวังโจรล้วงกระเป๋าที่ Kerning City ล่ะ")
    // else -> sm.sendSayOkay("เลือกอะไรของเอ็ง?") // กรณีมีค่าประหลาดหลุดมา
}
```

---

## 🧐 **ไวยากรณ์น่ารู้ (Grammar Breakdown)**

### 1. **String String String (`+`)**
การต่อข้อความ (Concatenation) ทำได้หลายแบบ
*   แบบบ้านๆ: `"Hello " + "World"`
*   แบบดูดี: `"""Multi-line String"""` (ใช้ฟันหนู 3 ตัว เขียนหลายบรรทัดได้เลย ไม่ต้องใช้ `\r\n`)

ตัวอย่างแบบ 3 ฟันหนู (Raw String):
```kotlin
val menu = """
    เลือกเมืองที่ชอบ:
    #L0# Henesys#l
    #L1# Ellinia#l
""".trimIndent() // trimIndent() ช่วยลบย่อหน้าส่วนเกินออกให้สวยงาม
```

### 2. **When Expression (The Kotlin Highlight)**
นี่คือพระเอกของ Kotlin ที่มาฆ่า Switch Case ของ Java
*   ไม่ต้องใช้ `break` (มันจบในตัว)
*   ใช้ `->` (Arrow) ชี้ไปที่คำสั่งเลย
*   ใส่หลายค่าได้ เช่น `0, 1 -> sm.sendSay("0 หรือ 1 ก็ได้")`
*   ใช้เช็คช่วงได้ เช่น `in 1..10 -> sm.sendSay("เลข 1 ถึง 10")`

---

## 📜 ภารกิจที่ 5: เมนูที่มีเงื่อนไข (Advanced Menu)
บางทีเราอยากโชว์เมนูเฉพาะคนที่มีของ หรือเลเวลถึง

### **Code ตัวอย่าง (ConditionalMenu.kts)**
```kotlin
var text = "บริการวาร์ปพิเศษ:\r\n"
text += "#L0# วาร์ปปกติ (ฟรี)#l\r\n"

// เช็คเลเวลผู้เล่น (chr.level หรือ chr.getLevel())
if (chr.level >= 30) {
    text += "#L1# วาร์ป VIP (เฉพาะเลเวล 30+)#l\r\n"
}

val sel = sm.sendAskMenu(text)

when (sel) {
    0 -> sm.sendSayOkay("วาร์ปปกติ... ฟิ้ววว")
    1 -> {
        // ถ้า Logic ยาวๆ ให้ใช้วงเล็บปีกกา { } ครอบ
        sm.sendNext("โอ้โห ท่าน VIP!")
        sm.sendSayOkay("เชิญครับท่าน...")
    }
}
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** สร้าง NPC ขายบัฟ (Buff Seller)
1.  เมนู 1: เพิ่มเลือดเต็ม (Full Heal)
2.  เมนู 2: เพิ่มความเร็ว (Speed Up)
3.  ใช้ `when` ในการจัดการคำตอบ (ยังไม่ต้องเขียน Logic เพิ่มเลือดจริง แค่ `sendSayOkay` ว่า "ฮีลแล้วจ้า" ก็พอ)

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val msg = """
    ต้องการบัฟแบบไหน?
    #L1# ฮีลเลือดเต็มถัง#l
    #L2# วิ่งเร็วดั่งสายฟ้า#l
""".trimIndent()

val choice = sm.sendAskMenu(msg)

when (choice) {
    1 -> sm.sendSayOkay("วิ้งงงง! เลือดเต็มหลอดแล้วจ้า")
    2 -> sm.sendSayOkay("ฟิ้ววว! วิ่งฝุ่นตลบไปเลยพี่")
}
```
</details>
