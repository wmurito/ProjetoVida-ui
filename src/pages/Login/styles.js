import styled from 'styled-components';
import vida from "../../assets/logovida.png";

export const Body = styled.div`
  background-image: url(${vida});
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

`;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
`;

export const ImgLogo = styled.div`
margin-bottom: 3rem;

    img {
        width: 12rem;;
    }
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30rem;
    height: 22rem;
    padding: 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.22);
    border-radius: 10px;
    background-color: #fFF;
`;

export const FormTitle = styled.h1`
    letter-spacing: 2px;
    color: #8a8a8a; 
    margin-right: 12rem;

    &:after {
        content: '';
        display: block;
        width: 55px;
        border-bottom: 2px solid #ff7bac;
    }
`;

export const Footer = styled.div`
    position: absolute;
    margin-bottom: 18px;
    bottom: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    letter-spacing: 2px;
    color: #8A8A8A;
`;

export const FooterDev = styled.div`
    position: absolute;
    bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    letter-spacing: 2px;
    color: #8A8A8A;
`;

export const MenuItemLink = styled.a`
    color: #8A8A8A;
    text-decoration: none;
    padding: 10px;
    margin: 7px 0;

    transition: opacity .3s;

    &:hover {
        opacity: .7;
    }

    a {
    color: inherit; 
    margin: 0 2px; 
    text-decoration: none; 
        }
            a:hover, a:focus {
            color: inherit; 
            }
                a:active {
                color: inherit; 
                }
`;

export const CheckContainer = styled.div ` 
    display: flex;
    align-self: center;
    margin-right: 16rem;

    label {
        color: #8a8a8a !important;
        font-size: .875rem;
        align-self: center;
        margin-left: 5px;
    }
`;

export const InputCheck = styled.input.attrs({ type: 'checkbox' })`
  color: #8a8a8a !important;
  -webkit-appearance: checkbox;
  -moz-appearance: checkbox;
  appearance: checkbox;
  display: flex;
  align-items: center;
  width: auto;

  /* Estilos quando marcado */
  &:checked {
    accent-color: #FF7BAC;
  }
`;

export const PasswordContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
`;

export const ShowPasswordButton = styled.button`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: #ff7bac;
`;

