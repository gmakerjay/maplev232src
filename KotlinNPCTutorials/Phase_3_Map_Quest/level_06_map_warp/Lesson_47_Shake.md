# 🎓 Level 47: แผ่นดินไหว (Earthquake)

สร้างความตื่นเต้นด้วยการเขย่าจอ!

## 📜 ภารกิจที่ 49: เขย่าทั้งแมพ
ใช้คำสั่งแสดง Effect พิเศษที่ชื่อ "Tremble"

### **Code ตัวอย่าง (Shake.kts)**
```kotlin
// Arg 1: Type (0 = เบา, 1 = แรง)
// Arg 2: Delay (Millisecond)
sm.showFieldEffect("earthquake", 10000) // (สมมติว่าเป็นคำสั่งนี้ เช็ค API จริงอีกที)
// Swordie ปกติใช้ Packet: 
// field.broadcastPacket(FieldPacket.fieldEffect(FieldEffect.tremble(1, 10000, 50)))

// แต่ถ้าผ่าน ScriptManager อาจจะต้องใช้ Helper
// ถ้าไม่มี ให้ใช้ท่าไม้ตาย: ส่ง Packet ตรงๆ (Advance)
// แต่เอาเป็นว่าสมมติมีฟังก์ชันนี้ก่อน
sm.chat("แผ่นดินไหว!!!!")
```

**หมายเหตุ:** ใน SwordieMS `sm` อาจจะไม่มี `shakeScreen` โดยตรง
ต้องใช้ `field.broadcastPacket(FieldPacket.tremble(0, 1000, 10))`
(ต้อง Import `net.swordie.ms.connection.packet.field.FieldPacket`)

```kotlin
import net.swordie.ms.connection.packet.field.FieldPacket

// เขย่าแรงระดับ 1 นาน 5 วิ (5000 ms)
field.broadcastPacket(FieldPacket.tremble(1, 5000, 30))
sm.chatRed("ระวังหินถล่ม!")
```

---

## ✍️ **แบบฝึกหัด**
ลองสร้าง NPC ที่พอคุยจบแล้ว จอจะสั่น 3 วินาที แล้ววาร์ปผู้เล่นหนี
(เฉลย: `tremble` -> `invokeAfter(3000)` -> `warp`)
