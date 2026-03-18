import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, Platform, Text, View } from 'react-native';
import { C } from '../constants/colors';

const BIKE_MESSAGES = [
  'Connexion au cerveau repAire...', 'Optimisation de la netteté...', 'Segmentation des composants...',
  'Analyse de la transmission...', "Vérification de l'alignement...", "Inspection de l'état des freins...",
  "Recherche de traces d'usure...", 'Comparaison base de données...', "Identification de l'anomalie...",
  'Calcul de la solution...', 'Estimation du temps de réparation...', 'Rédaction du guide...',
];

const SCOOTER_MESSAGES = [
  'Initialisation du scan...', 'Analyse de la structure...', 'Vérification du système de pliage...',
  'Inspection des roues (Plein/Air)...', 'Recherche de fissures...', 'Analyse du câblage visible...',
  'Détection du modèle...', 'Interrogation base de données...', 'Vérification sécurité batterie...',
  'Calcul des pièces nécessaires...', 'Génération de la solution...', 'Finalisation du rapport...',
];

interface Props {
  visible: boolean;
  vehicleType: 'Bike' | 'Scooter';
}

export default function ScanModal({ visible, vehicleType }: Props) {
  const scanAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0.3)).current;
  const [scanText, setScanText] = useState('Initialisation...');

  const isBike = vehicleType === 'Bike';
  const iconName = isBike ? 'bicycle' : 'flash';
  const iconColor = isBike ? C.tealDark : C.yellow;
  const messages = isBike ? BIKE_MESSAGES : SCOOTER_MESSAGES;

  useEffect(() => {
    if (!visible) {
      scanAnim.setValue(0);
      fadeAnim.setValue(0.3);
      return;
    }

    // Scan line animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 2000, useNativeDriver: true, easing: Easing.linear }),
        Animated.timing(scanAnim, { toValue: 0, duration: 2000, useNativeDriver: true, easing: Easing.linear }),
      ])
    ).start();

    // Fade animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    // Rotating messages
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) { setScanText(messages[i]); i++; }
      else setScanText('Finalisation...');
    }, 1500);

    return () => clearInterval(interval);
  }, [visible]);

  const laserY = scanAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 150] });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 250, height: 250, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          {/* Corner brackets */}
          <View style={{ position: 'absolute', top: 0, left: 0, width: 30, height: 30, borderTopWidth: 4, borderLeftWidth: 4, borderColor: C.tealDark }} />
          <View style={{ position: 'absolute', top: 0, right: 0, width: 30, height: 30, borderTopWidth: 4, borderRightWidth: 4, borderColor: C.tealDark }} />
          <View style={{ position: 'absolute', bottom: 0, left: 0, width: 30, height: 30, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: C.tealDark }} />
          <View style={{ position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderBottomWidth: 4, borderRightWidth: 4, borderColor: C.tealDark }} />

          {/* Icon */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <Ionicons name={iconName} size={140} color={iconColor} />
          </Animated.View>

          {/* Laser line */}
          <Animated.View style={{
            position: 'absolute', top: 20, width: '90%', height: 4,
            backgroundColor: C.tealLight,
            transform: [{ translateY: laserY }],
            shadowColor: iconColor, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 15, elevation: 15,
          }} />
          <Animated.View style={{
            position: 'absolute', top: 16, width: '80%', height: 20,
            backgroundColor: C.tealDark, opacity: 0.2,
            transform: [{ translateY: laserY }],
          }} />
        </View>

        <Text style={{
          color: C.tealLight, marginTop: 40, fontSize: 16, fontWeight: 'bold',
          letterSpacing: 2, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        }}>
          {scanText.toUpperCase()}
        </Text>
        <Text style={{ color: C.border, marginTop: 10, fontSize: 10 }}>
          NE QUITTEZ PAS L'APPLICATION
        </Text>
      </View>
    </Modal>
  );
}
