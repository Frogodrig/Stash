"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserInput = exports.createCommentInput = exports.updateBlogInput = exports.createBlogInput = exports.signinInput = exports.signupInput = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupInput = zod_1.default.object({
    username: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
    name: zod_1.default.string().optional(),
});
exports.signinInput = zod_1.default.object({
    username: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
});
exports.createBlogInput = zod_1.default.object({
    title: zod_1.default.string().trim().min(1, { message: "Title is required" }),
    content: zod_1.default.string().trim().min(1, { message: "Content is required" }),
});
exports.updateBlogInput = zod_1.default.object({
    id: zod_1.default.number().optional(),
    title: zod_1.default.string().trim().min(1, { message: "Title is required" }),
    content: zod_1.default.string().trim().min(1, { message: "Content is required" }),
});
exports.createCommentInput = zod_1.default.object({
    content: zod_1.default.string().trim().min(1, { message: "Content is required" }),
});
exports.updateUserInput = zod_1.default.object({
    bio: zod_1.default.string().optional(),
    currentPassword: zod_1.default.string().min(6),
    newPassword: zod_1.default.string().min(6),
    confirmPassword: zod_1.default.string().min(6),
});
