const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "El nombre de usuario es obligatorio"],
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "El correo es obligatorio"],
            unique: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, "El correo no es válido"],
        },
        password: {
            type: String,
            required: [true, "La contraseña es obligatoria"],
            minlength: [6, "La contraseña debe tener mínimo 6 caracteres"],
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        fullName: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
            match: [/^\+?[0-9\s-]{7,15}$/, "El teléfono no es válido"],
        },
        avatar: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        },
        avatarId: {
            type: String,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        lastLogin: {
            type: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
