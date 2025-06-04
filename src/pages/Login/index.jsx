import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Input from "../../components/Input";
import Button from "../../components/Button";
import logoImg from "../../assets/logo.png";

import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel } from "@mui/material";

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

  const navigate = useNavigate();
  const { login, logged, loading: authLoading } = useAuth();

  useEffect(() => {
    if (logged && !authLoading) {
      navigate("/dashboard");
    }
  }, [logged, navigate, authLoading]);

  useEffect(() => {
    const storedRememberMe = localStorage.getItem("lsRememberMe");
    if (storedRememberMe === "true") {
      setRememberMe(true);
      const storedEmail = localStorage.getItem("username");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lsRememberMe", rememberMe);
    if (rememberMe) {
      localStorage.setItem("username", email);
    } else {
      localStorage.removeItem("username");
    }
  }, [rememberMe, email]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isChangingPassword && newPassword !== confirmPassword) {
        toast.error("As novas senhas não coincidem.");
        setLoading(false);
        return;
      }

      const result = await login(email, password, newPassword);

      if (result?.newPasswordRequired) {
        toast.info("É necessário alterar sua senha.");
        setIsChangingPassword(true);
        return;
      }

      if (result?.success) {
        toast.success("Login realizado com sucesso!");
      } else {
        toast.error(result?.error || "Erro ao fazer login");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error(error.message || "Erro ao fazer login");
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
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </PasswordContainer>

              <PasswordContainer>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirmar nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </PasswordContainer>
            </>
          )}

          <CheckContainer>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  color="primary"
                />
              }
              label="Lembrar-me"
            />
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
