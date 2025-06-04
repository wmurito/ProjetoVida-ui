import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Box, Typography, MenuItem, Alert } from '@mui/material';
import api from '../../services/api';
import { GlobalStyles } from '@mui/system';

const EditModal = ({ isOpen, onClose, pacienteId, onUpdate }) => { // Removemos 'saudeDaMama' e 'onUpdate'
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && pacienteId) {
            setIsLoading(true);
            api.get(`/saude-da-mama/${pacienteId}`)
                .then(response => {
                    setFormData(response.data);
                })
                .catch(error => {
                    setError('Ocorreu um erro ao carregar os dados. Por favor, tente novamente.');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [isOpen, pacienteId]);

     const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Lógica para lidar com a data de óbito quando "Desfecho Morte" é desmarcado
        if (name === 'desfecho_morte' && !checked) {
            setFormData((prevData) => ({
                ...prevData,
                [name]: checked,
                data_obito: null // Define data_obito como null explicitamente
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onUpdate(formData);
        } catch (error) {
            console.error('Erro ao atualizar dados de saúde da mama:', error);
            // TODO: Exibir mensagem de erro ao usuário
        }
    };

    return (

        <>
            {/* Estilos globais para personalizar a barra de rolagem */}
            <GlobalStyles styles={{
                '::-webkit-scrollbar': {
                    width: '8px',
                },
                '::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                },
                '::-webkit-scrollbar-thumb': {
                    background: '#ff7bac',
                    borderRadius: '4px',
                },
                '::-webkit-scrollbar-thumb:hover': {
                    background: '#cfcdcd',
                },
            }}
            />

            <Modal open={isOpen} onClose={onClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: 700,
                        height: 600,
                        overflowY: 'auto',
                        bgcolor: 'background.paper',
                        borderRadius: '8px',
                        boxShadow: 24,
                        p: 4,
                        outline: 'none',
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                            mb: 2,
                            textAlign: 'center',
                            color: '#8A8A8A',
                            letterSpacing: '2px'
                        }}
                    >
                        EDITAR DADOS SAÚDE DA MAMA
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            select
                            label="Tipo de Tumor"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="tipo_tumor"
                            value={formData.tipo_tumor || ''}
                            onChange={handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#8a8a8a',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#FF7BAC',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#8a8a8a',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#8a8a8a',
                                },
                                '&:hover .MuiInputLabel-root': {
                                    color: '#FF7BAC',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#8A8A8A',
                                }
                            }}
                        >
                            <MenuItem value="" disabled>Selecione o tipo de tumor</MenuItem>
                            <MenuItem value="Carcinoma ductal invasivo">Carcinoma ductal invasivo</MenuItem>
                            <MenuItem value="Carcinoma invasivo SOE">Carcinoma invasivo SOE</MenuItem>
                            <MenuItem value="Carcinoma invasivo de tipo não especial">Carcinoma invasivo de tipo não especial</MenuItem>
                            <MenuItem value="Carcinoma lobular invasivo">Carcinoma lobular invasivo</MenuItem>
                            <MenuItem value="Carcinoma tubular invasivo">Carcinoma tubular invasivo</MenuItem>
                            <MenuItem value="Carcinoma medular invasivo">Carcinoma medular invasivo</MenuItem>
                            <MenuItem value="Carcinoma mucinoso invasivo">Carcinoma mucinoso invasivo</MenuItem>
                            <MenuItem value="Carcinoma metaplásico">Carcinoma metaplásico</MenuItem>
                            <MenuItem value="Carcinoma colóide invasivo">Carcinoma colóide invasivo</MenuItem>
                            <MenuItem value="Outros tipos de câncer de mama">Outros tipos de câncer de mama</MenuItem>
                        </TextField>

                        <TextField
                            label="Data do Diagnóstico"
                            type="date"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="data_diagnostico"
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                            value={formData.data_diagnostico ? formData.data_diagnostico.split('T')[0] : ''}
                            onChange={handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#8a8a8a',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#FF7BAC',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#8a8a8a',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#8a8a8a',
                                },
                                '&:hover .MuiInputLabel-root': {
                                    color: '#FF7BAC',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#8A8A8A',
                                }
                            }}
                        />

                        <TextField
                            select
                            label="Estádio do Tumor"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="estadiamento"
                            value={formData.estadiamento || ''}
                            onChange={handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#8a8a8a', // Cor da borda padrão
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#FF7BAC',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#8a8a8a',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#8a8a8a',
                                },
                                '&:hover .MuiInputLabel-root': {
                                    color: '#FF7BAC',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#8A8A8A',
                                }
                            }}
                        >
                            <MenuItem value="" disabled>Selecione o estadiamento</MenuItem>
                            <MenuItem value="Estádio 0">Estádio 0</MenuItem>
                            <MenuItem value="Estádio I">Estádio I</MenuItem>
                            <MenuItem value="Estádio II">Estádio II</MenuItem>
                            <MenuItem value="Estádio III">Estádio III</MenuItem>
                            <MenuItem value="Estádio IV">Estádio IV</MenuItem>
                        </TextField>

                        <TextField
                            select
                            label="Tipo de Cirúrgia"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="tipo_cirurgia"
                            value={formData.tipo_cirurgia || ''}
                            onChange={handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#8a8a8a',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#FF7BAC',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#8a8a8a',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#8a8a8a',
                                },
                                '&:hover .MuiInputLabel-root': {
                                    color: '#FF7BAC',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#8A8A8A',
                                }
                            }}
                        >
                            <MenuItem value="" disabled>Selecione o tipo de cirurgia</MenuItem>
                            <MenuItem value="Mastectomia">Mastectomia</MenuItem>
                            <MenuItem value="Quadrantectomia">Quadrantectomia</MenuItem>
                            <MenuItem value="Setorectomia">Setorectomia</MenuItem>
                            <MenuItem value="Outros">Outros</MenuItem>
                        </TextField>


                        <TextField
                            select
                            label="Tratamento Adjuvância"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="adjuvancia"
                            value={formData.adjuvancia || ''}
                            onChange={handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#8a8a8a',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#FF7BAC',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#8a8a8a',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#8a8a8a',
                                },
                                '&:hover .MuiInputLabel-root': {
                                    color: '#FF7BAC',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#8A8A8A',
                                }
                            }}
                        >
                            <MenuItem value="" disabled>Selecione a adjuvância</MenuItem>
                            <MenuItem value="Quimioterapia">Quimioterapia</MenuItem>
                            <MenuItem value="Radioterapia">Radioterapia</MenuItem>
                            <MenuItem value="Endocrinoterapia">Endocrinoterapia</MenuItem>
                            <MenuItem value="Terapia Alvo">Terapia Alvo</MenuItem>
                            <MenuItem value="Nenhuma">Nenhuma</MenuItem>
                        </TextField>

                        <Box
                            sx={{
                                marginTop: '20px',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: 2,
                            }}
                        >


                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: '#8A8A8A'
                            }}
                            >
                                <input
                                    type="checkbox"
                                    name="remissao"
                                    checked={formData.remissao || false}
                                    onChange={handleChange}
                                    style=
                                    {{
                                        marginRight: '8px',
                                    }}
                                />
                                Remissão
                            </label>


                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: '#8A8A8A'
                            }}
                            >
                                <input
                                    type="checkbox"
                                    name="metastase"
                                    checked={formData.metastase || false}
                                    onChange={handleChange}
                                    style=
                                    {{
                                        marginRight: '8px',
                                    }}
                                />
                                Metástase
                            </label>

                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: '#8A8A8A'
                            }}
                            >
                                <input
                                    type="checkbox"
                                    name="recidiva"
                                    checked={formData.recidiva || false}
                                    onChange={handleChange}
                                    style=
                                    {{
                                        marginRight: '8px',
                                    }}
                                />
                                Recidiva
                            </label>

                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: '#8A8A8A'
                            }}
                            >
                                <input
                                    type="checkbox"
                                    name="recidiva_local"
                                    checked={formData.recidiva_local || false}
                                    onChange={handleChange}
                                    style=
                                    {{
                                        marginRight: '8px',
                                    }}
                                />
                                Recidiva Local
                            </label>

                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: '#8A8A8A'
                            }}
                            >
                                <input
                                    type="checkbox"
                                    name="desfecho_morte"
                                    checked={formData.desfecho_morte || false}
                                    onChange={handleChange}
                                    style=
                                    {{
                                        marginRight: '8px',
                                    }}
                                />
                                Desfecho Morte
                            </label>
                        </Box>

                        <Box sx={{ marginTop: '20px' }}>
                            <TextField
                                label="Data da Morte"
                                type="date"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                name="data_obito"
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                                value={formData.data_obito ? formData.data_obito.split('T')[0] : ''}
                                onChange={handleChange}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#8a8a8a',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#FF7BAC',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#8a8a8a',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#8a8a8a',
                                    },
                                    '&:hover .MuiInputLabel-root': {
                                        color: '#FF7BAC',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#8A8A8A',
                                    }
                                }}
                            />
                        </Box>


                        <Box
                            sx={{
                                margin: '20px',
                                textAlign: 'right'
                            }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    mt: 2,
                                    backgroundColor: '#FF7BAC',
                                    color: 'white',
                                    '&:hover': {
                                        opacity: 0.8
                                    },
                                    marginRight: '10px', 
                                }}
                            >
                                Salvar
                            </Button>

                            <Button
                                type="button"
                                variant="outlined"
                                onClick={onClose}
                                sx={{
                                    mt: 2,
                                    color: 'white',
                                    backgroundColor: '#FF7BAC',
                                    borderColor: 'transparent', 
                                    '&:hover': {
                                        opacity: 0.8
                                    }
                                }}
                            >
                                Fechar
                            </Button>
                        </Box>

                    </form>
                </Box>
            </Modal>
        </>
    );
};

export default EditModal;