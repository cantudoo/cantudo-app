import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  FlatList, 
  Animated, 
  ActivityIndicator, 
  SafeAreaView, 
  StatusBar,
  Modal
} from 'react-native';

// --- ICONES MOCKADOS (Para evitar dependências externas que quebram a nuvem) ---
const HomeIcon = ({ color }: { color: string }) => <Text style={{ color, fontSize: 20, fontWeight: 'bold' }}>🏠</Text>;
const ChatIcon = ({ color }: { color: string }) => <Text style={{ color, fontSize: 20, fontWeight: 'bold' }}>💬</Text>;
const FinanceIcon = ({ color }: { color: string }) => <Text style={{ color, fontSize: 20, fontWeight: 'bold' }}>💲</Text>;

export default function App() {
  // Gerência de Estados Globais
  const [currentScreen, setCurrentScreen] = useState<'LOGIN' | 'MAIN'>('LOGIN');
  const [currentTab, setCurrentTab] = useState<'HOME' | 'CHAT' | 'FINANCE'>('HOME');
  const [userProfile, setUserProfile] = useState<'RESIDENTIAL' | 'CORPORATE'>('RESIDENTIAL');
  const [userName, setUserName] = useState('Cliente CanTudo');
  const [inputValue, setInputValue] = useState('');
  const [isInputValid, setIsInputValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados específicos do fluxo do app
  const [photoAttached, setPhotoAttached] = useState(false);
  const [ticketDescription, setTicketDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [budgetStatus, setBudgetStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  // Animação de pulsação da Logo
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (currentScreen === 'LOGIN') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 1500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1.0, duration: 1500, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [currentScreen]);

  // Validação básica do Input de Login
  const handleInputChange = (text: string) => {
    setInputValue(text);
    if (text.length === 0) {
      setIsInputValid(null);
    } else {
      setIsInputValid(text.length >= 5);
    }
  };

  // Fluxo Simulador de Login / Chaveamento Inteligente
  const handleLogin = (type: 'RESIDENTIAL' | 'CORPORATE') => {
    if (inputValue.length < 5) {
      setIsInputValid(false);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUserProfile(type);
      setUserName(type === 'RESIDENTIAL' ? 'Carlos Alberto' : 'Condomínio Spazio');
      setCurrentScreen('MAIN');
      setCurrentTab('HOME');
    }, 1500);
  };

  // Dados Mockados para Histórico Corporativo
  const historyMock = [
    { id: '1', date: '19/06/2026', technician: 'Alex Silva', status: 'Concluído' },
    { id: '2', date: '28/05/2026', technician: 'Carlos Souza', status: 'Concluído' },
  ];

  // --- SUB-TELA: LOGIN ---
  const renderLoginScreen = () => (
    <View style={styles.loginContainer}>
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
        <View style={styles.logoGlow}>
          <Text style={styles.logoText}>CT</Text>
        </View>
      </Animated.View>

      <Text style={styles.brandTitle}>CanTudo <Text style={styles.cyanText}>&lt;TECH INFO&gt;</Text></Text>
      <Text style={styles.brandSubtitle}>Infraestrutura de Redes e CFTV de Alta Performance</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>CPF, CNPJ ou E-mail</Text>
        <TextInput
          style={[
            styles.textInput,
            isInputValid === true && { borderColor: '#00E5FF' },
            isInputValid === false && { borderColor: '#FF3B30' }
          ]}
          placeholder="Digite suas credenciais"
          placeholderTextColor="#666666"
          value={inputValue}
          onChangeText={handleInputChange}
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.gradientButton} onPress={() => handleLogin('RESIDENTIAL')}>
        {loading ? <ActivityIndicator color="#00E5FF" /> : <Text style={styles.buttonText}>Entrar como Residencial</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.gradientButton, { backgroundColor: '#0033aa', marginTop: 12 }]} onPress={() => handleLogin('CORPORATE')}>
        {loading ? <ActivityIndicator color="#00E5FF" /> : <Text style={styles.buttonText}>Entrar como Corporativo</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.visitorButton} onPress={() => { setInputValue('visitante@cantudo.com'); setIsInputValid(true); }}>
        <Text style={styles.visitorText}>Solicitar Atendimento Roteado (Visitante)</Text>
      </TouchableOpacity>
    </View>
  );

  // --- SUB-TELA: DASHBOARD INTERACTIVE ---
  const renderDashboardTab = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.profileHeader}>
        <View>
          <Text style={styles.welcomeText}>Olá, {userName}!</Text>
          <Text style={styles.profileTag}>{userProfile === 'RESIDENTIAL' ? '💎 CONTRATO VAREJO / RESIDENCIAL' : '🏢 CONTRATO CORPORATIVO'}</Text>
        </View>
        <TouchableOpacity style={styles.switchButton} onPress={() => setUserProfile(userProfile === 'RESIDENTIAL' ? 'CORPORATE' : 'RESIDENTIAL')}>
          <Text style={styles.switchButtonText}>Alternar Perfil</Text>
        </TouchableOpacity>
      </View>

      {userProfile === 'RESIDENTIAL' ? (
        // VISÃO A: RESIDENCIAL
        <View>
          <View style={styles.cardSecondary}>
            <Text style={styles.cardTitleHighlight}>Acompanhar meu Reparo de Hardware</Text>
            <Text style={styles.cardMetaText}>Equipamento: Notebook Dell Inspiron Nvme 1TB</Text>
            
            {/* Stepper Horizontal */}
            <View style={styles.stepperContainer}>
              <View style={styles.stepUnit}><Text style={styles.stepChecked}>✓ Análise</Text></View>
              <View style={styles.stepUnit}><Text style={styles.stepActive}>➔ Teste Ativo</Text></View>
              <View style={styles.stepUnit}><Text style={styles.stepPending}>Retirada</Text></View>
            </View>
          </View>

          <Text style={styles.sectionHeading}>Agendar Nova Instalação</Text>
          <View style={styles.gridContainer}>
            {['Fechaduras Eletrônicas', 'Redes Wi-Fi 6 Mesh', 'Câmeras Residenciais IP'].map((item, index) => (
              <TouchableOpacity key={index} style={styles.gridCard} onPress={() => alert(`Agendamento solicitado para: ${item}`)}>
                <Text style={styles.gridCardText}>🛠️ {item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        // VISÃO B: CORPORATIVO
        <View>
          <View style={styles.cardSecondary}>
            <Text style={styles.cardTitleHighlight}>Abrir Chamado Técnico (Ticket)</Text>
            <Text style={styles.inputLabel}>Setor da Ocorrência</Text>
            <Text style={styles.cardMetaText}>📍 Rack Central de Redes / Câmeras Avany</Text>
            
            <TextInput
              style={styles.textAreaInput}
              placeholder="Descreva o problema ou falha técnica na infraestrutura..."
              placeholderTextColor="#555"
              multiline
              value={ticketDescription}
              onChangeText={setTicketDescription}
            />

            <TouchableOpacity style={styles.outlineButton} onPress={() => setPhotoAttached(true)}>
              <Text style={styles.outlineButtonText}>
                {photoAttached ? '✅ camera_rack_central.jpg anexado' : '📷 Anexar Foto da Ocorrência'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gradientButton, { height: 40, marginTop: 10 }]} onPress={() => { alert('Chamado enviado para a central técnica da CanTudo!'); setTicketDescription(''); setPhotoAttached(false); }}>
              <Text style={styles.buttonText}>Enviar Chamado Crítico</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeading}>Histórico de Manutenções Preventivas</Text>
          {historyMock.map((item) => (
            <View key={item.id} style={styles.historyRow}>
              <View>
                <Text style={styles.historyMainText}>Frequência de Redes e CFTV</Text>
                <Text style={styles.historySubText}>Téc: {item.technician} • {item.date}</Text>
              </View>
              <View style={styles.statusBadge}><Text style={styles.statusBadgeText}>{item.status}</Text></View>
            </View>
          ))}
        </View>
      )}

      {/* MODULO AVANÇADO DE ORÇAMENTOS */}
      <Text style={styles.sectionHeading}>Módulo de Orçamentos Pendentes</Text>
      <View style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <Text style={styles.budgetID}>ORÇAMENTO #2026-A94</Text>
          <Text style={styles.budgetExpiry}>Validade: 30 dias</Text>
        </View>

        {/* Tabela de Itens */}
        <View style={styles.tableRowHeader}>
          <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Item</Text>
          <Text style={[styles.tableCell, { textAlign: 'center' }]}>Qtd</Text>
          <Text style={[styles.tableCell, { textAlign: 'right' }]}>Total</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>Câmeras Bullet Intelbras Full HD</Text>
          <Text style={[styles.tableCell, { textAlign: 'center' }]}>4</Text>
          <Text style={[styles.tableCell, { textAlign: 'right' }]}>R$ 1.200</Text>
        </View>
