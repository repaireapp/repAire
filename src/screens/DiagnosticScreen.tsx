import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AdModal from '../components/AdModal';
import ScanModal from '../components/ScanModal';
import { C } from '../constants/colors';
import { bikeOfflineGuides, scooterOfflineGuides } from '../data/offlineGuides';
import { sendToAI } from '../services/aiService';

interface Props {
  vehicleType: 'Bike' | 'Scooter';
  onBack: () => void;
  onResult: (result: string) => void;
}

export default function DiagnosticScreen({ vehicleType, onBack, onResult }: Props) {
  const [isScanning, setIsScanning] = useState(false);
  const [description, setDescription] = useState('');
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [hasConnectionError, setHasConnectionError] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showAd, setShowAd] = useState(false);

  const isBike = vehicleType === 'Bike';
  const title = isBike ? 'DIAGNOSTIC VÉLO' : 'DIAGNOSTIC TROTTINETTE';
  const subtitle = isBike ? 'Prêt à scanner' : 'Prêt à scanner - Module Mécanique Uniquement';
  const guides = isBike ? bikeOfflineGuides : scooterOfflineGuides;
  const sosTitle = isBike ? 'SOS URGENCES (HORS LIGNE)' : 'SOS URGENCES (MÉCANIQUE)';
  const placeholder = isBike
    ? "Ex: Ça fait 'pshiit' ou le frein est mou..."
    : "Ex: Ça fait du bruit en bas, ou je perds de la puissance...";
  const tip = isBike
    ? "Conseil : Une photo ne montre pas le mouvement ! Décris le bruit (clac-clac) ou le ressenti (ça frotte) pour un diagnostic 100% fiable."
    : "Le diagnostic électrique est désactivé par sécurité";

  // SOS buttons config
  const sosButtons = isBike
    ? [
        { key: 'chain', icon: 'bicycle' as const, label: 'Chaîne', color: C.teal },
        { key: 'tire', icon: 'disc' as const, label: 'Pneu', color: C.teal },
        { key: 'brake', icon: 'hand-left' as const, label: 'Frein', color: C.teal },
      ]
    : [
        { key: 'pneu', icon: 'alert-circle' as const, label: 'Pneu à plat', color: C.yellow },
        { key: 'jeu', icon: 'move' as const, label: 'Guidon lâche', color: C.teal },
        { key: 'bip', icon: 'hand-left' as const, label: 'Frein mou', color: C.red },
      ];

  const lancerAnalyse = async (base64: string) => {
    setIsScanning(true);
    setHasConnectionError(false);
    const response = await sendToAI(base64, description, vehicleType);
    setIsScanning(false);

    if (!response || response.startsWith('Erreur') || response.includes('connexion')) {
      Alert.alert('Pas de réseau', "L'envoi a échoué. Déplacez-vous vers une zone Wi-Fi et appuyez sur RÉESSAYER (votre photo est sauvegardée).");
      setHasConnectionError(true);
    } else {
      onResult(response);
      setTempImage(null);
    }
  };

  const prendrePhoto = async () => {
    if (hasConnectionError && tempImage) { lancerAnalyse(tempImage); return; }

    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== 'granted') return;

    const result = await ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 0.7 });
    if (result.canceled) return;

    const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'base64' });
    setTempImage(base64);
    setHasConnectionError(false);

    if (isPremium) lancerAnalyse(base64);
    else setShowAd(true);
  };

  const onAdComplete = () => {
    setShowAd(false);
    if (tempImage) lancerAnalyse(tempImage);
  };

  return (
    <View style={s.container}>
      <TouchableOpacity onPress={onBack} style={s.backBtn}>
        <Ionicons name="arrow-back" size={24} color={C.textMuted} />
        <Text style={s.backText}> {isBike ? 'Changer de véhicule' : 'Retour au Garage'}</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ flex: 0 }} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={s.titleRow}>
          <Text style={s.title}>{title}</Text>
        </View>
        <Text style={s.subtitle}>{subtitle}</Text>

        {/* SOS */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>{sosTitle}</Text>
          <View style={s.sosRow}>
            {sosButtons.map(btn => (
              <TouchableOpacity
                key={btn.key}
                style={s.sosCard}
                onPress={() => onResult((guides as any)[btn.key])}
              >
                <Ionicons name={btn.icon} size={28} color={btn.color} />
                <Text style={s.sosText}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description input */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>DÉCRIS LE PROBLÈME</Text>
          {isBike && <Text style={s.tip}>{tip}</Text>}
          <View style={s.inputBox}>
            <TextInput
              style={s.input}
              placeholder={placeholder}
              placeholderTextColor={C.textDim}
              multiline
              onChangeText={setDescription}
            />
            <Ionicons name="create-outline" size={20} color={C.textDim} style={{ marginLeft: 8 }} />
          </View>
        </View>

        {/* Launch button */}
        <View style={s.bottom}>
          <TouchableOpacity
            style={[s.bigBtn, hasConnectionError && { backgroundColor: C.orange }]}
            onPress={prendrePhoto}
          >
            <Ionicons name={hasConnectionError ? 'wifi' : 'camera'} size={28} color="#FFF" style={{ marginRight: 10 }} />
            <Text style={s.bigBtnText}>
              {hasConnectionError ? 'RÉESSAYER (WI-FI)' : 'LANCER DIAGNOSTIC IA'}
            </Text>
          </TouchableOpacity>
          <Text style={s.hint}>
            {hasConnectionError
              ? 'Photo sauvegardée. Connectez-vous et relancez.'
              : isBike
                ? "L'IA analyse la photo ET ton texte"
                : 'Le diagnostic électrique est désactivé par sécurité'}
          </Text>
        </View>
      </ScrollView>

      <ScanModal visible={isScanning} vehicleType={vehicleType} />
      <AdModal
        visible={showAd}
        label={isBike ? 'Promo VAE Sport...' : 'Assurance Trottinette...'}
        onComplete={onAdComplete}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingHorizontal: 20, paddingTop: 10 },
  backText: { color: C.textMuted, fontSize: 14, fontWeight: '600' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF', letterSpacing: 0.5 },
  subtitle: { color: C.textMuted, fontSize: 14, paddingHorizontal: 20, marginBottom: 10 },
  section: { marginBottom: 25, paddingHorizontal: 20 },
  sectionTitle: { color: C.textDim, fontSize: 12, fontWeight: 'bold', marginBottom: 15, letterSpacing: 1, textTransform: 'uppercase' },
  sosRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sosCard: {
    backgroundColor: C.card, width: '30%', aspectRatio: 1, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: C.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 3,
  },
  sosText: { color: C.text, marginTop: 8, fontSize: 12, fontWeight: '600' },
  tip: { color: C.yellow, fontSize: 12, marginBottom: 10, fontStyle: 'italic', lineHeight: 18 },
  inputBox: {
    backgroundColor: C.card, borderRadius: 15, borderWidth: 1, borderColor: C.border,
    padding: 15, flexDirection: 'row', alignItems: 'flex-start',
  },
  input: { flex: 1, color: '#FFF', fontSize: 16, textAlignVertical: 'top', height: 80 },
  bottom: { alignItems: 'center', paddingHorizontal: 20, marginBottom: 40 },
  bigBtn: {
    backgroundColor: C.tealDark, flexDirection: 'row', width: '100%', paddingVertical: 18,
    borderRadius: 50, justifyContent: 'center', alignItems: 'center',
    shadowColor: C.tealDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, elevation: 8,
    marginBottom: 10,
  },
  bigBtnText: { color: '#1A202C', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
  hint: { color: C.textDim, fontSize: 12, fontStyle: 'italic', textAlign: 'center' },
});
