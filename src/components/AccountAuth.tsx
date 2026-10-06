import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, LogOut, Loader2, Sparkles, X, AlertCircle, Chrome } from 'lucide-react';
import { motion } from 'framer-motion';
import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { Language } from '../lib/i18n';

interface AccountAuthProps {
  language: Language;
  onClose: () => void;
  onStateUpdateNeeded: () => void;
  hideClose?: boolean;
}

export const AccountAuth: React.FC<AccountAuthProps> = ({ language, onClose, onStateUpdateNeeded, hideClose }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const t = {
    tr: {
      title: 'Hesap Yönetimi',
      login: 'Giriş Yap',
      register: 'Kayıt Ol',
      forgot: 'Şifre Sıfırlama',
      email: 'E-posta Adresi',
      password: 'Şifre',
      confirmPassword: 'Şifreyi Doğrula',
      forgotBtn: 'Şifremi Unuttum',
      loginLink: 'Zaten bir hesabınız var mı? Giriş Yapın',
      registerLink: 'Hesabınız yok mu? Yeni Hesap Oluşturun',
      forgotBtnLink: 'Giriş sayfasın dön',
      successForgot: 'Şifre sıfırlama e-postası başarıyla gönderildi!',
      successLogin: 'Giriş başarılı!',
      successRegister: 'Hesap başarıyla oluşturuldu!',
      errorMatch: 'Şifreler eşleşmiyor!',
      authTip: 'Verilerinizi bulutta yedeklemek ve cihazlar arası senkronize etmek için giriş yapın.',
      firebaseTip: 'Not: Firebase Console üzerinden Email/Password ve Google sağlayıcılarının etkinleştirildiğinden emin olun.',
      logout: 'Çıkış Yap',
      welcome: 'Hoş geldiniz,',
      activeStatus: 'Sistem aktif durumda ve verileriniz bulutta güvende.',
      errorTitle: 'Hata',
      submit: 'Devam Et',
      googleSignIn: 'Google ile Giriş Yap',
    },
    en: {
      title: 'Account Management',
      login: 'Sign In',
      register: 'Sign Up',
      forgot: 'Reset Password',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotBtn: 'Forgot Password?',
      loginLink: 'Already have an account? Sign In',
      registerLink: 'Don\'t have an account? Create one',
      forgotBtnLink: 'Back to Sign In',
      successForgot: 'Password reset link sent to your email!',
      successLogin: 'Login successful!',
      successRegister: 'Account created successfully!',
      errorMatch: 'Passwords do not match!',
      authTip: 'Sign in to back up and synchronize all your study data securely in the cloud.',
      firebaseTip: 'Note: Ensure Email/Password and Google providers are enabled in your Firebase Console.',
      logout: 'Sign Out',
      welcome: 'Welcome,',
      activeStatus: 'Your study statistics are synchronized with the cloud securely.',
      errorTitle: 'Error',
      submit: 'Continue',
      googleSignIn: 'Sign In with Google',
    },
    ar: {
      title: 'إدارة الحساب',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب جديد',
      forgot: 'استعادة كلمة المرور',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      forgotBtn: 'نسيت كلمة المرور؟',
      loginLink: 'لديك حساب بالفعل؟ تسجيل الدخول',
      registerLink: 'ليس لديك حساب؟ إنشاء حساب جديد',
      forgotBtnLink: 'العودة لتسجيل الدخول',
      successForgot: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك!',
      successLogin: 'تم تسجيل الدخول بنجاح!',
      successRegister: 'تم إنشاء الحساب بنجاح!',
      errorMatch: 'كلمات المرور غير متطابقة!',
      authTip: 'سجّل الدخول لحفظ بياناتك في السحابة ومزامنتها بأمان عبر أجهزتك.',
      firebaseTip: 'ملاحظة: تأكد من تفعيل موفري البريد/كلمة المرور وGoogle في Firebase Console.',
      logout: 'تسجيل الخروج',
      welcome: 'مرحباً،',
      activeStatus: 'إحصائيات دراستك متزامنة مع السحابة بأمان.',
      errorTitle: 'خطأ',
      submit: 'متابعة',
      googleSignIn: 'تسجيل الدخول عبر Google',
    }
  }[language || 'tr'];

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setLoadingGoogle(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setSuccessMessage(t.successLogin);
      setTimeout(() => {
        onStateUpdateNeeded();
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error("Google login failed", err);
      let errMsg = err.message || String(err);
      if (err.code === 'auth/popup-blocked') {
        errMsg = language === 'tr' 
          ? 'Giriş penceresi tarayıcı tarafından engellendi. Lütfen açılır pencerelere izin verin.' 
          : language === 'ar'
          ? 'تم حظر نافذة تسجيل الدخول المنبثقة من قبل المتصفح. يرجى السماح بالنوافذ المنبثقة.'
          : 'Sign-in popup was blocked by your browser. Please enable popups for this site.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errMsg = language === 'tr'
          ? "Google ile giriş yöntemi Firebase Console'da etkinleştirilmemiş! Lütfen Firebase Console -> Authentication -> Sign-in method sekmesinden 'Google' sağlayıcısını etkinleştirin."
          : language === 'ar'
          ? "تسجيل الدخول عبر Google غير مفعّل في Firebase Console! يرجى الانتقال إلى Firebase Console وتفعيل موفر Google."
          : "Google sign-in is disabled in your Firebase Console! Please go to Firebase Console -> Authentication -> Sign-in method and enable the 'Google' provider.";
      }
      setErrorMessage(errMsg);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    if (mode === 'register' && password !== confirmPassword) {
      setErrorMessage(t.errorMatch);
      setLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccessMessage(t.successLogin);
        setTimeout(() => {
          onStateUpdateNeeded();
          onClose();
        }, 1200);
      } else if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMessage(t.successRegister);
        setTimeout(() => {
          onStateUpdateNeeded();
          onClose();
        }, 1200);
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setSuccessMessage(t.successForgot);
      }
    } catch (err: any) {
      console.error(err);
      let cleanMessage = err.message || String(err);
      if (err.code === 'auth/user-not-found') {
        cleanMessage = language === 'tr' ? 'Kullanıcı bulunamadı.' : language === 'ar' ? 'المستخدم غير موجود.' : 'User not found.';
      } else if (err.code === 'auth/wrong-password') {
        cleanMessage = language === 'tr' ? 'Şifre hatalı.' : language === 'ar' ? 'كلمة المرور غير صحيحة.' : 'Wrong password.';
      } else if (err.code === 'auth/email-already-in-use') {
        cleanMessage = language === 'tr' ? 'Bu e-posta adresi zaten kullanımda.' : language === 'ar' ? 'البريد الإلكتروني مستخدم بالفعل.' : 'Email already in use.';
      } else if (err.code === 'auth/invalid-email') {
        cleanMessage = language === 'tr' ? 'Geçersiz e-posta adresi.' : language === 'ar' ? 'عنوان البريد الإلكتروني غير صالح.' : 'Invalid email.';
      } else if (err.code === 'auth/weak-password') {
        cleanMessage = language === 'tr' ? 'Şifre en az 6 karakter olmalıdır.' : language === 'ar' ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.' : 'Weak password (min. 6 chars).';
      } else if (err.code === 'auth/operation-not-allowed') {
        cleanMessage = language === 'tr' 
          ? "Giriş yöntemi (E-posta/Şifre) Firebase Console'da etkinleştirilmemiş! Lütfen Firebase Console -> Authentication -> Sign-in method sekmesinden 'Email/Password' sağlayıcısını etkinleştirin."
          : language === 'ar'
          ? "طريقة تسجيل الدخول (البريد/كلمة المرور) غير مفعلة في Firebase Console! يرجى تفعيلها من لوحة التحكم."
          : "Sign-in provider (Email/Password) is disabled in your Firebase Console! Please go to Firebase Console -> Authentication -> Sign-in method and enable the 'Email/Password' provider.";
      }
      setErrorMessage(cleanMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      onStateUpdateNeeded();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[120] flex items-center justify-center p-4 ${
      hideClose 
        ? 'bg-slate-50 overflow-hidden' 
        : 'bg-slate-950/40 backdrop-blur-md'
    }`}>
      {hideClose && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-emerald-100/20 rounded-full blur-[100px]" />
        </div>
      )}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="glass-panel p-6 md:p-8 max-w-md w-full relative bg-white border border-slate-100/90 shadow-2xl rounded-[2rem] z-10"
      >
        {/* Close Button */}
        {!hideClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {currentUser ? (
          // Logged In Status View
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-6 shadow-sm">
              <Sparkles className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              {t.welcome}
            </h3>
            <p className="text-sm font-mono font-bold text-indigo-600 mt-1 mb-3">
              {currentUser.email}
            </p>
            
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed px-4">
              {t.activeStatus}
            </p>

            <div className="w-full h-px bg-slate-100 my-6" />

            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100/60 rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              {t.logout}
            </button>
          </div>
        ) : (
          // Login/Register Form View
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 block mb-1">
                Lumina Sync Core
              </span>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {mode === 'login' ? t.login : mode === 'register' ? t.register : t.forgot}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {t.authTip}
              </p>
            </div>

            {errorMessage && (
              <div className="flex flex-col gap-2 p-3.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl text-xs mb-4">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
                {errorMessage.includes("Firebase Console") && (
                  <a
                    href="https://console.firebase.google.com/project/bright-streamer-l8gvj/authentication/providers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-center py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all text-[11px] uppercase tracking-wider block"
                  >
                    {language === 'tr' ? "Firebase Console'u Aç" : language === 'ar' ? "فتح Firebase Console" : "Open Firebase Console"}
                  </a>
                )}
              </div>
            )}

            {successMessage && (
              <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl text-xs mb-4">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              <div>
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1.5 ml-1">
                  {t.email}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@domain.com"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:border-indigo-500 hover:border-slate-200 transition-all text-slate-700 font-medium"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1.5 ml-1">
                    {t.password}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:border-indigo-500 hover:border-slate-200 transition-all text-slate-700 font-medium"
                    />
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1.5 ml-1">
                    {t.confirmPassword}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:border-indigo-500 hover:border-slate-200 transition-all text-slate-700 font-medium"
                    />
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-right text-[10px] text-indigo-500 hover:text-indigo-600 font-bold self-end transition-colors"
                >
                  {t.forgotBtn}
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-wider text-xs shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {t.submit}
              </button>
            </form>

            {mode !== 'forgot' && (
              <>
                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[10px] uppercase font-bold text-slate-400 px-3 tracking-widest">
                    {language === 'tr' ? 'veya' : language === 'ar' ? 'أو' : 'or'}
                  </span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading || loadingGoogle}
                  className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 text-slate-700 hover:text-indigo-600 rounded-2xl font-bold text-xs shadow-sm hover:shadow active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loadingGoogle ? (
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                  ) : (
                    <Chrome className="w-4.5 h-4.5 text-indigo-600" />
                  )}
                  <span>{t.googleSignIn}</span>
                </button>
              </>
            )}

            <div className="w-full h-px bg-slate-100 my-5" />

            <div className="text-center">
              {mode === 'login' && (
                <button
                  onClick={() => setMode('register')}
                  className="text-xs text-indigo-500 hover:underline font-bold transition-all"
                >
                  {t.registerLink}
                </button>
              )}
              {mode === 'register' && (
                <button
                  onClick={() => setMode('login')}
                  className="text-xs text-indigo-500 hover:underline font-bold transition-all"
                >
                  {t.loginLink}
                </button>
              )}
              {mode === 'forgot' && (
                <button
                  onClick={() => setMode('login')}
                  className="text-xs text-indigo-500 hover:underline font-bold transition-all"
                >
                  {t.forgotBtnLink}
                </button>
              )}
            </div>

            <div className="text-[9px] mt-6 text-slate-400 leading-normal text-center bg-slate-50 rounded-xl p-2.5 border border-slate-100/50">
              {t.firebaseTip}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
