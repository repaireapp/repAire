import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { BackHandler, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { C } from '../constants/colors';
import { codexData } from '../data/codexData';

interface Props {
  onBack: () => void;
  initialView?: string;
}

export default function CodexScreen({ onBack, initialView = 'menu' }: Props) {
  const [currentView, setCurrentView] = useState(initialView);
  const [showBrakeChoice, setShowBrakeChoice] = useState(false);
  // Is this a detail/zoom page?
  const isZoomPage = currentView.startsWith('zoom_') || currentView === 'frein_disque'
    || currentView === 'freins' || ['transmission', 'roue', 'pedalier', 'guidon', 'pneu'].includes(currentView)
    || (currentView.startsWith('scooter_') && currentView !== 'scooter_global');

  // --- BACK LOGIC ---
  const goBack = (): boolean => {
    if (showBrakeChoice) { setShowBrakeChoice(false); return true; }
    if (currentView === initialView) { onBack(); return true; }
    if (currentView === 'menu') { onBack(); return true; }
    if (['global', 'scooter_global', 'outils'].includes(currentView)) { setCurrentView('menu'); return true; }
    if (currentView.startsWith('zoom_')) { setCurrentView('outils'); return true; }
    if (currentView.startsWith('scooter_')) { setCurrentView('scooter_global'); return true; }
    setCurrentView('global');
    return true;
  };

  // Android hardware back
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', goBack);
    return () => sub.remove();
  }, [currentView, showBrakeChoice, initialView]);

  const handleZonePress = (target: string) => {
    if (target === 'freins') setShowBrakeChoice(true);
    else setCurrentView(target);
  };

  // --- MENU VIEW ---
  if (currentView === 'menu') {
    return (
      <View style={s.container}>
        <View style={s.menuHeader}>
          <TouchableOpacity onPress={onBack} style={s.menuBackBtn}>
            <Ionicons name="arrow-back" size={24} color={C.textMuted} />
            <Text style={s.backText}> Garage</Text>
          </TouchableOpacity>
          <Text style={s.menuTitle}>LE CODEX</Text>
        </View>
        <Text style={s.chooseTitle}>CHOISIS TON MANUEL</Text>
        <View style={s.menuCards}>
          <TouchableOpacity style={s.menuCard} onPress={() => setCurrentView('global')}>
            <View style={[s.menuIcon, { backgroundColor: C.teal }]}>
              <Ionicons name="bicycle" size={40} color={C.bg} />
            </View>
            <Text style={s.menuCardText}>Le Vélo</Text>
            <Text style={s.menuCardSub}>Vues éclatées interactives</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.menuCard} onPress={() => setCurrentView('scooter_global')}>
            <View style={[s.menuIcon, { backgroundColor: C.yellow }]}>
              <Ionicons name="flash" size={40} color={C.bg} />
            </View>
            <Text style={s.menuCardText}>Trottinette</Text>
            <Text style={s.menuCardSub}>Modèle standard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.menuCard} onPress={() => setCurrentView('outils')}>
            <View style={[s.menuIcon, { backgroundColor: C.orange }]}>
              <Ionicons name="construct" size={40} color={C.bg} />
            </View>
            <Text style={s.menuCardText}>Boîte à Outils</Text>
            <Text style={s.menuCardSub}>Encyclopédie</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- DETAIL VIEW ---
  const data = codexData[currentView] || codexData['global'];

  let backLabel = 'Vue Globale';
  if (currentView === initialView) backLabel = 'Retour';
  else if (['global', 'scooter_global', 'outils'].includes(currentView)) backLabel = 'Menu Codex';
  else if (currentView.startsWith('zoom_')) backLabel = 'Retour Établi';

  return (
    <View style={[s.container, isZoomPage && { backgroundColor: 'black' }]}>
      {/* Back button */}
      <View style={{ position: 'absolute', top: 50, left: 20, zIndex: 100 }}>
        <TouchableOpacity onPress={goBack} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={s.backText}>{backLabel}</Text>
        </TouchableOpacity>
      </View>

      {data && (
        <>
          {/* Image + hitboxes */}
          <View style={{
            position: 'absolute',
            top: isZoomPage ? 0 : 90,
            left: 0, right: 0,
            bottom: isZoomPage ? 0 : 220,
            overflow: 'hidden',
          }}>
            <Image
              source={data.image}
              style={{
                width: '100%', height: '100%',
                resizeMode: 'contain',
              }}
            />
            {/* Hitboxes overlay - same size as image container */}
            {data.zones.map(zone => (
              <TouchableOpacity
                key={zone.id}
                onPress={() => zone.target ? handleZonePress(zone.target) : setCurrentView(zone.id)}
                style={{
                  position: 'absolute',
                  top: `${zone.top}%`, left: `${zone.left}%`,
                  width: `${zone.width}%`, height: `${zone.height}%`,
                  backgroundColor: 'rgba(79, 209, 197, 0.18)',
                  borderWidth: 1.5, borderColor: 'rgba(79, 209, 197, 0.45)',
                  borderRadius: 8,
                  zIndex: 20,
                }}
              />
            ))}
          </View>

          {/* Info panel */}
          <View style={s.infoPanel}>
            <Text style={s.infoTitle}>{data.title}</Text>
            <Text style={s.infoDesc}>{data.description}</Text>
          </View>
        </>
      )}

      {/* Brake choice modal */}
      <Modal visible={showBrakeChoice} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>QUEL TYPE DE FREIN ?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 }}>
              <TouchableOpacity style={s.choiceCard} onPress={() => { setShowBrakeChoice(false); setCurrentView('freins'); }}>
                <View style={{ backgroundColor: C.card, padding: 15, borderRadius: 50, borderWidth: 1, borderColor: C.border }}>
                  <Ionicons name="radio-button-on" size={30} color={C.textMuted} />
                </View>
                <Text style={s.choiceText}>Patins</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.choiceCard, { borderColor: C.tealDark, borderWidth: 1 }]}
                onPress={() => { setShowBrakeChoice(false); setCurrentView('frein_disque'); }}
              >
                <View style={{ backgroundColor: 'rgba(56, 178, 172, 0.2)', padding: 15, borderRadius: 50 }}>
                  <Ionicons name="disc" size={30} color={C.tealDark} />
                </View>
                <Text style={[s.choiceText, { color: C.tealDark }]}>Disques</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setShowBrakeChoice(false)} style={{ marginTop: 30 }}>
              <Text style={{ color: C.textDim }}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  // Menu
  menuHeader: { marginBottom: 20, alignItems: 'center', paddingTop: 10 },
  menuBackBtn: {
    position: 'absolute', left: 20, top: 0,
    flexDirection: 'row', alignItems: 'center',
  },
  menuTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  chooseTitle: {
    fontSize: 16, fontWeight: 'bold', color: C.text, marginTop: 40,
    textAlign: 'center', letterSpacing: 1, textTransform: 'uppercase',
  },
  menuCards: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 20 },
  menuCard: {
    backgroundColor: C.card, width: '48%', aspectRatio: 1, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginVertical: 10,
    borderWidth: 1, borderColor: C.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5,
  },
  menuCardText: { color: C.text, marginTop: 10, fontWeight: '700', textAlign: 'center', fontSize: 13 },
  menuCardSub: { color: C.textMuted, fontSize: 10, marginTop: 5 },
  menuIcon: { padding: 15, borderRadius: 50, marginBottom: 10 },
  // Detail
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: C.textMuted, fontSize: 14, marginLeft: 5, fontWeight: '600' },
  infoPanel: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 25, minHeight: 220,
  },
  infoTitle: { color: C.tealDark, fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  infoDesc: { color: C.text, fontSize: 16, lineHeight: 24 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalBox: {
    width: '85%', backgroundColor: C.bg, borderRadius: 20, padding: 25,
    alignItems: 'center', borderWidth: 1, borderColor: C.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10,
  },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },
  choiceCard: {
    width: '47%', backgroundColor: C.darkCard, borderRadius: 15, padding: 15,
    alignItems: 'center', borderWidth: 1, borderColor: C.card,
  },
  choiceText: { color: 'white', fontWeight: 'bold', marginTop: 10, fontSize: 14 },
});
