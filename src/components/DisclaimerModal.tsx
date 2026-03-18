import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { C } from '../constants/colors';

const TERMS_KEY = 'hasAcceptedTerms_v2';

export default function DisclaimerModal() {
  const [step, setStep] = useState<'hidden' | 'disclaimer' | 'camera'>('hidden');

  useEffect(() => {
    const checkTerms = async () => {
      try {
        const val = await AsyncStorage.getItem(TERMS_KEY);
        if (val !== 'true') {
          setStep('disclaimer');
        }
      } catch (e) {
        // Si erreur AsyncStorage, on affiche quand même le disclaimer
        setStep('disclaimer');
      }
    };
    checkTerms();
  }, []);

  const acceptDisclaimer = async () => {
    try { await AsyncStorage.setItem(TERMS_KEY, 'true'); } catch {}
    setStep('camera');
  };

  const requestCamera = async () => {
    await ImagePicker.requestCameraPermissionsAsync();
    setStep('hidden');
  };

  // --- STEP 1 : DISCLAIMER ---
  if (step === 'disclaimer') {
    return (
      <Modal visible transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', padding: 20 }}>
          <View style={{
            backgroundColor: C.card, borderRadius: 20, padding: 25,
            borderWidth: 1, borderColor: C.orange,
          }}>
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: 15 }}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={{ width: 60, height: 60, resizeMode: 'contain', marginBottom: 10 }}
              />
              <Text style={{ color: C.orange, fontSize: 22, fontWeight: 'bold' }}>
                AVANT DE COMMENCER
              </Text>
            </View>

            {/* Content */}
            <ScrollView style={{ maxHeight: 340 }}>
              <Text style={{ color: C.text, lineHeight: 26, fontSize: 15 }}>
                Bienvenue sur <Text style={{ fontWeight: 'bold', color: C.teal }}>repAire</Text> !{'\n\n'}

                Cette application utilise l'intelligence artificielle pour t'aider à
                <Text style={{ fontWeight: 'bold', color: 'white' }}> diagnostiquer et réparer </Text>
                ton vélo ou ta trottinette électrique.{'\n\n'}

                <Ionicons name="warning" size={14} color={C.yellow} />
                {'  '}
                <Text style={{ fontWeight: 'bold', color: C.yellow }}>Avertissement important :</Text>
                {'\n\n'}

                {'  '}1. repAire est un <Text style={{ fontWeight: 'bold', color: 'white' }}>outil d'aide</Text>, pas un mécanicien professionnel. Les conseils fournis sont indicatifs.{'\n\n'}

                {'  '}2. En cas de doute sur ta sécurité (freins défaillants, cadre fissuré, problème électrique), <Text style={{ fontWeight: 'bold', color: C.red }}>fais appel à un professionnel</Text>.{'\n\n'}

                {'  '}3. L'éditeur de l'application <Text style={{ fontWeight: 'bold', color: 'white' }}>décline toute responsabilité</Text> en cas de dommages matériels ou corporels résultant des réparations effectuées.{'\n\n'}

                {'  '}4. Tu es seul responsable des actions que tu entreprends sur ton véhicule.{'\n\n'}

                <Ionicons name="heart" size={14} color={C.teal} />
                {'  '}
                <Text style={{ color: C.textMuted, fontStyle: 'italic' }}>
                  Notre but : te rendre autonome en toute sécurité. Si une réparation te semble trop complexe, n'hésite jamais à consulter un pro.
                </Text>
              </Text>
            </ScrollView>

            {/* Accept button */}
            <TouchableOpacity onPress={acceptDisclaimer} style={{
              backgroundColor: C.orange, paddingVertical: 16, borderRadius: 50,
              marginTop: 20, alignItems: 'center',
              shadowColor: C.orange, shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3, elevation: 5,
            }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }}>
                J'AI COMPRIS, C'EST PARTI !
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // --- STEP 2 : CAMERA PERMISSION ---
  if (step === 'camera') {
    return (
      <Modal visible transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', padding: 20 }}>
          <View style={{
            backgroundColor: C.card, borderRadius: 20, padding: 25,
            borderWidth: 1, borderColor: C.teal, alignItems: 'center',
          }}>
            <View style={{
              backgroundColor: 'rgba(79, 209, 197, 0.15)', padding: 20,
              borderRadius: 50, marginBottom: 20,
            }}>
              <Ionicons name="camera" size={50} color={C.teal} />
            </View>

            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
              ACCÈS CAMÉRA
            </Text>

            <Text style={{
              color: C.textMuted, fontSize: 14, textAlign: 'center',
              lineHeight: 22, marginBottom: 25, paddingHorizontal: 10,
            }}>
              Pour analyser ton véhicule, repAire a besoin d'accéder à ta caméra.{'\n\n'}
              <Text style={{ color: C.text }}>
                Tes photos ne sont jamais stockées et sont envoyées uniquement pour le diagnostic IA.
              </Text>
            </Text>

            <TouchableOpacity onPress={requestCamera} style={{
              backgroundColor: C.tealDark, paddingVertical: 16, borderRadius: 50,
              width: '100%', alignItems: 'center',
              shadowColor: C.tealDark, shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4, elevation: 5,
            }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }}>
                AUTORISER LA CAMÉRA
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setStep('hidden')} style={{ marginTop: 15, padding: 10 }}>
              <Text style={{ color: C.textDim, fontSize: 12 }}>Plus tard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return null;
}
