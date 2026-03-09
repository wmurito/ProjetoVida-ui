import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sanitizeInput } from "../../services/securityConfig";

import logoImg from "../../assets/logovida.png";
import logoTexto from "../../assets/logo.png";
import { FaGithub, FaInstagram, FaLinkedin, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const { login, logged, loading: authLoading } = useAuth();

  useEffect(() => {
    if (logged && !authLoading) {
      navigate("/dashboard");
    }
  }, [logged, navigate, authLoading]);

  useEffect(() => {
    try {
      const storedRememberMe = sessionStorage.getItem("rememberMe");
      if (storedRememberMe === "true") {
        setRememberMe(true);
        const storedEmail = sessionStorage.getItem("username");
        if (storedEmail) {
          setEmail(storedEmail);
        }
      }
    } catch (error) {
      console.error('Erro ao acessar sessionStorage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem("rememberMe", rememberMe);
      if (rememberMe) {
        sessionStorage.setItem("username", sanitizeInput(email));
      } else {
        sessionStorage.removeItem("username");
      }
    } catch (error) {
      console.error('Erro ao salvar em sessionStorage:', error);
      toast.warning('Não foi possível salvar preferências');
    }
  }, [rememberMe, email]);

  const validatePassword = (password) => {
    if (password.length < 8) return "A senha deve ter pelo menos 8 caracteres";
    if (!/[A-Z]/.test(password)) return "A senha deve conter pelo menos uma letra maiúscula";
    if (!/[a-z]/.test(password)) return "A senha deve conter pelo menos uma letra minúscula";
    if (!/[0-9]/.test(password)) return "A senha deve conter pelo menos um número";
    if (!/[^A-Za-z0-9]/.test(password)) return "A senha deve conter pelo menos um caractere especial";
    return "";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sanitizedEmail = sanitizeInput(email);

      if (isChangingPassword) {
        const passwordValidation = validatePassword(newPassword);
        if (passwordValidation) {
          setPasswordError(passwordValidation);
          setLoading(false);
          return;
        }

        if (newPassword !== confirmPassword) {
          setPasswordError("As novas senhas não coincidem");
          setLoading(false);
          return;
        }
      }

      const result = await login(sanitizedEmail, password, newPassword);

      if (!result) {
        toast.error("Erro ao processar login");
        return;
      }

      if (result.newPasswordRequired) {
        toast.info("É necessário alterar sua senha");
        setIsChangingPassword(true);
        return;
      }

      if (result.mfaRequired) {
        toast.info("Código MFA necessário");
        return;
      }

      if (result.success) {
        toast.success("Login realizado com sucesso");
      } else if (result.error) {
        toast.error(result.error);
      } else {
        toast.error("Credenciais inválidas");
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Login error:', error);
      }
      toast.error(error?.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 bg-slate-900"
        style={{ backgroundImage: `url(${logoImg})`, backgroundColor: 'rgba(0,0,0,0.6)', backgroundBlendMode: 'overlay' }}
      >
        <div className="flex flex-col items-center">
          <img src={logoTexto} alt="Logo VIDA" className="w-48 mb-8" />
          <div className="text-white text-lg font-medium animate-pulse">Carregando espere...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${logoImg})`, backgroundColor: 'rgba(15, 23, 42, 0.65)', backgroundBlendMode: 'overlay' }}
    >
      <div className="flex flex-col items-center w-full z-10">
        <div className="mb-12">
          <img src={logoTexto} alt="Logo VIDA" className="w-48 drop-shadow-lg" />
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-10 flex flex-col w-full max-w-[480px]"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-500 tracking-widest uppercase inline-block pb-1 relative">
              Conectar
              <span className="absolute bottom-0 left-0 w-14 h-1 bg-pink-400 rounded-full"></span>
            </h1>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <input
              type="email"
              placeholder="E-mail"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-colors pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-pink-500 transition-colors bg-transparent border-none appearance-none outline-none focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            {isChangingPassword && (
              <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 mt-2">
                <p className="text-sm font-medium text-amber-600 mb-1">Criação de nova senha obrigatória</p>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nova senha"
                    className="w-full px-4 py-3 bg-slate-50 border border-amber-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors pr-12"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError("");
                    }}
                    required
                  />
                </div>

                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirmar nova senha"
                    className="w-full px-4 py-3 bg-slate-50 border border-amber-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors pr-12"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError("");
                    }}
                    required
                  />
                </div>

                {passwordError && (
                  <div className="text-rose-500 text-sm font-medium animate-pulse">
                    {passwordError}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center mb-8">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-500 group select-none transition-colors hover:text-slate-700">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-pink-500 focus:ring-pink-500 focus:ring-2 cursor-pointer transition-colors accent-pink-500"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Lembrar-me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-pink-500/30"
          >
            {loading
              ? isChangingPassword
                ? "Trocando senha..."
                : "Entrando..."
              : isChangingPassword
                ? "Trocar senha"
                : "Entrar"}
          </button>
        </form>

        <div className="absolute bottom-16 text-xs tracking-[0.15em] text-white/70 text-center uppercase font-light">
          COPYRIGHT {new Date().getFullYear()} © VIDA | VISUALIZAÇÃO & DADOS EM SAÚDE DA MAMA
        </div>

        <div className="absolute bottom-6 flex items-center justify-center gap-2 text-xs tracking-wider text-white/50 text-center font-light">
          Desenvolvido por Maryângela Soares
          <div className="flex items-center gap-3 ml-2">
            <a href="https://github.com/maryangelasoares" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-opacity">
              <FaGithub size={16} />
            </a>
            <a href="https://instagram.com/maryangelasoares" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-opacity">
              <FaInstagram size={16} />
            </a>
            <a href="https://linkedin.com/in/maryangelasoares" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-opacity">
              <FaLinkedin size={16} />
            </a>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
