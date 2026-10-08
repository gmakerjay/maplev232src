# 🎓 Level 29: พลังที่ซ่อนอยู่ (Checking STR/DEX/INT/LUK)

NPC บางตัว เช่น หินศักดิ์สิทธิ์ (Holy Stone) อาจจะต้องการค่า Stat ที่กำหนดถึงจะคุยรู้เรื่อง

## 📜 ภารกิจที่ 32: ตรวจร่างกาย
ค่า Stat อยู่ใน `chr.avatarData.characterStat` หรือเรียกผ่าน `chr.stat` (สำหรับบางเวอร์ชั่น แต่ใน Swordie เรียกตรงๆ จาก `chr` ได้เลย มี Getter เตรียมไว้ให้)

*   `chr.getStat(Stat.STR)` ... อันนี้ยากไป
*   ใช้ทางลัด:
    *   `chr.avatarData.characterStat.str`
    *   `chr.avatarData.characterStat.dex`
    *   ...

### **Code ตัวอย่าง (CheckAbility.kts)**
```kotlin
val str = chr.avatarData.characterStat.str
val dex = chr.avatarData.characterStat.dex

sm.sendNext("ค่าพลังของคุณ: STR $str, DEX $dex")

if (str > 50) {
    sm.sendSayOkay("กล้ามใหญ่ใช้ได้นี่พ่อหนุ่ม")
} else {
    sm.sendSayOkay("ผอมแห้งแรงน้อยจริงๆ")
}
```

---

## 🧐 **AP (Ability Points)**
เช็คแต้มฟรีที่ยังไม่ได้อัพ: `chr.avatarData.characterStat.ap`

```kotlin
val ap = chr.avatarData.characterStat.ap
if (ap > 0) {
    sm.sendSay("นายลืมอัพ Stat รึเปล่า? เหลือตั้ง $ap แต้มแน่ะ")
}
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** ประตูแห่งปัญญา (Gate of Wisdom)
1.  ประตูนี้เปิดให้เฉพาะคนฉลาด (INT >= 20)
2.  ถ้า INT ไม่ถึง ให้บอกว่า "ไปอ่านหนังสือมาเพิ่มซะ!"
3.  ถ้าผ่าน ให้บอก "เชิญท่านนักปราชญ์"

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val int = chr.avatarData.characterStat.int

if (int >= 20) {
    sm.sendSayOkay("สมองท่านช่างปราดเปรื่อง... เชิญ")
} else {
    sm.sendSayOkay("เจ้าโง่! INT แค่นี้จะไปทำอะไรกิน!")
}
```
</details>
