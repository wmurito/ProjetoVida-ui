import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sanitizeInput } from "../../services/securityConfig";

import Input from "../../components/Input";
import Button from "../../components/Button";
import logoImg from "../../assets/logo.png";

import { Checkbox, CheckboxLabel } from "../../components/UI";

import {
  FaGithub,
  FaInstagram,
  FaLinkedin
} from "react-icons/fa";

import {
  Body,
  Container,
  ImgLogo,
  Form,
  FormTitle,
  Footer,
  FooterDev,
  MenuItemLink,
  CheckContainer,
  PasswordContainer,
  ShowPasswordButton
} from "./styles";

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
      // Usar sessionStorage em vez de localStorage para maior segurança
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
      // Armazenar em sessionStorage em vez de localStorage
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

  // Validação de senha forte
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "A senha deve ter pelo menos 8 caracteres";
    }
    if (!/[A-Z]/.test(password)) {
      return "A senha deve conter pelo menos uma letra maiúscula";
    }
    if (!/[a-z]/.test(password)) {
      return "A senha deve conter pelo menos uma letra minúscula";
    }
    if (!/[0-9]/.test(password)) {
      return "A senha deve conter pelo menos um número";
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return "A senha deve conter pelo menos um caractere especial";
    }
    return "";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sanitizar entradas
      const sanitizedEmail = sanitizeInput(email);

      if (isChangingPassword) {
        // Validar força da senha
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
      <Body>
        <Container>
          <ImgLogo>
            <img src={logoImg} alt="Logo VIDA" />
          </ImgLogo>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Carregando...
          </div>
        </Container>
      </Body>
    );
  }

  return (
    <Body>
      <Container>
        <ImgLogo>
          <img src={logoImg} alt="Logo VIDA" />
        </ImgLogo>

        <Form onSubmit={handleLogin}>
          <FormTitle>Conectar</FormTitle>

          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <PasswordContainer>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <ShowPasswordButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </ShowPasswordButton>
          </PasswordContainer>

          {isChangingPassword && (
            <>
              <PasswordContainer>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nova senha"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError("");
                  }}
                  required
                />
              </PasswordContainer>

              <PasswordContainer>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirmar nova senha"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError("");
                  }}
                  required
                />
              </PasswordContainer>
              
              {passwordError && (
                <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
                  {passwordError}
                </div>
              )}
            </>
          )}

          <CheckContainer>
            <CheckboxLabel>
              <Checkbox
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Lembrar-me
            </CheckboxLabel>
          </CheckContainer>

          <Button type="submit" disabled={loading}>
            {loading
              ? isChangingPassword
                ? "Trocando senha..."
                : "Entrando..."
              : isChangingPassword
              ? "Trocar senha"
              : "Entrar"}
          </Button>
        </Form>

        <Footer>
          COPYRIGHT 2024 © VIDA | VISUALIZAÇÃO & DADOS EM SAÚDE DA MAMA
        </Footer>

        <FooterDev>
          Desenvolvido por Maryângela Soares
          <MenuItemLink
            href="https://github.com/maryangelasoares"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </MenuItemLink>
          <MenuItemLink
            href="https://instagram.com/maryangelasoares"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </MenuItemLink>
          <MenuItemLink
            href="https://linkedin.com/in/maryangelasoares"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </MenuItemLink>
        </FooterDev>
      </Container>
      <ToastContainer />
    </Body>
  );
};

export default Login;