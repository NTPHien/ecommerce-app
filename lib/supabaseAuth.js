import { supabase } from './supabaseClient.js';

// Đăng ký người dùng
export async function signUp(email, password) {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { user, error };
}
// Đăng nhập người dùng
export async function signIn(email, password) {
  const { user, error } = await supabase.auth.signIn({ 
    email,
    password,
  });
  return { user, error };
}
// Đăng xuất người dùng
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
} 
// Lấy thông tin người dùng hiện tại
export function getCurrentUser() {
  return supabase.auth.user();
}