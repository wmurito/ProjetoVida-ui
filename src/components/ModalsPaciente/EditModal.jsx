// EditPacienteFormModal.jsx - PARTE 1

import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Grid, Typography, Checkbox, FormControlLabel,
  FormGroup, Paper, Divider, CircularProgress, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
// Para DatePicker do MUI (opcional, pode usar TextField type="date")
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { ptBR } from 'date-fns/locale';

// --- Funções Helper ---
const nullToEmpty = (value) => value === null || value === undefined ? '' : value;
const nullToFalse = (value) => value === null || value === undefined ? false : value;
const emptyToNull = (value) => (value === '' || value === undefined) ? null : value;
const emptyStringToNullNumber = (value) => {
  const num = parseFloat(value);
  return (value === '' || value === undefined || isNaN(num)) ? null : num;
};
const emptyStringToNullInt = (value) => {
    const num = parseInt(value, 10);
    return (value === '' || value === undefined || isNaN(num)) ? null : num;
};
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  // Tenta converter para objeto Date e depois para YYYY-MM-DD
  try {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return ''; // Data inválida
    return dateObj.toISOString().split('T')[0];
  } catch (e) {
    return ''; // Retorna vazio se houver erro na conversão
  }
};

const EditPacienteFormModal = ({ pacienteInitialData, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    // PacienteBase
    nome_completo: '', idade: '', endereco: '', cidade: '', data_nascimento: null,
    telefone: '', naturalidade: '', altura: '', peso: '', imc: '',
    cor_etnia: '', escolaridade: '', renda_familiar: '',
    // Sub-entidades (inicializadas com todos os campos esperados, mesmo que vazios)
    historia_patologica: { hipertensao: false, hipotireoidismo: false, ansiedade: false, depressao: false, diabetes: false, outros: '' },
    historia_familiar: { cancer_mama: false, parentesco_mama: '', idade_diagnostico_mama: '', cancer_ovario: false, parentesco_ovario: '', idade_diagnostico_ovario: '', outros: '' },
    habitos_vida: { tabagismo_carga: '', tabagismo_tempo_anos: '', etilismo_dose_diaria: '', etilismo_tempo_anos: '' },
    paridade: { gesta: '', para: '', aborto: '', idade_primeiro_filho: '', amamentou: false, tempo_amamentacao_meses: '', menarca_idade: '', menopausa: false, idade_menopausa: '', trh_uso: false, tempo_uso_trh: '', tipo_terapia: '' },
    historia_doenca: { idade_diagnostico: '', score_tyrer_cuzick: '', score_canrisk: '', score_gail: '' },
    histologia: { subtipo_core_re: '', subtipo_core_rp: '', subtipo_core_her2: '', subtipo_core_ki67: '', subtipo_cirurgia_re: '', subtipo_cirurgia_rp: '', subtipo_cirurgia_her2: '', subtipo_cirurgia_ki67: '', tamanho_tumoral: '', grau_tumoral_cirurgia: '', margens_comprometidas: false, margens_local: '', biopsia_linfonodo_sentinela: false, bls_numerador: '', bls_denominador: '', linfadenectomia_axilar: false, ea_numerador: '', ea_denominador: '' },
    tratamento: { tratamento_neoadjuvante: false, inicio_neoadjuvante: null, termino_neoadjuvante: null, qual_neoadjuvante: '', estagio_clinico_pre_qxt: '', imunoterapia: false, adjuvancia: false, quimioterapia: '', inicio_quimioterapia: null, fim_quimioterapia: null, radioterapia_tipo: '', radioterapia_sessoes: '', inicio_radioterapia: null, fim_radioterapia: null, endocrinoterapia: '', inicio_endocrino: null, fim_endocrino: null, terapia_alvo: '', inicio_terapia_alvo: null, fim_terapia_alvo: null },
    desfecho: { morte: false, data_morte: null, causa_morte: '', metastase: false, data_metastase: null, local_metastase: '', recidiva_local: false, data_recidiva_local: null, recidiva_regional: false, data_recidiva_regional: null, sitio_recidiva_regional: '' },
    tempos_diagnostico: { data_mamografia: null, data_usg: null, data_rm: null, data_primeira_consulta: null, data_core_biopsy: null, data_cirurgia: null },
  });
  const [loading, setLoading] = useState(false);
  // const [errors, setErrors] = useState({}); // Validação pode ser adicionada depois

  useEffect(() => {
    if (pacienteInitialData) {
      // Função para popular uma sub-entidade, garantindo que todos os campos existam
      const populateSubEntity = (initialSubData, defaultStructure) => {
        const populated = { ...defaultStructure }; // Começa com a estrutura padrão (todos os campos)
        if (initialSubData) {
          for (const key in defaultStructure) {
            if (initialSubData.hasOwnProperty(key)) {
              // Tratar booleanos e datas especificamente se necessário para o input
              if (typeof defaultStructure[key] === 'boolean') {
                populated[key] = nullToFalse(initialSubData[key]);
              } else if (defaultStructure[key] === null && (key.startsWith('data_') || key.includes('_data') || key.includes('_neoadjuvante') || key.includes('_quimioterapia') || key.includes('_radioterapia') || key.includes('_endocrino') || key.includes('_terapia_alvo'))) {
                 // Para campos de data, inicializa com a string formatada ou ''
                populated[key] = formatDateForInput(initialSubData[key]);
              }
              else {
                populated[key] = nullToEmpty(initialSubData[key]);
              }
            }
          }
        }
        return populated;
      };
      
      setFormData(prev => ({
        ...prev, // Mantém a estrutura padrão das sub-entidades
        nome_completo: nullToEmpty(pacienteInitialData.nome_completo),
        idade: nullToEmpty(pacienteInitialData.idade),
        endereco: nullToEmpty(pacienteInitialData.endereco),
        cidade: nullToEmpty(pacienteInitialData.cidade),
        data_nascimento: formatDateForInput(pacienteInitialData.data_nascimento),
        telefone: nullToEmpty(pacienteInitialData.telefone),
        naturalidade: nullToEmpty(pacienteInitialData.naturalidade),
        altura: nullToEmpty(pacienteInitialData.altura),
        peso: nullToEmpty(pacienteInitialData.peso),
        imc: nullToEmpty(pacienteInitialData.imc),
        cor_etnia: nullToEmpty(pacienteInitialData.cor_etnia),
        escolaridade: nullToEmpty(pacienteInitialData.escolaridade),
        renda_familiar: nullToEmpty(pacienteInitialData.renda_familiar),

        // Popula sub-entidades usando a função helper
        // A estrutura de formData.historia_patologica (etc.) já tem todos os campos
        historia_patologica: populateSubEntity(pacienteInitialData.historia_patologica, prev.historia_patologica),
        historia_familiar: populateSubEntity(pacienteInitialData.historia_familiar, prev.historia_familiar),
        habitos_vida: populateSubEntity(pacienteInitialData.habitos_vida, prev.habitos_vida),
        paridade: populateSubEntity(pacienteInitialData.paridade, prev.paridade),
        historia_doenca: populateSubEntity(pacienteInitialData.historia_doenca, prev.historia_doenca),
        histologia: populateSubEntity(pacienteInitialData.histologia, prev.histologia),
        tratamento: populateSubEntity(pacienteInitialData.tratamento, prev.tratamento),
        desfecho: populateSubEntity(pacienteInitialData.desfecho, prev.desfecho),
        tempos_diagnostico: populateSubEntity(pacienteInitialData.tempos_diagnostico, prev.tempos_diagnostico),
      }));
    }
  }, [pacienteInitialData]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubEntityChange = (entityName, fieldName, value, type = 'text') => {
    // Para checkboxes dentro de sub-entidades
    const val = type === 'checkbox' ? !formData[entityName][fieldName] : value;
    setFormData(prev => ({
      ...prev,
      [entityName]: {
        ...prev[entityName],
        [fieldName]: val,
      },
    }));
  };
  
  const handleDateChange = (entityName, fieldName, dateString) => {
    // Para TextField type="date", o valor já é YYYY-MM-DD string ou ''
    handleSubEntityChange(entityName, fieldName, dateString || null); // Armazena como string ou null
  };
  // Handler para datas de nível superior (ex: data_nascimento)
  const handleTopLevelDateChange = (fieldName, dateString) => {
    setFormData(prev => ({
        ...prev,
        [fieldName]: dateString || null, // Armazena como string ou null
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    // setErrors({}); // Se for implementar validação

    const convertSubEntity = (subEntityData) => {
        if (!subEntityData) return null;
        const converted = {};
        let hasValue = false;
        for (const key in subEntityData) {
            if (typeof subEntityData[key] === 'string' && subEntityData[key].trim() === '') {
                converted[key] = null; // Converte string vazia para null
            } else if (subEntityData[key] !== undefined) { // Mantém booleanos e números
                converted[key] = subEntityData[key];
                if (subEntityData[key] !== null && subEntityData[key] !== false && String(subEntityData[key]).trim() !== '') {
                    hasValue = true;
                }
            }
        }
        return hasValue ? converted : null; // Retorna null se todos os campos forem null/empty/false
    };


    const payload = {
      nome_completo: formData.nome_completo,
      idade: emptyStringToNullInt(formData.idade),
      endereco: emptyToNull(formData.endereco),
      cidade: emptyToNull(formData.cidade),
      data_nascimento: emptyToNull(formData.data_nascimento), // Já deve estar YYYY-MM-DD ou null
      telefone: emptyToNull(formData.telefone),
      naturalidade: emptyToNull(formData.naturalidade),
      altura: emptyStringToNullNumber(formData.altura),
      peso: emptyStringToNullNumber(formData.peso),
      imc: emptyStringToNullNumber(formData.imc),
      cor_etnia: emptyToNull(formData.cor_etnia),
      escolaridade: emptyToNull(formData.escolaridade),
      renda_familiar: emptyToNull(formData.renda_familiar),

      // Lógica do seu backend (delete e recria) simplifica o payload.
      // Basta enviar o objeto da sub-entidade. Se o objeto for enviado (mesmo que
      // com campos null/padrão), o backend tentará o delete/create.
      // Se você não quer que uma sub-entidade seja tocada se não houver mudanças,
      // a lógica de payload precisaria ser mais complexa (comparar com initialData).
      // A abordagem atual assume que, se a seção é editada, você envia os dados dela.
      // Se uma sub-entidade não for fornecida no payload (ou for null), o schema PacienteUpdate
      // do Pydantic a tratará como não presente, e o backend não a processará.
      historia_patologica: convertSubEntity(formData.historia_patologica),
      historia_familiar: convertSubEntity(formData.historia_familiar),
      habitos_vida: convertSubEntity(formData.habitos_vida),
      paridade: convertSubEntity(formData.paridade),
      historia_doenca: convertSubEntity(formData.historia_doenca),
      histologia: convertSubEntity(formData.histologia),
      tratamento: convertSubEntity(formData.tratamento),
      desfecho: convertSubEntity(formData.desfecho),
      tempos_diagnostico: convertSubEntity(formData.tempos_diagnostico),
    };
    
    // Limpar sub-entidades que são null do payload final
    const finalPayload = {};
    for (const key in payload) {
        if (payload[key] !== null) {
            finalPayload[key] = payload[key];
        }
    }


    console.log("Payload final para atualização:", JSON.stringify(finalPayload, null, 2));
    await onSave(finalPayload);
    setLoading(false);
  };

  if (!pacienteInitialData) {
    return <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress /></Box>;
  }
 // EditPacienteFormModal.jsx - PARTE 2 (continuação)

  return (
    // <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}> {/* Se usar DatePicker MUI */}
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, maxHeight: 'calc(90vh - 100px)', overflowY: 'auto' }}> {/* Ajustar maxHeight */}
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
          Editar Paciente: {pacienteInitialData?.nome_completo} (ID: {pacienteInitialData?.paciente_id})
        </Typography>

        {/* --- Dados Pessoais --- */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Dados Pessoais</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField name="nome_completo" label="Nome Completo" value={formData.nome_completo} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField name="idade" label="Idade" type="number" value={formData.idade} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                name="data_nascimento"
                label="Data de Nascimento"
                type="date"
                value={formData.data_nascimento || ''} // O input date espera YYYY-MM-DD ou ''
                onChange={(e) => handleTopLevelDateChange('data_nascimento', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="endereco" label="Endereço" value={formData.endereco} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="cidade" label="Cidade" value={formData.cidade} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="telefone" label="Telefone" value={formData.telefone} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="naturalidade" label="Naturalidade" value={formData.naturalidade} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={3}><TextField name="altura" label="Altura (m)" type="number" inputProps={{ step: "0.01" }} value={formData.altura} onChange={handleChange} fullWidth /></Grid>
            <Grid item xs={12} sm={3}><TextField name="peso" label="Peso (kg)" type="number" inputProps={{ step: "0.1" }} value={formData.peso} onChange={handleChange} fullWidth /></Grid>
            <Grid item xs={12} sm={3}><TextField name="imc" label="IMC" type="number" inputProps={{ step: "0.1" }} value={formData.imc} onChange={handleChange} fullWidth /></Grid>
            <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                    <InputLabel id="cor-etnia-label">Cor/Etnia</InputLabel>
                    <Select
                        labelId="cor-etnia-label"
                        name="cor_etnia"
                        value={formData.cor_etnia}
                        label="Cor/Etnia"
                        onChange={handleChange}
                    >
                        <MenuItem value=""><em>Não informado</em></MenuItem>
                        <MenuItem value="Branca">Branca</MenuItem>
                        <MenuItem value="Parda">Parda</MenuItem>
                        <MenuItem value="Preta">Preta</MenuItem>
                        <MenuItem value="Amarela">Amarela</MenuItem>
                        <MenuItem value="Indigena">Indígena</MenuItem>
                        <MenuItem value="Outra">Outra</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
             <Grid item xs={12} sm={6}><TextField name="escolaridade" label="Escolaridade" value={formData.escolaridade} onChange={handleChange} fullWidth /></Grid>
             <Grid item xs={12} sm={6}><TextField name="renda_familiar" label="Renda Familiar" value={formData.renda_familiar} onChange={handleChange} fullWidth /></Grid>
          </Grid>
        </Paper>

        {/* --- História Patológica --- */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>História Patológica Pregressa</Typography>
          <FormGroup>
            <Grid container spacing={1}>
                {[
                    { label: 'Hipertensão', name: 'hipertensao' },
                    { label: 'Hipotireoidismo', name: 'hipotireoidismo' },
                    { label: 'Ansiedade', name: 'ansiedade' },
                    { label: 'Depressão', name: 'depressao' },
                    { label: 'Diabetes', name: 'diabetes' },
                ].map(item => (
                    <Grid item xs={12} sm={4} md={2.4} key={item.name}> {/* 5 items per row on md */}
                        <FormControlLabel
                            control={<Checkbox checked={formData.historia_patologica[item.name] || false} onChange={(e) => handleSubEntityChange('historia_patologica', item.name, '', 'checkbox')} />}
                            label={item.label}
                        />
                    </Grid>
                ))}
            </Grid>
            <TextField
              label="Outras Patologias"
              value={formData.historia_patologica.outros}
              onChange={(e) => handleSubEntityChange('historia_patologica', 'outros', e.target.value)}
              fullWidth margin="normal" multiline rows={2}
            />
          </FormGroup>
        </Paper>
        
        {/* --- História Familiar --- */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>História Familiar de Câncer</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <FormControlLabel control={<Checkbox checked={formData.historia_familiar.cancer_mama || false} onChange={(e) => handleSubEntityChange('historia_familiar', 'cancer_mama', '', 'checkbox')} />} label="Câncer de Mama na Família" />
                </Grid>
                <Grid item xs={12} sm={4}><TextField label="Parentesco (Mama)" value={formData.historia_familiar.parentesco_mama} onChange={(e) => handleSubEntityChange('historia_familiar', 'parentesco_mama', e.target.value)} fullWidth /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Idade Diag. (Mama)" type="number" value={formData.historia_familiar.idade_diagnostico_mama} onChange={(e) => handleSubEntityChange('historia_familiar', 'idade_diagnostico_mama', e.target.value)} fullWidth /></Grid>
                
                <Grid item xs={12} sm={4}>
                    <FormControlLabel control={<Checkbox checked={formData.historia_familiar.cancer_ovario || false} onChange={(e) => handleSubEntityChange('historia_familiar', 'cancer_ovario', '', 'checkbox')} />} label="Câncer de Ovário na Família" />
                </Grid>
                <Grid item xs={12} sm={4}><TextField label="Parentesco (Ovário)" value={formData.historia_familiar.parentesco_ovario} onChange={(e) => handleSubEntityChange('historia_familiar', 'parentesco_ovario', e.target.value)} fullWidth /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Idade Diag. (Ovário)" type="number" value={formData.historia_familiar.idade_diagnostico_ovario} onChange={(e) => handleSubEntityChange('historia_familiar', 'idade_diagnostico_ovario', e.target.value)} fullWidth /></Grid>
                
                <Grid item xs={12}>
                    <TextField label="Outros Cânceres (Família)" value={formData.historia_familiar.outros} onChange={(e) => handleSubEntityChange('historia_familiar', 'outros', e.target.value)} fullWidth multiline rows={2} />
                </Grid>
            </Grid>
        </Paper>
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>História da Doença Atual</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                    <TextField label="Idade no Diagnóstico" type="number" value={formData.historia_doenca.idade_diagnostico} onChange={(e) => handleSubEntityChange('historia_doenca', 'idade_diagnostico', e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField label="Score Gail (%)" type="number" inputProps={{ step: "0.01" }} value={formData.historia_doenca.score_gail} onChange={(e) => handleSubEntityChange('historia_doenca', 'score_gail', e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField label="Score Tyrer-Cuzick (%)" type="number" inputProps={{ step: "0.01" }} value={formData.historia_doenca.score_tyrer_cuzick} onChange={(e) => handleSubEntityChange('historia_doenca', 'score_tyrer_cuzick', e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField label="Score CanRisk (%)" type="number" inputProps={{ step: "0.01" }} value={formData.historia_doenca.score_canrisk} onChange={(e) => handleSubEntityChange('historia_doenca', 'score_canrisk', e.target.value)} fullWidth />
                </Grid>
            </Grid>
        </Paper>
        
        {/* Exemplo de seção mais complexa: Tratamento (com datas) */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Tratamento</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <FormControlLabel control={<Checkbox checked={formData.tratamento.tratamento_neoadjuvante || false} onChange={(e) => handleSubEntityChange('tratamento', 'tratamento_neoadjuvante', '', 'checkbox')} />} label="Realizou Tratamento Neoadjuvante" />
                </Grid>
                 <Grid item xs={12} sm={6}>
                    <TextField label="Qual Neoadjuvante" value={formData.tratamento.qual_neoadjuvante} onChange={(e) => handleSubEntityChange('tratamento', 'qual_neoadjuvante', e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="Início Neoadjuvante" type="date" value={formData.tratamento.inicio_neoadjuvante || ''} onChange={(e) => handleDateChange('tratamento', 'inicio_neoadjuvante', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="Término Neoadjuvante" type="date" value={formData.tratamento.termino_neoadjuvante || ''} onChange={(e) => handleDateChange('tratamento', 'termino_neoadjuvante', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={6}><TextField label="Estágio Clínico Pré-QXT" value={formData.tratamento.estagio_clinico_pre_qxt} onChange={(e) => handleSubEntityChange('tratamento', 'estagio_clinico_pre_qxt', e.target.value)} fullWidth /></Grid>
                {/* ... mais campos de Tratamento ... */}
            </Grid>
        </Paper>
        {/* --- Hábitos de Vida --- */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Hábitos de Vida</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField label="Tabagismo (Carga Maços/Ano)" type="number" value={formData.habitos_vida.tabagismo_carga} onChange={(e) => handleSubEntityChange('habitos_vida', 'tabagismo_carga', e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField label="Tabagismo (Tempo Anos)" type="number" value={formData.habitos_vida.tabagismo_tempo_anos} onChange={(e) => handleSubEntityChange('habitos_vida', 'tabagismo_tempo_anos', e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField label="Etilismo (Dose Diária)" value={formData.habitos_vida.etilismo_dose_diaria} onChange={(e) => handleSubEntityChange('habitos_vida', 'etilismo_dose_diaria', e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField label="Etilismo (Tempo Anos)" type="number" value={formData.habitos_vida.etilismo_tempo_anos} onChange={(e) => handleSubEntityChange('habitos_vida', 'etilismo_tempo_anos', e.target.value)} fullWidth />
                </Grid>
            </Grid>
        </Paper>

        {/* --- Paridade e História Ginecológica --- */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Paridade e História Ginecológica</Typography>
            <Grid container spacing={2}>
                <Grid item xs={6} sm={3}><TextField label="Gesta" type="number" value={formData.paridade.gesta} onChange={(e) => handleSubEntityChange('paridade', 'gesta', e.target.value)} fullWidth /></Grid>
                <Grid item xs={6} sm={3}><TextField label="Para" type="number" value={formData.paridade.para} onChange={(e) => handleSubEntityChange('paridade', 'para', e.target.value)} fullWidth /></Grid>
                <Grid item xs={6} sm={3}><TextField label="Aborto" type="number" value={formData.paridade.aborto} onChange={(e) => handleSubEntityChange('paridade', 'aborto', e.target.value)} fullWidth /></Grid>
                <Grid item xs={6} sm={3}><TextField label="Idade Primeiro Filho" type="number" value={formData.paridade.idade_primeiro_filho} onChange={(e) => handleSubEntityChange('paridade', 'idade_primeiro_filho', e.target.value)} fullWidth /></Grid>
                
                <Grid item xs={12} sm={6}><FormControlLabel control={<Checkbox checked={formData.paridade.amamentou || false} onChange={(e) => handleSubEntityChange('paridade', 'amamentou', '', 'checkbox')} />} label="Amamentou" /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Tempo Amamentação (Meses)" type="number" value={formData.paridade.tempo_amamentacao_meses} onChange={(e) => handleSubEntityChange('paridade', 'tempo_amamentacao_meses', e.target.value)} fullWidth /></Grid>

                <Grid item xs={12} sm={4}><TextField label="Idade Menarca" type="number" value={formData.paridade.menarca_idade} onChange={(e) => handleSubEntityChange('paridade', 'menarca_idade', e.target.value)} fullWidth /></Grid>
                <Grid item xs={12} sm={4}><FormControlLabel control={<Checkbox checked={formData.paridade.menopausa || false} onChange={(e) => handleSubEntityChange('paridade', 'menopausa', '', 'checkbox')} />} label="Menopausa" /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Idade Menopausa" type="number" value={formData.paridade.idade_menopausa} onChange={(e) => handleSubEntityChange('paridade', 'idade_menopausa', e.target.value)} fullWidth /></Grid>

                <Grid item xs={12} sm={4}><FormControlLabel control={<Checkbox checked={formData.paridade.trh_uso || false} onChange={(e) => handleSubEntityChange('paridade', 'trh_uso', '', 'checkbox')} />} label="Uso de TRH" /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Tempo Uso TRH (Anos)" type="number" value={formData.paridade.tempo_uso_trh} onChange={(e) => handleSubEntityChange('paridade', 'tempo_uso_trh', e.target.value)} fullWidth /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Tipo Terapia (TRH)" value={formData.paridade.tipo_terapia} onChange={(e) => handleSubEntityChange('paridade', 'tipo_terapia', e.target.value)} fullWidth /></Grid>
            </Grid>
        </Paper>

        {/* --- Histologia --- */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Histologia</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}><Typography variant="subtitle1">Subtipo Core Biopsy</Typography></Grid>
                <Grid item xs={6} sm={3}><TextField label="RE (Core)" value={formData.histologia.subtipo_core_re} onChange={(e) => handleSubEntityChange('histologia', 'subtipo_core_re', e.target.value)} fullWidth /></Grid>
                <Grid item xs={6} sm={3}><TextField label="RP (Core)" value={formData.histologia.subtipo_core_rp} onChange={(e) => handleSubEntityChange('histologia', 'subtipo_core_rp', e.target.value)} fullWidth /></Grid>
                <Grid item xs={6} sm={3}><TextField label="HER2 (Core)" value={formData.histologia.subtipo_core_her2} onChange={(e) => handleSubEntityChange('histologia', 'subtipo_core_her2', e.target.value)} fullWidth /></Grid>
                <Grid item xs={6} sm={3}><TextField label="Ki67 (Core)" value={formData.histologia.subtipo_core_ki67} onChange={(e) => handleSubEntityChange('histologia', 'subtipo_core_ki67', e.target.value)} fullWidth /></Grid>

                <Grid item xs={12} sx={{mt:1}}><Typography variant="subtitle1">Subtipo Cirurgia</Typography></Grid>
                <Grid item xs={6} sm={3}><TextField label="RE (Cirurgia)" value={formData.histologia.subtipo_cirurgia_re} onChange={(e) => handleSubEntityChange('histologia', 'subtipo_cirurgia_re', e.target.value)} fullWidth /></Grid>
                <Grid item xs={6} sm={3}><TextField label="RP (Cirurgia)" value={formData.histologia.subtipo_cirurgia_rp} onChange={(e) => handleSubEntityChange('histologia', 'subtipo_cirurgia_rp', e.target.value)} fullWidth /></Grid>
                <Grid item xs={6} sm={3}><TextField label="HER2 (Cirurgia)" value={formData.histologia.subtipo_cirurgia_her2} onChange={(e) => handleSubEntityChange('histologia', 'subtipo_cirurgia_her2', e.target.value)} fullWidth /></Grid>
                <Grid item xs={6} sm={3}><TextField label="Ki67 (Cirurgia)" value={formData.histologia.subtipo_cirurgia_ki67} onChange={(e) => handleSubEntityChange('histologia', 'subtipo_cirurgia_ki67', e.target.value)} fullWidth /></Grid>

                <Grid item xs={12} sm={4}><TextField label="Tamanho Tumoral (cm)" type="number" inputProps={{ step: "0.1" }} value={formData.histologia.tamanho_tumoral} onChange={(e) => handleSubEntityChange('histologia', 'tamanho_tumoral', e.target.value)} fullWidth /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Grau Tumoral (Cirurgia)" value={formData.histologia.grau_tumoral_cirurgia} onChange={(e) => handleSubEntityChange('histologia', 'grau_tumoral_cirurgia', e.target.value)} fullWidth /></Grid>
                <Grid item xs={12} sm={4}><FormControlLabel control={<Checkbox checked={formData.histologia.margens_comprometidas || false} onChange={(e) => handleSubEntityChange('histologia', 'margens_comprometidas', '', 'checkbox')} />} label="Margens Comprometidas" /></Grid>
                <Grid item xs={12}><TextField label="Local Margens Comprometidas" value={formData.histologia.margens_local} onChange={(e) => handleSubEntityChange('histologia', 'margens_local', e.target.value)} fullWidth /></Grid>

                <Grid item xs={12} sm={6}><FormControlLabel control={<Checkbox checked={formData.histologia.biopsia_linfonodo_sentinela || false} onChange={(e) => handleSubEntityChange('histologia', 'biopsia_linfonodo_sentinela', '', 'checkbox')} />} label="Biópsia Linfonodo Sentinela" /></Grid>
                <Grid item xs={3} sm={1.5}><TextField label="BLS Num." type="number" value={formData.histologia.bls_numerador} onChange={(e) => handleSubEntityChange('histologia', 'bls_numerador', e.target.value)} fullWidth /></Grid>
                <Grid item xs={3} sm={1.5}><TextField label="BLS Den." type="number" value={formData.histologia.bls_denominador} onChange={(e) => handleSubEntityChange('histologia', 'bls_denominador', e.target.value)} fullWidth /></Grid>
                
                <Grid item xs={12} sm={6}><FormControlLabel control={<Checkbox checked={formData.histologia.linfadenectomia_axilar || false} onChange={(e) => handleSubEntityChange('histologia', 'linfadenectomia_axilar', '', 'checkbox')} />} label="Linfadenectomia Axilar" /></Grid>
                <Grid item xs={3} sm={1.5}><TextField label="EA Num." type="number" value={formData.histologia.ea_numerador} onChange={(e) => handleSubEntityChange('histologia', 'ea_numerador', e.target.value)} fullWidth /></Grid>
                <Grid item xs={3} sm={1.5}><TextField label="EA Den." type="number" value={formData.histologia.ea_denominador} onChange={(e) => handleSubEntityChange('histologia', 'ea_denominador', e.target.value)} fullWidth /></Grid>
            </Grid>
        </Paper>
        
        {/* Seção Tratamento já foi exemplificada na Parte 2, mas aqui está mais completa */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Tratamento</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}><FormControlLabel control={<Checkbox checked={formData.tratamento.tratamento_neoadjuvante || false} onChange={(e) => handleSubEntityChange('tratamento', 'tratamento_neoadjuvante', '', 'checkbox')} />} label="Tratamento Neoadjuvante" /></Grid>
                <Grid item xs={12} sm={6} md={4}><TextField label="Início Neoadjuvante" type="date" value={formData.tratamento.inicio_neoadjuvante || ''} onChange={(e) => handleDateChange('tratamento', 'inicio_neoadjuvante', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={12} sm={6} md={4}><TextField label="Término Neoadjuvante" type="date" value={formData.tratamento.termino_neoadjuvante || ''} onChange={(e) => handleDateChange('tratamento', 'termino_neoadjuvante', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Qual Neoadjuvante" value={formData.tratamento.qual_neoadjuvante} onChange={(e) => handleSubEntityChange('tratamento', 'qual_neoadjuvante', e.target.value)} fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Estágio Clínico Pré-QXT" value={formData.tratamento.estagio_clinico_pre_qxt} onChange={(e) => handleSubEntityChange('tratamento', 'estagio_clinico_pre_qxt', e.target.value)} fullWidth /></Grid>
                
                <Grid item xs={12} sm={6} md={4}><FormControlLabel control={<Checkbox checked={formData.tratamento.imunoterapia || false} onChange={(e) => handleSubEntityChange('tratamento', 'imunoterapia', '', 'checkbox')} />} label="Imunoterapia" /></Grid>
                <Grid item xs={12} sm={6} md={4}><FormControlLabel control={<Checkbox checked={formData.tratamento.adjuvancia || false} onChange={(e) => handleSubEntityChange('tratamento', 'adjuvancia', '', 'checkbox')} />} label="Adjuvância" /></Grid>
                
                <Grid item xs={12}><Typography variant="subtitle2" sx={{mt:1}}>Quimioterapia Adjuvante</Typography></Grid>
                <Grid item xs={12} sm={4}><TextField label="Esquema QT" value={formData.tratamento.quimioterapia} onChange={(e) => handleSubEntityChange('tratamento', 'quimioterapia', e.target.value)} fullWidth /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Início QT" type="date" value={formData.tratamento.inicio_quimioterapia || ''} onChange={(e) => handleDateChange('tratamento', 'inicio_quimioterapia', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Fim QT" type="date" value={formData.tratamento.fim_quimioterapia || ''} onChange={(e) => handleDateChange('tratamento', 'fim_quimioterapia', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>

                <Grid item xs={12}><Typography variant="subtitle2" sx={{mt:1}}>Radioterapia</Typography></Grid>
                <Grid item xs={12} sm={4}><TextField label="Tipo RT" value={formData.tratamento.radioterapia_tipo} onChange={(e) => handleSubEntityChange('tratamento', 'radioterapia_tipo', e.target.value)} fullWidth /></Grid>
                <Grid item xs={12} sm={2}><TextField label="Sessões RT" type="number" value={formData.tratamento.radioterapia_sessoes} onChange={(e) => handleSubEntityChange('tratamento', 'radioterapia_sessoes', e.target.value)} fullWidth /></Grid>
                <Grid item xs={12} sm={3}><TextField label="Início RT" type="date" value={formData.tratamento.inicio_radioterapia || ''} onChange={(e) => handleDateChange('tratamento', 'inicio_radioterapia', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={12} sm={3}><TextField label="Fim RT" type="date" value={formData.tratamento.fim_radioterapia || ''} onChange={(e) => handleDateChange('tratamento', 'fim_radioterapia', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>

                <Grid item xs={12}><Typography variant="subtitle2" sx={{mt:1}}>Endocrinoterapia</Typography></Grid>
                <Grid item xs={12} sm={4}><TextField label="Esquema Endocrino" value={formData.tratamento.endocrinoterapia} onChange={(e) => handleSubEntityChange('tratamento', 'endocrinoterapia', e.target.value)} fullWidth /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Início Endocrino" type="date" value={formData.tratamento.inicio_endocrino || ''} onChange={(e) => handleDateChange('tratamento', 'inicio_endocrino', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Fim Endocrino" type="date" value={formData.tratamento.fim_endocrino || ''} onChange={(e) => handleDateChange('tratamento', 'fim_endocrino', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>

                <Grid item xs={12}><Typography variant="subtitle2" sx={{mt:1}}>Terapia Alvo</Typography></Grid>
                <Grid item xs={12} sm={4}><TextField label="Esquema Terapia Alvo" value={formData.tratamento.terapia_alvo} onChange={(e) => handleSubEntityChange('tratamento', 'terapia_alvo', e.target.value)} fullWidth /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Início Terapia Alvo" type="date" value={formData.tratamento.inicio_terapia_alvo || ''} onChange={(e) => handleDateChange('tratamento', 'inicio_terapia_alvo', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Fim Terapia Alvo" type="date" value={formData.tratamento.fim_terapia_alvo || ''} onChange={(e) => handleDateChange('tratamento', 'fim_terapia_alvo', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
            </Grid>
        </Paper>

        {/* --- Desfecho --- */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Desfecho Clínico</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}><FormControlLabel control={<Checkbox checked={formData.desfecho.morte || false} onChange={(e) => handleSubEntityChange('desfecho', 'morte', '', 'checkbox')} />} label="Óbito" /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Data do Óbito" type="date" value={formData.desfecho.data_morte || ''} onChange={(e) => handleDateChange('desfecho', 'data_morte', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Causa do Óbito" value={formData.desfecho.causa_morte} onChange={(e) => handleSubEntityChange('desfecho', 'causa_morte', e.target.value)} fullWidth /></Grid>

                <Grid item xs={12} sm={4}><FormControlLabel control={<Checkbox checked={formData.desfecho.metastase || false} onChange={(e) => handleSubEntityChange('desfecho', 'metastase', '', 'checkbox')} />} label="Metástase à Distância" /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Data da Metástase" type="date" value={formData.desfecho.data_metastase || ''} onChange={(e) => handleDateChange('desfecho', 'data_metastase', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Local da Metástase" value={formData.desfecho.local_metastase} onChange={(e) => handleSubEntityChange('desfecho', 'local_metastase', e.target.value)} fullWidth /></Grid>

                <Grid item xs={12} sm={4}><FormControlLabel control={<Checkbox checked={formData.desfecho.recidiva_local || false} onChange={(e) => handleSubEntityChange('desfecho', 'recidiva_local', '', 'checkbox')} />} label="Recidiva Local" /></Grid>
                <Grid item xs={12} sm={8}><TextField label="Data Recidiva Local" type="date" value={formData.desfecho.data_recidiva_local || ''} onChange={(e) => handleDateChange('desfecho', 'data_recidiva_local', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
                
                <Grid item xs={12} sm={4}><FormControlLabel control={<Checkbox checked={formData.desfecho.recidiva_regional || false} onChange={(e) => handleSubEntityChange('desfecho', 'recidiva_regional', '', 'checkbox')} />} label="Recidiva Regional" /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Data Recidiva Regional" type="date" value={formData.desfecho.data_recidiva_regional || ''} onChange={(e) => handleDateChange('desfecho', 'data_recidiva_regional', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Sítio Recidiva Regional" value={formData.desfecho.sitio_recidiva_regional} onChange={(e) => handleSubEntityChange('desfecho', 'sitio_recidiva_regional', e.target.value)} fullWidth /></Grid>
            </Grid>
        </Paper>

        {/* --- Tempos de Diagnóstico e Tratamento --- */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Tempos de Diagnóstico e Tratamento</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}><TextField label="Data Mamografia" type="date" value={formData.tempos_diagnostico.data_mamografia || ''} onChange={(e) => handleDateChange('tempos_diagnostico', 'data_mamografia', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Data USG" type="date" value={formData.tempos_diagnostico.data_usg || ''} onChange={(e) => handleDateChange('tempos_diagnostico', 'data_usg', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Data RM" type="date" value={formData.tempos_diagnostico.data_rm || ''} onChange={(e) => handleDateChange('tempos_diagnostico', 'data_rm', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Data Primeira Consulta" type="date" value={formData.tempos_diagnostico.data_primeira_consulta || ''} onChange={(e) => handleDateChange('tempos_diagnostico', 'data_primeira_consulta', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Data Core Biopsy" type="date" value={formData.tempos_diagnostico.data_core_biopsy || ''} onChange={(e) => handleDateChange('tempos_diagnostico', 'data_core_biopsy', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Data Cirurgia" type="date" value={formData.tempos_diagnostico.data_cirurgia || ''} onChange={(e) => handleDateChange('tempos_diagnostico', 'data_cirurgia', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
            </Grid>
        </Paper>

        {/* Botões de Ação (já estavam na Parte 1, mas repetindo para o final do formulário) */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} color="secondary" variant="outlined" disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Salvar Alterações'}
          </Button>
        </Box>
      </Box>
  );
};

export default EditPacienteFormModal; 