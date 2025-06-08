import React, { useState, useEffect, useContext } from "react"; // Adicionado useContext
import { HeaderContainer } from "./styles"; // Mantenha suas importações de estilo
import Avatar from "@mui/material/Avatar";
import UserIcon from "../../assets/images/users/avatar-5.png"; // Renomeado para clareza
import Modal from "react-modal"; // Você ainda tem um modal, vamos mantê-lo por enquanto
import { Menu, MenuItem, Box, Button } from "@mui/material"; // Removido TextField
import { fetchAuthSession, signOut } from 'aws-amplify/auth'; // Importar signOut

Modal.setAppElement("#root"); // Certifique-se que #root é o ID do seu elemento raiz da aplicação

const Header = () => {

  const [modalIsOpen, setIsOpen] = useState(false); // Mantido para o modal de registro
  const [anchorEl, setAnchorEl] = useState(null);
  const [userEmail, setUserEmail] = useState(""); // Estado para o e-mail do usuário
  const [loadingLogout, setLoadingLogout] = useState(false); // Estado de loading para logout

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        console.log('[Header] Tentando obter sessão para e-mail...');
        const session = await fetchAuthSession(); // Não precisa de { tokens } aqui se só quer o ID token
        console.log('[Header] Sessão obtida:', session);

        if (session?.tokens?.idToken) { // O e-mail geralmente está no ID Token
          const idTokenPayload = session.tokens.idToken.payload; // Acesso direto ao payload
          console.log('[Header] ID Token Payload:', idTokenPayload);
          setUserEmail(idTokenPayload.email || 'Usuário'); 
        } else if (session?.tokens?.accessToken) { // Fallback para Access Token se necessário
            const accessTokenPayload = session.tokens.accessToken.payload;
            console.warn('[Header] E-mail não encontrado no idToken, tentando accessToken. Access Token Payload:', accessTokenPayload);
            setUserEmail(accessTokenPayload.email || accessTokenPayload.username || 'Usuário');
        }
        else {
          console.warn('[Header] Nenhum token encontrado na sessão para buscar e-mail.');
          setUserEmail('Usuário'); // Fallback
        }
      } catch (error) {
        console.error("[Header] Erro ao buscar e-mail do usuário:", error);
        setUserEmail('Erro ao carregar'); // Indica um erro no UI
      }
    };

    fetchUserEmail();
  }, []); // Roda apenas uma vez na montagem

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  // Removidas funções open/closeModalSenha

  const handleClickAvatar = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };


  return (
    <HeaderContainer>
      <Avatar
        alt={userEmail || "Usuário"} // Mostra o e-mail ou "Usuário"
        src={UserIcon} // Use um ícone genérico ou o avatar do usuário se disponível
        sx={{ width: 46, height: 46, cursor: 'pointer' }} // Adicionado cursor pointer
        onClick={handleClickAvatar}
      />

      {/* Menu do Perfil */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        MenuListProps={{
          "aria-labelledby": "avatar-button", // Pode usar um ID no Avatar se quiser
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {/* Exibe o e-mail do usuário no menu */}
        <MenuItem onClick={handleCloseMenu} sx={{ fontWeight: 'bold' }}>
          {userEmail || "Perfil"}
        </MenuItem>
      </Menu>
    </HeaderContainer>
  );
};

export default Header;