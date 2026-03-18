import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Modal, Text, View } from 'react-native';
import { C } from '../constants/colors';

interface Props {
  visible: boolean;
  label?: string;
  onComplete: () => void;
}

export default function AdModal({ visible, label = 'Promo VAE Sport...', onComplete }: Props) {
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    if (!visible) { setTimer(5); return; }

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible]);

  return (
    <Modal visible={visible} transparent={false} animationType="slide">
      <View style={{ flex: 1, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 40 }}>
          PUBLICITÉ PARTENAIRE
        </Text>
        <View style={{
          width: 300, height: 200, backgroundColor: C.card, justifyContent: 'center', alignItems: 'center',
          borderRadius: 10, borderWidth: 1, borderColor: C.border,
        }}>
          <Ionicons name="play-circle" size={60} color="white" />
          <Text style={{ color: 'white', marginTop: 10 }}>{label}</Text>
        </View>
        <Text style={{ color: 'white', marginTop: 40, fontSize: 18 }}>
          Récompense dans : <Text style={{ color: C.yellow, fontWeight: 'bold', fontSize: 40 }}>{timer}</Text>
        </Text>
        <Text style={{ color: 'white', marginTop: 10 }}>Analyse de votre photo en attente...</Text>
      </View>
    </Modal>
  );
}
