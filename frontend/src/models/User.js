import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ✅ 기존 모델이 존재하면 재사용, 없으면 새로 생성
export default mongoose.models.User || mongoose.model("User", UserSchema);
