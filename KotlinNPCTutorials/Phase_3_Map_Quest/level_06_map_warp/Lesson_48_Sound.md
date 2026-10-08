# 🎓 Level 48: เสียงสยอง (Sound Effects)

บรรยากาศที่ดีต้องมีเสียงประกอบ (Sound Effect) ไม่ใช่แค่ BGM

## 📜 ภารกิจที่ 50: เล่นเสียง SFX
คำสั่ง: `sm.playSound("Part/Sound")`
*   ต้องรู้ Path ในไฟล์ Sound.wz (เช่น `Game/LevelUp`, `Mob/Slime/Die`)

### **Code ตัวอย่าง (PlaySound.kts)**
```kotlin
// เสียงเลเวลอัพ
sm.playSound("Game/LevelUp")

// เสียงมอนสเตอร์ตาย
sm.playSound("Mob/1210102/Die")

// เสียง UI
sm.playSound("UI/UIWindow/Quest/Accept")
```

---

## 🧐 **หา Path เสียงยังไง?**
ต้องใช้โปรแกรม **Harepacker** เปิดไฟล์ `Sound.wz` ดูโครงสร้างโฟลเดอร์

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** กล่องดนตรี
1.  เมนูเลือกเพลง 1. LevelUp 2. JobChange 3. QuestComplete
2.  เลือกข้อไหน เล่นเสียงนั้น

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val sel = sm.sendAskMenu("Test Sound:\r\n#L0# Level Up#l\r\n#L1# Job Change#l\r\n#L2# Quest Complete#l")

when (sel) {
    0 -> sm.playSound("Game/LevelUp")
    1 -> sm.playSound("Game/JobChange")
    2 -> sm.playSound("Game/QuestComplete")
}
```
</details>
