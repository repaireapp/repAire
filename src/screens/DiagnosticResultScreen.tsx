import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { C } from '../constants/colors';
import { parseIaResponse, parseSteps } from '../services/aiService';

interface Props {
  result: string;
  vehicleType: string;
  onBack: () => void;
  onOpenCodex: (target: string) => void;
}

export default function DiagnosticResultScreen({ result, vehicleType, onBack, onOpenCodex }: Props) {
  const parsedData = parseIaResponse(result);
  const toolsText = parsedData['1. OUTILS NÉCESSAIRES'] || 'Aucun outil spécifié.';

  // Fix targetPart for scooter
  let targetPart = parsedData['targetPart'] || 'global';
  if (vehicleType === 'Scooter' && !targetPart.startsWith('scooter_')) {
    targetPart = targetPart === 'global' ? 'scooter_global' : 'scooter_' + targetPart;
  }

  // Normalize targetTools to array
  let targetTools: string[] = parsedData['targetTools'] || [];
  if (typeof targetTools === 'string') targetTools = [targetTools];

  const steps = parseSteps(parsedData['Diagnostic et Solution']);
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep] || { title: 'Erreur', content: '...' };

  const dangerColor = parsedData['Danger'] === 'Élevé' ? C.red
    : parsedData['Danger'] === 'Moyen' ? C.yellow : C.teal;

  // Auto-speak on step change
  useEffect(() => {
    Speech.stop();
    if (step) Speech.speak(`${step.title}. ${step.content}`, { language: 'fr' });
  }, [currentStep]);

  const goBack = () => { Speech.stop(); onBack(); };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={goBack} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={s.backText}>Garage</Text>
        </TouchableOpacity>
        <View style={[s.dangerBadge, { backgroundColor: dangerColor }]}>
          <Ionicons name="warning" size={16} color={C.bg} />
          <Text style={s.dangerLabel}>Danger : {parsedData['Danger']}</Text>
        </View>
      </View>

      {/* Tools banner */}
      <View style={s.toolsBanner}>
        <Text style={s.toolsTitle}>
          Outils & Temps ({parsedData['Temps estimé']}) :
        </Text>
        <Text style={s.toolsText}>{toolsText}</Text>

        {targetTools.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            {targetTools.map((toolId: string, i: number) => (
              <TouchableOpacity key={i} style={s.toolChip} onPress={() => onOpenCodex(toolId)}>
                <Ionicons name="construct" size={16} color={C.yellow} />
                <Text style={s.toolChipText}>
                  {toolId.replace('zoom_', '').replace(/_/g, ' ').toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Step card */}
      <View style={s.stepContainer}>
        <View style={s.stepCard}>
          <View style={s.stepHeader}>
            <Text style={s.stepTitle}>{step.title.toUpperCase()}</Text>
            <TouchableOpacity
              onPress={() => Speech.speak(`${step.title}. ${step.content}`, { language: 'fr' })}
              style={s.audioBtn}
            >
              <Ionicons name="volume-high" size={20} color={C.teal} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <Text style={s.stepContent}>{step.content}</Text>
          </ScrollView>
          <TouchableOpacity style={s.codexLink} onPress={() => onOpenCodex(targetPart)}>
            <Ionicons name="eye-outline" size={20} color={C.teal} />
            <Text style={s.codexLinkText}>
              {targetPart === 'global' ? 'Ouvrir le Codex' : 'Voir la pièce dans le Codex'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation */}
      <View style={s.navBar}>
        <TouchableOpacity
          style={[s.navBtn, currentStep === 0 && s.navBtnDisabled]}
          onPress={() => setCurrentStep(p => Math.max(0, p - 1))}
          disabled={currentStep === 0}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={s.navLabel}>Étape {currentStep + 1} / {steps.length}</Text>
        <TouchableOpacity
          style={[s.navBtn, currentStep === steps.length - 1 && s.navBtnDisabled]}
          onPress={() => setCurrentStep(p => Math.min(steps.length - 1, p + 1))}
          disabled={currentStep === steps.length - 1}
        >
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 10, marginBottom: 15,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: C.textMuted, fontSize: 14, marginLeft: 5, fontWeight: '600' },
  dangerBadge: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignItems: 'center' },
  dangerLabel: { color: C.bg, fontWeight: 'bold', marginLeft: 5, fontSize: 12 },
  toolsBanner: {
    backgroundColor: C.card, padding: 15, borderRadius: 12, marginHorizontal: 20,
    marginBottom: 20, borderLeftWidth: 4, borderLeftColor: C.yellow,
  },
  toolsTitle: { color: C.yellow, fontWeight: 'bold', marginBottom: 5, fontSize: 14 },
  toolsText: { color: C.text, fontSize: 14, lineHeight: 20 },
  toolChip: {
    backgroundColor: 'rgba(246, 224, 94, 0.2)', paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 10, flexDirection: 'row', alignItems: 'center',
    marginRight: 10, borderWidth: 1, borderColor: C.yellow,
  },
  toolChipText: { color: C.yellow, fontSize: 10, fontWeight: 'bold', marginLeft: 6 },
  stepContainer: { flex: 1, marginHorizontal: 20, marginBottom: 20 },
  stepCard: {
    backgroundColor: C.card, borderRadius: 16, padding: 20, flex: 1,
    borderWidth: 1, borderColor: C.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 6,
  },
  stepHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 15, borderBottomWidth: 1, borderBottomColor: C.border, paddingBottom: 10,
  },
  stepTitle: { color: C.teal, fontSize: 20, fontWeight: 'bold', flex: 1, textTransform: 'uppercase' },
  stepContent: { color: 'white', fontSize: 18, lineHeight: 28 },
  audioBtn: { padding: 8, backgroundColor: C.bg, borderRadius: 20, borderWidth: 1, borderColor: C.border },
  codexLink: {
    marginTop: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    padding: 12, backgroundColor: C.bg, borderRadius: 8,
    borderWidth: 1, borderColor: C.border, borderStyle: 'dashed',
  },
  codexLinkText: { color: C.teal, marginLeft: 8, fontSize: 14, fontWeight: '600' },
  navBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 20, backgroundColor: C.card, padding: 10,
    borderRadius: 30, borderWidth: 1, borderColor: C.border,
  },
  navBtn: { backgroundColor: C.teal, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  navBtnDisabled: { backgroundColor: C.border, opacity: 0.3 },
  navLabel: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
