import styled from 'styled-components';

// Layout:
// AS = Aside;
// CT = Content;

export const Grid = styled.div`
   display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: 'AS CT';
    height: 100vh;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        grid-template-areas: 
            'AS'
            'CT';
    }
`;