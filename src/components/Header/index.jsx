import React, { useState, useEffect } from "react";
import { HeaderContainer, ButtonCadastro } from "./styles";
import Avatar from "@mui/material/Avatar";
import User from "../../assets/images/users/avatar-5.png";
import Modal from "react-modal";
import { Menu, MenuItem, Box, Button, TextField } from "@mui/material";
import { fetchAuthSession } from 'aws-amplify/auth';
import api from '../../services/api';

Modal.setAppElement("#root");

const Header = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalSenhaIsOpen, setSenhaIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Obter informações da sessão atual
        const { tokens } = await fetchAuthSession();
        if (!tokens) {
          console.error('Usuário não está autenticado');
          return;
        }

        // Extrair informações do token JWT
        const payload = JSON.parse(atob(tokens.accessToken.toString().split('.')[1]));
        setUserName(payload.email || payload.username || 'Usuário');
      } catch (error) {
        console.error("Erro ao buscar detalhes do usuário:", error);
      }
    };

    fetchUser();
  }, []);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openModalSenha() {
    setSenhaIsOpen(true);
  }

  function closeModalSenha() {
    setSenhaIsOpen(false);
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeSenha = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put('/api/usuarios/alterar-senha', {
        senhaAtual,
        novaSenha,
      });
      closeModalSenha();
      alert('Senha alterada com sucesso!');
    } catch (error) {
      alert('Erro ao alterar a senha: ' + (error.response ? error.response.data : error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeaderContainer>
      <Avatar
        alt={userName || "Usuário"}
        src={User}
        sx={{ width: 46, height: 46 }}
        onClick={handleClick}
      />

      {/* Menu do Perfil */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>{userName || "Perfil"}</MenuItem>
        <MenuItem onClick={() => { handleClose(); openModalSenha(); }}>Alterar Senha</MenuItem>
      </Menu>

      {/* Modal de Registro de Pacientes */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Registro de Pacientes"
        ariaHideApp={false}
        appElement={document.getElementById("root")}
        style={{
          overlay: { backgroundColor: "rgba(28, 28, 28, 0.278)" },
          content: {
            border: "none",
            borderRadius: "8px",
            padding: "20px",
          },
        }}
      >
      </Modal>

      {/* Modal de Alterar Senha */}
      <Modal
        isOpen={modalSenhaIsOpen}
        onRequestClose={closeModalSenha}
        contentLabel="Alterar Senha"
        ariaHideApp={false}
        appElement={document.getElementById("root")}
        style={{
          overlay: { backgroundColor: "rgba(28, 28, 28, 0.278)" },
          content: {
            border: "none",
            borderRadius: "8px",
            padding: "0",
            width: "300px",
            height: "300px",
            margin: "auto",
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            color: "#333",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <div className="barra-modal">
            <h3>ALTERAR SENHA</h3>
            <button onClick={closeModalSenha} className="botao-fechar">
              X
            </button>
          </div>

          <form onSubmit={handleChangeSenha}>
            <TextField
              type="password"
              placeholder="Senha Atual"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
            />
            <TextField
              type="password"
              placeholder="Nova Senha"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </form>
        </Box>
      </Modal>

    </HeaderContainer>
  );
};

export default Header;