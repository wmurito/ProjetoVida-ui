import styled from 'styled-components';

// Layout:
// HE = Header;
// AS = Aside;
// CT = Content;

export const Grid = styled.div`
   display: grid
;
    grid-template-columns: 12rem auto;
    grid-template-rows: 5rem auto;
    grid-template-areas:
        'AS HE'
        'AS CT';
    height: 100vh;

    @media (max-width: 768px) {
        grid-template-columns: 1fr; /* Colunas se tornam uma só */
        grid-template-areas: 
            'HE'
            'AS'
            'CT';
    }
    

    @media (max-width: 480px) {
        grid-template-rows: 50px auto; /* Ajusta a altura do Header para telas menores */
    }
`;
